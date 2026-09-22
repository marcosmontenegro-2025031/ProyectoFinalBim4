import { Router } from "express";
import cors from "cors";
import { FotoProblemaController } from "../controllers/fotoProblema.controller.js";
import { upload } from "../config/upload.middleware.js";

export const fotoProblemaRouter = Router();

fotoProblemaRouter.get("/api/fotografias", cors(), (req, res) => {
    const controller = new FotoProblemaController();
    controller.listar(req, res);
});

fotoProblemaRouter.get("/api/fotografias/reporte/:idReporte", cors(), (req, res) => {
    const controller = new FotoProblemaController();
    controller.obtenerPorReporte(req, res);
});

fotoProblemaRouter.get("/api/fotografias/:id", cors(), (req, res) => {
    const controller = new FotoProblemaController();
    controller.obtenerPorId(req, res);
});

fotoProblemaRouter.post("/api/fotografias", cors(), upload.single('imagen'), (req, res) => {
    const controller = new FotoProblemaController();
    controller.crear(req, res);
});

fotoProblemaRouter.put("/api/fotografias/:id", cors(), (req, res) => {
    const controller = new FotoProblemaController();
    controller.actualizar(req, res);
});

fotoProblemaRouter.delete("/api/fotografias/:id", cors(), (req, res) => {
    const controller = new FotoProblemaController();
    controller.eliminar(req, res);
});
