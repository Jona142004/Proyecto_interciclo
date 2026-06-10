import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'programadores/:slug',
    loadComponent: () =>
      import('./pages/programador-perfil/programador-perfil.component').then(
        (m) => m.ProgramadorPerfilComponent
      ),
  },
  {
    path: 'proyectos/:slug',
    loadComponent: () =>
      import('./pages/proyecto-detalle/proyecto-detalle.component').then(
        (m) => m.ProyectoDetalleComponent
      ),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'registro',
    loadComponent: () =>
      import('./pages/registro/registro.component').then(
        (m) => m.RegistroComponent
      ),
  },
  {
    path: 'solicitud',
    loadComponent: () =>
      import('./pages/solicitud-form/solicitud-form.component').then(
        (m) => m.SolicitudFormComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: 'solicitudes',
    loadComponent: () =>
      import('./pages/solicitudes/solicitudes.component').then(
        (m) => m.SolicitudesComponent
      ),
    canActivate: [authGuard],
  },
  { path: '**', redirectTo: '' },
];
