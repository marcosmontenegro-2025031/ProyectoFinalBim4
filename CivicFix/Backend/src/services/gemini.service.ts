import { GoogleGenAI, Type } from "@google/genai";
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
            contents: `Analiza el siguiente reporte ciudadano sobre un problema urbano: "${textoCiudadano}"`,
            config: {
                systemInstruction: `Eres un clasificador automatizado para un sistema municipal de reportes urbanos. 
Analiza quejas urbanas y estructura la información según los siguientes criterios estrictos de prioridad:
- "CRITICA": Riesgo inminente para la vida o seguridad (ej. postes caídos, cables de alta tensión expuestos, fugas mayores de gas/agua, hundimientos grandes).
- "ALTA": Problemas severos que bloquean vialidades o representan un peligro importante (ej. baches gigantescos, semáforos totalmente inservibles).
- "MEDIA": Incidencias moderadas que afectan el servicio pero no ponen en riesgo inmediato la seguridad (ej. luminaria inoperativa, baches estándar).
- "BAJA": Desperfectos menores o estéticos que requieren atención a largo plazo.`,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        es_reporte_valido: {
                            type: Type.BOOLEAN,
                            description: "Indica si el texto describe una falla o problema urbano real."
                        },
                        codigo_tipo: {
                            type: Type.STRING,
                            enum: ["BACHE", "AGUA", "LUMINARIA"],
                            description: "Código de la categoría a la que pertenece el reporte."
                        },
                        codigo_prioridad: {
                            type: Type.STRING,
                            enum: ["BAJA", "MEDIA", "ALTA", "CRITICA"],
                            description: "Nivel de gravedad o urgencia detectado."
                        },
                        titulo_corto: {
                            type: Type.STRING,
                            description: "Título conciso para visualizar en mapas o listas."
                        },
                        descripcion_limpia: {
                            type: Type.STRING,
                            description: "Redacción formal y limpia de la incidencia reportada."
                        }
                    },
                    required: ["es_reporte_valido", "codigo_tipo", "codigo_prioridad", "titulo_corto", "descripcion_limpia"]
                }
            }
        });

        return JSON.parse(respuesta.text || "{}") as AnalisisGeminiResult;

    } catch (error: any) {
        if (error?.status === 503 && reintentos > 0) {
            console.warn(`⚠️ Gemini saturado (503). Reintentando (${reintentos} intentos restantes)...`);
            await new Promise(resolve => setTimeout(resolve, 2000));
            return analizarQueja(textoCiudadano, reintentos - 1);
        }
        throw error;
    }
};

