export interface EvidenciaSolucion {
    id_evidencia?: number;
    fk_id_reporte: number;
    ruta_fotografia: string;
    descripcion?: string;
    fecha_subida?: string;
}
