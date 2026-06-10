import { Timestamp } from '@angular/fire/firestore';

export interface StrapiMedia {
  id: number;
  documentId: string;
  name: string;
  url: string;
  formats?: {
    thumbnail?: { url: string };
    small?: { url: string };
    medium?: { url: string };
    large?: { url: string };
  };
}

export interface StrapiResponse<T> {
  data: T;
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface Tecnologia {
  id: number;
  documentId: string;
  nombre: string;
  logo: StrapiMedia | null;
}

export interface Programador {
  id: number;
  documentId: string;
  nombreCompleto: string;
  especialidad: string;
  descripcionBreve: string;
  descripcionCompleta: string;
  fotoPerfil: StrapiMedia | null;
  correoContacto: string;
  github: string;
  linkedin: string;
  activo: boolean;
  slug: string;
  proyectos?: Proyecto[];
}

export interface Proyecto {
  id: number;
  documentId: string;
  nombre: string;
  slug: string;
  descripcionBreve: string;
  descripcionCompleta: string;
  imagenPrincipal: StrapiMedia | null;
  tipo: 'academico' | 'personal' | 'laboral' | 'simulado';
  repositorio: string;
  demo: string | null;
  destacado: boolean;
  programadors?: Programador[];
  tecnologias?: Tecnologia[];
}

export interface Servicio {
  id: number;
  documentId: string;
  nombre: string;
  descripcion: string;
  icono: string;
}

export interface Solicitud {
  id?: string;
  nombreSolicitante: string;
  correoSolicitante: string;
  descripcionProyecto: string;
  programadorSlug: string;
  programadorNombre: string;
  programadorEmail: string;
  uid: string;
  usuarioEmail: string;
  estado: 'Pendiente' | 'Respondida';
  respuesta: string;
  fechaCreacion: Timestamp | null;
}
