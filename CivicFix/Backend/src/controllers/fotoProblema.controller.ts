import { Request, Response } from 'express';
import { FotoProblemaService } from '../services/fotoProblema.service.js';

export class FotoProblemaController {
    private service = new FotoProblemaService();

    async listar(_req: Request, res: Response): Promise<void> {
        try {
            res.status(200).json(await this.service.listar());
        } catch (error) {
            res.status(500).json({ mensaje: 'Error al obtener las fotografías', error: (error as Error).message });
        }
    }

    async obtenerPorId(req: Request, res: Response): Promise<void> {
        try {
            const id = Number(req.params.id);
            if (!Number.isInteger(id)) {
                res.status(400).json({ mensaje: 'El id debe ser un número' });
                return;
            }
            res.status(200).json(await this.service.obtenerPorId(id));
        } catch (error) {
            res.status(404).json({ mensaje: (error as Error).message });
        }
    }

    async obtenerPorReporte(req: Request, res: Response): Promise<void> {
        try {
            const idReporte = Number(req.params.idReporte);
            if (!Number.isInteger(idReporte)) {
                res.status(400).json({ mensaje: 'El idReporte debe ser un número' });
                return;
            }
            res.status(200).json(await this.service.obtenerPorReporte(idReporte));
        } catch (error) {
            res.status(500).json({ mensaje: (error as Error).message });
        }
    }

    async crear(req: Request, res: Response): Promise<void> {
        try {
            const idReporte = Number(req.body.id_reporte);
            if (!req.file || !Number.isInteger(idReporte)) {
                res.status(400).json({ mensaje: 'id_reporte e imagen son obligatorios' });
                return;
            }
            const foto = await this.service.crear({
                fk_id_reporte: idReporte,
                ruta_fotografia: `/uploads/${req.file.filename}`,
                descripcion: req.body.descripcion
            });
            res.status(201).json(foto);
        } catch (error) {
            res.status(400).json({ mensaje: (error as Error).message });
        }
    }

    async actualizar(req: Request, res: Response): Promise<void> {
        try {
            const id = Number(req.params.id);
            if (!Number.isInteger(id)) {
                res.status(400).json({ mensaje: 'El id debe ser un número' });
                return;
            }
            res.status(200).json(await this.service.actualizar(id, req.body));
        } catch (error) {
            res.status(404).json({ mensaje: (error as Error).message });
        }
    }

    async eliminar(req: Request, res: Response): Promise<void> {
        try {
            const id = Number(req.params.id);
            if (!Number.isInteger(id)) {
                res.status(400).json({ mensaje: 'El id debe ser un número' });
                return;
            }
            const fotografia = await this.service.eliminar(id);
            res.status(200).json({ mensaje: 'Fotografía eliminada correctamente', fotografia });
        } catch (error) {
            res.status(404).json({ mensaje: (error as Error).message });
        }
    }
}
