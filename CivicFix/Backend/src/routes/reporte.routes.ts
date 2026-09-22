import { Router } from 'express';
import { 
  crearReporteHandler, 
<<<<<<< HEAD
  obtenerPuntosMapaHandler, 
  obtenerReportesHandler // <--- 1. Importa el controlador para listar reportes
} from '../controllers/reporte.controller';
=======
  obtenerMisReportesHandler, 
  obtenerPuntosMapaHandler, 
  obtenerReportesHandler // <--- 1. Importa el controlador para listar reportes
} from '../controllers/reporte.controller';
import { verificarTokenUsuario, verificarTokenEmpleado } from '../middleware/auth.middleware';
>>>>>>> Develop

const router = Router();

router.post('/reportes', crearReporteHandler);
<<<<<<< HEAD
router.get('/reportes', obtenerReportesHandler);    
router.get('/reportes/mapa', obtenerPuntosMapaHandler);
=======
router.get('/reportes', verificarTokenEmpleado, obtenerReportesHandler);
router.get('/reportes/mapa', obtenerPuntosMapaHandler);
router.get(
    '/reportes/mis-reportes',
    verificarTokenUsuario,
    obtenerMisReportesHandler
);
>>>>>>> Develop

export default router;

