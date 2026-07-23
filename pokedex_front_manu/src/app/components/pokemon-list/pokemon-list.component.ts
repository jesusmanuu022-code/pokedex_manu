import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Pokemon } from '../../models/pokemon.model';
import { PokemonService } from '../../services/pokemon.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

const TIPOS_BASE = ['Agua', 'Fuego', 'Planta', 'Eléctrico', 'Roca', 'Volador', 'Veneno', 'Fantasma', 'Lucha', 'Normal'];

@Component({
  selector: 'app-pokemon-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ConfirmDialogComponent],
  templateUrl: './pokemon-list.component.html',
  styleUrl: './pokemon-list.component.css',
})
export class PokemonListComponent implements OnInit {
  readonly pokemonService = inject(PokemonService);

  readonly tiposBase = TIPOS_BASE;

  dialogoVisible = false;
  pokemonAEliminar: Pokemon | null = null;

  ngOnInit(): void {
    this.pokemonService.cargar();
  }

  onFiltroTipoChange(tipo: string): void {
    this.pokemonService.setFiltroTipo(tipo);
  }

  onBusquedaChange(texto: string): void {
    this.pokemonService.setBusqueda(texto);
  }

  subirNivel(pokemon: Pokemon): void {
    const nuevoNivel = Math.min(pokemon.nivel + 1, 100);
    this.pokemonService.actualizarNivel(pokemon.id, { nivel: nuevoNivel }).subscribe();
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

  porcentajeNivel(nivel: number): number {
    return Math.min(100, Math.round((nivel / 100) * 100));
  }
}
