import { pool } from '../config/db';
import { Reporte } from '../models/reporte.model';
import { Ubicacion } from '../models/ubicacion.model';
import { UbicacionRepository } from './ubicacion.repository';

export interface GuardarReporteCompletoParams {
    ubicacion: Omit<Ubicacion, 'id_ubicacion'>;
    titulo: string;
    descripcion: string;
    idUsuario: number;
    codigoTipo: string;
    codigoPrioridad: string;
}

export class ReporteRepository {
    private ubicacionRepo = new UbicacionRepository();

    async crearReporteConTransaccion(params: GuardarReporteCompletoParams): Promise<{ id_reporte: number; fecha_reporte: Date }> {
        const client = await pool.connect();

        try {
            await client.query('BEGIN');

            const idUbicacion = await this.ubicacionRepo.crear(params.ubicacion, client);

            const queryReporte = `
                INSERT INTO Reporte (
                    titulo,
                    descripcion,
                    id_usuario,
                    id_tipo_incidencia,
                    id_ubicacion,
                    id_estado,
                    id_prioridad
                )
                VALUES (
                    $1, $2, $3,
                    (SELECT id_tipo_incidencia FROM TipoIncidencia WHERE codigo_ia = $4),
                    $5,
                    (SELECT id_estado FROM Estado WHERE nombre = 'PENDIENTE'),
                    (SELECT id_prioridad FROM Prioridad WHERE codigo_ia = $6)
                )
                RETURNING id_reporte, fecha_reporte;
            `;

            const values = [
                params.titulo,
                params.descripcion,
                params.idUsuario,
                params.codigoTipo,
                idUbicacion,
                params.codigoPrioridad
            ];

            const { rows } = await client.query(queryReporte, values);
            await client.query('COMMIT');

            return {
                id_reporte: rows[0].id_reporte,
                fecha_reporte: rows[0].fecha_reporte
            };

        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    async obtenerReportesParaMapa() {
        const query = `
            SELECT 
                r.id_reporte,
                r.titulo,
                r.descripcion,
                r.fecha_reporte,
                u.direccion,
                u.zona,
                u.referencia,
                u.latitud,
                u.longitud,
                ti.nombre AS categoria,
                p.nombre AS prioridad,
                e.nombre AS estado
            FROM Reporte r
            INNER JOIN Ubicacion u ON r.id_ubicacion = u.id_ubicacion
            INNER JOIN TipoIncidencia ti ON r.id_tipo_incidencia = ti.id_tipo_incidencia
            INNER JOIN Prioridad p ON r.id_prioridad = p.id_prioridad
            INNER JOIN Estado e ON r.id_estado = e.id_estado
            ORDER BY r.fecha_reporte DESC;
        `;
        const { rows } = await pool.query(query);
        return rows;
    }
}