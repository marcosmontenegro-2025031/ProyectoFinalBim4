import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import asignacionRoutes from '../routes/asignacion.routes.js';

dotenv.config();

export class Server {
    private app: Application;
    private port: number | string;

    constructor() {
        this.app = express();
        this.port = process.env.PORT || 3000;

        this.middlewares();
        this.routes();
    }

    private middlewares(): void {
        this.app.use(cors({
            origin: process.env.CLIENT_URL || 'http://localhost:4200',
            credentials: true
        }));

        this.app.use(express.json());

        this.app.use('/uploads', express.static('uploads'));
    }

    private routes(): void {
        this.app.use('/api/asignaciones', asignacionRoutes);
    }

    public listen(): void {
        const httpServer = this.app.listen(
            Number(this.port),
            '0.0.0.0',
            () => {
                console.log(
                    `Servidor ejecutándose en el puerto ${this.port}`
                );
            }
        );

        httpServer.on('error', (error: any) => {
            if (error.code === 'EADDRINUSE') {
                console.error(
                    `Error crítico: El puerto ${this.port} ya está en uso por otra aplicación.`
                );
            } else {
                console.error(
                    'Error en el servidor HTTP:',
                    error
                );
            }

            process.exit(1);
        });
    }
}