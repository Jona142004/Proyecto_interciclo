import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { StrapiService, mediaUrl } from '../../services/strapi.service';
import { Programador, Proyecto } from '../../models/strapi.models';
import { ProyectoCardComponent } from '../../components/proyecto-card/proyecto-card.component';

@Component({
  selector: 'app-programador-perfil',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, ProyectoCardComponent],
  templateUrl: './programador-perfil.component.html',
  styleUrl: './programador-perfil.component.css',
})
export class ProgramadorPerfilComponent implements OnInit {
  private readonly strapi = inject(StrapiService);
  private readonly route = inject(ActivatedRoute);

  readonly programador = signal<Programador | null>(null);
  readonly proyectos = signal<Proyecto[]>([]);
  readonly cargando = signal(true);
  readonly error = signal('');

  readonly mediaUrl = mediaUrl;

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug') ?? '';

    this.strapi.getProgramadorBySlug(slug).subscribe({
      next: (res) => {
        const prog = res.data[0] ?? null;
        this.programador.set(prog);
        if (prog) {
          this.cargarProyectos(slug);
        } else {
          this.error.set('Programador no encontrado.');
          this.cargando.set(false);
        }
      },
      error: () => {
        this.error.set('No se pudo cargar el perfil.');
        this.cargando.set(false);
      },
    });
  }

  private cargarProyectos(slug: string): void {
    this.strapi.getProyectosByProgramador(slug).subscribe({
      next: (res) => {
        this.proyectos.set(res.data);
        this.cargando.set(false);
      },
      error: () => {
        this.cargando.set(false);
      },
    });
  }
}
