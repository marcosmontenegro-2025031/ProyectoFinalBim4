import { pool } from "../config/db.js";
import { BitacoraCambioEstado } from "../models/bitacoraCambioEstado.model.js";

const COLUMNAS = `
    id_bitacora,
    id_reporte AS fk_id_reporte,
    id_estado_anterior AS fk_id_estado_anterior,
    id_estado_nuevo AS fk_id_estado_nuevo,
    id_empleado AS fk_id_empleado,
    comentario,
    fecha_cambio
`;

export class BitacoraCambioEstadoRepository {

    async obtenerTodos(): Promise<BitacoraCambioEstado[]> {
        const resultado = await pool.query<BitacoraCambioEstado>(`
            SELECT ${COLUMNAS} FROM BitacoraCambioEstado
            ORDER BY id_bitacora
        `);
        return resultado.rows;
    }


    async obtenerPorId(id: number): Promise<BitacoraCambioEstado | null> {
        const resultado = await pool.query<BitacoraCambioEstado>(
            `SELECT ${COLUMNAS} FROM BitacoraCambioEstado WHERE id_bitacora = $1`,
            [id]
        );

        if (resultado.rows.length === 0) {
            return null;
        }

        return resultado.rows[0];
    }


    async obtenerPorReporte(idReporte: number): Promise<BitacoraCambioEstado[]> {
        const resultado = await pool.query<BitacoraCambioEstado>(
            `SELECT ${COLUMNAS} FROM BitacoraCambioEstado
            WHERE id_reporte = $1
            ORDER BY fecha_cambio`,
            [idReporte]
        );
        return resultado.rows;
    }


    async crear(bitacora: BitacoraCambioEstado): Promise<BitacoraCambioEstado> {
        const resultado = await pool.query<BitacoraCambioEstado>(
            `INSERT INTO BitacoraCambioEstado
                (id_reporte, id_estado_anterior, id_estado_nuevo, id_empleado, comentario, fecha_cambio)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING ${COLUMNAS}`,
            [
                bitacora.fk_id_reporte,
                bitacora.fk_id_estado_anterior,
                bitacora.fk_id_estado_nuevo,
                bitacora.fk_id_empleado,
                bitacora.comentario,
                bitacora.fecha_cambio
            ]
        );

        return resultado.rows[0];
    }


    async actualizar(id: number, bitacora: BitacoraCambioEstado): Promise<BitacoraCambioEstado | null> {
        const resultado = await pool.query<BitacoraCambioEstado>(
            `UPDATE BitacoraCambioEstado
            SET
                id_reporte = $1,
                id_estado_anterior = $2,
                id_estado_nuevo = $3,
                id_empleado = $4,
                comentario = $5,
                fecha_cambio = $6
            WHERE id_bitacora = $7
            RETURNING ${COLUMNAS}`,
            [
                bitacora.fk_id_reporte,
                bitacora.fk_id_estado_anterior,
                bitacora.fk_id_estado_nuevo,
                bitacora.fk_id_empleado,
                bitacora.comentario,
                bitacora.fecha_cambio,
                id
            ]
        );

        if (resultado.rows.length === 0) {
            return null;
        }

        return resultado.rows[0];
    }


    async eliminar(id: number): Promise<BitacoraCambioEstado | null> {
        const resultado = await pool.query<BitacoraCambioEstado>(
            `DELETE FROM BitacoraCambioEstado
            WHERE id_bitacora = $1
            RETURNING ${COLUMNAS}`,
            [id]
        );

        if (resultado.rows.length === 0) {
            return null;
        }

        return resultado.rows[0];
    }

}
