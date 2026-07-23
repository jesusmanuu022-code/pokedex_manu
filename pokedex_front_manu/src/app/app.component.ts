import { Component } from '@angular/core';
import { PokemonFormComponent } from './components/pokemon-form/pokemon-form.component';
import { PokemonListComponent } from './components/pokemon-list/pokemon-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [PokemonFormComponent, PokemonListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  onRegistrado(): void {}
}
