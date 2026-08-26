import { Request, Response } from 'express';
import { PrioridadService } from '../services/prioridad.service';

const prioridadService = new PrioridadService();

export const listarPrioridadesHandler = async (_req: Request, res: Response): Promise<Response> => {
    try {
        const prioridades = await prioridadService.listarPrioridades();
        return res.status(200).json(prioridades);
    } catch (error: any) {
        return res.status(500).json({
            error: 'Error al consultar las prioridades',
            detalle: error.message
        });
    }
};