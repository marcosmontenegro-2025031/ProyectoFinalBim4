import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AsignacionService } from '../../core/services/asignacion';
import { Asignacion } from '../../core/models/asignacion.model';

@Component({
    selector: 'app-asignaciones',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './asignaciones.html',
    styleUrl: './asignaciones.css'
})
export class Asignaciones {
    private service = inject(AsignacionService);
    private fb = inject(FormBuilder);

    asignaciones = signal<Asignacion[]>([]);
    cargando = signal(false);
    error = signal<string | null>(null);

    form = this.fb.nonNullable.group({
        fk_id_reporte: [null as number | null, Validators.required],
        fk_id_empleado: [null as number | null, Validators.required],
        observacion: ['']
    });

    constructor() {
        this.cargar();
    }

    cargar(): void {
        this.cargando.set(true);
        this.service.listar().subscribe({
            next: (data) => {
                this.asignaciones.set(data);
                this.cargando.set(false);
            },
            error: () => {
                this.error.set('No se pudieron cargar las asignaciones. Verifica que el backend esté corriendo.');
                this.cargando.set(false);
            }
        });
    }

    guardar(): void {
        if (this.form.invalid) return;

        const valores = this.form.getRawValue();
        this.service.crear({
            fk_id_reporte: valores.fk_id_reporte!,
            fk_id_empleado: valores.fk_id_empleado!,
            observacion: valores.observacion
        }).subscribe({
            next: () => {
                this.form.reset();
                this.cargar();
            },
            error: () => this.error.set('No se pudo crear la asignación.')
        });
    }

    eliminar(id: number): void {
        this.service.eliminar(id).subscribe({
            next: () => this.cargar(),
            error: () => this.error.set('No se pudo eliminar la asignación.')
        });
    }
}
