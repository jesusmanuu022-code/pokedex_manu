import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild, inject } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import lottie, { AnimationItem } from 'lottie-web';
import { PokemonFormComponent } from './components/pokemon-form/pokemon-form.component';
import { PokemonListComponent } from './components/pokemon-list/pokemon-list.component';
import { PokemonService } from './services/pokemon.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatTooltipModule,
    MatDialogModule,
    PokemonListComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements AfterViewInit, OnDestroy {
  // Solo lectura: alimenta el contador del navbar con el estado existente.
  readonly pokemonService = inject(PokemonService);
  private readonly dialog = inject(MatDialog);

  @ViewChild('bulba') bulba!: ElementRef<HTMLElement>;
  @ViewChild('splashAnim') splashAnim?: ElementRef<HTMLElement>;

  // Sale una vez por sesión de pestaña: al abrir una pestaña nueva se muestra,
  // pero no al recargar (sessionStorage se borra al cerrar la pestaña).
  mostrarSplash = !sessionStorage.getItem('pokedex_splash_visto');
  saliendo = false;

  private anim?: AnimationItem;
  private splash?: AnimationItem;

  ngAfterViewInit(): void {
    // Footer: Bulbasaur corriendo
    this.anim = lottie.loadAnimation({
      container: this.bulba.nativeElement,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: '/assets/bulbasaur.json',
    });

    // Splash inicial: evolución de Pichu (solo la primera vez)
    if (this.mostrarSplash && this.splashAnim) {
      sessionStorage.setItem('pokedex_splash_visto', '1');
      this.splash = lottie.loadAnimation({
        container: this.splashAnim.nativeElement,
        renderer: 'svg',
        loop: false,
        autoplay: true,
        path: '/assets/pichu-evolution.json',
      });
      // La animación dura ~6s: mostramos el splash ese tiempo y lo ocultamos.
      setTimeout(() => this.ocultarSplash(), 6000);
    }
  }

  private ocultarSplash(): void {
    if (this.saliendo) return;
    this.saliendo = true;
    setTimeout(() => {
      this.mostrarSplash = false;
      this.splash?.destroy();
    }, 600);
  }

  ngOnDestroy(): void {
    this.anim?.destroy();
    this.splash?.destroy();
  }

  abrirRegistro(): void {
    this.dialog.open(PokemonFormComponent, {
      width: '640px',
      maxWidth: '95vw',
      autoFocus: false,
      panelClass: 'pf-dialog',
    });
  }
}
