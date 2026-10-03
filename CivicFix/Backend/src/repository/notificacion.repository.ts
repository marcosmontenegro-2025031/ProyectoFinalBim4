import { pool } from '../config/db';
import { Notificacion } from '../models/notificacion.model';

export const obtenerTodasLasNotificaciones = async (idUsuario: number): Promise<Notificacion[]> => {
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
    WHERE id_usuario = $1
    ORDER BY fecha_notificacion DESC`,
    [idUsuario]
  );

  return resultado.rows;
};

export const obtenerNotificacionPorId = async (
  idNotificacion: number,
  idUsuario: number
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
    WHERE id_notificacion = $1 AND id_usuario = $2`,
    [idNotificacion, idUsuario]
  );

  return resultado.rows[0] || null;
};

export const marcarComoLeida = async (
  idNotificacion: number,
  idUsuario: number
): Promise<Notificacion | null> => {
  const resultado = await pool.query(
    `UPDATE Notificacion
     SET leida = TRUE
    WHERE id_notificacion = $1 AND id_usuario = $2
     RETURNING
       id_notificacion,
       id_usuario,
       id_reporte,
       titulo,
       mensaje,
       fecha_notificacion,
       leida`,
    [idNotificacion, idUsuario]
  );

  return resultado.rows[0] || null;
};

export const marcarComoNoLeida = async (
  idNotificacion: number,
  idUsuario: number
): Promise<Notificacion | null> => {
  const resultado = await pool.query(
    `UPDATE Notificacion
     SET leida = FALSE
    WHERE id_notificacion = $1 AND id_usuario = $2
     RETURNING
       id_notificacion,
       id_usuario,
       id_reporte,
       titulo,
       mensaje,
       fecha_notificacion,
       leida`,
    [idNotificacion, idUsuario]
  );

  return resultado.rows[0] || null;
};

export const marcarTodasComoLeidas = async (idUsuario: number): Promise<number> => {
  const resultado = await pool.query(
    `UPDATE Notificacion
     SET leida = TRUE
    WHERE leida = FALSE AND id_usuario = $1`,
      [idUsuario]
  );

  return resultado.rowCount ?? 0;
};

export const eliminarNotificacion = async (
  idNotificacion: number,
  idUsuario: number
): Promise<boolean> => {
  const resultado = await pool.query(
    `DELETE FROM Notificacion
    WHERE id_notificacion = $1 AND id_usuario = $2`,
      [idNotificacion, idUsuario]
  );

  return (resultado.rowCount ?? 0) > 0;
};

