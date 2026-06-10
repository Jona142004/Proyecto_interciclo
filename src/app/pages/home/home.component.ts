import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { StrapiService } from '../../services/strapi.service';
import { Programador, Proyecto, Servicio } from '../../models/strapi.models';
import { ProgramadorCardComponent } from '../../components/programador-card/programador-card.component';
import { ProyectoCardComponent } from '../../components/proyecto-card/proyecto-card.component';
import { ServicioCardComponent } from '../../components/servicio-card/servicio-card.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, ProgramadorCardComponent, ProyectoCardComponent, ServicioCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  private readonly strapi = inject(StrapiService);
  readonly auth = inject(AuthService);

  readonly programadores = signal<Programador[]>([]);
  readonly proyectosDestacados = signal<Proyecto[]>([]);
  readonly servicios = signal<Servicio[]>([]);

  readonly cargandoProgramadores = signal(true);
  readonly cargandoProyectos = signal(true);
  readonly cargandoServicios = signal(true);

  readonly errorProgramadores = signal('');
  readonly errorProyectos = signal('');
  readonly errorServicios = signal('');

  ngOnInit(): void {
    this.strapi.getProgramadores().subscribe({
      next: (res) => {
        this.programadores.set(res.data);
        this.cargandoProgramadores.set(false);
      },
      error: () => {
        this.errorProgramadores.set('No se pudieron cargar los programadores.');
        this.cargandoProgramadores.set(false);
      },
    });

    this.strapi.getProyectosDestacados().subscribe({
      next: (res) => {
        this.proyectosDestacados.set(res.data);
        this.cargandoProyectos.set(false);
      },
      error: () => {
        this.errorProyectos.set('No se pudieron cargar los proyectos.');
        this.cargandoProyectos.set(false);
      },
    });

    this.strapi.getServicios().subscribe({
      next: (res) => {
        this.servicios.set(res.data);
        this.cargandoServicios.set(false);
      },
      error: () => {
        this.errorServicios.set('No se pudieron cargar los servicios.');
        this.cargandoServicios.set(false);
      },
    });
  }
}
