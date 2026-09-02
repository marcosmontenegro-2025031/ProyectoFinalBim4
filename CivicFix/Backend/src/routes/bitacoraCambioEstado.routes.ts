import { Router } from "express";
import cors from "cors";
import { BitacoraCambioEstadoController } from "../controllers/bitacoraCambioEstado.controller.js";

export const bitacoraCambioEstadoRouter = Router();

bitacoraCambioEstadoRouter.get("/api/bitacoras-cambio-estado", cors(), (req, res) => {
    const controller = new BitacoraCambioEstadoController();
    controller.listar(req, res);
});

bitacoraCambioEstadoRouter.get("/api/bitacoras-cambio-estado/reporte/:idReporte", cors(), (req, res) => {
    const controller = new BitacoraCambioEstadoController();
    controller.obtenerPorReporte(req, res);
});

bitacoraCambioEstadoRouter.get("/api/bitacoras-cambio-estado/:id", cors(), (req, res) => {
    const controller = new BitacoraCambioEstadoController();
    controller.obtenerPorId(req, res);
});

bitacoraCambioEstadoRouter.post("/api/bitacoras-cambio-estado", cors(), (req, res) => {
    const controller = new BitacoraCambioEstadoController();
    controller.crear(req, res);
});

bitacoraCambioEstadoRouter.put("/api/bitacoras-cambio-estado/:id", cors(), (req, res) => {
    const controller = new BitacoraCambioEstadoController();
    controller.actualizar(req, res);
});

bitacoraCambioEstadoRouter.delete("/api/bitacoras-cambio-estado/:id", cors(), (req, res) => {
    const controller = new BitacoraCambioEstadoController();
    controller.eliminar(req, res);
});
