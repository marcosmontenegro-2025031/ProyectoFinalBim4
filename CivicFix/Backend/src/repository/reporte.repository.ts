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

   async obtenerTodosLosReportes() {
        const query = `
            SELECT 
                r.id_reporte,
                r.id_estado,
                r.id_prioridad,
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
            INNER JOIN Usuario usr ON r.id_usuario = usr.id_usuario
            INNER JOIN Ubicacion u ON r.id_ubicacion = u.id_ubicacion
            INNER JOIN TipoIncidencia ti ON r.id_tipo_incidencia = ti.id_tipo_incidencia
            INNER JOIN Prioridad p ON r.id_prioridad = p.id_prioridad
            INNER JOIN Estado e ON r.id_estado = e.id_estado
            LEFT JOIN LATERAL (SELECT ruta_fotografia FROM FotografiaProblema WHERE id_reporte = r.id_reporte ORDER BY id_fotografia DESC LIMIT 1) f ON TRUE
            ORDER BY r.fecha_reporte DESC;
        `;
        const { rows } = await pool.query(query);
        return rows;
    }

    async crearReporteConTransaccion(params: GuardarReporteCompletoParams): Promise<any> {
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
        $1,
        $2,
        $3,
        (SELECT id_tipo_incidencia
         FROM TipoIncidencia
         WHERE LOWER(codigo_ia) = LOWER($4) AND activo=TRUE
         LIMIT 1),
        $5,
        (SELECT id_estado
         FROM Estado
         WHERE LOWER(nombre) = LOWER('Recibido')
         LIMIT 1),
        (SELECT id_prioridad
         FROM Prioridad
         WHERE LOWER(codigo_ia) = LOWER($6) AND activo=TRUE
         LIMIT 1)
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

    async obtenerReportesPorUsuario(idUsuario: number) {
        const query = `
            SELECT 
                r.id_reporte,
                r.id_estado,
                r.id_prioridad,
                r.titulo,
                r.descripcion,
                r.fecha_reporte,
                ti.nombre AS tipo_incidencia,
                u.direccion,
                u.zona,
                u.latitud,
                u.longitud,
                e.nombre AS estado,
                p.nombre AS prioridad,
                f.ruta_fotografia
            FROM Reporte r
            INNER JOIN Ubicacion u ON r.id_ubicacion = u.id_ubicacion
            INNER JOIN TipoIncidencia ti ON r.id_tipo_incidencia = ti.id_tipo_incidencia
            INNER JOIN Prioridad p ON r.id_prioridad = p.id_prioridad
            INNER JOIN Estado e ON r.id_estado = e.id_estado
            LEFT JOIN LATERAL (SELECT ruta_fotografia FROM FotografiaProblema WHERE id_reporte = r.id_reporte ORDER BY id_fotografia DESC LIMIT 1) f ON TRUE
            WHERE r.id_usuario = $1
            ORDER BY r.fecha_reporte DESC;
        `;
        const { rows } = await pool.query(query, [idUsuario]);
        return rows;
    }

    async actualizarEstadoReporte(idReporte: number, idEstado: number, idEmpleado?: number) {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            const anterior = await client.query('SELECT id_estado FROM Reporte WHERE id_reporte=$1 FOR UPDATE', [idReporte]);
            if (!anterior.rows.length) { await client.query('ROLLBACK'); return null; }
            const valido = await client.query('SELECT 1 FROM Estado WHERE id_estado=$1 AND activo=TRUE',[idEstado]);
            if (!valido.rows.length) { await client.query('ROLLBACK'); throw new Error('Estado inexistente o inactivo'); }
            const viejo = anterior.rows[0].id_estado;
            const {rows} = await client.query('UPDATE Reporte SET id_estado=$1 WHERE id_reporte=$2 RETURNING id_reporte,id_estado', [idEstado,idReporte]);
            if (viejo !== idEstado) {
                await client.query(`INSERT INTO BitacoraCambioEstado(id_reporte,id_estado_anterior,id_estado_nuevo,id_empleado,comentario)
                    VALUES($1,$2,$3,$4,$5)`,[idReporte,viejo,idEstado,idEmpleado??null,'Cambio registrado desde CivicFix']);
            }
            await client.query('COMMIT');return rows[0];
        } catch(error) { await client.query('ROLLBACK');throw error; }
        finally { client.release(); }
    }

    async obtenerReportesParaMapa() {
        const query = `
            SELECT 
                r.id_reporte,
                r.id_estado,
                r.id_prioridad,
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