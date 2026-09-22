import { pool } from '../config/db';
import { Prioridad } from '../models/prioridad.model';

export class PrioridadRepository {
    async obtenerTodas(): Promise<Prioridad[]> {
        const query = 'SELECT id_prioridad, nombre, codigo_ia FROM Prioridad';
        const { rows } = await pool.query(query);
        return rows;
    }

    async obtenerPorCodigoIa(codigoIa: string): Promise<Prioridad | null> {
        const query = 'SELECT id_prioridad, nombre, codigo_ia FROM Prioridad WHERE codigo_ia = $1';
        const { rows } = await pool.query(query, [codigoIa]);
        return rows[0] || null;
    }
}