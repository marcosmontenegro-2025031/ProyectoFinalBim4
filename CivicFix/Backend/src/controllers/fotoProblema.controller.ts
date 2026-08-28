import { Request, Response } from "express";
import { FotoProblemaService } from "../service/fotoProblema.service.js";

export class FotoProblemaController {

    static async listar(req: Request, res: Response): Promise<void> {
        try {
            const fotos = await FotoProblemaService.listar();
            res.status(200).json(fotos);
        } catch (error) {
            res.status(500).json({ mensaje: "Error al obtener las fotografías", error: (error as Error).message });
        }
    }


    static async obtenerPorId(req: Request, res: Response): Promise<void> {
        try {
            const id = Number(req.params.id);

            if (isNaN(id)) {
                res.status(400).json({ mensaje: "El id debe ser un número" });
                return;
            }

            const foto = await FotoProblemaService.obtenerPorId(id);
            res.status(200).json(foto);
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

            const fotos = await FotoProblemaService.obtenerPorReporte(idReporte);
            res.status(200).json(fotos);
        } catch (error) {
            res.status(500).json({ mensaje: (error as Error).message });
        }
    }


    static async crear(req: Request, res: Response): Promise<void> {
        try {
            const nuevaFoto = await FotoProblemaService.crear(req.body);
            res.status(201).json(nuevaFoto);
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

            const fotoActualizada = await FotoProblemaService.actualizar(id, req.body);
            res.status(200).json(fotoActualizada);
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

            const fotoEliminada = await FotoProblemaService.eliminar(id);
            res.status(200).json({ mensaje: "Fotografía eliminada correctamente", fotografia: fotoEliminada });
        } catch (error) {
            res.status(404).json({ mensaje: (error as Error).message });
        }
    }

}
