import { Router } from 'express';
import { obtenerTodasLasUbicacionesHandler, obtenerUbicacionPorIdHandler } from '../controllers/ubicacion.controller';

const router = Router();

router.get('/ubicaciones', obtenerTodasLasUbicacionesHandler);
router.get('/ubicaciones/:id', obtenerUbicacionPorIdHandler);

export default router;