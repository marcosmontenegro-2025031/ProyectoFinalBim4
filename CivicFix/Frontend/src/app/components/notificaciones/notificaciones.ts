import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { NotificacionService } from '../../core/services/notificacion.service';
import { Notificacion } from '../../core/models/notificacion.model';

@Component({
    selector: 'app-notificaciones',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './notificaciones.html',
    styleUrl: './notificaciones.css'
})
export class Notificaciones {
    private service = inject(NotificacionService);
    private fb = inject(FormBuilder);

    notificaciones = signal<Notificacion[]>([]);
    cargando = signal(false);
    error = signal<string | null>(null);

    buscarForm = this.fb.nonNullable.group({
        fk_id_usuario: [null as number | null, Validators.required]
    });

    form = this.fb.nonNullable.group({
        fk_id_usuario: [null as number | null, Validators.required],
        fk_id_reporte: [null as number | null, Validators.required],
        titulo: ['', Validators.required],
        mensaje: ['', Validators.required]
    });

    buscar(): void {
        if (this.buscarForm.invalid) return;
        const idUsuario = this.buscarForm.getRawValue().fk_id_usuario!;

        this.cargando.set(true);
        this.service.listarPorUsuario(idUsuario).subscribe({
            next: (data) => {
                this.notificaciones.set(data);
                this.cargando.set(false);
            },
            error: () => {
                this.error.set('No se pudieron cargar las notificaciones. Verifica que el backend esté corriendo.');
                this.cargando.set(false);
            }
        });
    }

    guardar(): void {
        if (this.form.invalid) return;

        const valores = this.form.getRawValue();
        this.service.crear({
            fk_id_usuario: valores.fk_id_usuario!,
            fk_id_reporte: valores.fk_id_reporte!,
            titulo: valores.titulo,
            mensaje: valores.mensaje
        }).subscribe({
            next: () => {
                this.form.reset();
                if (this.buscarForm.value.fk_id_usuario === valores.fk_id_usuario) {
                    this.buscar();
                }
            },
            error: () => this.error.set('No se pudo crear la notificación.')
        });
    }

    marcarLeida(id: number): void {
        this.service.marcarComoLeida(id).subscribe({
            next: () => this.buscar(),
            error: () => this.error.set('No se pudo marcar como leída.')
        });
    }

    eliminar(id: number): void {
        this.service.eliminar(id).subscribe({
            next: () => this.buscar(),
            error: () => this.error.set('No se pudo eliminar la notificación.')
        });
    }
}
