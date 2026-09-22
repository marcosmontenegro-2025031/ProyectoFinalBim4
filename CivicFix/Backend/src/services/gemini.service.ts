import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface AnalisisGeminiResult {
    es_reporte_valido: boolean;
    codigo_tipo: string;
    codigo_prioridad: string;
    titulo_corto: string;
    descripcion_limpia: string;
}

export const analizarQueja = async (textoCiudadano: string, reintentos = 3): Promise<AnalisisGeminiResult> => {
    try {
        const respuesta = await ai.models.generateContent({
            model: 'gemini-3.6-flash',
            contents: `Analiza este reporte ciudadano sobre un problema urbano: "${textoCiudadano}"`,
            config: {
                systemInstruction: `Eres un clasificador automatizado para un sistema municipal de reportes urbanos. Devuelve ÚNICAMENTE un objeto JSON válido con esta estructura:
{
  "es_reporte_valido": boolean,
  "codigo_tipo": "BACHE" | "AGUA" | "LUMINARIA",
  "codigo_prioridad": "BAJA" | "MEDIA" | "ALTA" | "CRITICA",
  "titulo_corto": "string muy corto",
  "descripcion_limpia": "string formal"
}`,
                responseMimeType: "application/json" 
            }
        });

        return JSON.parse(respuesta.text || "{}") as AnalisisGeminiResult;

    } catch (error: any) {
        const mensajeError = JSON.stringify(error);
        const esAgotamientoCuota = 
            error?.code === 429 || 
            error?.status === 'RESOURCE_EXHAUSTED' || 
            mensajeError.includes('quota') || 
            mensajeError.includes('429');

        if (esAgotamientoCuota) {
            console.warn('Límite de cuota de Gemini alcanzado (429). Usando modo de respaldo automático para continuar las pruebas...');
            
            let tipoSugerido = "BACHE";
            const textoLower = textoCiudadano.toLowerCase();
            if (textoLower.includes('agua')  || textoLower.includes('fuga')) tipoSugerido = "AGUA";
            if (textoLower.includes('luz') || textoLower.includes('luminaria') || textoLower.includes('poste')) tipoSugerido = "LUMINARIA";

            return {
                es_reporte_valido: true,
                codigo_tipo: tipoSugerido,
                codigo_prioridad: "MEDIA",
                titulo_corto: textoCiudadano.length > 30 ? textoCiudadano.substring(0, 27) + '...' : textoCiudadano,
                descripcion_limpia: textoCiudadano
            };
        }

        console.error('Error crítico en Gemini:', error);
        throw error;
    }
};