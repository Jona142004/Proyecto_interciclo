import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { StrapiService } from '../../services/strapi.service';
import { AuthService } from '../../services/auth.service';
import { SolicitudesService } from '../../services/solicitudes.service';
import { Programador } from '../../models/strapi.models';

@Component({
  selector: 'app-solicitud-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule],
  templateUrl: './solicitud-form.component.html',
  styleUrl: './solicitud-form.component.css',
})
export class SolicitudFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly strapi = inject(StrapiService);
  private readonly auth = inject(AuthService);
  private readonly solicitudesService = inject(SolicitudesService);

  readonly programadores = signal<Programador[]>([]);
  readonly cargandoProgramadores = signal(true);
  readonly cargando = signal(false);
  readonly exito = signal(false);
  readonly errorMsg = signal('');

  readonly form = this.fb.group({
    nombreSolicitante: ['', [Validators.required, Validators.minLength(3)]],
    correoSolicitante: ['', [Validators.required, Validators.email]],
    descripcionProyecto: ['', [Validators.required, Validators.minLength(20)]],
    programadorSlug: ['', [Validators.required]],
  });

  ngOnInit(): void {
    const emailUsuario = this.auth.usuario()?.email ?? '';
    this.form.patchValue({ correoSolicitante: emailUsuario });

    this.strapi.getProgramadores().subscribe({
      next: (res) => {
        this.programadores.set(res.data.filter((p) => p.activo));
        this.cargandoProgramadores.set(false);
      },
      error: () => {
        this.cargandoProgramadores.set(false);
      },
    });
  }

  campoInvalido(campo: string): boolean {
    const ctrl = this.form.get(campo)!;
    return ctrl.invalid && ctrl.touched;
  }

  async enviar(): Promise<void> {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    const { programadorSlug } = this.form.getRawValue();
    const programador = this.programadores().find((p) => p.slug === programadorSlug);
    if (!programador) return;

    const usuario = this.auth.usuario();
    if (!usuario) return;

    this.cargando.set(true);
    this.errorMsg.set('');

    const { nombreSolicitante, correoSolicitante, descripcionProyecto } = this.form.getRawValue();

    try {
      await this.solicitudesService.crearSolicitud({
        nombreSolicitante: nombreSolicitante!,
        correoSolicitante: correoSolicitante!,
        descripcionProyecto: descripcionProyecto!,
        programadorSlug: programador.slug,
        programadorNombre: programador.nombreCompleto,
        programadorEmail: programador.correoContacto,
        uid: usuario.uid,
        usuarioEmail: usuario.email ?? '',
      });
      this.exito.set(true);
      this.form.reset({ correoSolicitante: usuario.email ?? '' });
    } catch {
      this.errorMsg.set('Error al enviar la solicitud. Intenta de nuevo.');
    } finally {
      this.cargando.set(false);
    }
  }

  nuevaSolicitud(): void {
    this.exito.set(false);
    this.errorMsg.set('');
  }
}
