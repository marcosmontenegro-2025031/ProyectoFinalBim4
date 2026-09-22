import { pool } from '../config/db';
import { FotoProblema } from '../models/fotoProblema.model';

const COLUMNAS = `
    id_fotografia,
    id_reporte AS fk_id_reporte,
    ruta_fotografia,
    descripcion,
    fecha_subida
`;

export class FotoProblemaRepository {
    async crear(foto: FotoProblema): Promise<FotoProblema> {
        const query = `
            INSERT INTO FotografiaProblema (id_reporte, ruta_fotografia, descripcion) 
            VALUES ($1, $2, $3) 
            RETURNING id_fotografia, id_reporte, ruta_fotografia, descripcion, fecha_subida;
        `;
        
        const values = [foto.id_reporte, foto.ruta_fotografia, foto.descripcion || 'Evidencia de problema urbano'];

<<<<<<< HEAD
        const result = await pool.query(query, values);
        
        return result.rows[0]; 
    }
=======
    async obtenerTodos(): Promise<FotografiaProblema[]> {
        const resultado = await pool.query<FotografiaProblema>(`
            SELECT ${COLUMNAS} FROM FotografiaProblema
            ORDER BY id_fotografia
        `);
        return resultado.rows;
    }


    async obtenerPorId(id: number): Promise<FotografiaProblema | null> {
        const resultado = await pool.query<FotografiaProblema>(
            `SELECT ${COLUMNAS} FROM FotografiaProblema WHERE id_fotografia = $1`,
            [id]
        );

        if (resultado.rows.length === 0) {
            return null;
        }

        return resultado.rows[0];
    }


    async obtenerPorReporte(idReporte: number): Promise<FotografiaProblema[]> {
        const resultado = await pool.query<FotografiaProblema>(
            `SELECT ${COLUMNAS} FROM FotografiaProblema WHERE id_reporte = $1 ORDER BY fecha_subida`,
            [idReporte]
        );
        return resultado.rows;
    }


    async crear(foto: FotografiaProblema): Promise<FotografiaProblema> {
        const resultado = await pool.query<FotografiaProblema>(
            `INSERT INTO FotografiaProblema (id_reporte, ruta_fotografia, descripcion, fecha_subida)
            VALUES ($1, $2, $3, $4)
            RETURNING ${COLUMNAS}`,
            [foto.fk_id_reporte, foto.ruta_fotografia, foto.descripcion, foto.fecha_subida]
        );

        return resultado.rows[0];
    }


    async actualizar(id: number, foto: FotografiaProblema): Promise<FotografiaProblema | null> {
        const resultado = await pool.query<FotografiaProblema>(
            `UPDATE FotografiaProblema
            SET id_reporte = $1, ruta_fotografia = $2, descripcion = $3, fecha_subida = $4
            WHERE id_fotografia = $5
            RETURNING ${COLUMNAS}`,
            [foto.fk_id_reporte, foto.ruta_fotografia, foto.descripcion, foto.fecha_subida, id]
        );

        if (resultado.rows.length === 0) {
            return null;
        }

        return resultado.rows[0];
    }


    async eliminar(id: number): Promise<FotografiaProblema | null> {
        const resultado = await pool.query<FotografiaProblema>(
            `DELETE FROM FotografiaProblema WHERE id_fotografia = $1 RETURNING ${COLUMNAS}`,
            [id]
        );

        if (resultado.rows.length === 0) {
            return null;
        }

        return resultado.rows[0];
    }

>>>>>>> Develop
}

