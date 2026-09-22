import { Router } from 'express';
import { 
  crearReporteHandler, 
  obtenerMisReportesHandler, 
  obtenerPuntosMapaHandler, 
  obtenerReportesHandler // <--- 1. Importa el controlador para listar reportes
} from '../controllers/reporte.controller';
import { verificarTokenUsuario } from '../middleware/auth.middleware';

const router = Router();

router.post('/reportes', crearReporteHandler);
router.get('/reportes', obtenerReportesHandler);    
router.get('/reportes/mapa', obtenerPuntosMapaHandler);
router.get(
    '/reportes/mis-reportes',
    verificarTokenUsuario,
    obtenerMisReportesHandler
);

export default router;

