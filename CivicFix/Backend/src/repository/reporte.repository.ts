import { pool } from '../config/db';
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

    async actualizarEstado(idReporte: number, idEstado: number): Promise<boolean> {
        const resultado = await pool.query(
            'UPDATE Reporte SET fk_id_estado = $1 WHERE id_reporte = $2',
            [idEstado, idReporte]
        );
        return resultado.rowCount === 1;
    }

    async obtenerTodosLosReportes() {
        const query = `
            SELECT
                r.id_reporte,
                r.titulo,
                r.descripcion,
                r.fecha_reporte,
                usr.nombre AS usuario,
                ti.nombre AS tipo_incidencia,
                u.direccion,
                u.zona,
                u.latitud,
                u.longitud,
                e.nombre AS estado,
                p.nombre AS prioridad,
                f.ruta_fotografia
            FROM Reporte r
            INNER JOIN Usuario usr ON r.fk_id_usuario = usr.id_usuario
            INNER JOIN Ubicacion u ON r.fk_id_ubicacion = u.id_ubicacion
            INNER JOIN TipoIncidencia ti ON r.fk_id_tipo_incidencia = ti.id_tipo_incidencia
            INNER JOIN Prioridad p ON r.fk_id_prioridad = p.id_prioridad
            INNER JOIN Estado e ON r.fk_id_estado = e.id_estado
            LEFT JOIN FotografiaProblema f ON r.id_reporte = f.fk_id_reporte
            ORDER BY r.fecha_reporte DESC;
        `;

        const { rows } = await pool.query(query);

        return rows;
    }

    async crearReporteConTransaccion(
        params: GuardarReporteCompletoParams
    ): Promise<any> {
        const client = await pool.connect();

        try {
            await client.query('BEGIN');

            const idUbicacion = await this.ubicacionRepo.crear(
                params.ubicacion,
                client
            );

            const queryReporte = `
                INSERT INTO Reporte (
                    titulo,
                    descripcion,
                    fk_id_usuario,
                    fk_id_tipo_incidencia,
                    fk_id_ubicacion,
                    fk_id_estado,
                    fk_id_prioridad
                )
                VALUES (
                    $1,
                    $2,
                    $3,
                    (
                        SELECT id_tipo_incidencia
                        FROM TipoIncidencia
                        WHERE LOWER(codigo_ia) = LOWER($4)
                        LIMIT 1
                    ),
                    $5,
                    (
                        SELECT id_estado
                        FROM Estado
                        WHERE nombre = 'Pendiente'
                        LIMIT 1
                    ),
                    (
                        SELECT id_prioridad
                        FROM Prioridad
                        WHERE LOWER(codigo_ia) = LOWER($6)
                        LIMIT 1
                    )
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

            const { rows } = await client.query(
                queryReporte,
                values
            );

            await client.query('COMMIT');

            return {
                data: {
                    analisis: {
                        titulo_corto: params.titulo,
                        codigo_tipo: params.codigoTipo,
                        nivel_prioridad: params.codigoPrioridad
                    }
                },
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
            INNER JOIN Ubicacion u ON r.fk_id_ubicacion = u.id_ubicacion
            INNER JOIN TipoIncidencia ti ON r.fk_id_tipo_incidencia = ti.id_tipo_incidencia
            INNER JOIN Prioridad p ON r.fk_id_prioridad = p.id_prioridad
            INNER JOIN Estado e ON r.fk_id_estado = e.id_estado
            ORDER BY r.fecha_reporte DESC;
        `;

        const { rows } = await pool.query(query);

        return rows;
    }

    async obtenerReportesPorUsuario(idUsuario: number) {
        const query = `
            SELECT
                r.id_reporte,
                r.titulo,
                r.descripcion,
                r.fecha_reporte,
                usr.nombre AS usuario,
                ti.nombre AS tipo_incidencia,
                u.direccion,
                u.zona,
                u.latitud,
                u.longitud,
                e.nombre AS estado,
                p.nombre AS prioridad,
                f.ruta_fotografia
            FROM Reporte r
            INNER JOIN Usuario usr ON r.fk_id_usuario = usr.id_usuario
            INNER JOIN Ubicacion u ON r.fk_id_ubicacion = u.id_ubicacion
            INNER JOIN TipoIncidencia ti ON r.fk_id_tipo_incidencia = ti.id_tipo_incidencia
            INNER JOIN Prioridad p ON r.fk_id_prioridad = p.id_prioridad
            INNER JOIN Estado e ON r.fk_id_estado = e.id_estado
            LEFT JOIN FotografiaProblema f ON r.id_reporte = f.fk_id_reporte
            WHERE r.fk_id_usuario = $1
            ORDER BY r.fecha_reporte DESC;
        `;
        const { rows } = await pool.query(query, [idUsuario]);
        return rows;
    }
}
