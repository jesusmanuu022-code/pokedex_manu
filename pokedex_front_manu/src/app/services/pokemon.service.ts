import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { catchError, finalize, tap, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiError } from '../models/api-error.model';
import { NivelUpdateRequest, Pokemon, PokemonRequest } from '../models/pokemon.model';

@Injectable({ providedIn: 'root' })
export class PokemonService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/pokemon`;

  private readonly pokemonesSignal = signal<Pokemon[]>([]);
  private readonly loadingSignal = signal(false);
  private readonly errorSignal = signal<string | null>(null);
  private readonly filtroTipoSignal = signal<string>('');
  private readonly busquedaSignal = signal<string>('');
  private readonly ordenNivelSignal = signal<'asc' | 'desc' | null>(null);

  readonly pokemones = this.pokemonesSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();
  readonly filtroTipo = this.filtroTipoSignal.asReadonly();
  readonly busqueda = this.busquedaSignal.asReadonly();
  readonly ordenNivel = this.ordenNivelSignal.asReadonly();

  readonly pokemonesFiltrados = computed(() => {
    const termino = this.busquedaSignal().trim().toLowerCase();
    let resultado = this.pokemonesSignal();

    if (termino) {
      resultado = resultado.filter((p) => p.nombre.toLowerCase().includes(termino));
    }

    const orden = this.ordenNivelSignal();
    if (orden) {
      resultado = [...resultado].sort((a, b) => (orden === 'asc' ? a.nivel - b.nivel : b.nivel - a.nivel));
    }

    return resultado;
  });

  readonly tiposDisponibles = computed(() => {
    const tipos = new Set(this.pokemonesSignal().map((p) => p.tipo));
    return Array.from(tipos).sort();
  });

  setBusqueda(texto: string): void {
    this.busquedaSignal.set(texto);
  }

  setFiltroTipo(tipo: string): void {
    this.filtroTipoSignal.set(tipo);
    this.cargar();
  }

  setOrdenNivel(orden: 'asc' | 'desc' | null): void {
    this.ordenNivelSignal.set(orden);
  }

  limpiarFiltros(): void {
    this.busquedaSignal.set('');
    this.ordenNivelSignal.set(null);
    if (this.filtroTipoSignal()) {
      this.filtroTipoSignal.set('');
      this.cargar();
    }
  }

  cargar(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    let params = new HttpParams();
    const tipo = this.filtroTipoSignal();
    if (tipo) {
      params = params.set('tipo', tipo);
    }

    this.http
      .get<Pokemon[]>(this.baseUrl, { params })
      .pipe(
        // Orden estable por id: evita que la tarjeta "salte" de sitio
        // (y parezca cambiar de color) tras actualizar el nivel.
        tap((data) => this.pokemonesSignal.set([...data].sort((a, b) => a.id - b.id))),
        catchError((err) => this.manejarError(err)),
        finalize(() => this.loadingSignal.set(false))
      )
      .subscribe();
  }

  registrar(request: PokemonRequest) {
    this.errorSignal.set(null);
    return this.http.post<Pokemon>(this.baseUrl, request).pipe(
      tap(() => this.cargar()),
      catchError((err) => this.manejarError(err))
    );
  }

  actualizarNivel(id: number, request: NivelUpdateRequest) {
    this.errorSignal.set(null);
    return this.http.patch<Pokemon>(`${this.baseUrl}/${id}/nivel`, request).pipe(
      // Actualiza solo ese Pokémon en el sitio (sin recargar toda la lista,
      // así no parpadea el "Cargando...").
      tap((actualizado) =>
        this.pokemonesSignal.update((lista) => lista.map((p) => (p.id === id ? actualizado : p)))
      ),
      catchError((err) => this.manejarError(err))
    );
  }

  eliminar(id: number) {
    this.errorSignal.set(null);
    return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(
      tap(() => this.pokemonesSignal.update((lista) => lista.filter((p) => p.id !== id))),
      catchError((err) => this.manejarError(err))
    );
  }

  private manejarError(err: HttpErrorResponse) {
    const apiError = err.error as ApiError | undefined;
    const mensaje = apiError?.details?.length
      ? apiError.details.join(' | ')
      : apiError?.message || 'Ocurrió un error inesperado al comunicarse con el servidor';
    this.errorSignal.set(mensaje);
    return throwError(() => new Error(mensaje));
  }
}
