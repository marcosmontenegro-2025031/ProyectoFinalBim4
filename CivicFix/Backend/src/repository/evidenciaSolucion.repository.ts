import { pool } from '../config/db.js';
import { EvidenciaSolucion } from '../models/evidenciaSolucion.model.js';
const cols = `id_evidencia, id_reporte AS fk_id_reporte, ruta_fotografia, descripcion, fecha_subida`;
export class EvidenciaSolucionRepository {
    private static selectColumns = `
        id_evidencia,
        id_reporte AS fk_id_reporte,
        ruta_fotografia,
        descripcion,
        fecha_subida
    `;

    static async obtenerTodos(): Promise<EvidenciaSolucion[]> {
        const resultado = await pool.query<EvidenciaSolucion>(`
            SELECT ${this.selectColumns}
            FROM EvidenciaSolucion
            ORDER BY id_evidencia
        `);
        return resultado.rows;
    }

    static async obtenerPorId(id: number): Promise<EvidenciaSolucion | null> {
        const resultado = await pool.query<EvidenciaSolucion>(`
            SELECT ${this.selectColumns}
            FROM EvidenciaSolucion
            WHERE id_evidencia = $1
        `, [id]);

        return resultado.rows[0] ?? null;
    }

    static async obtenerPorReporte(idReporte: number): Promise<EvidenciaSolucion[]> {
        const resultado = await pool.query<EvidenciaSolucion>(`
            SELECT ${this.selectColumns}
            FROM EvidenciaSolucion
            WHERE id_reporte = $1
            ORDER BY fecha_subida
        `, [idReporte]);
        return resultado.rows;
    }

    static async crear(evidencia: EvidenciaSolucion): Promise<EvidenciaSolucion> {
        const resultado = await pool.query<EvidenciaSolucion>(`
            INSERT INTO EvidenciaSolucion
                (id_reporte, ruta_fotografia, descripcion, fecha_subida)
            VALUES ($1, $2, $3, $4)
            RETURNING
                id_evidencia,
                id_reporte AS fk_id_reporte,
                ruta_fotografia,
                descripcion,
                fecha_subida
        `, [
            evidencia.fk_id_reporte,
            evidencia.ruta_fotografia,
            evidencia.descripcion,
            evidencia.fecha_subida
        ]);

        return resultado.rows[0];
    }

    static async actualizar(id: number, evidencia: EvidenciaSolucion): Promise<EvidenciaSolucion | null> {
        const resultado = await pool.query<EvidenciaSolucion>(`
            UPDATE EvidenciaSolucion
            SET id_reporte = $1,
                ruta_fotografia = $2,
                descripcion = $3,
                fecha_subida = $4
            WHERE id_evidencia = $5
            RETURNING
                id_evidencia,
                id_reporte AS fk_id_reporte,
                ruta_fotografia,
                descripcion,
                fecha_subida
        `, [
            evidencia.fk_id_reporte,
            evidencia.ruta_fotografia,
            evidencia.descripcion,
            evidencia.fecha_subida,
            id
        ]);

        return resultado.rows[0] ?? null;
    }

    static async eliminar(id: number): Promise<EvidenciaSolucion | null> {
        const resultado = await pool.query<EvidenciaSolucion>(`
            DELETE FROM EvidenciaSolucion
            WHERE id_evidencia = $1
            RETURNING
                id_evidencia,
                id_reporte AS fk_id_reporte,
                ruta_fotografia,
                descripcion,
                fecha_subida
        `, [id]);

        return resultado.rows[0] ?? null;
    }
}
