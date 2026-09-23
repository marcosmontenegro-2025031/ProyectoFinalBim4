import { pool } from "../config/db.js";
import { DepartamentoMunicipal } from "../models/departamentoMunicipal.model.js";

export class DepartamentoMunicipalRepository {
    async obtenerDepartamentos(): Promise<DepartamentoMunicipal[]> {
        const resultado = await pool.query<DepartamentoMunicipal>(
            "SELECT * FROM DepartamentoMunicipal ORDER BY id_departamento"
        );
        return resultado.rows;
    }

    async obtenerDepartamentosPorId(id: number): Promise<DepartamentoMunicipal | undefined> {
        const resultado = await pool.query<DepartamentoMunicipal>(
            "SELECT * FROM DepartamentoMunicipal WHERE id_departamento = $1",
            [id]
        );
        return resultado.rows[0];
    }

    async crearDepartamento(departamento: DepartamentoMunicipal): Promise<DepartamentoMunicipal> {
        const resultado = await pool.query<DepartamentoMunicipal>(
            `INSERT INTO DepartamentoMunicipal
                (nombre, descripcion, id_municipalidad)
             VALUES ($1, $2, $3)
             RETURNING *`,
            [departamento.nombre, departamento.descripcion, departamento.id_municipalidad]
        );
        return resultado.rows[0];
    }

    async actualizarDepartamento(
        id: number,
        departamento: DepartamentoMunicipal
    ): Promise<DepartamentoMunicipal | undefined> {
        const resultado = await pool.query<DepartamentoMunicipal>(
            `UPDATE DepartamentoMunicipal
             SET nombre = $1,
                 descripcion = $2,
                 id_municipalidad = $3
             WHERE id_departamento = $4
             RETURNING *`,
            [departamento.nombre, departamento.descripcion, departamento.id_municipalidad, id]
        );
        return resultado.rows[0];
    }

    async eliminarDepartamento(id: number): Promise<boolean> {
        const resultado = await pool.query(
            "DELETE FROM DepartamentoMunicipal WHERE id_departamento = $1",
            [id]
        );
        return (resultado.rowCount ?? 0) > 0;
    }
}
