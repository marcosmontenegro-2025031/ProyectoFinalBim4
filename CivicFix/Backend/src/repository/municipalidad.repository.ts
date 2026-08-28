import { pool } from "../config/db";
import { Municipalidad } from "../models/municipalidad.model";

export class MunicipalidadRepository {
    async obtenerMunicipalidades(): Promise<Municipalidad[]> {
        const resultado = await pool.query("SELECT * FROM Municipalidad");
        return resultado.rows;
    }

    async obtenerMunicipalidadPorId(id: number): Promise<Municipalidad | undefined> {
        const resultado = await pool.query("SELECT * FROM Municipalidad WHERE id_municipalidad = $1", [id]);
        return resultado.rows[0] as Municipalidad | undefined;
    }

    async crearMunicipalidad(municipalidad: Municipalidad): Promise<Municipalidad> {
        const resultado = await pool.query("INSERT INTO Municipalidad (nombre, direccion,telefono,correo) VALUES ($1,$2,$3,$4)",
            [municipalidad.nombre, municipalidad.direccion, municipalidad.telefono, municipalidad.correo]
        );
        return municipalidad;
    }

    async actualizarMunicipalidad(id: number, municipalidad: Municipalidad): Promise<Municipalidad | undefined> {
        const resultado = await pool.query("UPDATE Municipalidad SET nombre=$1, direccion=$2, telefono=$3, correo=$4 WHERE id_municipalidad=$5",
            [municipalidad.nombre, municipalidad.direccion, municipalidad.telefono, municipalidad.correo, id]
        );
        return (resultado.rowCount ?? 0) > 0 ? municipalidad : undefined;
    }

    async eliminarMunicipalidad(id: number): Promise<boolean> {
        const resultado = await pool.query("DELETE FROM Municipalidad WHERE id_municipalidad=$1", [id]);
        return (resultado.rowCount ?? 0) > 0;
    }
}