import { pool } from "../config/db.js";
import { BitacoraCambioEstado } from "../models/bitacoraCambioEstado.model.js";

export class BitacoraCambioEstadoRepository {

    static async obtenerTodos(): Promise<BitacoraCambioEstado[]> {
        const resultado = await pool.query<BitacoraCambioEstado>(`
            SELECT * FROM BitacoraCambioEstado
            ORDER BY id_bitacora
        `);
        return resultado.rows;
    }


    static async obtenerPorId(id: number): Promise<BitacoraCambioEstado | null> {
        const resultado = await pool.query<BitacoraCambioEstado>(
            `SELECT * FROM BitacoraCambioEstado WHERE id_bitacora = $1`,
            [id]
        );

        if (resultado.rows.length === 0) {
            return null;
        }

        return resultado.rows[0];
    }


    static async obtenerPorReporte(idReporte: number): Promise<BitacoraCambioEstado[]> {
        const resultado = await pool.query<BitacoraCambioEstado>(
            `SELECT * FROM BitacoraCambioEstado
            WHERE fk_id_reporte = $1
            ORDER BY fecha_cambio`,
            [idReporte]
        );
        return resultado.rows;
    }


    static async crear(bitacora: BitacoraCambioEstado): Promise<BitacoraCambioEstado> {
        const resultado = await pool.query<BitacoraCambioEstado>(
            `INSERT INTO BitacoraCambioEstado
                (fk_id_reporte, fk_id_estado_anterior, fk_id_estado_nuevo, fk_id_empleado, comentario, fecha_cambio)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *`,
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


    static async actualizar(id: number, bitacora: BitacoraCambioEstado): Promise<BitacoraCambioEstado | null> {
        const resultado = await pool.query<BitacoraCambioEstado>(
            `UPDATE BitacoraCambioEstado
            SET
                fk_id_reporte = $1,
                fk_id_estado_anterior = $2,
                fk_id_estado_nuevo = $3,
                fk_id_empleado = $4,
                comentario = $5,
                fecha_cambio = $6
            WHERE id_bitacora = $7
            RETURNING *`,
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


    static async eliminar(id: number): Promise<BitacoraCambioEstado | null> {
        const resultado = await pool.query<BitacoraCambioEstado>(
            `DELETE FROM BitacoraCambioEstado
            WHERE id_bitacora = $1
            RETURNING *`,
            [id]
        );

        if (resultado.rows.length === 0) {
            return null;
        }

        return resultado.rows[0];
    }

}
