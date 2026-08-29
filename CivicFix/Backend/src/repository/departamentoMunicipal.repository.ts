import { pool } from "../config/db";
import { DepartamentoMunicipal } from "../models/departamentoMunicipal.model";

export class DepartamentoMunicipalRepository{
    async obtenerDepartamentos(): Promise<DepartamentoMunicipal[]>{
        const resultado = await pool.query("SELECT * FROM DepartamentoMunicipal");
        return resultado.rows;
    }

    async obtenerDepartamentosPorId(id: number): Promise<DepartamentoMunicipal | undefined>{
        const resultado = await pool.query("SELECT * FROM DepartamentoMunicipal WHERE id_departamento = $1",
            [id]
        );
        return resultado.rows[0] as DepartamentoMunicipal | undefined;
    }

    async crearDepartamento(departamento: DepartamentoMunicipal): Promise<DepartamentoMunicipal>{
        const resultado = await pool.query("INSERT INTO DepartamentoMunicipal (nombre,descripccion,id_municipalidad) VALUES ($1,$2,$3)",
            [departamento.nombre,departamento.descripcion,departamento.id_municipalidad]
        );
        return departamento;
    }

    async actualizarDepartamento(id: number, departamento: DepartamentoMunicipal): Promise<DepartamentoMunicipal | undefined>{
        const resusltado = await pool.query("UPDATE DepartamentoMunicipal SET nombre= $1, descripccion= $2, id_municipalidad= $3 WHERE id_departamento= $4",
            [departamento.nombre, departamento.descripcion,departamento.id_municipalidad,id]
        );
        return (resusltado.rowCount ?? 0) > 0 ? departamento : undefined;
    }

    async deleteMunicipalidad(id: number): Promise<boolean>{
        const resultado = await pool.query("DELETE FROM DepartamentoMunicipal WHERE id_departamento = $1",
            [id]
        );
        return (resultado.rowCount ?? 0) > 0;
    }
}