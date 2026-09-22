import { Router } from 'express';
import cors from 'cors';
import { AuthController } from '../controllers/auth.controller';

export const authRouter = Router();

authRouter.post('/api/login/usuario', cors(), (req, res) => {
    const controller = new AuthController();
    controller.loginUsuario(req, res);
});

authRouter.post('/api/login/empleado', cors(), (req, res) => {
    const controller = new AuthController();
    controller.loginEmpleado(req, res);
});