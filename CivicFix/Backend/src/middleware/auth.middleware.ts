import { Request, Response, NextFunction } from "express";
import { validarTokenUsuario,validarTokenEmpleado } from "../utils/jwt.util";

export const verificarTokenUsuario = (req: Request,res: Response,next: NextFunction) => {

    const authHeader = req.headers.authorization;

    if(!authHeader){
        return res.status(401).json({
            message:"Token no proporcionado"
        });
    }

    const token = authHeader.split(" ")[1];

    try{
        const usuario = validarTokenUsuario(token);
        (req as any).usuario = usuario;
        next();
    }catch(error){
        return res.status(401).json({
            message:"Token inválido"
        });
    }
}

export const verificarTokenEmpleado = (req: Request,res: Response,next: NextFunction) => {

    const authHeader = req.headers.authorization;

    if(!authHeader){
        return res.status(401).json({
            message:"Token no proporcionado"
        });
    }

    const token = authHeader.split(" ")[1];

    try{
        const empleado = validarTokenEmpleado(token);
        (req as any).empleado = empleado;
        next();
    }catch(error){
        return res.status(401).json({
            message:"Token inválido"
        });
    }
}