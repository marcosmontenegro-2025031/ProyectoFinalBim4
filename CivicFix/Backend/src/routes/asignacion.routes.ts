// routes/asignacion.routes.ts
import { Router } from "express";
import { AsignacionController } from "../controllers/asignacion.controller.js";

const router = Router();

router.get("/", AsignacionController.listar);
router.get("/:id", AsignacionController.obtenerPorId);
router.post("/", AsignacionController.crear);
router.put("/:id", AsignacionController.actualizar);
router.delete("/:id", AsignacionController.eliminar);

export default router;