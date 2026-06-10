import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { StrapiService, mediaUrl } from '../../services/strapi.service';
import { Proyecto } from '../../models/strapi.models';

@Component({
  selector: 'app-proyecto-detalle',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  templateUrl: './proyecto-detalle.component.html',
  styleUrl: './proyecto-detalle.component.css',
})
export class ProyectoDetalleComponent implements OnInit {
  private readonly strapi = inject(StrapiService);
  private readonly route = inject(ActivatedRoute);

  readonly proyecto = signal<Proyecto | null>(null);
  readonly cargando = signal(true);
  readonly error = signal('');
  readonly mediaUrl = mediaUrl;

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug') ?? '';
    this.strapi.getProyectoBySlug(slug).subscribe({
      next: (res) => {
        this.proyecto.set(res.data[0] ?? null);
        if (!res.data[0]) {
          this.error.set('Proyecto no encontrado.');
        }
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar el proyecto.');
        this.cargando.set(false);
      },
    });
  }
}
