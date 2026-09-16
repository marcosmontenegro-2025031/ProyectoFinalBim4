import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export interface AnalisisGeminiResult {
    es_reporte_valido: boolean;
    codigo_tipo: string;
    codigo_prioridad: string;
    titulo_corto: string;
    descripcion_limpia: string;
}


const MODEL = process.env.GEMINI_MODEL || "gemini-3.5-flash-lite";
const MIN_INTERVAL_MS = Number(process.env.GEMINI_MIN_INTERVAL_MS || 5000);
const CACHE_TTL_MS = Number(process.env.GEMINI_CACHE_TTL_MS || 10 * 60 * 1000);
const MAX_TEXT_LENGTH = Number(process.env.GEMINI_MAX_TEXT_LENGTH || 1000);
const COOLDOWN_AFTER_429_MS = Number(process.env.GEMINI_COOLDOWN_MS || 60000);

let ultimaSolicitudGemini = 0;
let geminiBloqueadoHasta = 0;
const cache = new Map<string, { expiresAt: number; resultado: AnalisisGeminiResult }>();
const solicitudesEnCurso = new Map<string, Promise<AnalisisGeminiResult>>();
let colaGemini: Promise<void> = Promise.resolve();

const esperar = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));

function normalizarTexto(texto: string): string {
    return texto.trim().replace(/\s+/g, " ").toLowerCase();
}

function clasificacionLocal(textoCiudadano: string): AnalisisGeminiResult {
    const texto = normalizarTexto(textoCiudadano);

    let codigoTipo = "BACHE";
    if (/\b(agua|fuga|tuber[ií]a|alcantarillado|drenaje)\b/.test(texto)) {
        codigoTipo = "AGUA";
    } else if (/\b(luz|luminaria|poste|alumbrado|l[aá]mpara)\b/.test(texto)) {
        codigoTipo = "LUMINARIA";
    }

    let codigoPrioridad = "MEDIA";
    if (/\b(emergencia|peligro|accidente|inundaci[oó]n|incendio|riesgo)\b/.test(texto)) {
        codigoPrioridad = "CRITICA";
    } else if (/\b(urgente|grave|grande|peligroso|bloquea|bloqueado)\b/.test(texto)) {
        codigoPrioridad = "ALTA";
    } else if (/\b(peque[nñ]o|leve|menor)\b/.test(texto)) {
        codigoPrioridad = "BAJA";
    }

    const titulo = textoCiudadano.trim().replace(/\s+/g, " ");

    return {
        es_reporte_valido: true,
        codigo_tipo: codigoTipo,
        codigo_prioridad: codigoPrioridad,
        titulo_corto: titulo.length > 60 ? `${titulo.substring(0, 57)}...` : titulo,
        descripcion_limpia: textoCiudadano.trim()
    };
}

function esAgotamientoCuota(error: any): boolean {
    const mensajeError = JSON.stringify(error || "").toLowerCase();
    return error?.code === 429 ||
        error?.status === 429 ||
        error?.status === "RESOURCE_EXHAUSTED" ||
        mensajeError.includes("resource_exhausted") ||
        mensajeError.includes("quota") ||
        mensajeError.includes("rate limit") ||
        mensajeError.includes("429");
}

async function ejecutarConControlDeCarga<T>(trabajo: () => Promise<T>): Promise<T> {
    const anterior = colaGemini;
    let liberar!: () => void;
    colaGemini = new Promise<void>(resolve => { liberar = resolve; });

    await anterior;
    try {
        const transcurrido = Date.now() - ultimaSolicitudGemini;
        if (transcurrido < MIN_INTERVAL_MS && ultimaSolicitudGemini > 0) {
            await esperar(MIN_INTERVAL_MS - transcurrido);
        }

        ultimaSolicitudGemini = Date.now();
        return await trabajo();
    } finally {
        liberar();
    }
}

export const analizarQueja = async (textoCiudadano: string): Promise<AnalisisGeminiResult> => {
    const textoOriginal = String(textoCiudadano || "").trim();
    const texto = textoOriginal.substring(0, MAX_TEXT_LENGTH);
    const clave = normalizarTexto(texto);

    if (!clave) {
        return clasificacionLocal(textoOriginal);
    }

    const ahora = Date.now();
    const entradaCache = cache.get(clave);
    if (entradaCache && entradaCache.expiresAt > ahora) {
        return entradaCache.resultado;
    }
    if (entradaCache) cache.delete(clave);

    const solicitudExistente = solicitudesEnCurso.get(clave);
    if (solicitudExistente) return solicitudExistente;

    const solicitud = ejecutarAnalisis(texto, clave);
    solicitudesEnCurso.set(clave, solicitud);

    try {
        return await solicitud;
    } finally {
        solicitudesEnCurso.delete(clave);
    }
};

async function ejecutarAnalisis(textoCiudadano: string, clave: string): Promise<AnalisisGeminiResult> {
    if (Date.now() < geminiBloqueadoHasta) {
        return clasificacionLocal(textoCiudadano);
    }

    if (!ai || !apiKey || process.env.GEMINI_ENABLED === "false") {
        console.warn("Gemini desactivado o sin API key. Se utiliza clasificación local.");
        return clasificacionLocal(textoCiudadano);
    }

    try {
        const respuesta = await ejecutarConControlDeCarga(() => ai.models.generateContent({
            model: MODEL,
            contents: textoCiudadano,
            config: {
                systemInstruction: `Clasifica un reporte urbano. Responde SOLO JSON válido:
{"es_reporte_valido":boolean,"codigo_tipo":"BACHE"|"AGUA"|"LUMINARIA","codigo_prioridad":"BAJA"|"MEDIA"|"ALTA"|"CRITICA","titulo_corto":"string corto","descripcion_limpia":"string formal"}`,
                responseMimeType: "application/json"
            }
        }));

        const resultado = JSON.parse(respuesta.text || "{}") as AnalisisGeminiResult;
        cache.set(clave, { expiresAt: Date.now() + CACHE_TTL_MS, resultado });
        return resultado;
    } catch (error: any) {
        if (esAgotamientoCuota(error)) {
            geminiBloqueadoHasta = Date.now() + COOLDOWN_AFTER_429_MS;
            console.warn(`Gemini alcanzó su límite de frecuencia/cuota. Se pausa Gemini durante ${COOLDOWN_AFTER_429_MS / 1000}s y se utiliza el clasificador local.`);
            return clasificacionLocal(textoCiudadano);
        }

        console.error("Error en Gemini. Se utiliza clasificación local como protección:", error?.message || error);
        return clasificacionLocal(textoCiudadano);
    }
}
