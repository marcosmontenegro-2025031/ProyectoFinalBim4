import { Router } from "express";
import cors from "cors";
import { BitacoraCambioEstadoController } from "../controllers/bitacoraCambioEstado.controller.js";

export const bitacoraCambioEstadoRouter = Router();

bitacoraCambioEstadoRouter.get("/api/bitacora", cors(), (req, res) => {
    const controller = new BitacoraCambioEstadoController();
    controller.listar(req, res);
});

bitacoraCambioEstadoRouter.get("/api/bitacora/reporte/:idReporte", cors(), (req, res) => {
    const controller = new BitacoraCambioEstadoController();
    controller.obtenerPorReporte(req, res);
});

bitacoraCambioEstadoRouter.get("/api/bitacora/:id", cors(), (req, res) => {
    const controller = new BitacoraCambioEstadoController();
    controller.obtenerPorId(req, res);
});

bitacoraCambioEstadoRouter.post("/api/bitacora", cors(), (req, res) => {
    const controller = new BitacoraCambioEstadoController();
    controller.crear(req, res);
});

bitacoraCambioEstadoRouter.put("/api/bitacora/:id", cors(), (req, res) => {
    const controller = new BitacoraCambioEstadoController();
    controller.actualizar(req, res);
});

bitacoraCambioEstadoRouter.delete("/api/bitacora/:id", cors(), (req, res) => {
    const controller = new BitacoraCambioEstadoController();
    controller.eliminar(req, res);
});
