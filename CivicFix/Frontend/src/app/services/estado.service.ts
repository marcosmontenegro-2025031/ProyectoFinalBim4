import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Estado } from '../models/estado.model';

@Injectable({
  providedIn: 'root'
})
export class EstadoService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/estados';

  obtenerTodos(): Observable<Estado[]> {
    return this.http.get<Array<Estado & {id_estado?: number}>>(this.apiUrl).pipe(
      map(estados => estados.map(e => ({...e, idEstado: Number(e.id_estado ?? e.idEstado)})))
    );
  }
}