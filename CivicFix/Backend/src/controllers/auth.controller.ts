import { Request, Response } from "express";
import { AuthService } from "../service/auth.service";

export class AuthController {
    private service = new AuthService();

    async loginUsuario(req: Request, res: Response){
        try{
            const respuesta = await this.service.loginUsuario(req.body);
            res.status(200).json(respuesta);
        }catch(error:any){
            res.status(401).json({message:error.message});
        }
    }

    async loginEmpleado(req: Request, res: Response){
        try{
            const respuesta = await this.service.loginEmpleado(req.body);
            res.status(200).json(respuesta);
        }catch(error:any){
            res.status(401).json({message:error.message});
        }
    }
}