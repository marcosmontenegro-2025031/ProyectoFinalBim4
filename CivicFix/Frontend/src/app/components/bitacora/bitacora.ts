import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { BitacoraCambioEstadoService } from '../../core/services/bitacora-cambio-estado';
import { BitacoraCambioEstado } from '../../core/models/bitacoraCambioEstado.model';

@Component({
    selector: 'app-bitacora',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './bitacora.html',
    styleUrl: './bitacora.css'
})
export class Bitacora {
    private service = inject(BitacoraCambioEstadoService);
    private fb = inject(FormBuilder);

    registros = signal<BitacoraCambioEstado[]>([]);
    cargando = signal(false);
    error = signal<string | null>(null);

    form = this.fb.nonNullable.group({
        fk_id_reporte: [null as number | null, Validators.required],
        fk_id_estado_anterior: [null as number | null],
        fk_id_estado_nuevo: [null as number | null, Validators.required],
        fk_id_empleado: [null as number | null],
        comentario: ['']
    });

    constructor() {
        this.cargar();
    }

    cargar(): void {
        this.cargando.set(true);
        this.service.listar().subscribe({
            next: (data) => {
                this.registros.set(data);
                this.cargando.set(false);
            },
            error: () => {
                this.error.set('No se pudo cargar la bitácora. Verifica que el backend esté corriendo.');
                this.cargando.set(false);
            }
        });
    }

    guardar(): void {
        if (this.form.invalid) return;

        const valores = this.form.getRawValue();
        this.service.registrar({
            fk_id_reporte: valores.fk_id_reporte!,
            fk_id_estado_anterior: valores.fk_id_estado_anterior ?? undefined,
            fk_id_estado_nuevo: valores.fk_id_estado_nuevo!,
            fk_id_empleado: valores.fk_id_empleado ?? undefined,
            comentario: valores.comentario
        }).subscribe({
            next: () => {
                this.form.reset();
                this.cargar();
            },
            error: () => this.error.set('No se pudo registrar el cambio de estado.')
        });
    }
}
