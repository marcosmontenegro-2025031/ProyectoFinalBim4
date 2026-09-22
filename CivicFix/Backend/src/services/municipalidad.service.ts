import { MunicipalidadRepository } from "../repository/municipalidad.repository";
import { Municipalidad } from "../models/municipalidad.model";

export class MunicipalidadService {
    private municipalidadRepository = new MunicipalidadRepository();

    async obtenerMunicipalidades(): Promise<Municipalidad[]> {
        return this.municipalidadRepository.obtenerMunicipalidades();
    }

    async obtenerMunicipalidadPorId(id: number): Promise<Municipalidad | undefined> {
        if (id === undefined || id === null){
            throw new Error("Id no valido");
        }

        if (!Number.isInteger(id) || id <= 0){
            throw new Error("El id proporcionado no es valido");
        }

        return this.municipalidadRepository.obtenerMunicipalidadPorId(id);
    }

    async crearMunicipalidad(municipalidad: Municipalidad): Promise<Municipalidad> {
        if (!municipalidad.nombre || !municipalidad.direccion || !municipalidad.correo || municipalidad.telefono){
            throw new Error("Todos los campos son obligatorios");
        }

        if (!/^\d{8}$/.test(municipalidad.telefono)) {
            throw new Error("El número de teléfono debe tener 8 dígitos");
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(municipalidad.correo)) {
            throw new Error("Correo electrónico inválido");
        }

        return this.municipalidadRepository.crearMunicipalidad(municipalidad);
    }

    async actualizarMunicipalidad(id: number,municipalidad: Municipalidad): Promise<Municipalidad | undefined> {
        if (!municipalidad.nombre || !municipalidad.direccion || !municipalidad.correo || municipalidad.telefono){
            throw new Error("Todos los campos son obligatorios");
        }

        if (!/^\d{8}$/.test(municipalidad.telefono)) {
            throw new Error("El número de teléfono debe tener 8 dígitos");
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(municipalidad.correo)) {
            throw new Error("Correo electrónico inválido");
        }

        return this.municipalidadRepository.actualizarMunicipalidad(id,municipalidad);
    }

    async eliminarMunicipalidad(id: number): Promise<boolean> {
        if (id === undefined || id === null) {
            throw new Error("ID de usuario inválido");
        }
        if(!Number.isInteger(id) || id <= 0) {
            throw new Error("El id proporcionado no es válido.");
        }

        return this.municipalidadRepository.eliminarMunicipalidad(id);
    }
}