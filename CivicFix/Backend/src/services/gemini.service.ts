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

export const analizarQueja = async (textoCiudadano: string): Promise<AnalisisGeminiResult> => {
    const respuesta = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Analiza el siguiente reporte ciudadano sobre un problema urbano: "${textoCiudadano}"`,
        config: {
            systemInstruction: "Eres un clasificador automatizado para un sistema municipal. Analiza quejas urbanas, filtra contenido inapropiado o incoherente y estructura la información.",
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
};