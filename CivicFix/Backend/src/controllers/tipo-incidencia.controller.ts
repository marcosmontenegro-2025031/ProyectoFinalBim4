import { Request, Response } from 'express';
import { TipoIncidenciaService } from '../services/tipo-incidencia.service';

const tipoIncidenciaService = new TipoIncidenciaService();

export const listarTiposIncidenciaHandler = async (_req: Request, res: Response): Promise<Response> => {
    try {
        const tipos = await tipoIncidenciaService.listarTipos();
        return res.status(200).json(tipos);
    } catch (error: any) {
        return res.status(500).json({
            error: 'Error al consultar los tipos de incidencia',
            detalle: error.message
        });
    }
};