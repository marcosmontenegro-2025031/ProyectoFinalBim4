import { Router } from 'express';
import { listarPrioridadesHandler } from '../controllers/prioridad.controller';

const router = Router();

router.get('/prioridades', listarPrioridadesHandler);

export default router;