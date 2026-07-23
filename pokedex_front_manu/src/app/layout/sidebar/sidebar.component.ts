import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface NavItem {
  etiqueta: string;
  icono: string;
  activo: boolean;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  readonly items: NavItem[] = [
    { etiqueta: 'Pokémon', icono: 'pokebola', activo: true },
    { etiqueta: 'Entrenadores', icono: 'usuario', activo: false },
    { etiqueta: 'Tipos', icono: 'rayo', activo: false },
    { etiqueta: 'Acerca de', icono: 'info', activo: false },
  ];
}
