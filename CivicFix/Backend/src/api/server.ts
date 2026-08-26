import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import tipoIncidenciaRoutes from '../routes/tipo-incidencia.routes';
import prioridadRoutes from '../routes/prioridad.routes';
import estadoRoutes from '../routes/estado.routes';
import ubicacionRoutes from '../routes/ubicacion.routes';
import reporteRoutes from '../routes/reporte.routes';

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
    }

    private routes(): void {
        this.app.use('/api', tipoIncidenciaRoutes);
        this.app.use('/api', prioridadRoutes);
        this.app.use('/api', estadoRoutes);
        this.app.use('/api', ubicacionRoutes);
        this.app.use('/api', reporteRoutes);
    }

    public listen(): void {
        this.app.listen(this.port, () => {
            console.log(`Servidor ejecutándose en el puerto ${this.port}`);
        });
    }
}