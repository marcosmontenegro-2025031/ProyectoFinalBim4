import { Router } from "express";

import {
    UsuariosController
} from "../controllers/usuarios.controller";

import {
    verificarTokenUsuario,
    verificarTokenEmpleado
} from "../middleware/auth.middleware";

export const usuariosRouter = Router();

usuariosRouter.get(
    "/api/usuarios",
    verificarTokenEmpleado,
    (req, res) => {

        const controller =
            new UsuariosController();

        controller.getUsuarios(req, res);
    }
);

usuariosRouter.get(
    "/api/usuarios/:id",
    verificarTokenUsuario,
    (req, res) => {

        const controller =
            new UsuariosController();

        controller.getUsuarioById(req, res);
    }
);

usuariosRouter.post(
    "/api/usuarios",
    (req, res) => {

        const controller =
            new UsuariosController();

        controller.createUsuario(req, res);
    }
);

usuariosRouter.post(
    "/api/login/usuario",
    (req, res) => {

        const controller =
            new UsuariosController();

        controller.loginUsuario(req, res);
    }
);

usuariosRouter.put(
    "/api/usuarios/:id",
    verificarTokenUsuario,
    (req, res) => {

        const controller =
            new UsuariosController();

        controller.updateUsuario(req, res);
    }
);

usuariosRouter.delete(
    "/api/usuarios/:id",
    verificarTokenUsuario,
    (req, res) => {

        const controller =
            new UsuariosController();

        controller.deleteUsuario(req, res);
    }
);
