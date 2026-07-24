import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import lottie, { AnimationItem } from 'lottie-web';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Pokemon } from '../../models/pokemon.model';
import { PokemonService } from '../../services/pokemon.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { EditNivelDialogComponent } from '../edit-nivel-dialog/edit-nivel-dialog.component';
import { PokedexDetailComponent } from '../pokedex-detail/pokedex-detail.component';
import { PokemonCardComponent } from '../pokemon-card/pokemon-card.component';

const TIPOS_BASE = ['Agua', 'Fuego', 'Planta', 'Eléctrico', 'Roca', 'Volador', 'Veneno', 'Fantasma', 'Lucha', 'Normal'];

@Component({
  selector: 'app-pokemon-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    ConfirmDialogComponent,
    EditNivelDialogComponent,
    PokemonCardComponent,
  ],
  templateUrl: './pokemon-list.component.html',
  styleUrl: './pokemon-list.component.css',
})
export class PokemonListComponent implements OnInit, OnDestroy {
  readonly pokemonService = inject(PokemonService);
  private readonly dialog = inject(MatDialog);

  private snorlaxAnim?: AnimationItem;

  /** Carga/destruye la animación de Snorlax cuando aparece/desaparece el error. */
  @ViewChild('snorlaxError') set snorlaxError(ref: ElementRef<HTMLElement> | undefined) {
    if (ref) {
      this.snorlaxAnim ??= lottie.loadAnimation({
        container: ref.nativeElement,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: '/assets/snorlax.json',
      });
    } else {
      this.snorlaxAnim?.destroy();
      this.snorlaxAnim = undefined;
    }
  }

  readonly tiposBase = TIPOS_BASE;

  vista: 'grid' | 'lista' = 'grid';

  dialogoVisible = false;
  pokemonAEliminar: Pokemon | null = null;

  editDialogoVisible = false;
  pokemonAEditar: Pokemon | null = null;

  ngOnInit(): void {
    this.pokemonService.cargar();
  }

  ngOnDestroy(): void {
    this.snorlaxAnim?.destroy();
  }

  trackById(_index: number, pokemon: Pokemon): number {
    return pokemon.id;
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

  abrirDetalle(pokemon: Pokemon): void {
    const lista = this.pokemonService.pokemonesFiltrados();
    const index = lista.findIndex((p) => p.id === pokemon.id);
    this.dialog.open(PokedexDetailComponent, {
      panelClass: 'pokedex-dialog',
      autoFocus: false,
      maxWidth: '95vw',
      data: { pokemones: lista, index },
    });
  }

  subirNivel(pokemon: Pokemon): void {
    const nuevoNivel = Math.min(pokemon.nivel + 1, 100);
    this.pokemonService.actualizarNivel(pokemon.id, { nivel: nuevoNivel }).subscribe();
  }

  abrirEditarNivel(pokemon: Pokemon): void {
    this.pokemonAEditar = pokemon;
    this.editDialogoVisible = true;
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
}
