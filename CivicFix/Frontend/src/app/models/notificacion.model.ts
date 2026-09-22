export interface Notificacion {
  id_notificacion: number;
  titulo: string;
  mensaje: string;
  tipo?: string;
  fecha_notificacion: string | Date;
  leida: boolean;
  fk_id_reporte?: number;
}