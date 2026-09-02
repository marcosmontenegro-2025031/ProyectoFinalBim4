import { Router } from "express";
import cors from "cors";
import { FotoProblemaController } from "../controllers/fotoProblema.controller.js";

export const fotoProblemaRouter = Router();

fotoProblemaRouter.get("/api/fotos-problema", cors(), (req, res) => {
    const controller = new FotoProblemaController();
    controller.listar(req, res);
});

fotoProblemaRouter.get("/api/fotos-problema/reporte/:idReporte", cors(), (req, res) => {
    const controller = new FotoProblemaController();
    controller.obtenerPorReporte(req, res);
});

fotoProblemaRouter.get("/api/fotos-problema/:id", cors(), (req, res) => {
    const controller = new FotoProblemaController();
    controller.obtenerPorId(req, res);
});

fotoProblemaRouter.post("/api/fotos-problema", cors(), (req, res) => {
    const controller = new FotoProblemaController();
    controller.crear(req, res);
});

fotoProblemaRouter.put("/api/fotos-problema/:id", cors(), (req, res) => {
    const controller = new FotoProblemaController();
    controller.actualizar(req, res);
});

fotoProblemaRouter.delete("/api/fotos-problema/:id", cors(), (req, res) => {
    const controller = new FotoProblemaController();
    controller.eliminar(req, res);
});
