import { Request, Response } from "express";
import { EvidenciaSolucionService } from "../service/evidenciaSolucion.service.js";

export class EvidenciaSolucionController {

    static async listar(req: Request, res: Response): Promise<void> {
        try {
            const evidencias = await EvidenciaSolucionService.listar();
            res.status(200).json(evidencias);
        } catch (error) {
            res.status(500).json({ mensaje: "Error al obtener las evidencias", error: (error as Error).message });
        }
    }


    static async obtenerPorId(req: Request, res: Response): Promise<void> {
        try {
            const id = Number(req.params.id);

            if (isNaN(id)) {
                res.status(400).json({ mensaje: "El id debe ser un número" });
                return;
            }

            const evidencia = await EvidenciaSolucionService.obtenerPorId(id);
            res.status(200).json(evidencia);
        } catch (error) {
            res.status(404).json({ mensaje: (error as Error).message });
        }
    }


    static async obtenerPorReporte(req: Request, res: Response): Promise<void> {
        try {
            const idReporte = Number(req.params.idReporte);

            if (isNaN(idReporte)) {
                res.status(400).json({ mensaje: "El idReporte debe ser un número" });
                return;
            }

            const evidencias = await EvidenciaSolucionService.obtenerPorReporte(idReporte);
            res.status(200).json(evidencias);
        } catch (error) {
            res.status(500).json({ mensaje: (error as Error).message });
        }
    }


    static async crear(req: Request, res: Response): Promise<void> {
        try {
            const nuevaEvidencia = await EvidenciaSolucionService.crear(req.body);
            res.status(201).json(nuevaEvidencia);
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

            const evidenciaActualizada = await EvidenciaSolucionService.actualizar(id, req.body);
            res.status(200).json(evidenciaActualizada);
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

            const evidenciaEliminada = await EvidenciaSolucionService.eliminar(id);
            res.status(200).json({ mensaje: "Evidencia eliminada correctamente", evidencia: evidenciaEliminada });
        } catch (error) {
            res.status(404).json({ mensaje: (error as Error).message });
        }
    }

}
