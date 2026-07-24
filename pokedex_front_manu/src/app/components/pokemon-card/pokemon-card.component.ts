import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Pokemon } from '../../models/pokemon.model';
import { TipoColor, colorPorTipo } from '../../shared/tipo-color.util';

@Component({
  selector: 'app-pokemon-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatProgressBarModule,
    MatTooltipModule,
  ],
  templateUrl: './pokemon-card.component.html',
  styleUrl: './pokemon-card.component.css',
})
export class PokemonCardComponent {
  @Input({ required: true }) pokemon!: Pokemon;

  @Output() subirNivel = new EventEmitter<Pokemon>();
  @Output() editarNivel = new EventEmitter<Pokemon>();
  @Output() eliminar = new EventEmitter<Pokemon>();
  @Output() abrirDetalle = new EventEmitter<Pokemon>();

  get tipoColor(): TipoColor {
    return colorPorTipo(this.pokemon.tipo);
  }

  /** Nivel (1-100) mapeado a porcentaje para la barra. */
  get nivelPorcentaje(): number {
    return Math.min(100, Math.max(0, this.pokemon.nivel));
  }
}
