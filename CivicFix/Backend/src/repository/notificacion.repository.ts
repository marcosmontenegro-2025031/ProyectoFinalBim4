import { pool } from '../config/db';
import { Notificacion } from '../models/notificacion.model';

export const obtenerTodasLasNotificaciones = async (): Promise<Notificacion[]> => {
  const resultado = await pool.query(
    `SELECT
      id_notificacion,
      id_usuario,
      id_reporte,
      titulo,
      mensaje,
      fecha_notificacion,
      leida
    FROM Notificacion
    ORDER BY fecha_notificacion DESC`
  );

  return resultado.rows;
};

export const obtenerNotificacionPorId = async (
  idNotificacion: number
): Promise<Notificacion | null> => {
  const resultado = await pool.query(
    `SELECT
      id_notificacion,
      id_usuario,
      id_reporte,
      titulo,
      mensaje,
      fecha_notificacion,
      leida
    FROM Notificacion
    WHERE id_notificacion = $1`,
    [idNotificacion]
  );

  return resultado.rows[0] || null;
};

export const marcarComoLeida = async (
  idNotificacion: number
): Promise<Notificacion | null> => {
  const resultado = await pool.query(
    `UPDATE Notificacion
     SET leida = TRUE
     WHERE id_notificacion = $1
     RETURNING
       id_notificacion,
       id_usuario,
       id_reporte,
       titulo,
       mensaje,
       fecha_notificacion,
       leida`,
    [idNotificacion]
  );

  return resultado.rows[0] || null;
};

export const marcarTodasComoLeidas = async (): Promise<number> => {
  const resultado = await pool.query(
    `UPDATE Notificacion
     SET leida = TRUE
     WHERE leida = FALSE`
  );

  return resultado.rowCount ?? 0;
};

export const eliminarNotificacion = async (
  idNotificacion: number
): Promise<boolean> => {
  const resultado = await pool.query(
    `DELETE FROM Notificacion
     WHERE id_notificacion = $1`,
    [idNotificacion]
  );

  return (resultado.rowCount ?? 0) > 0;
};

