import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { Entrenador } from '../../models/entrenador.model';
import { EntrenadorService } from '../../services/entrenador.service';
import { PokemonService } from '../../services/pokemon.service';

@Component({
  selector: 'app-pokemon-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
  ],
  providers: [provideNativeDateAdapter(), { provide: MAT_DATE_LOCALE, useValue: 'es-ES' }],
  templateUrl: './pokemon-form.component.html',
  styleUrl: './pokemon-form.component.css',
})
export class PokemonFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly pokemonService = inject(PokemonService);
  private readonly entrenadorService = inject(EntrenadorService);
  private readonly dialogRef = inject(MatDialogRef<PokemonFormComponent>);

  entrenadores: Entrenador[] = [];
  enviando = false;
  errorLocal: string | null = null;

  readonly tipos = [
    'Acero', 'Agua', 'Bicho', 'Dragón', 'Eléctrico', 'Estelar', 'Fantasma',
    'Fuego', 'Hada', 'Hielo', 'Lucha', 'Normal', 'Planta', 'Psíquico',
    'Roca', 'Siniestro', 'Tierra', 'Veneno', 'Volador',
  ];

  // Validadores SIN CAMBIOS respecto al formulario original.
  form = this.fb.nonNullable.group({
    nombre: ['', Validators.required],
    tipo: ['', Validators.required],
    nivel: [1, [Validators.required, Validators.min(1), Validators.max(100)]],
    fechaCaptura: [null as Date | null],
    entrenadorId: [null as number | null, Validators.required],
  });

  ngOnInit(): void {
    this.entrenadorService.cargar().subscribe({
      next: (data) => (this.entrenadores = data),
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.errorLocal = null;
    this.enviando = true;
    const valores = this.form.getRawValue();

    this.pokemonService
      .registrar({
        nombre: valores.nombre,
        tipo: valores.tipo,
        nivel: Number(valores.nivel),
        fechaCaptura: valores.fechaCaptura ? this.formatearFecha(valores.fechaCaptura) : null,
        entrenadorId: Number(valores.entrenadorId),
      })
      .subscribe({
        next: () => {
          // El guardado ya se completó; mantenemos la animación de carga
          // visible un instante antes de cerrar el diálogo (solo UX).
          setTimeout(() => {
            this.enviando = false;
            this.dialogRef.close(true);
          }, 900);
        },
        error: (err) => {
          this.enviando = false;
          this.errorLocal = err.message;
        },
      });
  }

  cerrar(): void {
    this.dialogRef.close();
  }

  /** Formatea un Date a 'YYYY-MM-DD' usando la fecha local (sin desfase UTC). */
  private formatearFecha(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }
}
