import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Entrenador } from '../../models/entrenador.model';
import { EntrenadorService } from '../../services/entrenador.service';
import { PokemonService } from '../../services/pokemon.service';

@Component({
  selector: 'app-pokemon-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './pokemon-form.component.html',
  styleUrl: './pokemon-form.component.css',
})
export class PokemonFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly pokemonService = inject(PokemonService);
  private readonly entrenadorService = inject(EntrenadorService);

  @Output() registrado = new EventEmitter<void>();

  entrenadores: Entrenador[] = [];
  enviando = false;
  errorLocal: string | null = null;

  form = this.fb.nonNullable.group({
    nombre: ['', Validators.required],
    tipo: ['', Validators.required],
    nivel: [1, [Validators.required, Validators.min(1), Validators.max(100)]],
    fechaCaptura: [''],
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
        fechaCaptura: valores.fechaCaptura || null,
        entrenadorId: Number(valores.entrenadorId),
      })
      .subscribe({
        next: () => {
          this.enviando = false;
          this.form.reset({ nombre: '', tipo: '', nivel: 1, fechaCaptura: '', entrenadorId: null });
          this.registrado.emit();
        },
        error: (err) => {
          this.enviando = false;
          this.errorLocal = err.message;
        },
      });
  }
}
