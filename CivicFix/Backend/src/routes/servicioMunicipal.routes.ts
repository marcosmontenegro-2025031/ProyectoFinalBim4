import { Router } from "express";
import cors from "cors";
import { ServicioMunicipalController } from "../controllers/servicioMunicipal.controller";

export const servicioRouter = Router();

servicioRouter.get("/api/servicios", cors(), (req,res) => {
    const controller = new ServicioMunicipalController();
    controller.obtenerServicios(req,res);
});

servicioRouter.get("/api/servicios/:id", cors(), (req,res) => {
    const controller = new ServicioMunicipalController();
    controller.obtenerServiciosPorId(req,res);
});

servicioRouter.post("/api/servicios", cors(), (req,res) => {
    const controller = new ServicioMunicipalController();
    controller.crearServicio(req,res);
});

servicioRouter.put("/api/servicios/:id", cors(), (req,res) => {
    const controller = new ServicioMunicipalController();
    controller.actualizarServicio(req,res);
});

servicioRouter.delete("/api/servicios/:id", cors(), (req,res) => {
    const controller = new ServicioMunicipalController();
    controller.eliminarServicio(req,res);
});