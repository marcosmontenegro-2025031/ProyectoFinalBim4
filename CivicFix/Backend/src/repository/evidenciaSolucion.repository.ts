import { pool } from '../config/db.js';
import { EvidenciaSolucion } from '../models/evidenciaSolucion.model.js';
const cols = `id_evidencia, id_reporte AS fk_id_reporte, ruta_fotografia, descripcion, fecha_subida`;
export class EvidenciaSolucionRepository {
  static async obtenerTodos(): Promise<EvidenciaSolucion[]> {
    return (await pool.query(`SELECT ${cols} FROM EvidenciaSolucion ORDER BY fecha_subida DESC`)).rows;
  }
  static async obtenerPorEmpleado(idEmpleado: number): Promise<EvidenciaSolucion[]> {
    return (await pool.query(`SELECT ${cols} FROM EvidenciaSolucion e
      WHERE EXISTS (SELECT 1 FROM Asignacion a WHERE a.id_reporte=e.id_reporte AND a.id_empleado=$1)
      ORDER BY e.fecha_subida DESC`,[idEmpleado])).rows;
  }
  static async obtenerPorId(id: number): Promise<EvidenciaSolucion | null> {
    return (await pool.query(`SELECT ${cols} FROM EvidenciaSolucion WHERE id_evidencia=$1`,[id])).rows[0]??null;
  }
  static async obtenerPorReporte(idReporte: number): Promise<EvidenciaSolucion[]> {
    return (await pool.query(`SELECT ${cols} FROM EvidenciaSolucion WHERE id_reporte=$1 ORDER BY fecha_subida DESC`,[idReporte])).rows;
  }
  static async crear(e: EvidenciaSolucion): Promise<EvidenciaSolucion> {
    const {rows} = await pool.query(`INSERT INTO EvidenciaSolucion(id_reporte,ruta_fotografia,descripcion)
      VALUES($1,$2,$3) RETURNING ${cols}`,[e.fk_id_reporte,e.ruta_fotografia,e.descripcion]);
    return rows[0];
  }
  static async actualizar(id: number,e: EvidenciaSolucion): Promise<EvidenciaSolucion | null> {
    return (await pool.query(`UPDATE EvidenciaSolucion SET ruta_fotografia=$1, descripcion=$2
      WHERE id_evidencia=$3 RETURNING ${cols}`,[e.ruta_fotografia,e.descripcion,id])).rows[0]??null;
  }
  static async eliminar(id: number): Promise<EvidenciaSolucion | null> {
    return (await pool.query(`DELETE FROM EvidenciaSolucion WHERE id_evidencia=$1 RETURNING ${cols}`,[id])).rows[0]??null;
  }
}
