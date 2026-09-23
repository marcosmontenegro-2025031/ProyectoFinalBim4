import { Request, Response } from 'express';
import { ReporteService } from '../services/reporte.service';
import { pool } from '../config/db';

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
    const idReporte = Number(req.params.id);
    const idEstado = Number(req.body?.idEstado);
    const empleado = (req as any).empleado;
    if (!Number.isInteger(idReporte) || idReporte < 1 || !Number.isInteger(idEstado) || idEstado < 1) {
        return res.status(400).json({message: 'idReporte e idEstado deben ser números válidos'});
    }
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const {rows} = await client.query('SELECT id_estado FROM Reporte WHERE id_reporte=$1 FOR UPDATE', [idReporte]);
        if (!rows.length) {await client.query('ROLLBACK');return res.status(404).json({message: 'Reporte no encontrado'});}
        const {rowCount} = await client.query('SELECT 1 FROM Asignacion WHERE id_reporte=$1 AND id_empleado=$2',
          [idReporte, empleado.id_empleado]);
        if (!/admin/i.test(empleado.cargo ?? '') && !rowCount) {
          await client.query('ROLLBACK');return res.status(403).json({message:'Este reporte no está asignado a tu usuario'});
        }
        const anterior = Number(rows[0].id_estado);
        if (anterior === idEstado) {await client.query('COMMIT');return res.json({mensaje:'El reporte ya tenía ese estado'});}
        await client.query('UPDATE Reporte SET id_estado=$1 WHERE id_reporte=$2', [idEstado,idReporte]);
        await client.query(`INSERT INTO BitacoraCambioEstado
          (id_reporte,id_estado_anterior,id_estado_nuevo,id_empleado,comentario)
          VALUES ($1,$2,$3,$4,$5)`,[idReporte,anterior,idEstado,empleado.id_empleado,'Cambio de estado']);
        await client.query('COMMIT');
        return res.json({mensaje:'Estado del reporte actualizado'});
    } catch(error: any) {
        await client.query('ROLLBACK');
        console.error('Error al actualizar estado:',error);
        return res.status(error.code === '23503' ? 400 : 500).json({message:
          error.code === '23503' ? 'El estado seleccionado no existe' : 'Error al actualizar el estado'});
    } finally { client.release(); }
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

export const obtenerMisAsignacionesHandler = async (req: Request, res: Response): Promise<Response> => {
    try {
        const idEmpleado = (req as any).empleado?.id_empleado;

        if (!idEmpleado) {
            return res.status(401).json({ error: 'No se pudo identificar al empleado autenticado.' });
        }

        const reportes = await reporteService.obtenerReportesPorEmpleado(idEmpleado);
        return res.status(200).json(reportes);
    } catch (error: any) {
        return res.status(500).json({
            error: 'Error al obtener las incidencias asignadas',
            detalle: error.message
        });
    }
};