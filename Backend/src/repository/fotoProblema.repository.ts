import { pool } from '../config/db';
import { FotoProblema } from '../models/fotoProblema.model';

export class FotoProblemaRepository {
    async crear(foto: FotoProblema): Promise<FotoProblema> {
        const query = `
            INSERT INTO FotografiaProblema (id_reporte, ruta_fotografia, descripcion) 
            VALUES ($1, $2, $3) 
            RETURNING id_fotografia, id_reporte, ruta_fotografia, descripcion, fecha_subida;
        `;
        
        const values = [foto.id_reporte, foto.ruta_fotografia, foto.descripcion || 'Evidencia de problema urbano'];

        const result = await pool.query(query, values);
        
        return result.rows[0]; 
    }
}

