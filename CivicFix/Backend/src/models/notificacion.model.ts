
export interface Notificacion {
  id_notificacion: number;
  id_usuario: number;
  id_reporte: number;
  titulo: string;
  mensaje: string;
  fecha_notificacion: Date;
  leida: boolean;
}