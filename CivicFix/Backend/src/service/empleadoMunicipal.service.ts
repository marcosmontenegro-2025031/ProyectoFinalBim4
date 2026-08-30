import { EmpleadoMunicipalRepository } from "../repository/empleadoMunicipal.repository";
import { EmpleadoMunicipal, EmpleadoRegister } from "../models/empleadoMunicipal.mode";

export class EmpleadoMunicipalService {
    private empleadoRepository = new EmpleadoMunicipalRepository();

    async obtenerEmpleados(): Promise<EmpleadoMunicipal[]> {
        return this.empleadoRepository.obtenerEmpleado();
    }

    async obtenerEmpleadoPorId(id: number): Promise<EmpleadoMunicipal | undefined> {
        if (id === undefined || id === null) {
            throw new Error("ID de usuario inválido");
        }

        if(!Number.isInteger(id) || id <= 0) {
            throw new Error("El id proporcionado no es válido.");
        }
        return this.empleadoRepository.obtenerEmpleadoPorId(id);
    }

    async crearEmpleado(empleado: EmpleadoRegister) : Promise<EmpleadoRegister> {
        if (!empleado.nombre || !empleado.apellido || !empleado.usuario || !empleado.correo || !empleado.password || !empleado.telefono || 
            empleado.dpi || empleado.cargo || empleado.id_departamento
        ) {
            throw new Error("Todos los campos son obligatorios");
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(empleado.correo)) {
            throw new Error("Correo electrónico inválido");
        }

        if (!/^\d{8}$/.test(empleado.telefono)) {
            throw new Error("El número de teléfono debe tener 8 dígitos");
        }

        if (empleado.password.length < 8) {
            throw new Error("La contraseña debe tener al menos 8 caracteres");
        }

        if(!empleado.correo.endsWith("@gmail.com") && !empleado.correo.endsWith("@hotmail.com") && !empleado.correo.endsWith("@outlook.com") && !empleado.correo.endsWith("@yahoo.com") && !empleado.correo.endsWith("@icloud.com")) {
            throw new Error("El correo electrónico no pertenece a un dominio válido");
        }

        return this.empleadoRepository.crearEmpleado(empleado);
    }

    async actualizarEmpleado(id: number,empleado: EmpleadoRegister) : Promise<EmpleadoRegister | undefined> {
        if (!empleado.nombre || !empleado.apellido || !empleado.usuario || !empleado.correo || !empleado.password || !empleado.telefono || 
            empleado.dpi || empleado.cargo || empleado.id_departamento
        ) {
            throw new Error("Todos los campos son obligatorios");
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(empleado.correo)) {
            throw new Error("Correo electrónico inválido");
        }

        if (!/^\d{8}$/.test(empleado.telefono)) {
            throw new Error("El número de teléfono debe tener 8 dígitos");
        }

        if (empleado.password.length < 8) {
            throw new Error("La contraseña debe tener al menos 8 caracteres");
        }

        if(!empleado.correo.endsWith("@gmail.com") && !empleado.correo.endsWith("@hotmail.com") && !empleado.correo.endsWith("@outlook.com") && !empleado.correo.endsWith("@yahoo.com") && !empleado.correo.endsWith("@icloud.com")) {
            throw new Error("El correo electrónico no pertenece a un dominio válido");
        }

        return this.empleadoRepository.actualizarEmpleado(id,empleado);
    }

    async eliminarEmpleado(id: number): Promise<boolean> {
        if (id === undefined || id === null) {
            throw new Error("ID de usuario inválido");
        }

        if(!Number.isInteger(id) || id <= 0) {
            throw new Error("El id proporcionado no es válido.");
        }

        return this.empleadoRepository.eliminarEmpleado(id);
    }
}