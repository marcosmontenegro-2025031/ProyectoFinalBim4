import { FotoProblemaRepository } from "../repository/fotoProblema.repository.js";
import { FotografiaProblema, CrearFotografiaDTO, ActualizarFotografiaDTO } from "../models/fotoProblema.model.js";

export class FotoProblemaService {

    private repository = new FotoProblemaRepository();

    async listar(): Promise<FotografiaProblema[]> {
        return await this.repository.obtenerTodos();
    }


    async obtenerPorId(id: number): Promise<FotografiaProblema> {
        const foto = await this.repository.obtenerPorId(id);

        if (!foto) {
            throw new Error(`No se encontró la fotografía con id ${id}`);
        }

        return foto;
    }


    async obtenerPorReporte(idReporte: number): Promise<FotografiaProblema[]> {
        return await this.repository.obtenerPorReporte(idReporte);
    }


    async crear(datos: CrearFotografiaDTO): Promise<FotografiaProblema> {

        if (!datos.fk_id_reporte || !datos.ruta_fotografia) {
            throw new Error("fk_id_reporte y ruta_fotografia son obligatorios");
        }

        const nuevaFoto: FotografiaProblema = {
            id_fotografia: 0,
            fk_id_reporte: datos.fk_id_reporte,
            ruta_fotografia: datos.ruta_fotografia,
            descripcion: datos.descripcion,
            fecha_subida: datos.fecha_subida ?? new Date()
        };

        return await this.repository.crear(nuevaFoto);
    }


    async actualizar(id: number, datos: ActualizarFotografiaDTO): Promise<FotografiaProblema> {

        const fotoExistente = await this.repository.obtenerPorId(id);

        if (!fotoExistente) {
            throw new Error(`No se encontró la fotografía con id ${id}`);
        }

        const fotoActualizada: FotografiaProblema = {
            ...fotoExistente,
            ...datos
        };

        const resultado = await this.repository.actualizar(id, fotoActualizada);

        if (!resultado) {
            throw new Error(`No se pudo actualizar la fotografía con id ${id}`);
        }

        return resultado;
    }


    async eliminar(id: number): Promise<FotografiaProblema> {

        const fotoEliminada = await this.repository.eliminar(id);

        if (!fotoEliminada) {
            throw new Error(`No se encontró la fotografía con id ${id}`);
        }

        return fotoEliminada;
    }

}
