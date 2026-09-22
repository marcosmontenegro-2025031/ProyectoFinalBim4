import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { FotoProblemaService } from '../../core/services/fotoProblema';
import { FotografiaProblema } from '../../core/models/fotoProblema.model';

@Component({
    selector: 'app-fotografias',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './fotografias.html',
    styleUrl: './fotografias.css'
})
export class Fotografias {
    private service = inject(FotoProblemaService);
    private fb = inject(FormBuilder);

    fotografias = signal<FotografiaProblema[]>([]);
    cargando = signal(false);
    error = signal<string | null>(null);

    form = this.fb.nonNullable.group({
        fk_id_reporte: [null as number | null, Validators.required],
        ruta_fotografia: ['', Validators.required],
        descripcion: ['']
    });

    constructor() {
        this.cargar();
    }

    cargar(): void {
        this.cargando.set(true);
        this.service.listar().subscribe({
            next: (data) => {
                this.fotografias.set(data);
                this.cargando.set(false);
            },
            error: () => {
                this.error.set('No se pudieron cargar las fotografías. Verifica que el backend esté corriendo.');
                this.cargando.set(false);
            }
        });
    }

    guardar(): void {
        if (this.form.invalid) return;

        const valores = this.form.getRawValue();
        this.service.crear({
            fk_id_reporte: valores.fk_id_reporte!,
            ruta_fotografia: valores.ruta_fotografia,
            descripcion: valores.descripcion
        }).subscribe({
            next: () => {
                this.form.reset();
                this.cargar();
            },
            error: () => this.error.set('No se pudo registrar la fotografía.')
        });
    }

    eliminar(id: number): void {
        this.service.eliminar(id).subscribe({
            next: () => this.cargar(),
            error: () => this.error.set('No se pudo eliminar la fotografía.')
        });
    }
}
