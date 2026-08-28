import { pool } from "../config/db.js";
import { Asignacion } from "../models/asignacion.model.js";

export class AsignacionRepository {

    static async obtenerTodos(): Promise<Asignacion[]> {
        const resultado = await pool.query(`
            SELECT
                id_asignacion,
                id_reporte AS fk_id_reporte,
                id_empleado AS fk_id_empleado,
                fecha_asignacion,
                observacion
            FROM Asignacion
            ORDER BY id_asignacion
        `);

        return resultado.rows;
    }


    static async obtenerPorId(id: number): Promise<Asignacion | null> {
        const resultado = await pool.query(
            `SELECT
                id_asignacion,
                id_reporte AS fk_id_reporte,
                id_empleado AS fk_id_empleado,
                fecha_asignacion,
                observacion
            FROM Asignacion
            WHERE id_asignacion = $1`,
            [id]
        );

        if (resultado.rows.length === 0) {
            return null;
        }

        return resultado.rows[0];
    }


    static async crear(asignacion: Asignacion): Promise<Asignacion> {
        const resultado = await pool.query(
            `INSERT INTO Asignacion
                (id_reporte, id_empleado, fecha_asignacion, observacion)
            VALUES ($1, $2, $3, $4)
            RETURNING
                id_asignacion,
                id_reporte AS fk_id_reporte,
                id_empleado AS fk_id_empleado,
                fecha_asignacion,
                observacion`,
            [
                asignacion.fk_id_reporte,
                asignacion.fk_id_empleado,
                asignacion.fecha_asignacion,
                asignacion.observacion
            ]
        );

        return resultado.rows[0];
    }


    static async actualizar(id: number, asignacion: Asignacion): Promise<Asignacion | null> {
        const resultado = await pool.query(
            `UPDATE Asignacion
            SET
                id_reporte = $1,
                id_empleado = $2,
                fecha_asignacion = $3,
                observacion = $4
            WHERE id_asignacion = $5
            RETURNING
                id_asignacion,
                id_reporte AS fk_id_reporte,
                id_empleado AS fk_id_empleado,
                fecha_asignacion,
                observacion`,
            [
                asignacion.fk_id_reporte,
                asignacion.fk_id_empleado,
                asignacion.fecha_asignacion,
                asignacion.observacion,
                id
            ]
        );

        if (resultado.rows.length === 0) {
            return null;
        }

        return resultado.rows[0];
    }


    static async eliminar(id: number): Promise<Asignacion | null> {
        const resultado = await pool.query(
            `DELETE FROM Asignacion
            WHERE id_asignacion = $1
            RETURNING
                id_asignacion,
                id_reporte AS fk_id_reporte,
                id_empleado AS fk_id_empleado,
                fecha_asignacion,
                observacion`,
            [id]
        );

        if (resultado.rows.length === 0) {
            return null;
        }

        return resultado.rows[0];
    }

}