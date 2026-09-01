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