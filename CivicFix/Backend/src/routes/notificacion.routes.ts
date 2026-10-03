import { Router } from 'express';
import {
  obtenerNotificacionesHandler,
  obtenerNotificacionHandler,
  marcarComoLeidaHandler,
  marcarComoNoLeidaHandler,
  marcarTodasComoLeidasHandler,
  eliminarNotificacionHandler
} from '../controllers/notificacion.controller';
import { verificarTokenUsuario } from '../middleware/auth.middleware';

const router = Router();
router.use('/notificaciones', verificarTokenUsuario);

router.get('/notificaciones', obtenerNotificacionesHandler);

router.get('/notificaciones/:id', obtenerNotificacionHandler);

router.patch('/notificaciones/:id/leida', marcarComoLeidaHandler);

router.patch('/notificaciones/:id/no-leida', marcarComoNoLeidaHandler);

router.patch(
  '/notificaciones/marcar-todas-leidas',
  marcarTodasComoLeidasHandler
);

router.delete('/notificaciones/:id', eliminarNotificacionHandler);

export default router;