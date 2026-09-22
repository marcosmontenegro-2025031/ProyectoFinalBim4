import { Server } from './api/server';

const server = new Server();

server.listen();

process.on('uncaughtException', (error) => {
    console.error('EXCEPCIÓN NO CAPTURADA:', error);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('PROMESA RECHAZADA NO MANEJADA:', promise, 'razón:', reason);
<<<<<<< HEAD
});
=======
});
>>>>>>> d415eb1296741435254f3888415e9765aa112a68
