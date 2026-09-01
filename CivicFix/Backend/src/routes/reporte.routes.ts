import { Router } from 'express';
import { 
  crearReporteHandler, 
  obtenerPuntosMapaHandler, 
  obtenerReportesHandler // <--- 1. Importa el controlador para listar reportes
} from '../controllers/reporte.controller';

const router = Router();

router.post('/reportes', crearReporteHandler);
router.get('/reportes', obtenerReportesHandler);    
router.get('/reportes/mapa', obtenerPuntosMapaHandler);

export default router;

