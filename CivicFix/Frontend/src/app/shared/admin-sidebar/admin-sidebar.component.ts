import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SessionService } from '../../services/session.service';

interface AdminSessionUser {
  nombre?: string;
  apellido?: string;
  usuario?: string;
  cargo?: string;
  rol?: string;
}

/**
 * Sidebar único para TODO el rol de administrador.
 *
 * Antes cada vista de /admin/* dibujaba su propia barra lateral
 * (con nombres de clase distintos entre sí: .sidebar, .admin-sidebar, etc.)
 * y el Dashboard (home-admin) usaba un diseño totalmente diferente
 * (.civic-sidebar) con un menú incompleto copiado de la vista de
 * ciudadano (Inicio, Reportar Incidencia, Mapa, Notificaciones, Perfil).
 *
 * Eso causaba dos problemas:
 *  1. El Dashboard se veía distinto a todas las demás pantallas de admin.
 *  2. Al hacer clic en las opciones del Dashboard, se navegaba a rutas
 *     de ciudadano/empleado (algunas protegidas solo para 'ciudadano'),
 *     por lo que el guard rechazaba al administrador.
 *
 * Este componente centraliza el menú de administración (con el diseño
 * "civic" del Dashboard) y se reutiliza en TODAS las vistas /admin/*,
 * incluyendo el propio Dashboard. Así solo existe un lugar donde
 * mantener el menú y las rutas siempre apuntan dentro de /admin.
 */
@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './admin-sidebar.component.html',
  styleUrl: './admin-sidebar.component.css'
})
export class AdminSidebarComponent {
  private readonly session = inject(SessionService);
  readonly usuario = this.session.obtenerUsuario<AdminSessionUser>();

  get nombreCompleto(): string {
    const nombre = [this.usuario?.nombre, this.usuario?.apellido]
      .filter(Boolean)
      .join(' ');
    return nombre || this.usuario?.usuario || 'Administrador';
  }

  get cargo(): string {
    return this.usuario?.rol || this.usuario?.cargo || 'Administrador';
  }

  get inicial(): string {
    return this.nombreCompleto.charAt(0).toUpperCase();
  }
}
