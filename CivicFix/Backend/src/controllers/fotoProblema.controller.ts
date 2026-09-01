import { Request, Response } from 'express';
import { FotoProblemaRepository } from '../repository/fotoProblema.repository';

const repositorio = new FotoProblemaRepository();

export const registrarFotoProblema = async (req: Request, res: Response): Promise<Response> => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No se ha proporcionado ninguna imagen.' });
        }

        const { reporteId, id_reporte } = req.body;
        // Soporta tanto 'reporteId' como 'id_reporte' dependiendo de cómo lo envíe el frontend
        const targetReporteId = id_reporte || reporteId;

        if (!targetReporteId) {
            return res.status(400).json({ error: 'El id_reporte es obligatorio para asociar la fotografía.' });
        }

        // Ruta en la que se guardó localmente mediante Multer
        const rutaFotografia = `/uploads/${req.file.filename}`;

        const nuevaFoto = await repositorio.crear({
            id_reporte: Number(targetReporteId),
            ruta_fotografia: rutaFotografia,
            descripcion: req.body.descripcion || 'Foto inicial del reporte'
        });

        return res.status(201).json({
            message: 'Fotografía registrada con éxito en la base de datos',
            data: nuevaFoto
        });
    } catch (error: any) {
        console.error('Error al guardar foto:', error);
        return res.status(500).json({ error: 'Error interno al procesar e insertar la imagen en la base de datos.' });
    }
};