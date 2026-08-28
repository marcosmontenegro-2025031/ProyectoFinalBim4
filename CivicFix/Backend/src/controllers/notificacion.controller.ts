import { Request, Response } from "express";
import { NotificacionService } from "../service/notificacion.service.js";

export class NotificacionController {

    static async listar(req: Request, res: Response): Promise<void> {
        try {
            const notificaciones = await NotificacionService.listar();
            res.status(200).json(notificaciones);
        } catch (error) {
            res.status(500).json({ mensaje: "Error al obtener las notificaciones", error: (error as Error).message });
        }
    }


    static async obtenerPorId(req: Request, res: Response): Promise<void> {
        try {
            const id = Number(req.params.id);

            if (isNaN(id)) {
                res.status(400).json({ mensaje: "El id debe ser un número" });
                return;
            }

            const notificacion = await NotificacionService.obtenerPorId(id);
            res.status(200).json(notificacion);
        } catch (error) {
            res.status(404).json({ mensaje: (error as Error).message });
        }
    }


    static async obtenerPorUsuario(req: Request, res: Response): Promise<void> {
        try {
            const idUsuario = Number(req.params.idUsuario);

            if (isNaN(idUsuario)) {
                res.status(400).json({ mensaje: "El idUsuario debe ser un número" });
                return;
            }

            const notificaciones = await NotificacionService.obtenerPorUsuario(idUsuario);
            res.status(200).json(notificaciones);
        } catch (error) {
            res.status(500).json({ mensaje: (error as Error).message });
        }
    }


    static async crear(req: Request, res: Response): Promise<void> {
        try {
            const nuevaNotificacion = await NotificacionService.crear(req.body);
            res.status(201).json(nuevaNotificacion);
        } catch (error) {
            res.status(400).json({ mensaje: (error as Error).message });
        }
    }


    static async actualizar(req: Request, res: Response): Promise<void> {
        try {
            const id = Number(req.params.id);

            if (isNaN(id)) {
                res.status(400).json({ mensaje: "El id debe ser un número" });
                return;
            }

            const notificacionActualizada = await NotificacionService.actualizar(id, req.body);
            res.status(200).json(notificacionActualizada);
        } catch (error) {
            res.status(404).json({ mensaje: (error as Error).message });
        }
    }


    static async marcarComoLeida(req: Request, res: Response): Promise<void> {
        try {
            const id = Number(req.params.id);

            if (isNaN(id)) {
                res.status(400).json({ mensaje: "El id debe ser un número" });
                return;
            }

            const notificacionActualizada = await NotificacionService.marcarComoLeida(id);
            res.status(200).json(notificacionActualizada);
        } catch (error) {
            res.status(404).json({ mensaje: (error as Error).message });
        }
    }


    static async eliminar(req: Request, res: Response): Promise<void> {
        try {
            const id = Number(req.params.id);

            if (isNaN(id)) {
                res.status(400).json({ mensaje: "El id debe ser un número" });
                return;
            }

            const notificacionEliminada = await NotificacionService.eliminar(id);
            res.status(200).json({ mensaje: "Notificación eliminada correctamente", notificacion: notificacionEliminada });
        } catch (error) {
            res.status(404).json({ mensaje: (error as Error).message });
        }
    }

}
