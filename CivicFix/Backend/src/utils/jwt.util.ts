import jwt from 'jsonwebtoken';
import { JwtPayload } from '../models/usuarios.model';
import { JwtPayloadEmpleado } from '../models/empleadoMunicipal.model';
import dotenv from 'dotenv';

dotenv.config();
 
const CLAVE_SECRETA = process.env.JWT_SECRET;

if (!CLAVE_SECRETA) {
    throw new Error("JWT_SECRET no está configurado");
}

export const generarTokenUsuario = (payload: JwtPayload): string => {
  return jwt.sign(payload, CLAVE_SECRETA, { expiresIn: '4h' });
};

export const generarTokenEmpleado = (payload: JwtPayloadEmpleado): string => {
  return jwt.sign(payload, CLAVE_SECRETA, { expiresIn: '4h' });
};

export const validarTokenUsuario = (token: string): JwtPayload => {
    return jwt.verify(token, CLAVE_SECRETA) as JwtPayload;
};

export const validarTokenEmpleado = (token: string): JwtPayloadEmpleado => {
    return jwt.verify(token, CLAVE_SECRETA) as JwtPayloadEmpleado;
};
