import { pool } from '../config/db.js';
import { Notificacion } from '../models/notificacion.model.js';

const COLUMNAS = `
    id_notificacion,
    fk_id_usuario,
    fk_id_reporte,
    titulo,
    mensaje,
    fecha_notificacion,
    leida
`;

export class NotificacionRepository {
    async obtenerTodos(): Promise<Notificacion[]> {
        const resultado = await pool.query<Notificacion>(`SELECT ${COLUMNAS} FROM Notificacion ORDER BY fecha_notificacion DESC`);
        return resultado.rows;
    }

    async obtenerPorId(id: number): Promise<Notificacion | null> {
        const resultado = await pool.query<Notificacion>(`SELECT ${COLUMNAS} FROM Notificacion WHERE id_notificacion = $1`, [id]);
        return resultado.rows[0] ?? null;
    }

    async obtenerPorUsuario(idUsuario: number): Promise<Notificacion[]> {
        const resultado = await pool.query<Notificacion>(`SELECT ${COLUMNAS} FROM Notificacion WHERE fk_id_usuario = $1 ORDER BY fecha_notificacion DESC`, [idUsuario]);
        return resultado.rows;
    }

    async crear(notificacion: Notificacion): Promise<Notificacion> {
        const resultado = await pool.query<Notificacion>(
            `INSERT INTO Notificacion (fk_id_usuario, fk_id_reporte, titulo, mensaje, fecha_notificacion, leida)
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING ${COLUMNAS}`,
            [notificacion.fk_id_usuario, notificacion.fk_id_reporte, notificacion.titulo, notificacion.mensaje, notificacion.fecha_notificacion, notificacion.leida]
        );
        return resultado.rows[0];
    }

    async actualizar(id: number, notificacion: Notificacion): Promise<Notificacion | null> {
        const resultado = await pool.query<Notificacion>(
            `UPDATE Notificacion SET fk_id_usuario = $1, fk_id_reporte = $2, titulo = $3, mensaje = $4,
             fecha_notificacion = $5, leida = $6 WHERE id_notificacion = $7 RETURNING ${COLUMNAS}`,
            [notificacion.fk_id_usuario, notificacion.fk_id_reporte, notificacion.titulo, notificacion.mensaje, notificacion.fecha_notificacion, notificacion.leida, id]
        );
        return resultado.rows[0] ?? null;
    }

    async marcarComoLeida(id: number): Promise<Notificacion | null> {
        const resultado = await pool.query<Notificacion>(`UPDATE Notificacion SET leida = TRUE WHERE id_notificacion = $1 RETURNING ${COLUMNAS}`, [id]);
        return resultado.rows[0] ?? null;
    }

    async eliminar(id: number): Promise<Notificacion | null> {
        const resultado = await pool.query<Notificacion>(`DELETE FROM Notificacion WHERE id_notificacion = $1 RETURNING ${COLUMNAS}`, [id]);
        return resultado.rows[0] ?? null;
    }
}
