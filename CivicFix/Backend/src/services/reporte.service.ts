import { analizarQueja, AnalisisGeminiResult } from './gemini.service';
import { ReporteRepository } from '../repository/reporte.repository';
import { UbicacionService } from './ubicacion.service';
import { CrearReporteDTO } from '../models/reporte.model';

export interface RespuestaProcesamientoReporte {
    esValido: boolean;
    mensaje?: string;
    id_reporte?: number;
    fecha_reporte?: Date;
    data?: {
        idReporte: number;
        analisis: {
            titulo_corto: string;
            codigo_tipo: string;
            nivel_prioridad: string;
            justificacion: string;
        };
    };
    analisis: AnalisisGeminiResult;
}

export class ReporteService {
    private reporteRepo = new ReporteRepository();
    private ubicacionService = new UbicacionService();

    async obtenerTodosLosReportes() {
        return await this.reporteRepo.obtenerTodosLosReportes();
    }

    async registrarReporteCiudadano(dto: CrearReporteDTO): Promise<RespuestaProcesamientoReporte> {
        if (!this.ubicacionService.validarCoordenadas(dto.latitud, dto.longitud)) {
            throw new Error('Las coordenadas geográficas (latitud/longitud) ingresadas no son válidas.');
        }

        const analisis = await analizarQueja(dto.textoCiudadano);

        if (!analisis.es_reporte_valido) {
            return {
                esValido: false,
                mensaje: "El reporte no es válido",
                analisis
            };
        }

        const resultado = await this.reporteRepo.crearReporteConTransaccion({
            ubicacion: {
                direccion: dto.direccion,
                zona: dto.zona,
                referencia: dto.referencia,
                latitud: dto.latitud,
                longitud: dto.longitud
            },
            titulo: analisis.titulo_corto,
            descripcion: analisis.descripcion_limpia,
            idUsuario: dto.idUsuario,
            codigoTipo: analisis.codigo_tipo,
            codigoPrioridad: analisis.codigo_prioridad
        });

        return {
            esValido: true,
            mensaje: "Reporte registrado con éxito",
            id_reporte: resultado.id_reporte,
            fecha_reporte: resultado.fecha_reporte,
            data: {
                idReporte: resultado.id_reporte,
                analisis: {
                    titulo_corto: analisis.titulo_corto,
                    codigo_tipo: analisis.codigo_tipo,
                    nivel_prioridad: analisis.codigo_prioridad,
                    justificacion: analisis.descripcion_limpia
                }
            },
            analisis
        };
    }

    async obtenerPuntosParaMapa() {
        return await this.reporteRepo.obtenerReportesParaMapa();
    }
}