import { pool } from '../config/db';
import { Ubicacion } from '../models/ubicacion.model';

export interface GuardarReporteParams extends Omit<Ubicacion, 'id_ubicacion'> {
    titulo: string;
    descripcion: string;
    idUsuario: number;
    codigoTipo: string;
    codigoPrioridad: string;
}

export class ReporteRepository {
    async guardarReporteConUbicacion(datos: GuardarReporteParams) {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const resUbicacion = await client.query(
                `INSERT INTO Ubicacion (direccion, zona, referencia, latitud, longitud)
                 VALUES ($1, $2, $3, $4, $5)
                 RETURNING id_ubicacion`,
                [datos.direccion, datos.zona || null, datos.referencia || null, datos.latitud, datos.longitud]
            );
            const idUbicacion = resUbicacion.rows[0].id_ubicacion;

            const resReporte = await client.query(
                `INSERT INTO Reporte (
                    titulo, descripcion, id_usuario, id_tipo_incidencia, id_ubicacion, id_estado, id_prioridad
                 )
                 VALUES (
                    $1, $2, $3,
                    (SELECT id_tipo_incidencia FROM TipoIncidencia WHERE codigo_ia = $4),
                    $5,
                    (SELECT id_estado FROM Estado WHERE nombre = 'PENDIENTE'),
                    (SELECT id_prioridad FROM Prioridad WHERE codigo_ia = $6)
                 )
                 RETURNING id_reporte, fecha_reporte`,
                [
                    datos.titulo,
                    datos.descripcion,
                    datos.idUsuario,
                    datos.codigoTipo,
                    idUbicacion,
                    datos.codigoPrioridad
                ]
            );

            await client.query('COMMIT');
            return {
                id_reporte: resReporte.rows[0].id_reporte,
                fecha_reporte: resReporte.rows[0].fecha_reporte
            };
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    async obtenerPuntosMapa() {
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