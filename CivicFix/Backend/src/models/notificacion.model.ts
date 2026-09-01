export interface Notificacion {
    id_notificacion: number;
    fk_id_usuario: number;
    fk_id_reporte: number;
    titulo: string;
    mensaje: string;
    fecha_notificacion: Date;
    leida: boolean;
};

export type CrearNotificacionDTO = Omit<Notificacion, "id_notificacion" | "leida">;
export type ActualizarNotificacionDTO = Partial<Omit<Notificacion, "id_notificacion">>;