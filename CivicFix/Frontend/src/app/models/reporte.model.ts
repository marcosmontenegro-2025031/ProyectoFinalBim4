<<<<<<< HEAD
export interface CrearReporteDTO {
  titulo: string;
  descripcion: string;
  id_tipo_incidencia: number;
  id_usuario: number;
  latitud: number;
  longitud: number;
  direccion?: string;
=======
import { TipoIncidencia } from './tipo-incidencia.model';
import { Prioridad } from './prioridad.model';
import { Estado } from './estado.model';
import { Ubicacion } from './ubicacion.model';

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
>>>>>>> f4894cefaee6ff1f2f4c49035348117ec7f78596
}

export interface RespuestaReporte {
  mensaje: string;
<<<<<<< HEAD
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
=======
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
>>>>>>> f4894cefaee6ff1f2f4c49035348117ec7f78596
  direccion: string;
  zona: string;
  latitud: number;
  longitud: number;
<<<<<<< HEAD
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
=======
  estado: string;
  prioridad: string;
  ruta_fotografia?: string; 
>>>>>>> f4894cefaee6ff1f2f4c49035348117ec7f78596
}