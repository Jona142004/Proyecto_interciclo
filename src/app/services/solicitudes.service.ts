import { inject, Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  query,
  where,
  addDoc,
  doc,
  updateDoc,
  serverTimestamp,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Solicitud } from '../models/strapi.models';

@Injectable({ providedIn: 'root' })
export class SolicitudesService {
  private readonly db = inject(Firestore);

  async crearSolicitud(
    data: Omit<Solicitud, 'id' | 'estado' | 'respuesta' | 'fechaCreacion'>
  ): Promise<void> {
    const ref = collection(this.db, 'solicitudes');
    await addDoc(ref, {
      ...data,
      estado: 'Pendiente',
      respuesta: '',
      fechaCreacion: serverTimestamp(),
    });
  }

  solicitudesRecibidas(email: string): Observable<Solicitud[]> {
    const ref = collection(this.db, 'solicitudes');
    const q = query(ref, where('programadorEmail', '==', email));
    return collectionData(q, { idField: 'id' }) as Observable<Solicitud[]>;
  }

  solicitudesEnviadas(uid: string): Observable<Solicitud[]> {
    const ref = collection(this.db, 'solicitudes');
    const q = query(ref, where('uid', '==', uid));
    return collectionData(q, { idField: 'id' }) as Observable<Solicitud[]>;
  }

  async actualizarSolicitud(
    id: string,
    estado: 'Pendiente' | 'Respondida',
    respuesta: string
  ): Promise<void> {
    const ref = doc(this.db, 'solicitudes', id);
    await updateDoc(ref, { estado, respuesta });
  }
}