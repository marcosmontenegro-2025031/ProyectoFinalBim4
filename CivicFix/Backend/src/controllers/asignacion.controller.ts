import { Request, Response } from "express";
import { AsignacionService } from "../service/asignacion.service.js";
import { Asignacion } from "../models/asignacion.model.js";

export class AsignacionController {

    private service = new AsignacionService();

    async listar(req: Request, res: Response) {
        try {
            const asignaciones = await this.service.listar();

            console.log("GET /api/asignaciones");
            console.log("Asignaciones:", asignaciones);

            res.status(200).json(asignaciones);

        } catch (error: any) {
            console.error("Error al obtener las asignaciones:", error);

            res.status(500).json({
                mensaje: "Error al obtener las asignaciones"
            });
        }
    }


    async obtenerPorId(req: Request, res: Response) {
        try {
            const idParam = req.params.id;

            const id = parseInt(
                typeof idParam === "string"
                    ? idParam
                    : String(idParam)
            );

            if (isNaN(id)) {
                res.status(400).json({
                    mensaje: "El id debe ser un número"
                });

                return;
            }

            const asignacion = await this.service.obtenerPorId(id);

            if (asignacion) {

                console.log("GET /api/asignaciones/:id");
                console.log("Asignación ID:", id);
                console.log("Asignación:", asignacion);

                res.status(200).json(asignacion);

            } else {

                res.status(404).json({
                    mensaje: "Asignación no encontrada"
                });
            }

        } catch (error: any) {

            console.error("Error:", error.message);

            res.status(400).json({
                mensaje: error.message
            });
        }
    }


    async crear(req: Request, res: Response) {
        try {

            const nuevaAsignacion: Asignacion = req.body;

            const asignacionCreada =
                await this.service.crear(nuevaAsignacion);

            console.log("POST /api/asignaciones");
            console.log(
                "Asignación creada:",
                asignacionCreada
            );

            res.status(201).json(asignacionCreada);

        } catch (error: any) {

            console.error(
                "Error al crear asignación:",
                error.message
            );

            res.status(400).json({
                mensaje: error.message
            });
        }
    }


    async actualizar(req: Request, res: Response) {
        try {

            const idParam = req.params.id;

            const id = parseInt(
                typeof idParam === "string"
                    ? idParam
                    : String(idParam)
            );

            if (isNaN(id)) {

                res.status(400).json({
                    mensaje: "El id debe ser un número"
                });

                return;
            }

            const asignacionActualizada =
                await this.service.actualizar(
                    id,
                    req.body
                );

            if (asignacionActualizada) {

                console.log(
                    "PUT /api/asignaciones/:id"
                );

                console.log(
                    "Asignación actualizada:",
                    asignacionActualizada
                );

                res.status(200).json(
                    asignacionActualizada
                );

            } else {

                console.log(
                    "Asignación no encontrada ID:",
                    id
                );

                res.status(404).json({
                    mensaje: "Asignación no encontrada"
                });
            }

        } catch (error: any) {

            console.error(
                "Error al actualizar:",
                error.message
            );

            res.status(400).json({
                mensaje: error.message
            });
        }
    }


    async eliminar(req: Request, res: Response) {
        try {

            const idParam = req.params.id;

            const id = parseInt(
                typeof idParam === "string"
                    ? idParam
                    : String(idParam)
            );

            if (isNaN(id)) {

                res.status(400).json({
                    mensaje: "El id debe ser un número"
                });

                return;
            }

            const asignacionEliminada =
                await this.service.eliminar(id);

            if (asignacionEliminada) {

                console.log(
                    "DELETE /api/asignaciones/:id"
                );

                console.log(
                    "Asignación eliminada ID:",
                    id
                );

                res.status(200).json({
                    mensaje:
                        "Asignación eliminada correctamente"
                });

            } else {

                res.status(404).json({
                    mensaje: "Asignación no encontrada"
                });
            }

        } catch (error: any) {

            console.error(
                "Error:",
                error.message
            );

            res.status(400).json({
                mensaje: error.message
            });
        }
    }
}