import { Request, Response } from 'express';
import {
  obtenerNotificaciones,
  obtenerNotificacion,
  actualizarComoLeida,
  actualizarTodasComoLeidas,
  borrarNotificacion
} from '../services/notificacion.service';

export const obtenerNotificacionesHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const notificaciones = await obtenerNotificaciones();

    res.status(200).json(notificaciones);
  } catch (error) {
    console.error('Error al obtener notificaciones:', error);

    res.status(500).json({
      mensaje: 'Error al obtener las notificaciones'
    });
  }
};

export const obtenerNotificacionHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const idNotificacion = Number(req.params.id);

    if (isNaN(idNotificacion)) {
      res.status(400).json({
        mensaje: 'El ID de la notificación no es válido'
      });
      return;
    }

    const notificacion = await obtenerNotificacion(idNotificacion);

    if (!notificacion) {
      res.status(404).json({
        mensaje: 'Notificación no encontrada'
      });
      return;
    }

    res.status(200).json(notificacion);
  } catch (error) {
    console.error('Error al obtener la notificación:', error);

    res.status(500).json({
      mensaje: 'Error al obtener la notificación'
    });
  }
};

export const marcarComoLeidaHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const idNotificacion = Number(req.params.id);

    if (isNaN(idNotificacion)) {
      res.status(400).json({
        mensaje: 'El ID de la notificación no es válido'
      });
      return;
    }

    const notificacion = await actualizarComoLeida(idNotificacion);

    if (!notificacion) {
      res.status(404).json({
        mensaje: 'Notificación no encontrada'
      });
      return;
    }

    res.status(200).json({
      mensaje: 'Notificación marcada como leída',
      notificacion
    });
  } catch (error) {
    console.error('Error al marcar la notificación como leída:', error);

    res.status(500).json({
      mensaje: 'Error al marcar la notificación como leída'
    });
  }
};

export const marcarTodasComoLeidasHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const cantidad = await actualizarTodasComoLeidas();

    res.status(200).json({
      mensaje: 'Todas las notificaciones fueron marcadas como leídas',
      cantidad
    });
  } catch (error) {
    console.error('Error al marcar todas las notificaciones:', error);

    res.status(500).json({
      mensaje: 'Error al marcar todas las notificaciones como leídas'
    });
  }
};

export const eliminarNotificacionHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const idNotificacion = Number(req.params.id);

    if (isNaN(idNotificacion)) {
      res.status(400).json({
        mensaje: 'El ID de la notificación no es válido'
      });
      return;
    }

    const eliminada = await borrarNotificacion(idNotificacion);

    if (!eliminada) {
      res.status(404).json({
        mensaje: 'Notificación no encontrada'
      });
      return;
    }

    res.status(200).json({
      mensaje: 'Notificación eliminada correctamente'
    });
  } catch (error) {
    console.error('Error al eliminar la notificación:', error);

    res.status(500).json({
      mensaje: 'Error al eliminar la notificación'
    });
  }
};
