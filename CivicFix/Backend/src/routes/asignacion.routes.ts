import { Router } from "express";
import cors from "cors";
import { AsignacionController } from "../controllers/asignacion.controller.js";

export const asignacionRouter = Router();

asignacionRouter.get("/api/asignaciones", cors(), (req, res) => {
    const controller = new AsignacionController();
    controller.listar(req, res);
});

asignacionRouter.get("/api/asignaciones/:id", cors(), (req, res) => {
    const controller = new AsignacionController();
    controller.obtenerPorId(req, res);
});

asignacionRouter.post("/api/asignaciones", cors(), (req, res) => {
    const controller = new AsignacionController();
    controller.crear(req, res);
});

asignacionRouter.put("/api/asignaciones/:id", cors(), (req, res) => {
    const controller = new AsignacionController();
    controller.actualizar(req, res);
});

asignacionRouter.delete("/api/asignaciones/:id", cors(), (req, res) => {
    const controller = new AsignacionController();
    controller.eliminar(req, res);
});
