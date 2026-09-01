export interface BitacoraCambioEstado {
    id_bitacora: number;
    fk_id_reporte: number;
    fk_id_estado_anterior: number | null;
    fk_id_estado_nuevo: number;
    fk_id_empleado: number | null;
    comentario: string;
    fecha_cambio: Date;
};

export type CrearBitacoraDTO = Omit<BitacoraCambioEstado, "id_bitacora">;
export type ActualizarBitacoraDTO = Partial<CrearBitacoraDTO>;