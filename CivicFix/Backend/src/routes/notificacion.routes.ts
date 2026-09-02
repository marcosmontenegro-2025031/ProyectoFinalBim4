import { Router } from "express";
import cors from "cors";
import { NotificacionController } from "../controllers/notificacion.controller.js";

export const notificacionRouter = Router();

notificacionRouter.get("/api/notificaciones", cors(), (req, res) => {
    const controller = new NotificacionController();
    controller.listar(req, res);
});

notificacionRouter.get("/api/notificaciones/usuario/:idUsuario", cors(), (req, res) => {
    const controller = new NotificacionController();
    controller.obtenerPorUsuario(req, res);
});

notificacionRouter.get("/api/notificaciones/:id", cors(), (req, res) => {
    const controller = new NotificacionController();
    controller.obtenerPorId(req, res);
});

notificacionRouter.post("/api/notificaciones", cors(), (req, res) => {
    const controller = new NotificacionController();
    controller.crear(req, res);
});

notificacionRouter.put("/api/notificaciones/:id", cors(), (req, res) => {
    const controller = new NotificacionController();
    controller.actualizar(req, res);
});

notificacionRouter.patch("/api/notificaciones/:id/leida", cors(), (req, res) => {
    const controller = new NotificacionController();
    controller.marcarComoLeida(req, res);
});

notificacionRouter.delete("/api/notificaciones/:id", cors(), (req, res) => {
    const controller = new NotificacionController();
    controller.eliminar(req, res);
});
