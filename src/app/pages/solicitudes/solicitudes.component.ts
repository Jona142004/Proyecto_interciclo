import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  EnvironmentInjector,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { filter, switchMap, take, tap } from 'rxjs';
import { User } from '@angular/fire/auth';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { StrapiService } from '../../services/strapi.service';
import { SolicitudesService } from '../../services/solicitudes.service';
import { Programador, Solicitud } from '../../models/strapi.models';

@Component({
  selector: 'app-solicitudes',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
  templateUrl: './solicitudes.component.html',
  styleUrl: './solicitudes.component.css',
})
export class SolicitudesComponent implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly strapi = inject(StrapiService);
  private readonly solicitudesService = inject(SolicitudesService);
  private readonly injector = inject(EnvironmentInjector);
  private readonly destroyRef = inject(DestroyRef);

  readonly esProgramador = signal(false);
  readonly programadorActual = signal<Programador | null>(null);
  readonly cargando = signal(true);
  readonly solicitudes = signal<Solicitud[]>([]);

  readonly guardandoId = signal<string | null>(null);
  readonly mensajeGuardado = signal('');

  // Valores editables por el programador, indexados por id de solicitud.
  // Se llenan cuando llegan las solicitudes, sin pisar lo que el usuario esté escribiendo.
  readonly estadoEdit: Record<string, 'Pendiente' | 'Respondida'> = {};
  readonly respuestaEdit: Record<string, string> = {};

  ngOnInit(): void {
    toObservable(this.auth.usuario, { injector: this.injector })
      .pipe(
        filter((u): u is User => u != null),
        take(1),
        switchMap((usuario) => {
          console.log('[Sol] usuario.email =', usuario.email);

          return this.strapi.getProgramadores().pipe(
            switchMap((res) => {
              const correos = res.data.map((p) => p.correoContacto);
              console.log('[Sol] correos programadores =', correos);

              const coincide = res.data.find(
                (p) =>
                  (p.correoContacto ?? '').trim().toLowerCase() ===
                  (usuario.email ?? '').trim().toLowerCase()
              );
              const esProg = !!coincide;
              console.log('[Sol] es programador?', esProg);

              this.esProgramador.set(esProg);
              if (coincide) this.programadorActual.set(coincide);

              const solicitudes$ = coincide
                ? this.solicitudesService.solicitudesRecibidas(
                    coincide.correoContacto
                  )
                : this.solicitudesService.solicitudesEnviadas(usuario.uid);

              return solicitudes$.pipe(
                tap((lista) =>
                  console.log('[Sol] documentos recibidos =', lista)
                )
              );
            })
          );
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (lista) => {
          // Inicializa los valores editables solo la primera vez que se ve cada solicitud,
          // para no borrar lo que el programador esté escribiendo cuando la lista se refresca.
          for (const sol of lista) {
            const id = sol.id!;
            if (!(id in this.estadoEdit)) {
              this.estadoEdit[id] = sol.estado;
              this.respuestaEdit[id] = sol.respuesta ?? '';
            }
          }
          this.solicitudes.set(lista);
          this.cargando.set(false);
        },
        error: (err) => {
          console.error('[Sol] error en la cadena:', err);
          this.cargando.set(false);
        },
      });
  }

  async guardarRespuesta(solicitud: Solicitud): Promise<void> {
    const id = solicitud.id!;
    const estado = this.estadoEdit[id];
    const respuesta = this.respuestaEdit[id] ?? '';

    console.log('[Guardar] enviando', { id, estado, respuesta });

    this.guardandoId.set(id);
    this.mensajeGuardado.set('');
    try {
      await this.solicitudesService.actualizarSolicitud(id, estado, respuesta);
      this.mensajeGuardado.set('Guardado correctamente.');
    } catch {
      this.mensajeGuardado.set('Error al guardar.');
    } finally {
      this.guardandoId.set(null);
    }
  }

  formatFecha(solicitud: Solicitud): string {
    if (!solicitud.fechaCreacion) return 'Sin fecha';
    const ts = solicitud.fechaCreacion as { seconds: number } | null;
    if (!ts || typeof ts !== 'object' || !('seconds' in ts)) return 'Sin fecha';
    return new Date(ts.seconds * 1000).toLocaleDateString('es-EC', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }
}