import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Municipalidad } from '../models/municipalidad.model';

@Injectable({ providedIn: 'root' })
export class MunicipalidadService {
  private apiUrl = "http://localhost:3000/api/municipalidades";
  constructor(private http: HttpClient) {}
  obtenerMunicipalidades(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}