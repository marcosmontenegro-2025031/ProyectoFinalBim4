import { PoolClient } from 'pg';
import { pool } from '../config/db';
import { Ubicacion } from '../models/ubicacion.model';

export class UbicacionRepository {
    async crear(ubicacion: Omit<Ubicacion, 'id_ubicacion'>, client?: PoolClient): Promise<number> {
        const db = client || pool;
        const query = `
            INSERT INTO Ubicacion (direccion, zona, referencia, latitud, longitud)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id_ubicacion;
        `;
        const values = [
            ubicacion.direccion,
            ubicacion.zona || null,
            ubicacion.referencia || null,
            ubicacion.latitud,
            ubicacion.longitud
        ];

        const { rows } = await db.query(query, values);
        return rows[0].id_ubicacion;
    }

    async obtenerPorId(idUbicacion: number): Promise<Ubicacion | null> {
        const query = 'SELECT id_ubicacion, direccion, zona, referencia, latitud, longitud FROM Ubicacion WHERE id_ubicacion = $1';
        const { rows } = await pool.query(query, [idUbicacion]);
        return rows[0] || null;
    }
}