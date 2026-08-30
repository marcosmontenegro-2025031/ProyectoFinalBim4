import { DepartamentoMunicipalRepository } from "../repository/departamentoMunicipal.repository";
import { DepartamentoMunicipal } from "../models/departamentoMunicipal.model";

export class DepartamentoMunicipalService{
    private departamentoRepository = new DepartamentoMunicipalRepository();

    async obtenerDepartamentos(): Promise<DepartamentoMunicipal[]> {
        return this.departamentoRepository.obtenerDepartamentos();
    }

    async obtenerDepartamentosPorId(id: number): Promise<DepartamentoMunicipal | undefined> {
        if (id === undefined || id === null) {
            throw new Error("ID de usuario inválido");
        }

        if(!Number.isInteger(id) || id <= 0) {
            throw new Error("El id proporcionado no es válido.");
        }

        return this.departamentoRepository.obtenerDepartamentosPorId(id);
    }

    async crearDepartamento(departamento: DepartamentoMunicipal): Promise<DepartamentoMunicipal> {
        if (!departamento.nombre || !departamento.descripcion || !departamento.id_municipalidad) {
            throw new Error("Todos los campos son obligatorios");
        }

        return this.departamentoRepository.crearDepartamento(departamento);
    }

    async actualizarDepartamento(id: number,departamento: DepartamentoMunicipal): Promise<DepartamentoMunicipal | undefined> {
        if (!departamento.nombre || !departamento.descripcion || !departamento.id_municipalidad) {
            throw new Error("Todos los campos son obligatorios");
        }

        if (id === undefined || id === null) {
            throw new Error("ID de usuario inválido");
        }
        if(!Number.isInteger(id) || id <= 0) {
            throw new Error("El id proporcionado no es válido.");
        }

        return this.departamentoRepository.actualizarDepartamento(id,departamento);
    }

    async eliminarDepartamento(id: number): Promise<boolean> {
        if (id === undefined || id === null) {
            throw new Error("ID de usuario inválido");
        }
        if(!Number.isInteger(id) || id <= 0) {
            throw new Error("El id proporcionado no es válido.");
        }

        return this.departamentoRepository.eliminarDepartamento(id);
    }
}