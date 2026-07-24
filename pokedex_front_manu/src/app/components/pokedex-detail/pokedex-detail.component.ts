import { CommonModule } from '@angular/common';
import { Component, HostListener, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Pokemon } from '../../models/pokemon.model';
import { TipoColor, colorPorTipo } from '../../shared/tipo-color.util';

export interface PokedexDetailData {
  pokemones: Pokemon[];
  index: number;
}

@Component({
  selector: 'app-pokedex-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pokedex-detail.component.html',
  styleUrl: './pokedex-detail.component.css',
})
export class PokedexDetailComponent {
  indice: number;
  flash = false;

  constructor(
    private readonly dialogRef: MatDialogRef<PokedexDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PokedexDetailData,
  ) {
    this.indice = data.index >= 0 ? data.index : 0;
  }

  get actual(): Pokemon {
    return this.data.pokemones[this.indice];
  }

  get numero(): string {
    return '#' + String(this.actual.id).padStart(3, '0');
  }

  get tipoColor(): TipoColor {
    return colorPorTipo(this.actual.tipo);
  }

  anterior(): void {
    this.mover(-1);
  }

  siguiente(): void {
    this.mover(1);
  }

  private mover(delta: number): void {
    const n = this.data.pokemones.length;
    if (n <= 1) return;
    this.indice = (this.indice + delta + n) % n;
    // Reinicia la animación de cambio de pantalla
    this.flash = false;
    requestAnimationFrame(() => (this.flash = true));
  }

  cerrar(): void {
    this.dialogRef.close();
  }

  @HostListener('document:keydown', ['$event'])
  onKey(e: KeyboardEvent): void {
    if (e.key === 'ArrowRight') this.siguiente();
    else if (e.key === 'ArrowLeft') this.anterior();
  }
}
