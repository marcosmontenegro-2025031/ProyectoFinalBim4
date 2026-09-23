import { NotificacionRepository } from "../repository/notificacion.repository.js";
import { Notificacion, CrearNotificacionDTO, ActualizarNotificacionDTO } from "../models/notificacion.model.js";

export class NotificacionService {

    static async listar(): Promise<Notificacion[]> {
        return await NotificacionRepository.obtenerTodos();
    }


    static async obtenerPorId(id: number): Promise<Notificacion> {
        const notificacion = await NotificacionRepository.obtenerPorId(id);

        if (!notificacion) {
            throw new Error(`No se encontró la notificación con id ${id}`);
        }

        return notificacion;
    }


    static async obtenerPorUsuario(idUsuario: number): Promise<Notificacion[]> {
        return await NotificacionRepository.obtenerPorUsuario(idUsuario);
    }


    static async crear(datos: CrearNotificacionDTO): Promise<Notificacion> {

        if (!datos.fk_id_usuario || !datos.fk_id_reporte || !datos.titulo) {
            throw new Error("fk_id_usuario, fk_id_reporte y titulo son obligatorios");
        }

        const nuevaNotificacion: Notificacion = {
            id_notificacion: 0,
            fk_id_usuario: datos.fk_id_usuario,
            fk_id_reporte: datos.fk_id_reporte,
            titulo: datos.titulo,
            mensaje: datos.mensaje,
            fecha_notificacion: datos.fecha_notificacion ?? new Date(),
            leida: false
        };

        return await NotificacionRepository.crear(nuevaNotificacion);
    }


    static async actualizar(id: number, datos: ActualizarNotificacionDTO): Promise<Notificacion> {

        const notificacionExistente = await NotificacionRepository.obtenerPorId(id);

        if (!notificacionExistente) {
            throw new Error(`No se encontró la notificación con id ${id}`);
        }

        const notificacionActualizada: Notificacion = {
            ...notificacionExistente,
            ...datos
        };

        const resultado = await NotificacionRepository.actualizar(id, notificacionActualizada);

        if (!resultado) {
            throw new Error(`No se pudo actualizar la notificación con id ${id}`);
        }

        return resultado;
    }


    static async marcarComoLeida(id: number): Promise<Notificacion> {

        const resultado = await NotificacionRepository.marcarComoLeida(id);

        if (!resultado) {
            throw new Error(`No se encontró la notificación con id ${id}`);
        }

        return resultado;
    }


    static async eliminar(id: number): Promise<Notificacion> {

        const notificacionEliminada = await NotificacionRepository.eliminar(id);

        if (!notificacionEliminada) {
            throw new Error(`No se encontró la notificación con id ${id}`);
        }

        return notificacionEliminada;
    }

}
