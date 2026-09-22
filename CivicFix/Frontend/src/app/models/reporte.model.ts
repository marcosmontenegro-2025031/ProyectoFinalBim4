export interface CrearReporteDTO {
  titulo: string;
  descripcion: string;
  id_tipo_incidencia: number;
  id_usuario: number;
  latitud: number;
  longitud: number;
  direccion?: string;
}

export interface RespuestaReporte {
  mensaje: string;
  id_reporte: number;
  prioridad?: string;
  estado?: string;
}

export interface PuntoMapa {
  id: number;
  titulo: string;
  tipo: string;
  prioridad: string;
  estado: string;
  fecha: string;
  direccion: string;
  zona: string;
  latitud: number;
  longitud: number;
}

export interface ReporteAdmin {
  id: number;
  titulo: string;
  descripcion: string;
  tipo: string;
  prioridad: string;
  estado: string;
  fecha: string;
  direccion: string;
  usuario: string;
  latitud?: number;
  longitud?: number;
}