export interface CrearReporteDTO {
  textoCiudadano: string;
  direccion: string;
  zona?: string;
  referencia?: string;
  latitud: number;
  longitud: number;
  idUsuario: number;
}

export interface PuntoMapa {
  id_reporte: number;
  titulo: string;
  descripcion: string;
  latitud: number;
  longitud: number;
  direccion: string;
  zona: string;
  estado: string;
  prioridad: string;
}

export interface RespuestaReporte {
  mensaje: string;

  data: {
    idReporte: number;

    analisis: {
      titulo_corto: string;
      codigo_tipo: string;
      nivel_prioridad: string;
      justificacion: string;
    };
  };
}

export interface ReporteAdmin {
  id_reporte: number;
  titulo: string;
  descripcion: string;
  fecha_reporte: string | Date;
  usuario: string;
  tipo_incidencia: string;
  direccion: string;
  zona: string;
  latitud: number;
  longitud: number;
  estado: string;
  prioridad: string;
  ruta_fotografia?: string;
}

export interface Reporte {
  id_reporte: number;
  titulo: string;
  descripcion: string;
  fecha_reporte: string | Date;
  direccion: string;
  zona: string;
  latitud: number;
  longitud: number;
  estado: string;
  prioridad: string;
  tipo_incidencia: string;
  ruta_fotografia?: string;
  referencia?: string;
  id_usuario?: number;
}