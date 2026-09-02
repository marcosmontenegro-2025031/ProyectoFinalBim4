import { Request, Response } from "express";
import { FotoProblemaService } from "../service/fotoProblema.service.js";

export class FotoProblemaController {

    private service = new FotoProblemaService();

    async listar(req: Request, res: Response): Promise<void> {
        try {
            const fotos = await this.service.listar();
            res.status(200).json(fotos);
        } catch (error) {
            res.status(500).json({ mensaje: "Error al obtener las fotografías", error: (error as Error).message });
        }
    }


    async obtenerPorId(req: Request, res: Response): Promise<void> {
        try {
            const id = Number(req.params.id);

            if (isNaN(id)) {
                res.status(400).json({ mensaje: "El id debe ser un número" });
                return;
            }

            const foto = await this.service.obtenerPorId(id);
            res.status(200).json(foto);
        } catch (error) {
            res.status(404).json({ mensaje: (error as Error).message });
        }
    }


    async obtenerPorReporte(req: Request, res: Response): Promise<void> {
        try {
            const idReporte = Number(req.params.idReporte);

            if (isNaN(idReporte)) {
                res.status(400).json({ mensaje: "El idReporte debe ser un número" });
                return;
            }

            const fotos = await this.service.obtenerPorReporte(idReporte);
            res.status(200).json(fotos);
        } catch (error) {
            res.status(500).json({ mensaje: (error as Error).message });
        }
    }


    async crear(req: Request, res: Response): Promise<void> {
        try {
            const nuevaFoto = await this.service.crear(req.body);
            res.status(201).json(nuevaFoto);
        } catch (error) {
            res.status(400).json({ mensaje: (error as Error).message });
        }
    }


    async actualizar(req: Request, res: Response): Promise<void> {
        try {
            const id = Number(req.params.id);

            if (isNaN(id)) {
                res.status(400).json({ mensaje: "El id debe ser un número" });
                return;
            }

            const fotoActualizada = await this.service.actualizar(id, req.body);
            res.status(200).json(fotoActualizada);
        } catch (error) {
            res.status(404).json({ mensaje: (error as Error).message });
        }
    }


    async eliminar(req: Request, res: Response): Promise<void> {
        try {
            const id = Number(req.params.id);

            if (isNaN(id)) {
                res.status(400).json({ mensaje: "El id debe ser un número" });
                return;
            }

            const fotoEliminada = await this.service.eliminar(id);
            res.status(200).json({ mensaje: "Fotografía eliminada correctamente", fotografia: fotoEliminada });
        } catch (error) {
            res.status(404).json({ mensaje: (error as Error).message });
        }
    }

}
