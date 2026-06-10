import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Proyecto } from '../../models/strapi.models';
import { mediaUrl } from '../../services/strapi.service';

@Component({
  selector: 'app-proyecto-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <article class="card" [attr.aria-label]="proyecto().nombre">
      <a [routerLink]="['/proyectos', proyecto().slug]" class="card-link" tabindex="0">
        <div class="card-img-wrap">
          @if (imagenUrl()) {
            <img [src]="imagenUrl()" [alt]="proyecto().nombre" class="card-img" />
          } @else {
            <div class="card-img-placeholder" aria-hidden="true">
              <span>{{ proyecto().nombre.charAt(0) }}</span>
            </div>
          }
          <span class="badge badge-tipo">{{ proyecto().tipo }}</span>
          @if (proyecto().destacado) {
            <span class="badge badge-destacado">★ Destacado</span>
          }
        </div>
        <div class="card-body">
          <h3 class="card-title">{{ proyecto().nombre }}</h3>
          <p class="card-desc">{{ proyecto().descripcionBreve }}</p>
          @if (proyecto().tecnologias && proyecto().tecnologias!.length > 0) {
            <div class="card-techs" aria-label="Tecnologías">
              @for (tech of proyecto().tecnologias!.slice(0, 4); track tech.id) {
                <span class="tech-tag">{{ tech.nombre }}</span>
              }
            </div>
          }
        </div>
        <div class="card-footer">
          <span class="ver-detalle">Ver detalle →</span>
        </div>
      </a>
    </article>
  `,
  styles: [`
    .card {
      background: var(--color-surface);
      border-radius: 12px;
      border: 1px solid var(--color-border);
      overflow: hidden;
      transition: transform 0.2s, box-shadow 0.2s;
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    .card:hover { transform: translateY(-4px); box-shadow: 0 8px 24px rgba(0,0,0,0.1); }
    .card-link {
      display: flex;
      flex-direction: column;
      height: 100%;
      text-decoration: none;
      color: inherit;
    }
    .card-img-wrap { position: relative; height: 180px; overflow: hidden; }
    .card-img { width: 100%; height: 100%; object-fit: cover; }
    .card-img-placeholder {
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, var(--color-primary-light), var(--color-secondary-light));
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 3rem;
      font-weight: 700;
      color: var(--color-primary);
    }
    .badge {
      position: absolute;
      top: 10px;
      padding: 0.2rem 0.6rem;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: capitalize;
    }
    .badge-tipo { left: 10px; background: rgba(0,0,0,0.6); color: #fff; }
    .badge-destacado { right: 10px; background: var(--color-accent); color: #fff; }
    .card-body { padding: 1.25rem; flex: 1; display: flex; flex-direction: column; gap: 0.5rem; }
    .card-title { font-size: 1rem; font-weight: 700; color: var(--color-text); margin: 0; }
    .card-desc { font-size: 0.875rem; color: var(--color-text-secondary); line-height: 1.5; margin: 0; flex: 1; }
    .card-techs { display: flex; flex-wrap: wrap; gap: 0.375rem; margin-top: 0.25rem; }
    .tech-tag {
      background: var(--color-primary-light);
      color: var(--color-primary);
      font-size: 0.75rem;
      padding: 0.15rem 0.5rem;
      border-radius: 20px;
      font-weight: 600;
    }
    .card-footer { padding: 0.75rem 1.25rem; border-top: 1px solid var(--color-border); }
    .ver-detalle { font-size: 0.875rem; color: var(--color-primary); font-weight: 600; }
  `],
})
export class ProyectoCardComponent {
  readonly proyecto = input.required<Proyecto>();

  imagenUrl(): string {
    return mediaUrl(this.proyecto().imagenPrincipal);
  }
}
