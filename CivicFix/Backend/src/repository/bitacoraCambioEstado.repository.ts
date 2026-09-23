import { pool } from '../config/db.js';
import { BitacoraCambioEstado } from '../models/bitacoraCambioEstado.model.js';

const columnas = `id_bitacora, id_reporte AS fk_id_reporte,
  id_estado_anterior AS fk_id_estado_anterior,
  id_estado_nuevo AS fk_id_estado_nuevo,
  id_empleado AS fk_id_empleado, comentario, fecha_cambio`;
export class BitacoraCambioEstadoRepository {
  static async obtenerTodos(): Promise<BitacoraCambioEstado[]> {
    return (await pool.query(`SELECT ${columnas} FROM BitacoraCambioEstado ORDER BY fecha_cambio DESC`)).rows;
  }
  static async obtenerPorId(id: number): Promise<BitacoraCambioEstado | null> {
    return (await pool.query(`SELECT ${columnas} FROM BitacoraCambioEstado WHERE id_bitacora=$1`, [id])).rows[0] ?? null;
  }
  static async obtenerPorReporte(idReporte: number): Promise<BitacoraCambioEstado[]> {
    return (await pool.query(`SELECT ${columnas} FROM BitacoraCambioEstado WHERE id_reporte=$1 ORDER BY fecha_cambio DESC`, [idReporte])).rows;
  }
  static async crear(bitacora: BitacoraCambioEstado): Promise<BitacoraCambioEstado> {
    const {rows} = await pool.query(`INSERT INTO BitacoraCambioEstado
      (id_reporte,id_estado_anterior,id_estado_nuevo,id_empleado,comentario)
      VALUES ($1,$2,$3,$4,$5) RETURNING ${columnas}`,
      [bitacora.fk_id_reporte, bitacora.fk_id_estado_anterior, bitacora.fk_id_estado_nuevo,
       bitacora.fk_id_empleado, bitacora.comentario]);
    return rows[0];
  }
  static async actualizar(id: number, bitacora: BitacoraCambioEstado): Promise<BitacoraCambioEstado | null> {
    const {rows} = await pool.query(`UPDATE BitacoraCambioEstado SET comentario=$1 WHERE id_bitacora=$2
      RETURNING ${columnas}`, [bitacora.comentario, id]);
    return rows[0] ?? null;
  }
  static async eliminar(id: number): Promise<BitacoraCambioEstado | null> {
    return (await pool.query(`DELETE FROM BitacoraCambioEstado WHERE id_bitacora=$1 RETURNING ${columnas}`, [id])).rows[0] ?? null;
  }
}
