import { pool } from "../config/db.js";
import { FotografiaProblema } from "../models/fotoProblema.model.js";

export class FotoProblemaRepository {

    async obtenerTodos(): Promise<FotografiaProblema[]> {
        const resultado = await pool.query<FotografiaProblema>(`
            SELECT * FROM FotografiaProblema
            ORDER BY id_fotografia
        `);
        return resultado.rows;
    }


    async obtenerPorId(id: number): Promise<FotografiaProblema | null> {
        const resultado = await pool.query<FotografiaProblema>(
            `SELECT * FROM FotografiaProblema WHERE id_fotografia = $1`,
            [id]
        );

        if (resultado.rows.length === 0) {
            return null;
        }

        return resultado.rows[0];
    }


    async obtenerPorReporte(idReporte: number): Promise<FotografiaProblema[]> {
        const resultado = await pool.query<FotografiaProblema>(
            `SELECT * FROM FotografiaProblema WHERE fk_id_reporte = $1 ORDER BY fecha_subida`,
            [idReporte]
        );
        return resultado.rows;
    }


    async crear(foto: FotografiaProblema): Promise<FotografiaProblema> {
        const resultado = await pool.query<FotografiaProblema>(
            `INSERT INTO FotografiaProblema (fk_id_reporte, ruta_fotografia, descripcion, fecha_subida)
            VALUES ($1, $2, $3, $4)
            RETURNING *`,
            [foto.fk_id_reporte, foto.ruta_fotografia, foto.descripcion, foto.fecha_subida]
        );

        return resultado.rows[0];
    }


    async actualizar(id: number, foto: FotografiaProblema): Promise<FotografiaProblema | null> {
        const resultado = await pool.query<FotografiaProblema>(
            `UPDATE FotografiaProblema
            SET fk_id_reporte = $1, ruta_fotografia = $2, descripcion = $3, fecha_subida = $4
            WHERE id_fotografia = $5
            RETURNING *`,
            [foto.fk_id_reporte, foto.ruta_fotografia, foto.descripcion, foto.fecha_subida, id]
        );

        if (resultado.rows.length === 0) {
            return null;
        }

        return resultado.rows[0];
    }


    async eliminar(id: number): Promise<FotografiaProblema | null> {
        const resultado = await pool.query<FotografiaProblema>(
            `DELETE FROM FotografiaProblema WHERE id_fotografia = $1 RETURNING *`,
            [id]
        );

        if (resultado.rows.length === 0) {
            return null;
        }

        return resultado.rows[0];
    }

}
