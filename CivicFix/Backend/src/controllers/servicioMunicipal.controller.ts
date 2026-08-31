import { Request, Response } from 'express';
import { ServicioMunicpalService } from '../service/servicioMunicipal.service';

export class ServicioMunicipalController {
    private service = new ServicioMunicpalService();

    async obtenerServicios(req: Request, res: Response) {
        try {
            const servicios = await this.service.obtenerServiciosMunicipales();
            console.log("GET /api/servicios");
            console.log("Servicios:", servicios);
            res.status(200).json(servicios);
        } catch (error: any) {
            console.error("Error al obtener servicios municipales", error);
            res.status(404).json({ message: "Error al obtener servicios municipales" });
        }
    }

    async obtenerServiciosPorId(req: Request, res: Response) {
        try {
            const idParam = req.params.id;
            const id = parseInt(typeof idParam === 'string' ? idParam : String(idParam));
            const servicio = await this.service.obtenerServicioMunicipalPorId(id);
            if (servicio) {
                console.log("GET /api/servicios/:id");
                console.log("Servicio ID:", id);
                console.log("Servicio:", servicio);
                res.status(200).json(servicio);
            } else {
                console.log("Servicio no encontrado");
                res.status(404).json({ message: "Servicio no encontrado" });
            }
        } catch (error: any) {
            console.error("Error:", error.message);
            res.status(400).json({ message: error.message });
        }
    }

    async crearServicio(req: Request, res: Response) {
        try {
            const { nombre, descripcion, id_departamento } = req.body;
            const newServicio = await this.service.crearServicioMunicipal({ nombre, descripcion, id_departamento });
            console.log("POST /api/servicios");
            console.log("Servicio creado:", newServicio);
            res.status(201).json(newServicio);
        } catch (error: any) {
            console.error("Error:", error.message);
            res.status(400).json({ message: error.message });
        }
    }

    async actualizarServicio(req: Request, res: Response) {
        try {
            const idParam = req.params.id;
            const id = parseInt(typeof idParam === 'string' ? idParam : String(idParam));
            const { nombre, descripcion, id_departamento } = req.body;
            const updatedServicio = await this.service.actualizarServicioMunicipal(id, { nombre, descripcion, id_departamento });
            if (updatedServicio) {
                console.log("PUT /api/servicios/:id");
                console.log("Servicio actualizado:", updatedServicio);
                res.status(200).json(updatedServicio);
            } else {
                console.log("Servicio no encontrado");
                res.status(404).json({ message: "Servicio no encontrado" });
            }
        } catch (error: any) {
            console.error("Error:", error.message);
            res.status(400).json({ message: error.message });
        }
    }

    async eliminarServicio(req: Request, res: Response) {
        try {
            const idParam = req.params.id;
            const id = parseInt(typeof idParam === "string" ? idParam : String(idParam));
            const deletedServicio = await this.service.eliminarServicioMunicipal(id);
            if (deletedServicio) {
                console.log("DELETE /api/servicios/:id");
                console.log("Servicio ID eliminado:", id);
                res.status(200).json({ message: 'Servicio eliminado' });
            } else {
                console.log("Servicio no encontrado");
                res.status(404).json({ message: 'Servicio no encontrado' });
            }
        } catch (error: any) {
            console.error("Error:", error.message);
            res.status(400).json({ message: error.message });
        }
    }
}