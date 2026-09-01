export interface BitacoraCambioEstado {
    id_bitacora?: number;
    fk_id_reporte: number;
    fk_id_estado_anterior?: number;
    fk_id_estado_nuevo: number;
    fk_id_empleado?: number;
    comentario?: string;
    fecha_cambio?: string;
}
