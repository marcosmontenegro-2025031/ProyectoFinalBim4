import { Request, Response } from "express";
import { BitacoraCambioEstadoService } from "../services/bitacoraCambioEstado.service.js";
import { JwtPayloadEmpleado } from "../models/empleadoMunicipal.model.js";

export class BitacoraCambioEstadoController {

    static async obtenerPorEmpleado(req: Request, res: Response): Promise<void> {
        try {
            const empleado = (req as Request & { empleado: JwtPayloadEmpleado }).empleado;
            const bitacoras = await BitacoraCambioEstadoService.obtenerPorEmpleado(empleado.id_empleado);
            res.status(200).json(bitacoras);
        } catch (error) {
            console.error('Error al obtener la bitácora del empleado:', error);
            res.status(500).json({ mensaje: "Error al obtener la bitácora del empleado" });
        }
    }

    static async listar(req: Request, res: Response): Promise<void> {
        try {
            const bitacoras = await BitacoraCambioEstadoService.listar();
            res.status(200).json(bitacoras);
        } catch (error) {
            res.status(500).json({ mensaje: "Error al obtener la bitácora", error: (error as Error).message });
        }
    }


    static async obtenerPorId(req: Request, res: Response): Promise<void> {
        try {
            const id = Number(req.params.id);

            if (isNaN(id)) {
                res.status(400).json({ mensaje: "El id debe ser un número" });
                return;
            }

            const bitacora = await BitacoraCambioEstadoService.obtenerPorId(id);
            res.status(200).json(bitacora);
        } catch (error) {
            res.status(404).json({ mensaje: (error as Error).message });
        }
    }


    static async obtenerPorReporte(req: Request, res: Response): Promise<void> {
        try {
            const idReporte = Number(req.params.idReporte);

            if (isNaN(idReporte)) {
                res.status(400).json({ mensaje: "El idReporte debe ser un número" });
                return;
            }

            const bitacoras = await BitacoraCambioEstadoService.obtenerPorReporte(idReporte);
            res.status(200).json(bitacoras);
        } catch (error) {
            res.status(500).json({ mensaje: (error as Error).message });
        }
    }


    static async crear(req: Request, res: Response): Promise<void> {
        try {
            const nuevaBitacora = await BitacoraCambioEstadoService.crear(req.body);
            res.status(201).json(nuevaBitacora);
        } catch (error) {
            res.status(400).json({ mensaje: (error as Error).message });
        }
    }


    static async actualizar(req: Request, res: Response): Promise<void> {
        try {
            const id = Number(req.params.id);

            if (isNaN(id)) {
                res.status(400).json({ mensaje: "El id debe ser un número" });
                return;
            }

            const bitacoraActualizada = await BitacoraCambioEstadoService.actualizar(id, req.body);
            res.status(200).json(bitacoraActualizada);
        } catch (error) {
            res.status(404).json({ mensaje: (error as Error).message });
        }
    }


    static async eliminar(req: Request, res: Response): Promise<void> {
        try {
            const id = Number(req.params.id);

            if (isNaN(id)) {
                res.status(400).json({ mensaje: "El id debe ser un número" });
                return;
            }

            const bitacoraEliminada = await BitacoraCambioEstadoService.eliminar(id);
            res.status(200).json({ mensaje: "Registro de bitácora eliminado correctamente", bitacora: bitacoraEliminada });
        } catch (error) {
            res.status(404).json({ mensaje: (error as Error).message });
        }
    }

}
