import { Request,Response } from "express";
import { MunicipalidadService } from "../service/municipalidad.service";
import { Municipalidad } from "../models/municipalidad.model";

export class MunicipalidadController{
    private service = new MunicipalidadService();

    async obtenerMunicipalidades(req: Request, res: Response){
        try {
            const municipalidades = await this.service.obtenerMunicipalidades();
            console.log("GET /api/municipalidades");
            console.log("Municipalidades:", municipalidades)
            res.status(200).json(municipalidades);
        } catch (error: any) {
            console.error("error al obtener municipalidades:", error);
            res.status(404).json({ message: "Error al obtener Municipalidades"});
        }
    }

    async obtenerMunicipalidadPorId(req: Request, res: Response) {
        try {
            const idParam = req.params.id;
            const id = parseInt(typeof idParam === 'string' ? idParam: String(idParam) );
            const municipalidad = await this.service.obtenerMunicipalidadPorId(id);
            if (municipalidad) {
                console.log("Get /api/municipalidades/:id");
                console.log("Municipalidad ID:", id);
                console.log("Municipalidad:", municipalidad);
                res.status(200).json(municipalidad);
            }else{
                console.error("Municipalodad no encontrado");
                res.status(404).json({ message: "Municipalidad no encontrada"});
            }
        } catch (error: any) {
            console.error("error no.400:", error.message);
            res.status(400).json({ message: error.message});
        }
    }

    async crearMunicipalidad(req: Request, res: Response) {
        try {
            const { nombre,direccion,telefono,correo} = req.body;
            const newMunicipalidad: Municipalidad = {
                nombre,
                direccion,
                telefono,
                correo
            };
            const createdMunicipalidad = await this.service.crearMunicipalidad(newMunicipalidad);
            console.log("POST /api/municipalidades");
            console.log("Municipalidad creada:", createdMunicipalidad);
            res.status(201).json(createdMunicipalidad);
        } catch (error: any) {
            console.error("error:", error.message);
            res.status(400).json({ message: error.message});
        }
    }

    async actualizarMunicipalidad(req: Request, res: Response) {
        try {
            const { nombre,direccion,telefono,correo} = req.body;
            const newMunicipalidad: Municipalidad = {
                nombre,
                direccion,
                telefono,
                correo
            };
            const idParam = req.params.id;
            const id = parseInt(typeof idParam === 'string' ? idParam: String(idParam) );
            const upgradeMunicipalidad = await this.service.actualizarMunicipalidad(id,newMunicipalidad);
            if (upgradeMunicipalidad) {
                console.log("PUT /api/municipalidades/:id");
                console.log("Municipalidad ID:", id);
                console.log("Municipalidad:", upgradeMunicipalidad);
                res.status(200).json(upgradeMunicipalidad);
            }else{
                console.log("PUT /api/municipalidades/:id");
                console.error("Municipalodad no encontrada");
                res.status(404).json({ message: "Municipalidad no encontrada"});
            }
        } catch (error: any) {
            console.error("error:", error.message);
            res.status(400).json({ message: error.message});
        }
    }

    async eliminarMunicipalidad(req: Request, res: Response) {
        try {
            const idParam = req.params.id;
            const id = parseInt(typeof idParam === 'string' ? idParam: String(idParam) );
            const deletedMunicipalidad = await this.service.eliminarMunicipalidad(id);
            if (deletedMunicipalidad) {
                console.log("DELETE /api/municipalidades/:id");
                console.log("Municipalidad ID Eliminado:", id);
                res.status(200).json("Municipalidad Eliminada");
            }else{
                console.error("Municipalodad no encontrada");
                res.status(404).json({ message: "Municipalidad no encontrada"});
            }
        } catch (error: any) {
            console.error("error:", error.message);
            res.status(400).json({ message: error.message});
        }
    }
}