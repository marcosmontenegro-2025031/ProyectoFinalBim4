export interface Reporte {
    id_reporte?: number;
    titulo: string;
    descripcion: string;
    fecha_reporte?: Date;
    id_usuario: number;
    id_tipo_incidencia: number;
    id_ubicacion: number;
    id_estado: number;
    id_prioridad: number;
}

export interface CrearReporteDTO {
    textoCiudadano: string;
    direccion: string;
    zona?: string;
    referencia?: string;
    latitud: number;
    longitud: number;
    idUsuario: number;
}