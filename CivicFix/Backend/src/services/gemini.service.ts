import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const analizarQueja = async (textoCiudadano: string) => {
    const respuesta = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Analiza el siguiente reporte ciudadano sobre un problema urbano: "${textoCiudadano}"`,
        config: {
            systemInstruction: "Eres un clasificador automatizado para un sistema municipal. Analiza quejas urbanas, filtra contenido inapropiado y estructura la información.",
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    es_reporte_valido: {
                        type: Type.BOOLEAN,
                        description: "Indica si el mensaje describe una falla urbana real o si es spam, insultos o texto sin sentido."
                    },
                    codigo_tipo: {
                        type: Type.STRING,
                        enum: ["BACHE", "AGUA", "LUMINARIA"],
                        description: "Categoría principal de la incidencia reportada."
                    },
                    codigo_prioridad: {
                        type: Type.STRING,
                        enum: ["BAJA", "MEDIA", "ALTA", "CRITICA"],
                        description: "Nivel de urgencia evaluado según la gravedad de la falla."
                    },
                    titulo_corto: {
                        type: Type.STRING,
                        description: "Título formal y breve para mostrar en listas y mapas."
                    },
                    descripcion_limpia: {
                        type: Type.STRING,
                        description: "Resumen claro y educado del problema reportado, apto para ser leído por personal municipal y por el ciudadano."
                    }
                },
                required: ["es_reporte_valido", "codigo_tipo", "codigo_prioridad", "titulo_corto", "descripcion_limpia"]
            }
        }
    });

    return JSON.parse(respuesta.text || "{}");
};