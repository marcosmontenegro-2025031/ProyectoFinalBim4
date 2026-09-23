import { verificarAdministrador } from "../middleware/auth.middleware";
import { Router } from "express";
import cors from "cors";
import { EmpleadoMunicipalController } from "../controllers/empleadoMunicipal.controller";

export const empleadoRouter = Router();

const controller = new EmpleadoMunicipalController();

// ==========================================
// REGISTRO PÚBLICO DE EMPLEADO
// ==========================================

empleadoRouter.post("/api/empleados/registro", cors(), (req, res) => {
    const controller = new EmpleadoMunicipalController();
    controller.crearEmpleado(req, res);
});

// ==========================================
// RUTAS DE ADMINISTRACIÓN
// ==========================================

empleadoRouter.get("/api/empleados", cors(), verificarAdministrador, (req, res) => {
    controller.obtenerEmpleados(req, res);
});

empleadoRouter.get("/api/empleados/:id", cors(), verificarAdministrador, (req, res) => {
    controller.obtenerEmpleadosPorId(req, res);
});

empleadoRouter.post("/api/empleados", cors(), verificarAdministrador, (req, res) => {
    controller.crearEmpleado(req, res);
});

empleadoRouter.put("/api/empleados/:id", cors(), verificarAdministrador, (req, res) => {
    controller.actualizarEmpleado(req, res);
});

empleadoRouter.delete("/api/empleados/:id", cors(), verificarAdministrador, (req, res) => {
    controller.eliminarEmpleado(req, res);
});

empleadoRouter.patch("/api/empleados/actualizarPassword", cors(), verificarAdministrador, (req, res) => {
    controller.actualizarPassword(req, res);
});



