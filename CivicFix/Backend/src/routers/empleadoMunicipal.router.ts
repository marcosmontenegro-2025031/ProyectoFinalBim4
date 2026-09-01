import { Router } from "express";
import cors from "cors";
import { EmpleadoMunicipalController } from "../controllers/empleadoMunicipal.controller";

export const empleadoRouter = Router();

empleadoRouter.get("/api/empleados", cors(), (req,res) => {
    const controller = new EmpleadoMunicipalController();
    controller.obtenerEmpleados(req,res);
});

empleadoRouter.get("/api/empleados/:id", cors(), (req,res) => {
    const controller = new EmpleadoMunicipalController();
    controller.obtenerEmpleadosPorId(req,res);
});

empleadoRouter.post("/api/empleados", cors(), (req,res) => {
    const controller = new EmpleadoMunicipalController();
    controller.crearEmpleado(req,res);
});

empleadoRouter.put("/api/empleados/:id", cors(), (req,res) => {
    const controller = new EmpleadoMunicipalController();
    controller.actualizarEmpleado(req,res);
});

empleadoRouter.delete("/api/empleados/:id", cors(), (req,res) => {
    const controller = new EmpleadoMunicipalController();
    controller.eliminarEmpleado(req,res);
});