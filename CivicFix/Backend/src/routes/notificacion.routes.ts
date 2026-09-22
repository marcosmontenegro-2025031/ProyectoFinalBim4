import { Router } from 'express';
import {
    obtenerNotificacionesHandler,
    obtenerNotificacionHandler,
    marcarComoLeidaHandler,
    marcarTodasComoLeidasHandler,
    eliminarNotificacionHandler
} from '../controllers/notificacion.controller';

const router = Router();

router.get('/notificaciones', obtenerNotificacionesHandler);

router.get('/notificaciones/:id', obtenerNotificacionHandler);

router.patch(
    '/notificaciones/:id/leida',
    marcarComoLeidaHandler
);

router.patch(
    '/notificaciones/marcar-todas-leidas',
    marcarTodasComoLeidasHandler
);

router.delete(
    '/notificaciones/:id',
    eliminarNotificacionHandler
);

export default router;