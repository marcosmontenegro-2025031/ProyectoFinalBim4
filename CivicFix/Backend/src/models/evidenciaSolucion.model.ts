export interface EvidenciaSolucion {
    id_evidencia: number;
    fk_id_reporte: number;
    ruta_fotografia: string;
    descripcion: string;
    fecha_subida: Date;
};

export type CrearEvidenciaDTO = Omit<EvidenciaSolucion, "id_evidencia">;
export type ActualizarEvidenciaDTO = Partial<CrearEvidenciaDTO>;