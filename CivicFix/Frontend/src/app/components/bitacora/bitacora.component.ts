import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BitacoraCambioEstadoService } from '../../services/bitacoraCambioEstado.service';
import { BitacoraCambioEstado } from '../../models/bitacoraCambioEstado.model';
import { SessionService } from '../../services/session.service';
import { UnreadNotificationCountComponent } from '../../shared/unread-notification-count/unread-notification-count.component';

@Component({
  selector: 'app-bitacora',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    FormsModule,
    UnreadNotificationCountComponent
  ],
  templateUrl: './bitacora.html',
  styleUrl: './bitacora.css'
})
export class BitacoraCambioEstadoComponent implements OnInit {

  private bitacoraService = inject(BitacoraCambioEstadoService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private sesion = inject(SessionService);
  private cdr = inject(ChangeDetectorRef);
  puedeEditar(b: BitacoraCambioEstado): boolean {
    const usuario = this.sesion.obtenerUsuario<{id_empleado?: number}>();
    return this.sesion.obtenerRol() === 'administrador' ||
       (b.fk_id_empleado != null && b.fk_id_empleado === usuario?.id_empleado);
  }


  bitacoras: BitacoraCambioEstado[] = [];

  idReporte: number | null = null;

  cargando = true;
  error = '';

  editando = false;

  bitacoraEditando: BitacoraCambioEstado = {
    fk_id_reporte: 0,
    fk_id_estado_anterior: null,
    fk_id_estado_nuevo: 1,
    fk_id_empleado: null,
    comentario: ''
 };

  ngOnInit(): void {

    this.route.paramMap.subscribe(params => {

      const parametroId = params.get('idReporte');

      if (parametroId === null) {
        this.idReporte = null;
        this.cargarBitacora();
        return;
      }

      const id = Number(parametroId);
      if (!Number.isInteger(id) || id < 1) {
        this.error = 'No se recibió un reporte válido.';
        this.cargando = false;
        this.cdr.markForCheck();
        return;
      }

      this.idReporte = id;

      this.cargarBitacora();
    });
  }

  cargarBitacora(): void {

    this.cargando = true;
    this.error = '';

    const solicitud = this.idReporte === null
      ? this.bitacoraService.listarMisReportes()
      : this.bitacoraService.listarPorReporte(this.idReporte);

    solicitud.subscribe({

      next: (data) => {

        this.bitacoras = data;

        this.cargando = false;
        this.cdr.markForCheck();
      },

      error: (err) => {

        console.error('Error al cargar la bitácora:', err);

        this.error = 'No se pudo cargar la bitácora del reporte.';

        this.cargando = false;
        this.cdr.markForCheck();
      }
    });
  }

  volverReportes(): void {

    this.router.navigate(['/empleado/reportes']);
  }

  obtenerNombreEstado(idEstado: number | null): string {

    if (idEstado === null) {
      return 'Sin estado anterior';
    }

    switch (idEstado) {

      case 1:
        return 'Recibido';

      case 2:
        return 'En revisión';

      case 3:
        return 'Asignado';

      case 4:
        return 'En proceso';

      case 5:
        return 'Resuelto';

      case 6:
        return 'Rechazado';

      default:
        return `Estado #${idEstado}`;
    }
  }

  obtenerClaseEstado(idEstado: number | null): string {

    switch (idEstado) {

      case 1:
        return 'estado-pendiente';

      case 2:
        return 'estado-pendiente';

      case 3:
        return 'estado-asignado';

      case 4:
        return 'estado-proceso';

      case 5:
        return 'estado-resuelto';

      case 6:
        return 'estado-rechazado';

      default:
        return '';
    }
  }

  editarBitacora(bitacora: BitacoraCambioEstado): void {
    if (!this.puedeEditar(bitacora)) return;
    this.bitacoraEditando = {
        ...bitacora
    };

    this.editando = true;
   }

    cancelarEdicion(): void {
        this.editando = false;
    }

    guardarEdicion(): void {
        this.error = '';

        if (!this.bitacoraEditando.id_bitacora) {
            return;
        }

        this.bitacoraService.actualizar(
            this.bitacoraEditando.id_bitacora,
            this.bitacoraEditando
        ).subscribe({
            next: (bitacoraActualizada) => {

                const indice = this.bitacoras.findIndex(
                    b => b.id_bitacora === bitacoraActualizada.id_bitacora
                );

                if (indice !== -1) {
                    this.bitacoras[indice] = bitacoraActualizada;
                }

                this.editando = false;
                this.cdr.markForCheck();
            },
            error: (err) => {
                console.error('Error al actualizar la bitácora:', err);
                this.error = 'No se pudo actualizar la bitácora.';
                this.cdr.markForCheck();
            }
        });
    }
  
}