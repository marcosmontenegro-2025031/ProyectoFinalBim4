import { pool } from "../config/db";
import { ServicioMunicipal } from "../models/servicioMunicipal.model";

export class SercicioMunicipalRepository{
    async obtenerServiciosMunicipales(): Promise<ServicioMunicipal[]>{
        const resultado = await pool.query("SELECT * FROM ServicioMunicipal");
        return resultado.rows;
    }

    async obtenerServicioMunicipalePorId(id: number): Promise<ServicioMunicipal | undefined>{
        const resultado = await pool.query("SELECT * FROM ServicioMunicipal WHERE id_servicio = $1",
            [id]
        );
        return resultado.rows[0] as ServicioMunicipal | undefined;
    }

    async crearServicioMunicipal(servicio: ServicioMunicipal): Promise<ServicioMunicipal>{
        const resultado = await pool.query("INSERT INTO (nombre,descripccion,id_departamento) VALUES ($1,$2,$3)",
            [servicio.nombre,servicio.descripcion,servicio.id_departamento]
        );
        return servicio;
    }

    async actualizarServicioMunicipal(id: number, servicio: ServicioMunicipal): Promise<ServicioMunicipal | undefined>{
        const resultado = await pool.query("UPDATE ServicioMunicipal SET nombre= $1, desccripcion= $2, id_departamento= $3 WHERE id_servicio = $4",
            [servicio.nombre,servicio.descripcion,servicio.id_departamento,id]
        );
        return (resultado.rowCount ?? 0) > 0 ? servicio : undefined;
    }

    async eliminarServicioMunicipal(id: number): Promise<boolean> {
        const resultado = await pool.query("DELETE FROM ServicioMunicipal WHERE id_servicio = $1",
            [id]
        );
        return (resultado.rowCount ?? 0) > 0;
    }
}