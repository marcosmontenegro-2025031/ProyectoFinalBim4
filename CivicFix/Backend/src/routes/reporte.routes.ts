import { Router } from 'express';
import {
    crearReporteHandler,
    obtenerMisReportesHandler,
    obtenerPuntosMapaHandler,
    obtenerReportesHandler,
    actualizarEstadoHandler
} from '../controllers/reporte.controller';
import {
    verificarTokenUsuario,
    verificarTokenEmpleado
} from '../middleware/auth.middleware';

const router = Router();

router.post('/reportes', crearReporteHandler);
router.get('/reportes', verificarTokenEmpleado, obtenerReportesHandler);
router.patch('/reportes/:id/estado', verificarTokenEmpleado, actualizarEstadoHandler);
router.get('/reportes/mapa', obtenerPuntosMapaHandler);
router.get(
    '/reportes/mis-reportes',
    verificarTokenUsuario,
    obtenerMisReportesHandler
);

export default router;
