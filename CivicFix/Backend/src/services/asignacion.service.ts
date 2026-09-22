import { AsignacionRepository } from "../repository/asignacion.repository.js";
import { Asignacion } from "../models/asignacion.model.js";

export class AsignacionService {

private repository = new AsignacionRepository();


async listar(): Promise<Asignacion[]> {

    return await this.repository.obtenerTodos();

}


async obtenerPorId(id: number): Promise<Asignacion> {

    const asignacion =
        await this.repository.obtenerPorId(id);

    if (!asignacion) {

        throw new Error(
            `No se encontró la asignación con id ${id}`
        );

    }

    return asignacion;

}


async crear(
    datos: Omit<Asignacion, "id_asignacion">
): Promise<Asignacion> {

    if (
        !datos.fk_id_reporte ||
        !datos.fk_id_empleado
    ) {

        throw new Error(
            "fk_id_reporte y fk_id_empleado son obligatorios"
        );

    }


    const nuevaAsignacion: Asignacion = {

        id_asignacion: 0,

        fk_id_reporte:
            datos.fk_id_reporte,

        fk_id_empleado:
            datos.fk_id_empleado,

        fecha_asignacion:
            datos.fecha_asignacion ?? new Date(),

        observacion:
            datos.observacion

    };


    return await this.repository.crear(
        nuevaAsignacion
    );

}


async actualizar(

    id: number,

    datos: Partial<
        Omit<Asignacion, "id_asignacion">
    >

): Promise<Asignacion> {


    const asignacionExistente =
        await this.repository.obtenerPorId(id);


    if (!asignacionExistente) {

        throw new Error(
            `No se encontró la asignación con id ${id}`
        );

    }


    const asignacionActualizada: Asignacion = {

        ...asignacionExistente,

        ...datos

    };


    const resultado =
        await this.repository.actualizar(
            id,
            asignacionActualizada
        );


    if (!resultado) {

        throw new Error(
            `No se pudo actualizar la asignación con id ${id}`
        );

    }


    return resultado;

}


async eliminar(id: number): Promise<Asignacion> {

    const asignacionEliminada =
        await this.repository.eliminar(id);


    if (!asignacionEliminada) {

        throw new Error(
            `No se encontró la asignación con id ${id}`
        );

    }


    return asignacionEliminada;

}

}