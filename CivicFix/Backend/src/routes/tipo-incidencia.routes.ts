import { Router } from 'express';
import { listarTiposIncidenciaHandler } from '../controllers/tipo-incidencia.controller';

const router = Router();

router.get('/tipos-incidencia', listarTiposIncidenciaHandler);

export default router;