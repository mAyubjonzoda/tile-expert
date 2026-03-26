import { Component, Input } from '@angular/core';

@Component({
  selector: 'svg',
  imports: [],
  template: `<svg:use [attr.href]="href"></svg:use>`,
})
export class SvgIconComponent {
  @Input() icon = '';

  get href(): string {
    return `/assets/svg/${this.icon}.svg#${this.icon}`;
  }
}
