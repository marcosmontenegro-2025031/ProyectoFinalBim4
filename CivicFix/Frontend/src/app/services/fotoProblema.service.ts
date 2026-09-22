import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FotoProblemaService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/fotografias`;

  subirFoto(reporteId: number, archivo: File): Observable<any> {
    const formData = new FormData();
    formData.append('id_reporte', reporteId.toString());
    formData.append('imagen', archivo);

    return this.http.post<any>(this.apiUrl, formData);
  }
}