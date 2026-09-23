export interface Notificacion {
  id_notificacion: number;
  titulo: string;
  mensaje: string;
  tipo: string;
  fecha_creacion: string | Date;
  leida: boolean;
  id_reporte?: number;
}