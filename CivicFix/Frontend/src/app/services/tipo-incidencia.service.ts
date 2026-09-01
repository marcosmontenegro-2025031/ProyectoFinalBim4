import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TipoIncidencia } from '../models/tipo-incidencia.model';

@Injectable({ providedIn: 'root' })
export class TipoIncidenciaService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/tipos-incidencia';

  obtenerTodos(): Observable<TipoIncidencia[]> {
    return this.http.get<TipoIncidencia[]>(this.apiUrl);
  }
}