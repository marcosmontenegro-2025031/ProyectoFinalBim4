import { Request, Response } from 'express';
import { ReporteService } from '../services/reporte.service';

const reporteService = new ReporteService();

export const obtenerReportesHandler = async (_req: Request, res: Response): Promise<Response> => {
    try {
        const reportes = await reporteService.obtenerTodosLosReportes();
        return res.status(200).json(reportes);
    } catch (error: any) {
        return res.status(500).json({
            error: 'Error al obtener la lista de reportes',
            detalle: error.message
        });
    }
};

export const crearReporteHandler = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { textoCiudadano, direccion, zona, referencia, latitud, longitud, idUsuario } = req.body;

        if (!textoCiudadano || !direccion || latitud === undefined || longitud === undefined || !idUsuario) {
            return res.status(400).json({
                error: 'Faltan campos obligatorios: textoCiudadano, direccion, latitud, longitud e idUsuario.'
            });
        }

        const resultado = await reporteService.registrarReporteCiudadano({
            textoCiudadano,
            direccion,
            zona,
            referencia,
            latitud: Number(latitud),
            longitud: Number(longitud),
            idUsuario: Number(idUsuario)
        });

        if (!resultado.esValido) {
            return res.status(422).json({
                mensaje: 'El texto ingresado no califica como una incidencia urbana válida.',
                analisis: resultado.analisis
            });
        }

        return res.status(201).json({
            mensaje: 'Reporte registrado con éxito',
            data: resultado
        });

    } catch (error: any) {
        return res.status(500).json({
            error: 'Error en el servidor al procesar el reporte',
            detalle: error.message
        });
    }
};

export const obtenerMisReportesHandler = async (req: Request, res: Response): Promise<Response> => {
    try {
        const idUsuario = (req as any).usuario?.id_usuario;

        if (!idUsuario) {
            return res.status(401).json({ error: 'No se pudo identificar al usuario autenticado.' });
        }

        const reportes = await reporteService.obtenerReportesPorUsuario(idUsuario);
        return res.status(200).json(reportes);
    } catch (error: any) {
        return res.status(500).json({
            error: 'Error al obtener los reportes del usuario',
            detalle: error.message
        });
    }
};

export const actualizarEstadoReporteHandler = async (req: Request, res: Response): Promise<Response> => {
    try {
        const idReporte = Number(req.params.id);
        const { idEstado } = req.body;

        if (!idReporte || !idEstado) {
            return res.status(400).json({ error: 'Faltan datos: idReporte e idEstado son obligatorios.' });
        }

        const actualizado = await reporteService.actualizarEstadoReporte(idReporte, Number(idEstado), (req as any).empleado?.id_empleado);

        if (!actualizado) {
            return res.status(404).json({ error: 'Reporte no encontrado.' });
        }

        return res.status(200).json({ mensaje: 'Estado del reporte actualizado con éxito' });
    } catch (error: any) {
        return res.status(500).json({
            error: 'Error al actualizar el estado del reporte',
            detalle: error.message
        });
    }
};

export const obtenerPuntosMapaHandler = async (_req: Request, res: Response): Promise<Response> => {
    try {
        const puntos = await reporteService.obtenerPuntosParaMapa();
        return res.status(200).json(puntos);
    } catch (error: any) {
        return res.status(500).json({
            error: 'Error al obtener la lista de puntos para el mapa',
            detalle: error.message
        });
    }
};