import { Router } from "express";
import cors from "cors";
import { EmpleadoMunicipalController } from "../controllers/empleadoMunicipal.controller";
import { verificarTokenEmpleado, verificarAdministrador } from "../middleware/auth.middleware.js";

export const empleadoRouter = Router();

empleadoRouter.get("/api/empleados", verificarTokenEmpleado, verificarAdministrador, (req,res) => {
    const controller = new EmpleadoMunicipalController();
    controller.obtenerEmpleados(req,res);
});

empleadoRouter.get('/api/empleados/me', verificarTokenEmpleado, (req, res) => {
    new EmpleadoMunicipalController().obtenerMiPerfil(req, res);
});

empleadoRouter.put('/api/empleados/me', verificarTokenEmpleado, (req, res) => {
    new EmpleadoMunicipalController().actualizarMiPerfil(req, res);
});

empleadoRouter.get("/api/empleados/:id", cors(),verificarTokenEmpleado, (req,res) => {
    const actor = (req as any).empleado;
    if (!/admin/i.test(actor?.cargo ?? '') && Number(req.params.id) !== actor?.id_empleado) {
        return res.status(403).json({message: 'No tienes permiso para consultar este empleado'});
    }
    new EmpleadoMunicipalController().obtenerEmpleadosPorId(req,res);
});

empleadoRouter.post("/api/empleados", cors(), (req,res) => {
    if (/admin/i.test(String(req.body?.cargo ?? ''))) {
        return res.status(403).json({message: 'El rol Administrador no puede solicitarse desde el registro público'});
    }
    const controller = new EmpleadoMunicipalController();
    controller.crearEmpleado(req,res);
});

empleadoRouter.put("/api/empleados/:id", cors(),verificarTokenEmpleado, (req,res) => {
    if (!/admin/i.test((req as any).empleado?.cargo ?? '')) {
        return res.status(403).json({message: 'Actualización administrativa no permitida desde perfil'});
    }
    new EmpleadoMunicipalController().actualizarEmpleado(req,res);
});

empleadoRouter.delete("/api/empleados/:id", verificarTokenEmpleado, verificarAdministrador, (req,res) => {
    const controller = new EmpleadoMunicipalController();
    controller.eliminarEmpleado(req,res);
});

empleadoRouter.patch("/api/empleados/actualizarPassword", verificarTokenEmpleado, verificarAdministrador, (req,res) => {
    const controller = new EmpleadoMunicipalController();
    controller.actualizarPassword(req,res);
});