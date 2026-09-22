<<<<<<< HEAD
import { Server } from './api/server';
const server = new Server();
server.listen();

process.on('uncaughtException', (error) => {
    console.error('EXCEPCIÓN NO CAPTURADA:', error);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('PROMESA RECHAZADA NO MANEJADA:', promise, 'razón:', reason);
});

=======
import express from "express";
import cors from "cors";
import { asignacionRouter } from "./routes/asignacion.routes";
import { bitacoraCambioEstadoRouter } from "./routes/bitacoraCambioEstado.routes";
import { evidenciaSolucionRouter } from "./routes/evidenciaSolucion.routes";
import { fotoProblemaRouter } from "./routes/fotoProblema.routes";
import { notificacionRouter } from "./routes/notificacion.routes";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use(asignacionRouter);
app.use(bitacoraCambioEstadoRouter);
app.use(evidenciaSolucionRouter);
app.use(fotoProblemaRouter);
app.use(notificacionRouter);

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
>>>>>>> Develop
