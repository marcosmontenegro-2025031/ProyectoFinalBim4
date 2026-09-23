import { Request, Response } from 'express';
import { EmpleadoMunicipalService } from '../services/empleadoMunicipal.service';

export class EmpleadoMunicipalController {
    private service = new EmpleadoMunicipalService();

    async obtenerMiPerfil(req: Request, res: Response) {
        try {
            const id = Number((req as any).empleado?.id_empleado);
            if (!Number.isInteger(id) || id <= 0) return res.status(401).json({message: 'Sesión de empleado inválida'});
            const empleado = await this.service.obtenerEmpleadoPorId(id);
            return empleado ? res.status(200).json(empleado) : res.status(404).json({message: 'Empleado no encontrado'});
        } catch (error: any) {
            console.error('Error al obtener perfil:', error);
            return res.status(500).json({message: 'Error al consultar el perfil'});
        }
    }

    async actualizarMiPerfil(req: Request, res: Response) {
        try {
            const id = Number((req as any).empleado?.id_empleado);
            if (!Number.isInteger(id) || id <= 0) return res.status(401).json({message: 'Sesión de empleado inválida'});
            const {nombre, apellido, usuario, correo, telefono} = req.body;
            const empleado = await this.service.actualizarPerfil(id, {nombre, apellido, usuario, correo, telefono});
            return empleado ? res.status(200).json(empleado) : res.status(404).json({message: 'Empleado no encontrado'});
        } catch (error: any) {
            console.error('Error al actualizar perfil:', error);
            return res.status(error.code === '23505' ? 409 : 400).json({message:
                error.code === '23505' ? 'El usuario o correo ya existe' : error.message});
        }
    }

    async obtenerEmpleados(req: Request, res: Response) {
        try {
            const empleados = await this.service.obtenerEmpleados();
            console.log("GET /api/empleados");

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
            const { nombre, apellido,usuario,password,dpi,telefono,direccion,correo,cargo, id_departamento,id_municipalidad } = req.body;
            const newEmpleado = await this.service.crearEmpleado({ nombre, apellido,usuario,password,dpi,telefono,direccion,correo,cargo, id_departamento,id_municipalidad });
            console.log("POST /api/empleados");

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
            const { nombre, apellido,usuario,password,dpi,telefono,direccion,correo,cargo, id_departamento,id_municipalidad } = req.body;
            const updatedEmpleado = await this.service.actualizarEmpleado(id, { nombre, apellido,usuario,password,dpi,telefono,direccion,correo,cargo, id_departamento,id_municipalidad });
            if (updatedEmpleado) {
                console.log("PUT /api/empleados/:id");

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

    async actualizarPassword(req: Request, res: Response) {
        try {
            const { usuario, password } = req.body;
            const updatedPassword = await this.service.actualizarPassword(usuario, password);
            if (updatedPassword) {
                console.log("PATCH /api/empleados/actualizarPassword");
                console.log("Contraseña actualizada para el usuario:", usuario);
                res.status(200).json({ message: "Contraseña actualizada correctamente" });
            } else {
                console.log("Usuario no encontrado");
                res.status(404).json({ message: "Usuario no encontrado" });
            }
        } catch (error: any) {
            console.error("Error:", error.message);
            res.status(400).json({ message: error.message });
        }
    }
}