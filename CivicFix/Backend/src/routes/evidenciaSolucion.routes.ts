import { Router } from "express";
import cors from "cors";
import { EvidenciaSolucionController } from "../controllers/evidenciaSolucion.controller.js";

export const evidenciaSolucionRouter = Router();

evidenciaSolucionRouter.get("/api/evidencias-solucion", cors(), (req, res) => {
    const controller = new EvidenciaSolucionController();
    controller.listar(req, res);
});

evidenciaSolucionRouter.get("/api/evidencias-solucion/reporte/:idReporte", cors(), (req, res) => {
    const controller = new EvidenciaSolucionController();
    controller.obtenerPorReporte(req, res);
});

evidenciaSolucionRouter.get("/api/evidencias-solucion/:id", cors(), (req, res) => {
    const controller = new EvidenciaSolucionController();
    controller.obtenerPorId(req, res);
});

evidenciaSolucionRouter.post("/api/evidencias-solucion", cors(), (req, res) => {
    const controller = new EvidenciaSolucionController();
    controller.crear(req, res);
});

evidenciaSolucionRouter.put("/api/evidencias-solucion/:id", cors(), (req, res) => {
    const controller = new EvidenciaSolucionController();
    controller.actualizar(req, res);
});

evidenciaSolucionRouter.delete("/api/evidencias-solucion/:id", cors(), (req, res) => {
    const controller = new EvidenciaSolucionController();
    controller.eliminar(req, res);
});
