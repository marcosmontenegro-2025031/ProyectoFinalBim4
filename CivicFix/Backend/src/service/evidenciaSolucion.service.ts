import { EvidenciaSolucionRepository } from "../repository/evidenciaSolucion.repository.js";
import { EvidenciaSolucion, CrearEvidenciaDTO, ActualizarEvidenciaDTO } from "../models/evidenciaSolucion.model.js";

export class EvidenciaSolucionService {

    private repository = new EvidenciaSolucionRepository();

    async listar(): Promise<EvidenciaSolucion[]> {
        return await this.repository.obtenerTodos();
    }


    async obtenerPorId(id: number): Promise<EvidenciaSolucion> {
        const evidencia = await this.repository.obtenerPorId(id);

        if (!evidencia) {
            throw new Error(`No se encontró la evidencia con id ${id}`);
        }

        return evidencia;
    }


    async obtenerPorReporte(idReporte: number): Promise<EvidenciaSolucion[]> {
        return await this.repository.obtenerPorReporte(idReporte);
    }


    async crear(datos: CrearEvidenciaDTO): Promise<EvidenciaSolucion> {

        if (!datos.fk_id_reporte || !datos.ruta_fotografia) {
            throw new Error("fk_id_reporte y ruta_fotografia son obligatorios");
        }

        const nuevaEvidencia: EvidenciaSolucion = {
            id_evidencia: 0,
            fk_id_reporte: datos.fk_id_reporte,
            ruta_fotografia: datos.ruta_fotografia,
            descripcion: datos.descripcion,
            fecha_subida: datos.fecha_subida ?? new Date()
        };

        return await this.repository.crear(nuevaEvidencia);
    }


    async actualizar(id: number, datos: ActualizarEvidenciaDTO): Promise<EvidenciaSolucion> {

        const evidenciaExistente = await this.repository.obtenerPorId(id);

        if (!evidenciaExistente) {
            throw new Error(`No se encontró la evidencia con id ${id}`);
        }

        const evidenciaActualizada: EvidenciaSolucion = {
            ...evidenciaExistente,
            ...datos
        };

        const resultado = await this.repository.actualizar(id, evidenciaActualizada);

        if (!resultado) {
            throw new Error(`No se pudo actualizar la evidencia con id ${id}`);
        }

        return resultado;
    }


    async eliminar(id: number): Promise<EvidenciaSolucion> {

        const evidenciaEliminada = await this.repository.eliminar(id);

        if (!evidenciaEliminada) {
            throw new Error(`No se encontró la evidencia con id ${id}`);
        }

        return evidenciaEliminada;
    }

}
