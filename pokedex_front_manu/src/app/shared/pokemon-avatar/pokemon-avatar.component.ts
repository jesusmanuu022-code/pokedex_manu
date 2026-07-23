import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-pokemon-avatar',
  standalone: true,
  template: `
    <svg [attr.width]="size" [attr.height]="size" viewBox="0 0 48 48" aria-hidden="true">
      <circle cx="24" cy="24" r="22" fill="#f0f0f0" stroke="#d8d8d8" stroke-width="2" />
      <circle cx="24" cy="24" r="6" fill="#c4c4c4" />
    </svg>
  `,
  styles: [
    `
      :host {
        display: inline-flex;
      }
    `,
  ],
})
export class PokemonAvatarComponent {
  @Input() size = 48;
}
