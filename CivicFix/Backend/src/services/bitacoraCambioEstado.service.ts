import { BitacoraCambioEstadoRepository } from "../repository/bitacoraCambioEstado.repository.js";
import { BitacoraCambioEstado, CrearBitacoraDTO, ActualizarBitacoraDTO } from "../models/bitacoraCambioEstado.model.js";

export class BitacoraCambioEstadoService {

    static async listar(): Promise<BitacoraCambioEstado[]> {
        return await BitacoraCambioEstadoRepository.obtenerTodos();
    }


    static async obtenerPorId(id: number): Promise<BitacoraCambioEstado> {
        const bitacora = await BitacoraCambioEstadoRepository.obtenerPorId(id);

        if (!bitacora) {
            throw new Error(`No se encontró el registro de bitácora con id ${id}`);
        }

        return bitacora;
    }


    static async obtenerPorReporte(idReporte: number): Promise<BitacoraCambioEstado[]> {
        return await BitacoraCambioEstadoRepository.obtenerPorReporte(idReporte);
    }


    static async crear(datos: CrearBitacoraDTO): Promise<BitacoraCambioEstado> {

        if (!datos.fk_id_reporte || !datos.fk_id_estado_nuevo) {
            throw new Error("fk_id_reporte y fk_id_estado_nuevo son obligatorios");
        }

        const nuevaBitacora: BitacoraCambioEstado = {
            id_bitacora: 0,
            fk_id_reporte: datos.fk_id_reporte,
            fk_id_estado_anterior: datos.fk_id_estado_anterior ?? null,
            fk_id_estado_nuevo: datos.fk_id_estado_nuevo,
            fk_id_empleado: datos.fk_id_empleado ?? null,
            comentario: datos.comentario,
            fecha_cambio: datos.fecha_cambio ?? new Date()
        };

        return await BitacoraCambioEstadoRepository.crear(nuevaBitacora);
    }


    static async actualizar(id: number, datos: ActualizarBitacoraDTO): Promise<BitacoraCambioEstado> {

        const bitacoraExistente = await BitacoraCambioEstadoRepository.obtenerPorId(id);

        if (!bitacoraExistente) {
            throw new Error(`No se encontró el registro de bitácora con id ${id}`);
        }

        const bitacoraActualizada: BitacoraCambioEstado = {
            ...bitacoraExistente,
            ...datos
        };

        const resultado = await BitacoraCambioEstadoRepository.actualizar(id, bitacoraActualizada);

        if (!resultado) {
            throw new Error(`No se pudo actualizar la bitácora con id ${id}`);
        }

        return resultado;
    }


    static async eliminar(id: number): Promise<BitacoraCambioEstado> {

        const bitacoraEliminada = await BitacoraCambioEstadoRepository.eliminar(id);

        if (!bitacoraEliminada) {
            throw new Error(`No se encontró el registro de bitácora con id ${id}`);
        }

        return bitacoraEliminada;
    }

}
