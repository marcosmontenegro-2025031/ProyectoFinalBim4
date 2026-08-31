import { Request, Response } from 'express';
import { EmpleadoMunicipalService } from '../service/empleadoMunicipal.service';

export class EmpleadoMunicipalController {
    private service = new EmpleadoMunicipalService();

    async obtenerEmpleados(req: Request, res: Response) {
        try {
            const empleados = await this.service.obtenerEmpleados();
            console.log("GET /api/empleados");
            console.log("Empleados:", empleados);
            res.status(200).json(empleados);
        } catch (error: any) {
            console.error("Error al obtener empleados municipales", error);
            res.status(404).json({ message: "Error al obtener empleados municipales" });
        }
    }

    async obtenerEmpleadosPorId(req: Request, res: Response) {
        try {
            const idParam = req.params.id;
            const id = parseInt(typeof idParam === 'string' ? idParam : String(idParam));
            const empleado = await this.service.obtenerEmpleadoPorId(id);
            if (empleado) {
                console.log("GET /api/empleados/:id");
                console.log("Empleado ID:", id);
                console.log("Empleado:", empleado);
                res.status(200).json(empleado);
            } else {
                console.log("Empleado no encontrado");
                res.status(404).json({ message: "Empleado no encontrado" });
            }
        } catch (error: any) {
            console.error("Error:", error.message);
            res.status(400).json({ message: error.message });
        }
    }

    async crearEmpleado(req: Request, res: Response) {
        try {
            const { nombre, apellido,usuario,password,dpi,telefono,correo,cargo, id_departamento } = req.body;
            const newEmpleado = await this.service.crearEmpleado({ nombre, apellido,usuario,password,dpi,telefono,correo,cargo, id_departamento });
            console.log("POST /api/empleados");
            console.log("Empleado creado:", newEmpleado);
            res.status(201).json(newEmpleado);
        } catch (error: any) {
            console.error("Error:", error.message);
            res.status(400).json({ message: error.message });
        }
    }

    async actualizarEmpleado(req: Request, res: Response) {
        try {
            const idParam = req.params.id;
            const id = parseInt(typeof idParam === 'string' ? idParam : String(idParam));
            const { nombre, apellido,usuario,password,dpi,telefono,correo,cargo, id_departamento } = req.body;
            const updatedEmpleado = await this.service.actualizarEmpleado(id, { nombre, apellido,usuario,password,dpi,telefono,correo,cargo, id_departamento });
            if (updatedEmpleado) {
                console.log("PUT /api/empleados/:id");
                console.log("Empleado actualizado:", updatedEmpleado);
                res.status(200).json(updatedEmpleado);
            } else {
                console.log("Empleado no encontrado");
                res.status(404).json({ message: "Empleado no encontrado" });
            }
        } catch (error: any) {
            console.error("Error:", error.message);
            res.status(400).json({ message: error.message });
        }
    }

    async eliminarEmpleado(req: Request, res: Response) {
        try {
            const idParam = req.params.id;
            const id = parseInt(typeof idParam === "string" ? idParam : String(idParam));
            const deletedEmpleado = await this.service.eliminarEmpleado(id);
            if (deletedEmpleado) {
                console.log("DELETE /api/empleados/:id");
                console.log("Empleado eliminado:", deletedEmpleado);
                res.status(200).json(deletedEmpleado);
            } else {
                console.log("Empleado no encontrado");
                res.status(404).json({ message: "Empleado no encontrado" });
            }
        } catch (error: any) {
            console.error("Error:", error.message);
            res.status(400).json({ message: error.message });
        }
    }
}