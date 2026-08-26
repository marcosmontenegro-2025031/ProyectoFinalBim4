import { Router } from 'express';
import { listarEstadosHandler } from '../controllers/estado.controller';

const router = Router();

router.get('/estados', listarEstadosHandler);

export default router;