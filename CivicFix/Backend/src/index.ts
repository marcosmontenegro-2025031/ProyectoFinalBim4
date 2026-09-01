import { Server } from './api/server'; // 👈 Ruta relativa exacta desde src/index.ts

const server = new Server();
server.listen();

// Capturas de seguridad para ver cualquier detalle si ocurre algo
process.on('uncaughtException', (error) => {
    console.error('🔥 EXCEPCIÓN NO CAPTURADA:', error);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('🔥 PROMESA RECHAZADA NO MANEJADA:', promise, 'razón:', reason);
});