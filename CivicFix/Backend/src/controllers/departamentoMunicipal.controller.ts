import { Request, Response } from "express";
import { DepartamentoMunicipalService } from "../service/departamentoMunicipal.service";
import { DepartamentoMunicipal } from "../models/departamentoMunicipal.model";

export class DepartamentoMunicipalController {
    private service = new DepartamentoMunicipalService();

    async obtenerDepartamentos(req: Request, res: Response) {
        try {
            const departamento = await this.service.obtenerDepartamentos();
            console.log("GET /api/departamentos");
            console.log("Departamentos:", departamento);
            res.status(200).json(departamento);
        } catch (error: any) {
            console.error("Error al obtener departentos", error);
            res.status(404).json({ menssage: "Error al obtener departamentos "});
        }
    }

    async obtenerDepartamentosPorId(req: Request, res: Response) {
        try {
            const idParam = req.params.id;
            const id = parseInt(typeof idParam === 'string' ? idParam : String(idParam));
            const departamento = await this.service.obtenerDepartamentosPorId(id);
            if (departamento) {
                console.log("Get /api/departamentos/:id");
                console.log("Departamento ID:", id);
                console.log("Departamento:", departamento);
                res.status(200).json(departamento)
            }else {
                console.log("Departamento no encontrado");
                res.status(404).json({ message: "Departamento no encontrado" });
            }
        } catch (error: any) {
            console.error("error:", error.message);
            res.status(400).json({ message: error.message });
        }
    }

    async crearDepartamento(req: Request, res: Response){
            try {
                const { nombre,descripcion,id_municipalidad } = req.body;
                const newDepartamento: DepartamentoMunicipal = {
                    nombre,
                    descripcion,
                    id_municipalidad
                };
                const createdDepartamento = await this.service.crearDepartamento(newDepartamento);
                console.log("POST /api/departamentos");
                console.log("Departamento creado:", createdDepartamento);
                res.status(201).json(createdDepartamento);
            } catch (error: any) {
                console.error("Error al crear departamento:", error);
                res.status(400).json({ message: error.message });
            }
        }
    
        async actualizarDepartamento(req: Request, res: Response){
            try {
                const idParam = req.params.id;
                const id = parseInt(typeof idParam === 'string' ? idParam : String(idParam));
                const { nombre,descripcion,id_municipalidad } = req.body;
                const updatedDepartamento = await this.service.actualizarDepartamento(id, { nombre,descripcion,id_municipalidad });
                if (updatedDepartamento){
                    console.log('PUT /api/departamentos/:id');
                    console.log("Departamento actualizado:", updatedDepartamento);
                    res.status(200).json(updatedDepartamento);
                }else{
                    console.log('PUT /api/departamentos/:id');
                    console.log("Departamento no encontrado id:", id);
                    res.status(404).json({ message: 'Departamento no encontrado' });
                }
            } catch (error: any) {
                console.error("Error:", error.message);
                res.status(400).json({ message: error.message });
            }
        }
    
        async deleteUsuario(req: Request, res: Response){
            try {
                const idParam = req.params.id;
                const id = parseInt(typeof idParam === "string" ? idParam : String(idParam));
                const deletedDepartamento = await this.service.eliminarDepartamento(id);
                if (deletedDepartamento){
                    console.log("DELETE /api/departamentos/:id");
                    console.log("Departamento ID eliminado:", id);
                    res.status(200).json({ message: 'Departamento eliminado' });
                } else {
                    res.status(404).json({ message: 'Departamento no encontrado' });
                }
            } catch (error: any) {
                console.error("Error:", error.message);
                res.status(400).json({ message: error.message });
            }
        }
}