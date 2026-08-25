export interface Asignacion {
    id_asignacion: number;
    fk_id_reporte: number;
    fk_id_empleado: number;
    fecha_asignacion: Date;
    observacion: string;
};