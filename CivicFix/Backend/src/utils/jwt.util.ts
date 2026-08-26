import jwt from 'jsonwebtoken';
import { JwtPayload } from '../models/usuarios.model';
import dotenv from 'dotenv';

dotenv.config();
 
const CLAVE_SECRETA = process.env.JWT_SECRET;

if (!CLAVE_SECRETA) {
    throw new Error("JWT_SECRET no está configurado");
}

export const generarToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, CLAVE_SECRETA, { expiresIn: '4h' });
};

export const validarToken = (token: string): JwtPayload => {
    return jwt.verify(token, CLAVE_SECRETA) as JwtPayload;
};
