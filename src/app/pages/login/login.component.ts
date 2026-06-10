import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-page" role="main">
      <div class="auth-card">
        <div class="auth-header">
          <h1 class="auth-title">Iniciar sesión</h1>
          <p class="auth-subtitle">Accede a tu cuenta para gestionar solicitudes</p>
        </div>
        <form [formGroup]="form" (ngSubmit)="enviar()" class="auth-form" novalidate>
          <div class="form-group">
            <label for="email" class="form-label">Correo electrónico</label>
            <input
              id="email"
              type="email"
              formControlName="email"
              class="form-input"
              [class.input-error]="emailInvalido()"
              autocomplete="email"
              aria-describedby="email-error"
              placeholder="tu@correo.com"
            />
            @if (emailInvalido()) {
              <span id="email-error" class="field-error" role="alert">Ingresa un correo válido.</span>
            }
          </div>
          <div class="form-group">
            <label for="password" class="form-label">Contraseña</label>
            <input
              id="password"
              type="password"
              formControlName="password"
              class="form-input"
              [class.input-error]="passwordInvalido()"
              autocomplete="current-password"
              aria-describedby="password-error"
              placeholder="••••••••"
            />
            @if (passwordInvalido()) {
              <span id="password-error" class="field-error" role="alert">La contraseña es requerida.</span>
            }
          </div>
          @if (errorMsg()) {
            <div class="form-error" role="alert">{{ errorMsg() }}</div>
          }
          <button type="submit" class="btn btn-primary btn-block" [disabled]="cargando()">
            @if (cargando()) {
              Iniciando sesión...
            } @else {
              Iniciar sesión
            }
          </button>
        </form>
        <div class="divider" role="separator"><span>o</span></div>
        <button
          type="button"
          class="btn btn-google btn-block"
          [disabled]="cargandoGoogle()"
          (click)="entrarConGoogle()"
          aria-label="Iniciar sesión con Google"
        >
          <svg class="google-icon" aria-hidden="true" viewBox="0 0 24 24" width="20" height="20">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          @if (cargandoGoogle()) {
            Conectando...
          } @else {
            Iniciar sesión con Google
          }
        </button>
        <p class="auth-footer">
          ¿No tienes cuenta? <a routerLink="/registro" class="link">Regístrate aquí</a>
        </p>
      </div>
    </div>
  `,
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly cargando = signal(false);
  readonly cargandoGoogle = signal(false);
  readonly errorMsg = signal('');

  readonly form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  emailInvalido(): boolean {
    const ctrl = this.form.get('email')!;
    return ctrl.invalid && ctrl.touched;
  }

  passwordInvalido(): boolean {
    const ctrl = this.form.get('password')!;
    return ctrl.invalid && ctrl.touched;
  }

  async entrarConGoogle(): Promise<void> {
    this.cargandoGoogle.set(true);
    this.errorMsg.set('');
    try {
      await this.auth.iniciarSesionGoogle();
      this.router.navigate(['/']);
    } catch (err: unknown) {
      this.errorMsg.set(err instanceof Error ? err.message : 'Error al iniciar sesión con Google.');
    } finally {
      this.cargandoGoogle.set(false);
    }
  }

  async enviar(): Promise<void> {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    this.cargando.set(true);
    this.errorMsg.set('');
    const { email, password } = this.form.getRawValue();
    try {
      await this.auth.iniciarSesion(email!, password!);
      this.router.navigate(['/']);
    } catch (err: unknown) {
      this.errorMsg.set(err instanceof Error ? err.message : 'Error al iniciar sesión.');
    } finally {
      this.cargando.set(false);
    }
  }
}
