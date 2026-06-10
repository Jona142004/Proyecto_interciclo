import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar" role="navigation" aria-label="Navegación principal">
      <div class="navbar-brand">
        <a routerLink="/" class="brand-link" aria-label="Inicio">
          <span class="brand-icon">&#9998;</span>
          <span class="brand-text">DevPortafolio</span>
        </a>
      </div>
      <ul class="navbar-links" role="list">
        <li><a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}">Inicio</a></li>
        @if (auth.estaAutenticado()) {
          <li><a routerLink="/solicitudes" routerLinkActive="active">Mis solicitudes</a></li>
          <li class="user-info">
            <span class="user-email" aria-label="Usuario actual">{{ auth.usuario()?.email }}</span>
            <button class="btn-logout" (click)="cerrarSesion()" type="button">Cerrar sesión</button>
          </li>
        } @else {
          <li><a routerLink="/login" routerLinkActive="active" class="btn-nav btn-outline">Iniciar sesión</a></li>
          <li><a routerLink="/registro" routerLinkActive="active" class="btn-nav btn-primary">Registrarse</a></li>
        }
      </ul>
    </nav>
  `,
  styles: [`
    .navbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 2rem;
      height: 64px;
      background: var(--color-surface);
      border-bottom: 1px solid var(--color-border);
      position: sticky;
      top: 0;
      z-index: 100;
      box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    }
    .navbar-brand { display: flex; align-items: center; }
    .brand-link {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      text-decoration: none;
      color: var(--color-primary);
      font-weight: 700;
      font-size: 1.25rem;
    }
    .brand-icon { font-size: 1.4rem; }
    .navbar-links {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      list-style: none;
      margin: 0;
      padding: 0;
    }
    .navbar-links a {
      text-decoration: none;
      color: var(--color-text-secondary);
      font-size: 0.95rem;
      font-weight: 500;
      padding: 0.375rem 0.5rem;
      border-radius: 6px;
      transition: color 0.2s, background 0.2s;
    }
    .navbar-links a:hover, .navbar-links a.active {
      color: var(--color-primary);
      background: var(--color-primary-light);
    }
    .user-info {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .user-email {
      font-size: 0.85rem;
      color: var(--color-text-secondary);
      max-width: 160px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .btn-nav {
      padding: 0.4rem 1rem;
      border-radius: 6px;
      font-weight: 600;
      font-size: 0.9rem;
    }
    .btn-outline {
      border: 1.5px solid var(--color-primary);
      color: var(--color-primary) !important;
      background: transparent;
    }
    .btn-primary {
      background: var(--color-primary);
      color: #fff !important;
    }
    .btn-logout {
      background: transparent;
      border: 1.5px solid var(--color-danger);
      color: var(--color-danger);
      padding: 0.35rem 0.85rem;
      border-radius: 6px;
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s, color 0.2s;
    }
    .btn-logout:hover {
      background: var(--color-danger);
      color: #fff;
    }
    @media (max-width: 640px) {
      .navbar { padding: 0 1rem; }
      .user-email { display: none; }
      .navbar-links { gap: 0.75rem; }
    }
  `],
})
export class NavbarComponent {
  readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  async cerrarSesion(): Promise<void> {
    await this.auth.cerrarSesion();
    this.router.navigate(['/']);
  }
}
