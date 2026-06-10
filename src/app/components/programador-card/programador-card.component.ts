import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Programador } from '../../models/strapi.models';
import { mediaUrl } from '../../services/strapi.service';

@Component({
  selector: 'app-programador-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <article class="card" [attr.aria-label]="programador().nombreCompleto">
      <a [routerLink]="['/programadores', programador().slug]" class="card-link" tabindex="0">
        <div class="card-avatar">
          @if (fotoUrl()) {
            <img [src]="fotoUrl()" [alt]="programador().nombreCompleto" class="avatar-img" />
          } @else {
            <div class="avatar-placeholder" aria-hidden="true">
              {{ inicial() }}
            </div>
          }
        </div>
        <div class="card-body">
          <h3 class="card-name">{{ programador().nombreCompleto }}</h3>
          <p class="card-especialidad">{{ programador().especialidad }}</p>
          <p class="card-desc">{{ programador().descripcionBreve }}</p>
        </div>
        <div class="card-footer">
          <span class="ver-perfil">Ver perfil →</span>
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
    }
    .card:hover { transform: translateY(-4px); box-shadow: 0 8px 24px rgba(0,0,0,0.1); }
    .card-link {
      display: flex;
      flex-direction: column;
      height: 100%;
      text-decoration: none;
      color: inherit;
      padding: 1.5rem;
      gap: 1rem;
    }
    .card-avatar { display: flex; justify-content: center; }
    .avatar-img {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      object-fit: cover;
      border: 3px solid var(--color-primary-light);
    }
    .avatar-placeholder {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: var(--color-primary-light);
      color: var(--color-primary);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
      font-weight: 700;
    }
    .card-body { text-align: center; flex: 1; }
    .card-name { font-size: 1.1rem; font-weight: 700; color: var(--color-text); margin: 0 0 0.25rem; }
    .card-especialidad { font-size: 0.85rem; color: var(--color-primary); font-weight: 600; margin: 0 0 0.5rem; }
    .card-desc { font-size: 0.875rem; color: var(--color-text-secondary); line-height: 1.5; margin: 0; }
    .card-footer { text-align: center; }
    .ver-perfil { font-size: 0.875rem; color: var(--color-primary); font-weight: 600; }
  `],
})
export class ProgramadorCardComponent {
  readonly programador = input.required<Programador>();

  fotoUrl(): string {
    return mediaUrl(this.programador().fotoPerfil);
  }

  inicial(): string {
    return this.programador().nombreCompleto.charAt(0).toUpperCase();
  }
}
