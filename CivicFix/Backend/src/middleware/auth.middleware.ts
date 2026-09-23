import { Request, Response, NextFunction } from 'express';
import { validarTokenUsuario, validarTokenEmpleado } from '../utils/jwt.util';
import { pool } from '../config/db';

function leerBearer(req: Request): string | null {
    const match = /^Bearer\s+(\S+)$/i.exec(req.headers.authorization || '');
    return match ? match[1] : null;
}
function errorAuth(res: Response, error: unknown): void {
    if (typeof (error as any)?.code === 'string' && /^(08|28|42|53|57)/.test((error as any).code)) {
        console.error('Error verificando sesión:', error);
        res.status(503).json({message:'No se pudo validar la sesión en PostgreSQL'});
    } else {res.status(401).json({message:'Sesión inválida o expirada'});}
}

export const verificarTokenUsuario = async (req: Request,res: Response,next: NextFunction): Promise<void> => {
    const token = leerBearer(req);
    if (!token) {res.status(401).json({message:'Token no proporcionado'});return;}
    try {
        const usuario = validarTokenUsuario(token);
        if (!Number.isSafeInteger(usuario.id_usuario) || usuario.id_usuario<=0) {
            res.status(401).json({message:'Token de ciudadano inválido'});return;
        }
        const {rows}=await pool.query('SELECT activo FROM Usuario WHERE id_usuario=$1',[usuario.id_usuario]);
        if (!rows.length || !rows[0].activo) {res.status(403).json({message:'Cuenta no disponible'});return;}
        (req as any).usuario=usuario;
        next();
    }catch(error){errorAuth(res,error);}
};
export const verificarTokenEmpleado = async (req: Request,res: Response,next: NextFunction): Promise<void> => {
    const token = leerBearer(req);
    if (!token) {res.status(401).json({message:'Token no proporcionado'});return;}
    try {
        const empleado = validarTokenEmpleado(token);
        if (!Number.isSafeInteger(empleado.id_empleado) || empleado.id_empleado<=0) {
            res.status(401).json({message:'Token de empleado inválido'});return;
        }
        const {rows}=await pool.query('SELECT activo,cargo FROM EmpleadoMunicipal WHERE id_empleado=$1',[empleado.id_empleado]);
        if (!rows.length || !rows[0].activo) {res.status(403).json({message:'Cuenta no disponible'});return;}
        (req as any).empleado={...empleado,cargo:rows[0].cargo};
        next();
    }catch(error){errorAuth(res,error);}
};
export const verificarAdministrador = async (req: Request,res: Response,next: NextFunction): Promise<void> => {
    const token=leerBearer(req);
    if(!token){res.status(401).json({message:'Se requiere sesión de administrador'});return;}
    try{
        const empleado=validarTokenEmpleado(token);
        if(!Number.isSafeInteger(empleado.id_empleado)||empleado.id_empleado<=0){res.status(401).json({message:'Token inválido'});return;}
        const {rows}=await pool.query('SELECT cargo,activo FROM EmpleadoMunicipal WHERE id_empleado=$1',[empleado.id_empleado]);
        if(!rows.length||!rows[0].activo){res.status(403).json({message:'Cuenta no disponible'});return;}
        const cargo=String(rows[0].cargo||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim().toLowerCase();
        if(cargo!=='administrador'){res.status(403).json({message:'Solo administradores'});return;}
        (req as any).empleado={...empleado,cargo:rows[0].cargo};next();
    }catch(error){errorAuth(res,error);}
};
