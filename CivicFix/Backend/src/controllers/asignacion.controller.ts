// controllers/asignacion.controller.ts
import { Request, Response } from "express";
import { AsignacionService } from "../service/asignacion.service.js";

export class AsignacionController {

    static async listar(req: Request, res: Response): Promise<void> {
        try {
            const asignaciones = await AsignacionService.listar();
            res.status(200).json(asignaciones);
        } catch (error) {
            res.status(500).json({ mensaje: "Error al obtener las asignaciones", error: (error as Error).message });
        }
    }


    static async obtenerPorId(req: Request, res: Response): Promise<void> {
        try {
            const id = Number(req.params.id);

            if (isNaN(id)) {
                res.status(400).json({ mensaje: "El id debe ser un número" });
                return;
            }

            const asignacion = await AsignacionService.obtenerPorId(id);
            res.status(200).json(asignacion);
        } catch (error) {
            res.status(404).json({ mensaje: (error as Error).message });
        }
    }


    static async crear(req: Request, res: Response): Promise<void> {
        try {
            const nuevaAsignacion = await AsignacionService.crear(req.body);
            res.status(201).json(nuevaAsignacion);
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

            const asignacionActualizada = await AsignacionService.actualizar(id, req.body);
            res.status(200).json(asignacionActualizada);
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

            const asignacionEliminada = await AsignacionService.eliminar(id);
            res.status(200).json({ mensaje: "Asignación eliminada correctamente", asignacion: asignacionEliminada });
        } catch (error) {
            res.status(404).json({ mensaje: (error as Error).message });
        }
    }

}