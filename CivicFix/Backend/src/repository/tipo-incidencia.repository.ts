import { pool } from '../config/db';
import { TipoIncidencia } from '../models/tipo-incidencia.model';

export class TipoIncidenciaRepository {
    async obtenerTodos(): Promise<TipoIncidencia[]> {
        const query = 'SELECT id_tipo_incidencia, nombre, codigo_ia FROM TipoIncidencia ORDER BY nombre ASC';
        const { rows } = await pool.query(query);
        return rows;
    }

    async obtenerPorCodigoIa(codigoIa: string): Promise<TipoIncidencia | null> {
        const query = 'SELECT id_tipo_incidencia, nombre, codigo_ia FROM TipoIncidencia WHERE codigo_ia = $1';
        const { rows } = await pool.query(query, [codigoIa]);
        return rows[0] || null;
    }
}