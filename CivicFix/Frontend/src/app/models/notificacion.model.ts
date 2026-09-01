export interface Notificacion {
    id_notificacion?: number;
    fk_id_usuario: number;
    fk_id_reporte: number;
    titulo: string;
    mensaje: string;
    fecha_notificacion?: string;
    leida?: boolean;
}
