import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FotoProblemaService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/fotos'; // Ajusta la ruta base de tus rutas de backend

  subirFoto(reporteId: number, archivo: File): Observable<any> {
    const formData = new FormData();
    formData.append('reporteId', reporteId.toString());
    formData.append('imagen', archivo);

    return this.http.post<any>(this.apiUrl, formData);
  }
}