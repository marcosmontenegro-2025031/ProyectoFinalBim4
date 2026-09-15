import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { BitacoraCambioEstadoService } from '../../core/services/bitacoraCambioEstado';
import { BitacoraCambioEstado } from '../../core/models/bitacoraCambioEstado.model';

/** Representa una transición única (estado anterior -> estado nuevo) detectada en los datos. */
interface TransicionEstado {
    anterior: number | null;
    nuevo: number;
    etiqueta: string;
}

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

    // --- Filtros de búsqueda/auditoría ---
    textoBusqueda = signal('');
    transicionSeleccionada = signal<string>('todas');

    /** Lista de transiciones únicas presentes en los registros, para poblar el filtro. */
    transicionesDisponibles = computed<TransicionEstado[]>(() => {
        const mapa = new Map<string, TransicionEstado>();
        for (const item of this.registros()) {
            const anterior = item.fk_id_estado_anterior ?? null;
            const clave = `${anterior ?? 'n'}->${item.fk_id_estado_nuevo}`;
            if (!mapa.has(clave)) {
                mapa.set(clave, {
                    anterior,
                    nuevo: item.fk_id_estado_nuevo,
                    etiqueta: `${anterior ?? '—'} → ${item.fk_id_estado_nuevo}`
                });
            }
        }
        return Array.from(mapa.values());
    });

    /** Registros filtrados por texto libre y/o por la transición de estado elegida. */
    registrosFiltrados = computed<BitacoraCambioEstado[]>(() => {
        const texto = this.textoBusqueda().trim().toLowerCase();
        const transicion = this.transicionSeleccionada();

        return this.registros().filter((item) => {
            const coincideTexto =
                texto === '' ||
                String(item.id_bitacora ?? '').includes(texto) ||
                String(item.fk_id_reporte).includes(texto) ||
                String(item.fk_id_empleado ?? '').includes(texto) ||
                (item.comentario ?? '').toLowerCase().includes(texto);

            const coincideTransicion =
                transicion === 'todas' ||
                transicion === `${item.fk_id_estado_anterior ?? 'n'}->${item.fk_id_estado_nuevo}`;

            return coincideTexto && coincideTransicion;
        });
    });

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

    actualizarBusqueda(valor: string): void {
        this.textoBusqueda.set(valor);
    }

    actualizarTransicion(valor: string): void {
        this.transicionSeleccionada.set(valor);
    }

    limpiarFiltros(): void {
        this.textoBusqueda.set('');
        this.transicionSeleccionada.set('todas');
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