import { Router } from "express";
import cors from "cors";
import { DepartamentoMunicipalController } from "../controllers/departamentoMunicipal.controller";

export const departamentoRouter = Router();

departamentoRouter.get("/api/departamentos", cors(), (req,res) => {
    const controller = new DepartamentoMunicipalController();
    controller.obtenerDepartamentos(req,res);
});

departamentoRouter.get("/api/departamentos/:id", cors(), (req,res) => {
    const controller = new DepartamentoMunicipalController();
    controller.obtenerDepartamentosPorId(req,res);
}); 

departamentoRouter.post("/api/departamentos", cors(), (req,res) => {
    const controller = new DepartamentoMunicipalController();
    controller.crearDepartamento(req,res);
});

departamentoRouter.put("/api/departamentos/:id", cors(), (req,res) => {
    const controller = new DepartamentoMunicipalController();
    controller.actualizarDepartamento(req,res);
});

departamentoRouter.delete("/api/departamentos/:id", cors(), (req,res) => {
    const controller = new DepartamentoMunicipalController();
    controller.eliminarDepartamento(req,res);
});