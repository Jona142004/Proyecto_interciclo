import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import {
  Programador,
  Proyecto,
  Servicio,
  StrapiMedia,
  StrapiResponse,
  Tecnologia,
} from '../models/strapi.models';

export function mediaUrl(media: StrapiMedia | null | undefined): string {
  if (!media) return '';

  if (media.url.startsWith('http')) {
    return media.url;
  }

  return environment.strapiUrl + media.url;
}

@Injectable({ providedIn: 'root' })
export class StrapiService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.strapiUrl + '/api';

  getProgramadores(): Observable<StrapiResponse<Programador[]>> {
    const url = `${this.base}/programadores?populate=*`;
    console.log('[Strapi] GET', url);
    return this.http.get<StrapiResponse<Programador[]>>(url).pipe(
      tap({ next: (r) => console.log('[Strapi] programadores OK', r), error: (e) => console.error('[Strapi] programadores ERROR', e) })
    );
  }

  getProgramadorBySlug(slug: string): Observable<StrapiResponse<Programador[]>> {
    return this.http.get<StrapiResponse<Programador[]>>(
      `${this.base}/programadores?filters[slug][$eq]=${encodeURIComponent(slug)}&populate=*`
    );
  }

  getProyectos(): Observable<StrapiResponse<Proyecto[]>> {
    return this.http.get<StrapiResponse<Proyecto[]>>(
      `${this.base}/proyectos?populate=*`
    );
  }

  getProyectosDestacados(): Observable<StrapiResponse<Proyecto[]>> {
    const url = `${this.base}/proyectos?filters[destacado][$eq]=true&populate=*`;
    console.log('[Strapi] GET', url);
    return this.http.get<StrapiResponse<Proyecto[]>>(url).pipe(
      tap({ next: (r) => console.log('[Strapi] proyectos destacados OK', r), error: (e) => console.error('[Strapi] proyectos destacados ERROR', e) })
    );
  }

  getProyectoBySlug(slug: string): Observable<StrapiResponse<Proyecto[]>> {
    return this.http.get<StrapiResponse<Proyecto[]>>(
      `${this.base}/proyectos?filters[slug][$eq]=${encodeURIComponent(slug)}&populate=*`
    );
  }

  getProyectosByProgramador(slug: string): Observable<StrapiResponse<Proyecto[]>> {
    return this.http.get<StrapiResponse<Proyecto[]>>(
      `${this.base}/proyectos?filters[programadors][slug][$eq]=${encodeURIComponent(slug)}&populate=*`
    );
  }

  getServicios(): Observable<StrapiResponse<Servicio[]>> {
    return this.http.get<StrapiResponse<Servicio[]>>(
      `${this.base}/servicios?populate=*`
    );
  }

  getTecnologias(): Observable<StrapiResponse<Tecnologia[]>> {
    return this.http.get<StrapiResponse<Tecnologia[]>>(
      `${this.base}/tecnologias?populate=*`
    );
  }
}
