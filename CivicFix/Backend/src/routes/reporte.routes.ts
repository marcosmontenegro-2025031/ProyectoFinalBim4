import { Router } from 'express';
import { crearReporteHandler, obtenerPuntosMapaHandler } from '../controllers/reporte.controller';

const router = Router();

router.post('/reportes', crearReporteHandler);
router.get('/reportes/mapa', obtenerPuntosMapaHandler);

export default router;