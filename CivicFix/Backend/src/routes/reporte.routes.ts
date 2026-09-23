import { Router } from 'express';
import { 
  crearReporteHandler, 
  obtenerPuntosMapaHandler, 
  obtenerReportesHandler, // <--- 1. Importa el controlador para listar reportes
  obtenerMisReportesHandler,
  actualizarEstadoReporteHandler,
  obtenerMisAsignacionesHandler
} from '../controllers/reporte.controller';
import { verificarTokenUsuario, verificarTokenEmpleado } from '../middleware/auth.middleware';

const router = Router();

router.post('/reportes', crearReporteHandler);
router.get('/reportes', verificarTokenEmpleado, obtenerReportesHandler);
router.get('/reportes/mapa', obtenerPuntosMapaHandler);
router.get('/reportes/mis-reportes', verificarTokenUsuario, obtenerMisReportesHandler);
router.patch('/reportes/:id/estado', verificarTokenEmpleado, actualizarEstadoReporteHandler);
router.get('/reportes/mis-asignaciones', verificarTokenEmpleado, obtenerMisAsignacionesHandler);

export default router;