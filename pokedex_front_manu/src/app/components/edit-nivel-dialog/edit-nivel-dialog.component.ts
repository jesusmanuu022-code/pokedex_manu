import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-nivel-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-nivel-dialog.component.html',
  styleUrl: './edit-nivel-dialog.component.css',
})
export class EditNivelDialogComponent implements OnChanges {
  @Input() visible = false;
  @Input() nombrePokemon = '';
  @Input() nivelActual = 1;

  @Output() guardar = new EventEmitter<number>();
  @Output() cancelar = new EventEmitter<void>();

  nivel = 1;
  error: string | null = null;

  ngOnChanges(): void {
    this.nivel = this.nivelActual;
    this.error = null;
  }

  onGuardar(): void {
    if (!Number.isInteger(this.nivel) || this.nivel < 1 || this.nivel > 100) {
      this.error = 'El nivel debe ser un número entero entre 1 y 100';
      return;
    }
    this.guardar.emit(this.nivel);
  }
}
