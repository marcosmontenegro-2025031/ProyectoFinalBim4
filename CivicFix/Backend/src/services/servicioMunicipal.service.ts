import { SercicioMunicipalRepository } from "../repository/servicioMunicipal.repository";
import { ServicioMunicipal } from "../models/servicioMunicipal.model";

export class ServicioMunicpalService {
    private servicioRepository = new SercicioMunicipalRepository();

    async obtenerServiciosMunicipales(): Promise<ServicioMunicipal[]> {
        return this.servicioRepository.obtenerServiciosMunicipales();
    }

    async obtenerServicioMunicipalPorId(id: number): Promise<ServicioMunicipal | undefined> {
        if (id === undefined || id === null) {
            throw new Error("ID de usuario inválido");
        }

        if(!Number.isInteger(id) || id <= 0) {
            throw new Error("El id proporcionado no es válido.");
        }

        return this.servicioRepository.obtenerServicioMunicipalePorId(id);
    }

    async crearServicioMunicipal(servicio: ServicioMunicipal): Promise<ServicioMunicipal> {
        if (!servicio.nombre || !servicio.descripcion || !servicio.id_departamento) {
            throw new Error("Todos los campos son obligatorios");
        }

        return this.servicioRepository.crearServicioMunicipal(servicio);
    }

    async actualizarServicioMunicipal(id: number, servicio: ServicioMunicipal): Promise<ServicioMunicipal | undefined> {
        if (!servicio.nombre || !servicio.descripcion || !servicio.id_departamento) {
            throw new Error("Todos los campos son obligatorios");
        }

        if (id === undefined || id === null) {
            throw new Error("ID de usuario inválido");
        }

        if(!Number.isInteger(id) || id <= 0) {
            throw new Error("El id proporcionado no es válido.");
        }

        return this.servicioRepository.actualizarServicioMunicipal(id,servicio);
    }

    async eliminarServicioMunicipal(id: number): Promise<boolean> {
        if (id === undefined || id === null) {
            throw new Error("ID de usuario inválido");
        }

        if(!Number.isInteger(id) || id <= 0) {
            throw new Error("El id proporcionado no es válido.");
        }

        return this.servicioRepository.eliminarServicioMunicipal(id);
    }
}