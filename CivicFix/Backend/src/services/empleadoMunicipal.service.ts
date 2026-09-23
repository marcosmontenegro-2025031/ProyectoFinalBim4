import { EmpleadoMunicipalRepository } from "../repository/empleadoMunicipal.repository";
import { EmpleadoMunicipal, EmpleadoRegister } from "../models/empleadoMunicipal.model";

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
            !empleado.direccion ||!empleado.dpi || !empleado.cargo || !empleado.id_departamento || !empleado.id_municipalidad
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

        if(!empleado.correo.endsWith("@civicfix.com")) {
            throw new Error("El correo electrónico no pertenece a un dominio válido, solo se permiten correos con el dominio @civicfix.com");
        }

        return this.empleadoRepository.crearEmpleado(empleado);
    }

    async actualizarEmpleado(id: number,empleado: EmpleadoRegister) : Promise<EmpleadoRegister | undefined> {
        if (!empleado.nombre || !empleado.apellido || !empleado.usuario || !empleado.correo || !empleado.password || !empleado.telefono || 
            !empleado.direccion ||!empleado.dpi || !empleado.cargo || !empleado.id_departamento || !empleado.id_municipalidad
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

        if(!empleado.correo.endsWith("@civicfix.com")) {
            throw new Error("El correo electrónico no pertenece a un dominio válido, solo se permiten correos con el dominio @civicfix.com");
        }

        return this.empleadoRepository.actualizarEmpleado(id,empleado);
    }

    async actualizarPerfil(id: number, datos: {
        nombre: string; apellido: string; usuario: string; correo: string; telefono: string;
    }) {
        if (![datos.nombre, datos.apellido, datos.usuario, datos.correo].every(x => typeof x === 'string' && x.trim())) {
            throw new Error('Nombre, apellido, usuario y correo son obligatorios');
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.correo.trim())) {
            throw new Error('Correo electrónico inválido');
        }
        if (datos.telefono && !/^\d{8}$/.test(datos.telefono)) {
            throw new Error('El teléfono debe tener 8 dígitos');
        }
        return this.empleadoRepository.actualizarPerfil(id, {
            nombre: datos.nombre.trim(), apellido: datos.apellido.trim(),
            usuario: datos.usuario.trim(), correo: datos.correo.trim(),
            telefono: datos.telefono ?? ''
        });
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

    async actualizarPassword(usuario: string, password: string): Promise<boolean> {
        if (!usuario || !password) {
            throw new Error("Usuario y contraseña son obligatorios");
        }
        return this.empleadoRepository.actualizarPassword(usuario, password);
    }
}