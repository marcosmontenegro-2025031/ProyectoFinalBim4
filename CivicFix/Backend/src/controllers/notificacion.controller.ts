import { Request, Response } from 'express';
// ✅ Cambia esta línea:
import { NotificacionService } from '../services/notificacion.service';

const service = new NotificacionService();

export const obtenerNotificacionesHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const idUsuario = Number((req as any).usuario?.id_usuario);
        res.status(200).json(await service.obtenerPorUsuario(idUsuario));
    } catch (error) {
        res.status(500).json({ mensaje: (error as Error).message });
    }
};

export const obtenerNotificacionHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const notificacion = await service.obtenerPorId(Number(req.params.id));
        const idUsuario = Number((req as any).usuario?.id_usuario);
        if (notificacion.fk_id_usuario !== idUsuario) {
            res.status(404).json({ mensaje: 'Notificación no encontrada' });
            return;
        }
        res.status(200).json(notificacion);
    } catch (error) {
        res.status(404).json({ mensaje: (error as Error).message });
    }
};

export const marcarComoLeidaHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const notificacion = await service.obtenerPorId(Number(req.params.id));
        const idUsuario = Number((req as any).usuario?.id_usuario);
        if (notificacion.fk_id_usuario !== idUsuario) {
            res.status(404).json({ mensaje: 'Notificación no encontrada' });
            return;
        }
        res.status(200).json(await service.marcarComoLeida(Number(req.params.id)));
    } catch (error) {
        res.status(404).json({ mensaje: (error as Error).message });
    }
};

export const marcarTodasComoLeidasHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const idUsuario = Number((req as any).usuario?.id_usuario);
        const notificaciones = await service.obtenerPorUsuario(idUsuario);
        await Promise.all(notificaciones.filter(n => !n.leida).map(n => service.marcarComoLeida(n.id_notificacion)));
        res.status(200).json({ mensaje: 'Notificaciones marcadas como leídas' });
    } catch (error) {
        res.status(500).json({ mensaje: (error as Error).message });
    }
};

export const eliminarNotificacionHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const notificacion = await service.obtenerPorId(Number(req.params.id));
        const idUsuario = Number((req as any).usuario?.id_usuario);
        if (notificacion.fk_id_usuario !== idUsuario) {
            res.status(404).json({ mensaje: 'Notificación no encontrada' });
            return;
        }
        const eliminada = await service.eliminar(Number(req.params.id));
        res.status(200).json({ mensaje: 'Notificación eliminada correctamente', notificacion: eliminada });
    } catch (error) {
        res.status(404).json({ mensaje: (error as Error).message });
    }
};