import { Router } from "express";
import { NotificacionController } from "../controllers/notificacion.controller.js";

const router = Router();

router.get("/", NotificacionController.listar);
router.get("/usuario/:idUsuario", NotificacionController.obtenerPorUsuario);
router.get("/:id", NotificacionController.obtenerPorId);
router.post("/", NotificacionController.crear);
router.put("/:id", NotificacionController.actualizar);
router.patch("/:id/leida", NotificacionController.marcarComoLeida);
router.delete("/:id", NotificacionController.eliminar);

export default router;
