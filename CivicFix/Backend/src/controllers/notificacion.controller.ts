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

<<<<<<< HEAD
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
=======
    private service = new NotificacionService();

    async listar(req: Request, res: Response): Promise<void> {
        try {
            const notificaciones = await this.service.listar();
            res.status(200).json(notificaciones);
        } catch (error) {
            res.status(500).json({ mensaje: "Error al obtener las notificaciones", error: (error as Error).message });
        }
>>>>>>> Develop
    }

    const notificacion = await obtenerNotificacion(idNotificacion);

<<<<<<< HEAD
    if (!notificacion) {
      res.status(404).json({
        mensaje: 'Notificación no encontrada'
      });
      return;
=======
    async obtenerPorId(req: Request, res: Response): Promise<void> {
        try {
            const id = Number(req.params.id);

            if (isNaN(id)) {
                res.status(400).json({ mensaje: "El id debe ser un número" });
                return;
            }

            const notificacion = await this.service.obtenerPorId(id);
            res.status(200).json(notificacion);
        } catch (error) {
            res.status(404).json({ mensaje: (error as Error).message });
        }
>>>>>>> Develop
    }

    res.status(200).json(notificacion);
  } catch (error) {
    console.error('Error al obtener la notificación:', error);

<<<<<<< HEAD
    res.status(500).json({
      mensaje: 'Error al obtener la notificación'
    });
  }
};
=======
    async obtenerPorUsuario(req: Request, res: Response): Promise<void> {
        try {
            const idUsuario = Number(req.params.idUsuario);
>>>>>>> Develop

export const marcarComoLeidaHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const idNotificacion = Number(req.params.id);

<<<<<<< HEAD
    if (isNaN(idNotificacion)) {
      res.status(400).json({
        mensaje: 'El ID de la notificación no es válido'
      });
      return;
=======
            const notificaciones = await this.service.obtenerPorUsuario(idUsuario);
            res.status(200).json(notificaciones);
        } catch (error) {
            res.status(500).json({ mensaje: (error as Error).message });
        }
>>>>>>> Develop
    }

    const notificacion = await actualizarComoLeida(idNotificacion);

<<<<<<< HEAD
    if (!notificacion) {
      res.status(404).json({
        mensaje: 'Notificación no encontrada'
      });
      return;
=======
    async crear(req: Request, res: Response): Promise<void> {
        try {
            const nuevaNotificacion = await this.service.crear(req.body);
            res.status(201).json(nuevaNotificacion);
        } catch (error) {
            res.status(400).json({ mensaje: (error as Error).message });
        }
>>>>>>> Develop
    }

    res.status(200).json({
      mensaje: 'Notificación marcada como leída',
      notificacion
    });
  } catch (error) {
    console.error('Error al marcar la notificación como leída:', error);

<<<<<<< HEAD
    res.status(500).json({
      mensaje: 'Error al marcar la notificación como leída'
    });
  }
};
=======
    async actualizar(req: Request, res: Response): Promise<void> {
        try {
            const id = Number(req.params.id);
>>>>>>> Develop

export const marcarTodasComoLeidasHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const cantidad = await actualizarTodasComoLeidas();

<<<<<<< HEAD
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
=======
            const notificacionActualizada = await this.service.actualizar(id, req.body);
            res.status(200).json(notificacionActualizada);
        } catch (error) {
            res.status(404).json({ mensaje: (error as Error).message });
        }
>>>>>>> Develop
    }

    const eliminada = await borrarNotificacion(idNotificacion);

<<<<<<< HEAD
    if (!eliminada) {
      res.status(404).json({
        mensaje: 'Notificación no encontrada'
      });
      return;
=======
    async marcarComoLeida(req: Request, res: Response): Promise<void> {
        try {
            const id = Number(req.params.id);

            if (isNaN(id)) {
                res.status(400).json({ mensaje: "El id debe ser un número" });
                return;
            }

            const notificacionActualizada = await this.service.marcarComoLeida(id);
            res.status(200).json(notificacionActualizada);
        } catch (error) {
            res.status(404).json({ mensaje: (error as Error).message });
        }
>>>>>>> Develop
    }

    res.status(200).json({
      mensaje: 'Notificación eliminada correctamente'
    });
  } catch (error) {
    console.error('Error al eliminar la notificación:', error);

<<<<<<< HEAD
    res.status(500).json({
      mensaje: 'Error al eliminar la notificación'
    });
  }
};
=======
    async eliminar(req: Request, res: Response): Promise<void> {
        try {
            const id = Number(req.params.id);

            if (isNaN(id)) {
                res.status(400).json({ mensaje: "El id debe ser un número" });
                return;
            }

            const notificacionEliminada = await this.service.eliminar(id);
            res.status(200).json({ mensaje: "Notificación eliminada correctamente", notificacion: notificacionEliminada });
        } catch (error) {
            res.status(404).json({ mensaje: (error as Error).message });
        }
    }

}
>>>>>>> Develop
