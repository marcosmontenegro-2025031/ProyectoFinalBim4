import { Request, Response, NextFunction } from 'express';
import { validarTokenUsuario, validarTokenEmpleado } from '../utils/jwt.util';

const extraer = (req: Request): string | null => {
    const encabezado = req.headers.authorization;
    const resultado = /^Bearer\s+(\S+)$/i.exec(encabezado ?? '');
    return resultado?.[1] ?? null;
};

export const verificarTokenUsuario = (req: Request, res: Response, next: NextFunction): void => {
    const token = extraer(req);
    if (!token) { res.status(401).json({message: 'Token Bearer no proporcionado'}); return; }
    try {
        const usuario = validarTokenUsuario(token);
        if (!Number.isInteger(usuario.id_usuario) || usuario.id_usuario <= 0) throw Error('JWT de ciudadano no válido');
        (req as any).usuario = usuario;
        next();
    } catch { res.status(401).json({message: 'Token de ciudadano inválido o vencido'}); }
};

export const verificarTokenEmpleado = (req: Request, res: Response, next: NextFunction): void => {
    const token = extraer(req);
    if (!token) { res.status(401).json({message: 'Token Bearer no proporcionado'}); return; }
    try {
        const empleado = validarTokenEmpleado(token);
        if (!Number.isInteger(empleado.id_empleado) || empleado.id_empleado <= 0) throw Error('JWT de empleado no válido');
        (req as any).empleado = empleado;
        next();
    } catch { res.status(401).json({message: 'Token de empleado inválido o vencido'}); }
};

export const verificarAdministrador = (req: Request, res: Response, next: NextFunction): void => {
    if (!/admin/i.test((req as any).empleado?.cargo ?? '')) {
        res.status(403).json({message: 'Acceso exclusivo de administrador'});
        return;
    }
    next();
};
