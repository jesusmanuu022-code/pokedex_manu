import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { Entrenador } from '../models/entrenador.model';

@Injectable({ providedIn: 'root' })
export class EntrenadorService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/entrenadores`;

  private readonly entrenadoresSignal = signal<Entrenador[]>([]);
  readonly entrenadores = this.entrenadoresSignal.asReadonly();

  cargar() {
    return this.http.get<Entrenador[]>(this.baseUrl).pipe(
      tap((data) => this.entrenadoresSignal.set(data))
    );
  }
}
