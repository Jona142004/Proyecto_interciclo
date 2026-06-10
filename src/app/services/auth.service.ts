import { computed, EnvironmentInjector, inject, Injectable, runInInjectionContext } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  Auth,
  authState,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from '@angular/fire/auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly auth = inject(Auth);
  private readonly injector = inject(EnvironmentInjector);

  // authState() se llama aquí: campo de clase = contexto de inyección, sin problema.
  readonly usuario = toSignal(authState(this.auth), { initialValue: undefined });
  readonly estaAutenticado = computed(() => !!this.usuario());

  async registrar(email: string, password: string): Promise<void> {
    try {
      await runInInjectionContext(this.injector, () =>
        createUserWithEmailAndPassword(this.auth, email, password)
      );
    } catch (err: unknown) {
      throw new Error(this.traducirError(err));
    }
  }

  async iniciarSesion(email: string, password: string): Promise<void> {
    try {
      await runInInjectionContext(this.injector, () =>
        signInWithEmailAndPassword(this.auth, email, password)
      );
    } catch (err: unknown) {
      throw new Error(this.traducirError(err));
    }
  }

  async iniciarSesionGoogle(): Promise<void> {
    try {
      await runInInjectionContext(this.injector, () =>
        signInWithPopup(this.auth, new GoogleAuthProvider())
      );
    } catch (err: unknown) {
      throw new Error(this.traducirError(err));
    }
  }

  async cerrarSesion(): Promise<void> {
    await runInInjectionContext(this.injector, () => signOut(this.auth));
  }

  private traducirError(err: unknown): string {
    if (typeof err === 'object' && err !== null && 'code' in err) {
      const code = (err as { code: string }).code;
      switch (code) {
        case 'auth/email-already-in-use':
          return 'El correo ya está en uso.';
        case 'auth/invalid-email':
          return 'Correo electrónico inválido.';
        case 'auth/weak-password':
          return 'La contraseña debe tener al menos 6 caracteres.';
        case 'auth/user-not-found':
          return 'No existe una cuenta con ese correo.';
        case 'auth/wrong-password':
          return 'Contraseña incorrecta.';
        case 'auth/invalid-credential':
          return 'Credenciales inválidas. Verifica tu correo y contraseña.';
        case 'auth/too-many-requests':
          return 'Demasiados intentos. Intenta más tarde.';
        case 'auth/popup-closed-by-user':
          return 'La ventana de Google fue cerrada. Intenta de nuevo.';
        case 'auth/cancelled-popup-request':
          return 'La solicitud de Google fue cancelada.';
        default:
          return 'Error de autenticación. Intenta de nuevo.';
      }
    }
    return 'Error inesperado. Intenta de nuevo.';
  }
}
