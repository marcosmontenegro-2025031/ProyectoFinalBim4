import { Router } from 'express';
import { AsignacionController } from '../controllers/asignacion.controller.js';

const router = Router();

const controller = new AsignacionController();

router.get('/', (req, res) => {
    controller.listar(req, res);
});

router.get('/:id', (req, res) => {
    controller.obtenerPorId(req, res);
});

router.post('/', (req, res) => {
    controller.crear(req, res);
});

router.put('/:id', (req, res) => {
    controller.actualizar(req, res);
});

router.delete('/:id', (req, res) => {
    controller.eliminar(req, res);
});

export default router;