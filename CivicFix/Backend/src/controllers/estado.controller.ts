import { Request, Response } from 'express';
import { EstadoService } from '../services/estado.service';

const estadoService = new EstadoService();

export const listarEstadosHandler = async (_req: Request, res: Response): Promise<Response> => {
    try {
        const estados = await estadoService.listarEstados();
        return res.status(200).json(estados);
    } catch (error: any) {
        return res.status(500).json({
            error: 'Error al consultar los estados',
            detalle: error.message
        });
    }
};