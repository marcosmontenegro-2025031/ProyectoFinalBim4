import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import tipoIncidenciaRoutes from '../routes/tipo-incidencia.routes';
import prioridadRoutes from '../routes/prioridad.routes';
import estadoRoutes from '../routes/estado.routes';
import ubicacionRoutes from '../routes/ubicacion.routes';
import reporteRoutes from '../routes/reporte.routes';
import fotoProblemaRoutes from '../routes/fotoProblema.routes';
import notificacionRoutes from '../routes/notificacion.routes';
import evidenciaSolucionRoutes from '../routes/evidenciaSolucion.routes';
import bitacoraCambioEstadoRoutes from '../routes/bitacoraCambioEstado.routes';
import asignacionRoutes from '../routes/asignacion.routes';
import { authRouter } from '../routes/auth.routes';
import { servicioRouter } from '../routes/servicioMunicipal.routes';
import { empleadoRouter } from '../routes/empleadoMunicipal.routes';
import { municipalidadRouter } from '../routes/municipalidad.routes';
import { departamentoRouter } from '../routes/departamentoMunicipal.routes';
import { usuariosRouter } from '../routes/usuarios.routes';
import { adminRouter } from '../routes/admin.routes';


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

        this.app.get("/", (_req, res) => {
            res.status(200).json({ mensaje: "API CivicFix funcionando" });
        });

        this.app.use('/uploads', express.static('uploads'));
    }

    private routes(): void {
        this.app.use('/api', tipoIncidenciaRoutes);
        this.app.use('/api', prioridadRoutes);
        this.app.use('/api', estadoRoutes);
        this.app.use('/api', ubicacionRoutes);
        this.app.use('/api', reporteRoutes);
        this.app.use('/api/fotos', fotoProblemaRoutes);
        this.app.use('/api', notificacionRoutes);
        this.app.use('/api/evidencia', evidenciaSolucionRoutes);
        this.app.use('/api/bitacora', bitacoraCambioEstadoRoutes);
        this.app.use('/api/asignaciones', asignacionRoutes);

        // Estos routers ya incluyen el prefijo /api en cada ruta interna,
        // por lo que se montan en la raíz para no duplicarlo (/api/api/...).
        this.app.use(authRouter);
        this.app.use(servicioRouter);
        this.app.use(empleadoRouter);
        this.app.use(municipalidadRouter);
        this.app.use(departamentoRouter);
        this.app.use(usuariosRouter);
        this.app.use(adminRouter);
    }

    public listen(): void {
        const httpServer = this.app.listen(Number(this.port), '0.0.0.0', () => {
            console.log(`Servidor ejecutándose en el puerto ${this.port}`);
        });

        httpServer.on('error', (error: any) => {
            if (error.code === 'EADDRINUSE') {
                console.error(`Error crítico: El puerto ${this.port} ya está en uso por otra aplicación.`);
            } else {
                console.error('Error en el servidor HTTP:', error);
            }
            process.exit(1);
        });
    }
}

