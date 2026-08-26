export interface FotografiaProblema {
    id_fotografia: number;
    fk_id_reporte: number;
    ruta_fotografia: string;
    descripcion: string;
    fecha_subida: Date;
};