import { NotificacionRepository } from "../repository/notificacion.repository.js";
import { Notificacion, CrearNotificacionDTO, ActualizarNotificacionDTO } from "../models/notificacion.model.js";

export class NotificacionService {

    private repository = new NotificacionRepository();

    async listar(): Promise<Notificacion[]> {
        return await this.repository.obtenerTodos();
    }


    async obtenerPorId(id: number): Promise<Notificacion> {
        const notificacion = await this.repository.obtenerPorId(id);

        if (!notificacion) {
            throw new Error(`No se encontró la notificación con id ${id}`);
        }

        return notificacion;
    }


    async obtenerPorUsuario(idUsuario: number): Promise<Notificacion[]> {
        return await this.repository.obtenerPorUsuario(idUsuario);
    }


    async crear(datos: CrearNotificacionDTO): Promise<Notificacion> {

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

        return await this.repository.crear(nuevaNotificacion);
    }


    async actualizar(id: number, datos: ActualizarNotificacionDTO): Promise<Notificacion> {

        const notificacionExistente = await this.repository.obtenerPorId(id);

        if (!notificacionExistente) {
            throw new Error(`No se encontró la notificación con id ${id}`);
        }

        const notificacionActualizada: Notificacion = {
            ...notificacionExistente,
            ...datos
        };

        const resultado = await this.repository.actualizar(id, notificacionActualizada);

        if (!resultado) {
            throw new Error(`No se pudo actualizar la notificación con id ${id}`);
        }

        return resultado;
    }


    async marcarComoLeida(id: number): Promise<Notificacion> {

        const resultado = await this.repository.marcarComoLeida(id);

        if (!resultado) {
            throw new Error(`No se encontró la notificación con id ${id}`);
        }

        return resultado;
    }


    async eliminar(id: number): Promise<Notificacion> {

        const notificacionEliminada = await this.repository.eliminar(id);

        if (!notificacionEliminada) {
            throw new Error(`No se encontró la notificación con id ${id}`);
        }

        return notificacionEliminada;
    }

}
