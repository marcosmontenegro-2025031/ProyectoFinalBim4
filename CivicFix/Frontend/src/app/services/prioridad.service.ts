import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Prioridad } from '../models/prioridad.model';

@Injectable({
  providedIn: 'root'
})
export class PrioridadService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/prioridades';

  obtenerTodas(): Observable<Prioridad[]> {
    return this.http.get<Prioridad[]>(this.apiUrl);
  }
}