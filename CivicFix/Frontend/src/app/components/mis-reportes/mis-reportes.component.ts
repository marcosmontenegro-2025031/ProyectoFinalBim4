import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-mis-reportes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mis-reportes.component.html',
  styleUrls: ['./mis-reportes.component.css']
})
export class MisReportesComponent implements OnInit {
  private http = inject(HttpClient);
  reportes: any[] = [];
  cargando = true;

  ngOnInit(): void {
    this.cargarMisReportes();
  }

  cargarMisReportes(): void {
    this.http.get<any[]>('http://localhost:3000/api/reportes/usuario/1').subscribe({
      next: (data) => {
        this.reportes = data;
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
      }
    });
  }
}
