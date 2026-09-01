import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  private http = inject(HttpClient);
  
  totalReportes = 0;
  pendientes = 0;
  enProceso = 0;
  resueltos = 0;

  ngOnInit(): void {
    this.cargarEstadisticas();
  }

  cargarEstadisticas(): void {
    this.http.get<any[]>('http://localhost:3000/api/reportes/mapa').subscribe(data => {
      this.totalReportes = data.length;
      this.pendientes = data.filter(r => r.estado === 'PENDIENTE').length;
      this.enProceso = data.filter(r => r.estado === 'EN_PROCESO').length;
      this.resueltos = data.filter(r => r.estado === 'RESUELTO').length;
    });
  }
}
