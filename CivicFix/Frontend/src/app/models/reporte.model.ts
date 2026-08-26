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
