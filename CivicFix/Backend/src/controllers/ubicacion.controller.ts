import { Request, Response } from 'express';
import { UbicacionService } from '../services/ubicacion.service';

const ubicacionService = new UbicacionService();

export const obtenerUbicacionPorIdHandler = async (req: Request, res: Response): Promise<Response> => {
    try {
        const idUbicacion = Number(req.params.id);

        if (isNaN(idUbicacion)) {
            return res.status(400).json({ error: 'El parámetro ID debe ser un número entero válido.' });
        }

        const ubicacion = await ubicacionService.consultarPorId(idUbicacion);

        if (!ubicacion) {
            return res.status(404).json({ mensaje: 'Ubicación no encontrada.' });
        }

        return res.status(200).json(ubicacion);
    } catch (error: any) {
        return res.status(500).json({
            error: 'Error al consultar la ubicación',
            detalle: error.message
        });
    }
};