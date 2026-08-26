import { Router } from 'express';
import { obtenerUbicacionPorIdHandler } from '../controllers/ubicacion.controller';

const router = Router();

router.get('/ubicaciones/:id', obtenerUbicacionPorIdHandler);

export default router;