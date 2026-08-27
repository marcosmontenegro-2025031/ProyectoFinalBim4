import { Request, Response } from "express";
import { UsuariosService } from  "../service/usuarios.service";
import { UserRegister } from '../models/usuarios.model';


export class UsuariosController {
    private service = new UsuariosService();

    async getUsuarios(req: Request, res: Response){
        try {
            const usuarios = await this.service.obtenerUsuarios();
            console.log("GET /api/usuarios");
            console.log("Usuarios:", usuarios);
            res.status(200).json(usuarios);
        } catch (error: any) {
            console.error("Error al obtener usuarios:", error);
            res.status(404).json({ message: "Error al obtener usuarios" });
        }
    }

    async getUsuarioById(req: Request, res: Response) {
        try {
            const idParam = req.params.id;
            const id = parseInt(typeof idParam === 'string' ? idParam : String(idParam));
            const usuario = await this.service.obtenerUsuarioPorId(id);
            if (usuario) {
                console.log('GET /api/usuarios/:id');
                console.log("Usuario ID:", id);
                console.log("Usuario:", usuario);
                res.status(200).json(usuario);
            } else {
                res.status(404).json({ message: 'Usuario no encontrado' });
            }
        } catch (error: any) {
            console.error("Error al obtener usuario:", error);
            res.status(400).json({ message: error.message });
        }
            
    }

    async createUsuario(req: Request, res: Response){
        try {
            const { nombre, apellido, usuario, correo, password, telefono } = req.body;
            const newUsuario: UserRegister = {
                nombre,
                apellido,
                usuario,
                correo,
                password,
                telefono
            };
            const createdUsuario = await this.service.crearUsuario(newUsuario);
            console.log("POST /api/usuarios");
            console.log("Usuario creado:", createdUsuario);
            res.status(201).json(createdUsuario);
        } catch (error: any) {
            console.error("Error al crear usuario:", error);
            res.status(400).json({ message: error.message });
        }
    }

    async updateUsuario(req: Request, res: Response){
        try {
            const idParam = req.params.id;
            const id = parseInt(typeof idParam === 'string' ? idParam : String(idParam));
            const { nombre, apellido, usuario, correo, password, telefono } = req.body;
            const updatedUsuario = await this.service.actualizarUsuario(id, { nombre, apellido, usuario, correo, password, telefono });
            if (updatedUsuario){
                console.log('PUT /api/usuarios/:id');
                console.log("Usuario actualizado:", updatedUsuario);
                res.status(200).json(updatedUsuario);
            }else{
                console.log('PUT /api/usuarios/:id');
                console.log("Usuario no encontrado id:", id);
                res.status(404).json({ message: 'Usuario no encontrado' });
            }
        } catch (error: any) {
            console.error("Error al actualizar usuario:", error);
            res.status(400).json({ message: error.message });
        }
    }

    async deleteUsuario(req: Request, res: Response){
        try {
            const idParam = req.params.id;
            const id = parseInt(typeof idParam === "string" ? idParam : String(idParam));
            const deleted = await this.service.eliminarUsuario(id);
            if (deleted){
                console.log("DELETE /api/usuarios/:id");
                console.log("Usuario ID eliminado:", id);
                res.status(200).json({ message: 'Usuario eliminado' });
            } else {
                res.status(404).json({ message: 'Usuario no encontrado' });
            }
        } catch (error: any) {
            console.error("Error al eliminar usuario:", error);
            res.status(400).json({ message: error.message });
        }
    }
}