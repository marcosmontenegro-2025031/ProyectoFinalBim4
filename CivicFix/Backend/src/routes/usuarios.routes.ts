import { Router } from "express";
import cors from "cors";
import { UsuariosController } from "../controllers/usuarios.controller";
import { verificarTokenUsuario,verificarTokenEmpleado, verificarAdministrador } from "../middleware/auth.middleware";

export const usuariosRouter = Router();

usuariosRouter.get("/api/usuarios", cors(), verificarAdministrador, (req, res) => {
    const controller = new UsuariosController();
    controller.getUsuarios(req,res);
});

usuariosRouter.get("/api/usuarios/:id", cors(), verificarTokenUsuario, (req, res) => {
    if (Number(req.params.id) !== (req as any).usuario?.id_usuario) return res.status(403).json({ message: "Acceso denegado" });
    const controller = new UsuariosController();
    controller.getUsuarioById(req,res);
});

usuariosRouter.post("/api/usuarios", cors(), (req, res) => {
    const controller = new UsuariosController();
    controller.createUsuario(req, res);
});

usuariosRouter.put("/api/usuarios/:id", cors(), verificarTokenUsuario, (req, res) => {
    if (Number(req.params.id) !== (req as any).usuario?.id_usuario) return res.status(403).json({ message: "Acceso denegado" });
    const controller = new UsuariosController();
    controller.updateUsuario(req, res);
});

usuariosRouter.delete("/api/usuarios/:id", cors(), verificarAdministrador, (req, res) => {
    const controller = new UsuariosController();
    controller.deleteUsuario(req, res);
});