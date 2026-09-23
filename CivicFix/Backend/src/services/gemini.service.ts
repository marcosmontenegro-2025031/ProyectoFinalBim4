import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config({
    path: ".env",
    override: true
});

const apiKey = process.env.GEMINI_API_KEY?.trim();

if (!apiKey) {
    throw new Error("GEMINI_API_KEY no está configurada en Backend/.env");
}

console.log(
    "GEMINI_API_KEY configurada:",
    true,
    "longitud:",
    apiKey.length
);

const ai = new GoogleGenAI({
    apiKey
});

export interface AnalisisGeminiResult {
    es_reporte_valido: boolean;
    codigo_tipo: string;
    codigo_prioridad: string;
    titulo_corto: string;
    descripcion_limpia: string;
}

const generarRespaldo = (
    textoCiudadano: string
): AnalisisGeminiResult => {

    const textoLower = textoCiudadano.toLowerCase();

    let tipoSugerido = "BACHE";

    if (
        textoLower.includes("agua") ||
        textoLower.includes("fuga") ||
        textoLower.includes("tubería") ||
        textoLower.includes("tuberia") ||
        textoLower.includes("alcantarillado") ||
        textoLower.includes("drenaje")
    ) {
        tipoSugerido = "AGUA";
    }

    if (
        textoLower.includes("luz") ||
        textoLower.includes("luminaria") ||
        textoLower.includes("poste") ||
        textoLower.includes("alumbrado") ||
        textoLower.includes("lámpara") ||
        textoLower.includes("lampara") ||
        textoLower.includes("oscuro") ||
        textoLower.includes("oscuridad")
    ) {
        tipoSugerido = "LUMINARIA";
    }

    let prioridad = "MEDIA";

    if (
        textoLower.includes("peligro") ||
        textoLower.includes("accidente") ||
        textoLower.includes("riesgo") ||
        textoLower.includes("emergencia")
    ) {
        prioridad = "ALTA";
    }

    return {
        es_reporte_valido: true,
        codigo_tipo: tipoSugerido,
        codigo_prioridad: prioridad,
        titulo_corto:
            textoCiudadano.length > 50
                ? textoCiudadano.substring(0, 47) + "..."
                : textoCiudadano,
        descripcion_limpia: textoCiudadano.trim()
    };
};

export const analizarQueja = async (
    textoCiudadano: string,
    reintentos = 3
): Promise<AnalisisGeminiResult> => {

    const textoLimpio = textoCiudadano?.trim();

    if (!textoLimpio || textoLimpio.length < 5) {
        return {
            es_reporte_valido: false,
            codigo_tipo: "BACHE",
            codigo_prioridad: "BAJA",
            titulo_corto: "Reporte incompleto",
            descripcion_limpia:
                "Debe ingresar una descripción del problema urbano."
        };
    }

    for (let intento = 1; intento <= reintentos; intento++) {

        try {

            const respuesta = await ai.models.generateContent({
                model: "gemini-3.5-flash-lite",
                contents: `
Analiza el siguiente reporte ciudadano:

"${textoLimpio}"
                `,
                config: {
                    systemInstruction: `
Eres un sistema de inteligencia artificial para clasificar reportes ciudadanos de problemas urbanos.

Tu trabajo es identificar si el ciudadano está reportando un problema que pueda ser atendido por una municipalidad.

Los reportes pueden ser cortos, informales, tener errores ortográficos o no incluir todos los detalles.

IMPORTANTE:

Un reporte NO debe ser rechazado simplemente porque sea corto, informal o porque no indique una dirección exacta.

Si el ciudadano menciona claramente un problema urbano, debes considerarlo válido.

Ejemplos de reportes VÁLIDOS:

"Hay un bache en mi calle"

"Hay muchos baches"

"Hay una fuga de agua"

"Se está saliendo el agua de una tubería"

"No funciona la luminaria"

"La calle está oscura"

"Hay un poste que no tiene luz"

"El pavimento está dañado"

"Hay un agujero grande en la calle"

"Hay problemas con el alcantarillado"

"Hay una fuga frente a mi casa"

Si el reporte describe un problema urbano pero faltan detalles, debes marcarlo como válido y utilizar la información disponible.

Solo debes marcar es_reporte_valido como false cuando el texto NO describe ningún problema urbano.

Ejemplos de textos NO válidos:

"Hola"

"Buenos días"

"Necesito ayuda"

"Quiero hacer una pregunta"

"Prueba"

"No sé"

El sistema solamente trabaja con estas categorías:

BACHE:
- Baches
- Agujeros
- Calles dañadas
- Pavimento dañado
- Asfalto deteriorado

AGUA:
- Fugas de agua
- Tuberías dañadas
- Problemas de agua
- Alcantarillado
- Drenajes
- Agua desbordada

LUMINARIA:
- Luminarias dañadas
- Lámparas apagadas
- Postes sin iluminación
- Alumbrado público
- Calles oscuras por falta de iluminación

Si el problema urbano es válido pero no encaja perfectamente en una categoría, selecciona la categoría más cercana.

La prioridad debe determinarse según la gravedad:

BAJA:
Problema menor sin riesgo evidente.

MEDIA:
Problema que afecta el uso normal de la vía o servicio.

ALTA:
Problema que puede generar accidentes, daños importantes o afecta a varias personas.

CRITICA:
Situación urbana extremadamente peligrosa o de emergencia.

No inventes información que el ciudadano no proporcionó.

titulo_corto:
Debe ser breve y describir el problema.

descripcion_limpia:
Debe conservar la información proporcionada por el ciudadano y redactarla de forma clara y formal.

Devuelve ÚNICAMENTE JSON válido.

La estructura obligatoria es:

{
    "es_reporte_valido": true,
    "codigo_tipo": "BACHE",
    "codigo_prioridad": "MEDIA",
    "titulo_corto": "Bache en la calle",
    "descripcion_limpia": "Se reporta un bache en la calle."
}

No agregues markdown.
No agregues explicaciones.
No agregues texto fuera del JSON.
                    `,
                    responseMimeType: "application/json"
                }
            });

            const textoRespuesta = respuesta.text?.trim();

            if (!textoRespuesta) {
                throw new Error("Gemini devolvió una respuesta vacía");
            }

            const resultado = JSON.parse(
                textoRespuesta
            ) as AnalisisGeminiResult;

            if (
                typeof resultado.es_reporte_valido !== "boolean" ||
                !resultado.codigo_tipo ||
                !resultado.codigo_prioridad ||
                !resultado.titulo_corto ||
                !resultado.descripcion_limpia
            ) {
                throw new Error(
                    "Gemini devolvió una estructura JSON incompleta"
                );
            }

            const tiposValidos = [
                "BACHE",
                "AGUA",
                "LUMINARIA"
            ];

            const prioridadesValidas = [
                "BAJA",
                "MEDIA",
                "ALTA",
                "CRITICA"
            ];

            if (!tiposValidos.includes(resultado.codigo_tipo)) {
                resultado.codigo_tipo = "BACHE";
            }

            if (!prioridadesValidas.includes(resultado.codigo_prioridad)) {
                resultado.codigo_prioridad = "MEDIA";
            }

            return resultado;

        } catch (error: any) {

            const mensajeError = JSON.stringify(error);

            const esApiKeyInvalida =
                mensajeError.includes("API_KEY_INVALID") ||
                mensajeError.includes("API key not valid");

            if (esApiKeyInvalida) {

                console.error(
                    "La API key de Gemini no es válida. Se utilizará el análisis de respaldo."
                );

                return generarRespaldo(textoLimpio);
            }

            const esAgotamientoCuota =
                mensajeError.includes("RESOURCE_EXHAUSTED") ||
                mensajeError.includes("quota") ||
                mensajeError.includes("429");

            if (esAgotamientoCuota) {

                console.warn(
                    `Cuota de Gemini agotada. Intento ${intento}/${reintentos}`
                );

                if (intento === reintentos) {

                    console.warn(
                        "Se alcanzó el máximo de reintentos. Usando análisis de respaldo."
                    );

                    return generarRespaldo(textoLimpio);
                }

                await new Promise(resolve =>
                    setTimeout(resolve, 1000 * intento)
                );

                continue;
            }

            console.error(
                `Error en Gemini. Intento ${intento}/${reintentos}:`,
                error
            );

            if (intento === reintentos) {
                return generarRespaldo(textoLimpio);
            }

            await new Promise(resolve =>
                setTimeout(resolve, 1000 * intento)
            );
        }
    }

    return generarRespaldo(textoLimpio);
};