import { Router } from 'express';
import { registrarFotoProblema } from '../controllers/fotoProblema.controller';
import { upload } from '../config/upload.middleware';

const router = Router();

router.post('/', upload.single('imagen'), registrarFotoProblema);

export default router;