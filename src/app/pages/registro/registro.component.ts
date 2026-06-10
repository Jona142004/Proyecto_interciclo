import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

function passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirmar = control.get('confirmarPassword')?.value;
  return password === confirmar ? null : { passwordsMismatch: true };
}

@Component({
  selector: 'app-registro',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-page" role="main">
      <div class="auth-card">
        <div class="auth-header">
          <h1 class="auth-title">Crear cuenta</h1>
          <p class="auth-subtitle">Regístrate para solicitar servicios</p>
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
              autocomplete="new-password"
              aria-describedby="password-error"
              placeholder="Mínimo 6 caracteres"
            />
            @if (passwordInvalido()) {
              <span id="password-error" class="field-error" role="alert">La contraseña debe tener al menos 6 caracteres.</span>
            }
          </div>
          <div class="form-group">
            <label for="confirmarPassword" class="form-label">Confirmar contraseña</label>
            <input
              id="confirmarPassword"
              type="password"
              formControlName="confirmarPassword"
              class="form-input"
              [class.input-error]="confirmarInvalido()"
              autocomplete="new-password"
              aria-describedby="confirmar-error"
              placeholder="Repite tu contraseña"
            />
            @if (confirmarInvalido()) {
              <span id="confirmar-error" class="field-error" role="alert">Las contraseñas no coinciden.</span>
            }
          </div>
          @if (errorMsg()) {
            <div class="form-error" role="alert">{{ errorMsg() }}</div>
          }
          <button type="submit" class="btn btn-primary btn-block" [disabled]="cargando()">
            @if (cargando()) { Registrando... } @else { Crear cuenta }
          </button>
        </form>
        <p class="auth-footer">
          ¿Ya tienes cuenta? <a routerLink="/login" class="link">Inicia sesión</a>
        </p>
      </div>
    </div>
  `,
  styleUrl: './registro.component.css',
})
export class RegistroComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly cargando = signal(false);
  readonly errorMsg = signal('');

  readonly form = this.fb.group(
    {
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmarPassword: ['', [Validators.required]],
    },
    { validators: passwordsMatchValidator }
  );

  emailInvalido(): boolean {
    const ctrl = this.form.get('email')!;
    return ctrl.invalid && ctrl.touched;
  }

  passwordInvalido(): boolean {
    const ctrl = this.form.get('password')!;
    return ctrl.invalid && ctrl.touched;
  }

  confirmarInvalido(): boolean {
    const ctrl = this.form.get('confirmarPassword')!;
    return (ctrl.touched || this.form.touched) && !!this.form.errors?.['passwordsMismatch'];
  }

  async enviar(): Promise<void> {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    this.cargando.set(true);
    this.errorMsg.set('');
    const { email, password } = this.form.getRawValue();
    try {
      await this.auth.registrar(email!, password!);
      this.router.navigate(['/']);
    } catch (err: unknown) {
      this.errorMsg.set(err instanceof Error ? err.message : 'Error al registrarse.');
    } finally {
      this.cargando.set(false);
    }
  }
}
