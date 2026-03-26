import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'svg',
  imports: [],
  template: `<svg:use [attr.href]="href()"></svg:use>`,
})
export class SvgIconComponent {
  icon = input.required<string>();
  href = computed(() => `/assets/svg/${this.icon()}.svg#${this.icon()}`);
}
