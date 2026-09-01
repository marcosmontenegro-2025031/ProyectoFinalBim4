import { Router } from "express";
import cors from "cors";
import { MunicipalidadController } from "../controllers/municipalidad.controller";

export const municipalidadRouter = Router();

municipalidadRouter.get("/api/municipalidades", cors(), (req,res) => {
    const controller = new MunicipalidadController();
    controller.obtenerMunicipalidades(req,res);
});

municipalidadRouter.get("/api/municipalidades/:id", cors(), (req,res) => {
    const controller = new MunicipalidadController();
    controller.obtenerMunicipalidadPorId(req,res);
});

municipalidadRouter.post("/api/municipalidades", cors(), (req,res) => {
    const controller = new MunicipalidadController();
    controller.crearMunicipalidad(req,res);
});

municipalidadRouter.put("/api/municipalidades/:id", cors(), (req,res) => {
    const controller = new MunicipalidadController();
    controller.actualizarMunicipalidad(req,res);
});

municipalidadRouter.delete("/api/municipalidades/:id", cors(), (req,res) => {
    const controller = new MunicipalidadController();
    controller.eliminarMunicipalidad(req,res);
});