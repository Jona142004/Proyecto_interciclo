import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Servicio } from '../../models/strapi.models';

@Component({
  selector: 'app-servicio-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  template: `
    <article class="servicio-card" [attr.aria-label]="servicio().nombre">
      <div class="servicio-icono" aria-hidden="true">{{ servicio().icono }}</div>
      <h3 class="servicio-nombre">{{ servicio().nombre }}</h3>
      <p class="servicio-desc">{{ servicio().descripcion }}</p>
    </article>
  `,
  styles: [`
    .servicio-card {
      background: var(--color-surface);
      border-radius: 12px;
      border: 1px solid var(--color-border);
      padding: 1.5rem;
      text-align: center;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .servicio-card:hover { transform: translateY(-4px); box-shadow: 0 8px 24px rgba(0,0,0,0.08); }
    .servicio-icono { font-size: 2.5rem; margin-bottom: 0.75rem; }
    .servicio-nombre { font-size: 1rem; font-weight: 700; color: var(--color-text); margin: 0 0 0.5rem; }
    .servicio-desc { font-size: 0.875rem; color: var(--color-text-secondary); line-height: 1.5; margin: 0; }
  `],
})
export class ServicioCardComponent {
  readonly servicio = input.required<Servicio>();
}
