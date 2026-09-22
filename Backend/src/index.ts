import { Server } from './api/server';
const server = new Server();
server.listen();

process.on('uncaughtException', (error) => {
    console.error('EXCEPCIÓN NO CAPTURADA:', error);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('PROMESA RECHAZADA NO MANEJADA:', promise, 'razón:', reason);
});

