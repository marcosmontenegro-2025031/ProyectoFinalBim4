import { Component, HostBinding, OnInit, inject } from '@angular/core';
import { DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NotificacionService } from '../../services/notificacion.service';

@Component({
  selector: 'app-unread-notification-count',
  standalone: true,
  imports: [],
  template: '{{ cantidadNoLeidas }}',
  styles: [`
    :host([hidden]) { display: none !important; }
    :host(.notification-icon-count) {
      position: absolute;
      top: -6px;
      right: -6px;
      display: flex;
      min-width: 18px;
      height: 18px;
      padding: 0 4px;
      align-items: center;
      justify-content: center;
      border-radius: 999px;
      background: #d43d45;
      color: #fff;
      font-size: 10px;
      font-weight: 700;
      line-height: 1;
    }
  `]
})
export class UnreadNotificationCountComponent implements OnInit {
  private readonly notificacionService = inject(NotificacionService);
  private readonly destroyRef = inject(DestroyRef);
  cantidadNoLeidas = 0;

  @HostBinding('hidden') oculto = true;

  ngOnInit(): void {
    this.notificacionService.cantidadNoLeidas$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(cantidad => {
        this.cantidadNoLeidas = cantidad;
        this.oculto = cantidad === 0;
      });

    this.notificacionService.obtenerNotificaciones().subscribe({
      error: () => undefined
    });
  }
}