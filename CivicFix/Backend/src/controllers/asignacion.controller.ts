import { Request, Response } from "express";
import { AsignacionService } from "../services/asignacion.service.js";
import { Asignacion } from "../models/asignacion.model.js";

export class AsignacionController {

    private service = new AsignacionService();

    async listar(req: Request, res: Response): Promise<void> {
        try {
            const asignaciones = await this.service.listar();

            res.status(200).json(asignaciones);
        } catch (error) {
            console.error('Error al obtener las asignaciones:', error);

            res.status(500).json({
                mensaje: 'Error al obtener las asignaciones',
                error: (error as Error).message
            });
        }
    }

    async obtenerPorId(req: Request, res: Response): Promise<void> {
        try {
            const id = Number(req.params.id);

            if (isNaN(id)) {
                res.status(400).json({
                    mensaje: 'El id debe ser un número'
                });
                return;
            }

            const asignacion = await this.service.obtenerPorId(id);

            res.status(200).json(asignacion);
        } catch (error) {
            res.status(404).json({
                mensaje: (error as Error).message
            });
        }
    }

    async crear(req: Request, res: Response): Promise<void> {
        try {
            const asignacion = await this.service.crear(req.body);

            res.status(201).json(asignacion);
        } catch (error) {
            console.error('Error al crear asignación:', error);

            res.status(400).json({
                mensaje: (error as Error).message
            });
        }
    }

    async actualizar(req: Request, res: Response): Promise<void> {
        try {
            const id = Number(req.params.id);

            if (isNaN(id)) {
                res.status(400).json({
                    mensaje: 'El id debe ser un número'
                });
                return;
            }

            const asignacion = await this.service.actualizar(
                id,
                req.body
            );

            res.status(200).json(asignacion);
        } catch (error) {
            console.error('Error al actualizar asignación:', error);

            res.status(400).json({
                mensaje: (error as Error).message
            });
        }
    }

    async eliminar(req: Request, res: Response): Promise<void> {
        try {
            const id = Number(req.params.id);

            if (isNaN(id)) {
                res.status(400).json({
                    mensaje: 'El id debe ser un número'
                });
                return;
            }

            const asignacion = await this.service.eliminar(id);

            res.status(200).json({
                mensaje: 'Asignación eliminada correctamente',
                asignacion
            });
        } catch (error) {
            console.error('Error al eliminar asignación:', error);

            res.status(404).json({
                mensaje: (error as Error).message
            });
        }
    }
}
