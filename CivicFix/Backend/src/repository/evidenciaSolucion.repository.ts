import { pool } from "../config/db.js";
import { EvidenciaSolucion } from "../models/evidenciaSolucion.model.js";

export class EvidenciaSolucionRepository {

    async obtenerTodos(): Promise<EvidenciaSolucion[]> {
        const resultado = await pool.query<EvidenciaSolucion>(`
            SELECT * FROM EvidenciaSolucion
            ORDER BY id_evidencia
        `);
        return resultado.rows;
    }


    async obtenerPorId(id: number): Promise<EvidenciaSolucion | null> {
        const resultado = await pool.query<EvidenciaSolucion>(
            `SELECT * FROM EvidenciaSolucion WHERE id_evidencia = $1`,
            [id]
        );

        if (resultado.rows.length === 0) {
            return null;
        }

        return resultado.rows[0];
    }


    async obtenerPorReporte(idReporte: number): Promise<EvidenciaSolucion[]> {
        const resultado = await pool.query<EvidenciaSolucion>(
            `SELECT * FROM EvidenciaSolucion WHERE fk_id_reporte = $1 ORDER BY fecha_subida`,
            [idReporte]
        );
        return resultado.rows;
    }


    async crear(evidencia: EvidenciaSolucion): Promise<EvidenciaSolucion> {
        const resultado = await pool.query<EvidenciaSolucion>(
            `INSERT INTO EvidenciaSolucion (fk_id_reporte, ruta_fotografia, descripcion, fecha_subida)
            VALUES ($1, $2, $3, $4)
            RETURNING *`,
            [evidencia.fk_id_reporte, evidencia.ruta_fotografia, evidencia.descripcion, evidencia.fecha_subida]
        );

        return resultado.rows[0];
    }


    async actualizar(id: number, evidencia: EvidenciaSolucion): Promise<EvidenciaSolucion | null> {
        const resultado = await pool.query<EvidenciaSolucion>(
            `UPDATE EvidenciaSolucion
            SET fk_id_reporte = $1, ruta_fotografia = $2, descripcion = $3, fecha_subida = $4
            WHERE id_evidencia = $5
            RETURNING *`,
            [evidencia.fk_id_reporte, evidencia.ruta_fotografia, evidencia.descripcion, evidencia.fecha_subida, id]
        );

        if (resultado.rows.length === 0) {
            return null;
        }

        return resultado.rows[0];
    }


    async eliminar(id: number): Promise<EvidenciaSolucion | null> {
        const resultado = await pool.query<EvidenciaSolucion>(
            `DELETE FROM EvidenciaSolucion WHERE id_evidencia = $1 RETURNING *`,
            [id]
        );

        if (resultado.rows.length === 0) {
            return null;
        }

        return resultado.rows[0];
    }

}
