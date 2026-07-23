import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Pokemon } from '../../models/pokemon.model';
import { colorPorTipo } from '../../shared/tipo-color.util';
import { PokemonAvatarComponent } from '../../shared/pokemon-avatar/pokemon-avatar.component';
import { PokemonService } from '../../services/pokemon.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { EditNivelDialogComponent } from '../edit-nivel-dialog/edit-nivel-dialog.component';

const TIPOS_BASE = ['Agua', 'Fuego', 'Planta', 'Eléctrico', 'Roca', 'Volador', 'Veneno', 'Fantasma', 'Lucha', 'Normal'];

@Component({
  selector: 'app-pokemon-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ConfirmDialogComponent, EditNivelDialogComponent, PokemonAvatarComponent],
  templateUrl: './pokemon-list.component.html',
  styleUrl: './pokemon-list.component.css',
})
export class PokemonListComponent implements OnInit {
  readonly pokemonService = inject(PokemonService);

  readonly tiposBase = TIPOS_BASE;
  readonly colorPorTipo = colorPorTipo;

  vista: 'grid' | 'lista' = 'grid';

  dialogoVisible = false;
  pokemonAEliminar: Pokemon | null = null;

  editDialogoVisible = false;
  pokemonAEditar: Pokemon | null = null;

  menuAbiertoId: number | null = null;

  constructor(private readonly elementRef: ElementRef<HTMLElement>) {}

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.menuAbiertoId !== null && !this.elementRef.nativeElement.contains(event.target as Node)) {
      this.menuAbiertoId = null;
    }
  }

  ngOnInit(): void {
    this.pokemonService.cargar();
  }

  onFiltroTipoChange(tipo: string): void {
    this.pokemonService.setFiltroTipo(tipo);
  }

  onBusquedaChange(texto: string): void {
    this.pokemonService.setBusqueda(texto);
  }

  limpiarFiltros(): void {
    this.pokemonService.limpiarFiltros();
  }

  cambiarVista(vista: 'grid' | 'lista'): void {
    this.vista = vista;
  }

  toggleMenu(pokemon: Pokemon): void {
    this.menuAbiertoId = this.menuAbiertoId === pokemon.id ? null : pokemon.id;
  }

  cerrarMenu(): void {
    this.menuAbiertoId = null;
  }

  subirNivel(pokemon: Pokemon): void {
    const nuevoNivel = Math.min(pokemon.nivel + 1, 100);
    this.pokemonService.actualizarNivel(pokemon.id, { nivel: nuevoNivel }).subscribe();
  }

  abrirEditarNivel(pokemon: Pokemon): void {
    this.pokemonAEditar = pokemon;
    this.editDialogoVisible = true;
    this.menuAbiertoId = null;
  }

  guardarNivelEditado(nuevoNivel: number): void {
    if (this.pokemonAEditar) {
      this.pokemonService.actualizarNivel(this.pokemonAEditar.id, { nivel: nuevoNivel }).subscribe();
    }
    this.cerrarEditarNivel();
  }

  cerrarEditarNivel(): void {
    this.editDialogoVisible = false;
    this.pokemonAEditar = null;
  }

  pedirConfirmacionEliminar(pokemon: Pokemon): void {
    this.pokemonAEliminar = pokemon;
    this.dialogoVisible = true;
    this.menuAbiertoId = null;
  }

  confirmarEliminar(): void {
    if (this.pokemonAEliminar) {
      this.pokemonService.eliminar(this.pokemonAEliminar.id).subscribe();
    }
    this.cerrarDialogo();
  }

  cerrarDialogo(): void {
    this.dialogoVisible = false;
    this.pokemonAEliminar = null;
  }

  porcentajeNivel(nivel: number): number {
    return Math.min(100, Math.round((nivel / 100) * 100));
  }
}
