import { pool } from "../config/db.js";
import { FotoProblema } from "../models/fotoProblema.model.js";

const COLUMNAS = `
    id_fotografia,
    id_reporte,
    ruta_fotografia,
    descripcion,
    fecha_subida
`;

export class FotoProblemaRepository {

    async obtenerTodos(): Promise<FotoProblema[]> {
        const resultado = await pool.query<FotoProblema>(`
            SELECT ${COLUMNAS}
            FROM FotografiaProblema
            ORDER BY id_fotografia
        `);

        return resultado.rows;
    }

    async obtenerPorId(
        id: number
    ): Promise<FotoProblema | null> {

        const resultado = await pool.query<FotoProblema>(
            `SELECT ${COLUMNAS}
             FROM FotografiaProblema
             WHERE id_fotografia = $1`,
            [id]
        );

        if (resultado.rows.length === 0) {
            return null;
        }

        return resultado.rows[0];
    }

    async obtenerPorReporte(
        idReporte: number
    ): Promise<FotoProblema[]> {

        const resultado = await pool.query<FotoProblema>(
            `SELECT ${COLUMNAS}
             FROM FotografiaProblema
             WHERE id_reporte = $1
             ORDER BY fecha_subida`
            ,
            [idReporte]
        );

        return resultado.rows;
    }

    async crear(
        foto: FotoProblema
    ): Promise<FotoProblema> {

        const resultado = await pool.query<FotoProblema>(
            `INSERT INTO FotografiaProblema
                (
                    id_reporte,
                    ruta_fotografia,
                    descripcion,
                    fecha_subida
                )
             VALUES ($1, $2, $3, $4)
             RETURNING ${COLUMNAS}`,
            [
                foto.id_reporte,
                foto.ruta_fotografia,
                foto.descripcion,
                foto.fecha_subida ?? new Date()
            ]
        );

        return resultado.rows[0];
    }

    async actualizar(
        id: number,
        foto: FotoProblema
    ): Promise<FotoProblema | null> {

        const resultado = await pool.query<FotoProblema>(
            `UPDATE FotografiaProblema
             SET
                id_reporte = $1,
                ruta_fotografia = $2,
                descripcion = $3,
                fecha_subida = $4
             WHERE id_fotografia = $5
             RETURNING ${COLUMNAS}`,
            [
                foto.id_reporte,
                foto.ruta_fotografia,
                foto.descripcion,
                foto.fecha_subida ?? new Date(),
                id
            ]
        );

        if (resultado.rows.length === 0) {
            return null;
        }

        return resultado.rows[0];
    }

    async eliminar(
        id: number
    ): Promise<FotoProblema | null> {

        const resultado = await pool.query<FotoProblema>(
            `DELETE FROM FotografiaProblema
             WHERE id_fotografia = $1
             RETURNING ${COLUMNAS}`,
            [id]
        );

        if (resultado.rows.length === 0) {
            return null;
        }

        return resultado.rows[0];
    }
}