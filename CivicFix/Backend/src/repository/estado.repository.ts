import { pool } from '../config/db';
import { Estado } from '../models/estado.model';

export class EstadoRepository {
    async obtenerTodos(): Promise<Estado[]> {
        const query = 'SELECT id_estado, nombre FROM Estado';
        const { rows } = await pool.query(query);
        return rows;
    }

    async obtenerPorNombre(nombre: string): Promise<Estado | null> {
        const query = 'SELECT id_estado, nombre FROM Estado WHERE UPPER(nombre) = UPPER($1)';
        const { rows } = await pool.query(query, [nombre]);
        return rows[0] || null;
    }
}