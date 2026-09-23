import { pool } from "../config/db.js";
import { ServicioMunicipal } from "../models/servicioMunicipal.model.js";

export class SercicioMunicipalRepository {
    async obtenerServiciosMunicipales(): Promise<ServicioMunicipal[]> {
        const resultado = await pool.query<ServicioMunicipal>(
            "SELECT * FROM ServicioMunicipal ORDER BY id_servicio"
        );
        return resultado.rows;
    }

    async obtenerServicioMunicipalePorId(id: number): Promise<ServicioMunicipal | undefined> {
        const resultado = await pool.query<ServicioMunicipal>(
            "SELECT * FROM ServicioMunicipal WHERE id_servicio = $1",
            [id]
        );
        return resultado.rows[0];
    }

    async crearServicioMunicipal(servicio: ServicioMunicipal): Promise<ServicioMunicipal> {
        const resultado = await pool.query<ServicioMunicipal>(
            `INSERT INTO ServicioMunicipal
                (nombre, descripcion, id_departamento)
             VALUES ($1, $2, $3)
             RETURNING *`,
            [servicio.nombre, servicio.descripcion, servicio.id_departamento]
        );
        return resultado.rows[0];
    }

    async actualizarServicioMunicipal(
        id: number,
        servicio: ServicioMunicipal
    ): Promise<ServicioMunicipal | undefined> {
        const resultado = await pool.query<ServicioMunicipal>(
            `UPDATE ServicioMunicipal
             SET nombre = $1,
                 descripcion = $2,
                 id_departamento = $3
             WHERE id_servicio = $4
             RETURNING *`,
            [servicio.nombre, servicio.descripcion, servicio.id_departamento, id]
        );
        return resultado.rows[0];
    }

    async eliminarServicioMunicipal(id: number): Promise<boolean> {
        const resultado = await pool.query(
            "DELETE FROM ServicioMunicipal WHERE id_servicio = $1",
            [id]
        );
        return (resultado.rowCount ?? 0) > 0;
    }
}
