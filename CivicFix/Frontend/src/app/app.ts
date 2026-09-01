import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm mb-4">
      <div class="container">
        <a class="navbar-brand fw-bold text-primary" routerLink="/">CivicFix</a>
        <div class="navbar-nav ms-auto">
          <a class="nav-link" routerLink="/reportes" routerLinkActive="active">Crear Reporte</a>
          <a class="nav-link" routerLink="/mapa" routerLinkActive="active">Mapa</a>
          <a class="nav-link" routerLink="/admin" routerLinkActive="active">Panel Admin</a>
        </div>
      </div>
    </nav>
    <div class="container mb-5">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .nav-link.active {
      font-weight: bold;
      color: #0d6efd !important;
    }
  `]
})
export class App {}
