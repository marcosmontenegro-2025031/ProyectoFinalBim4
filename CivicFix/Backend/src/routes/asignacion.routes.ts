// routes/asignacion.routes.ts
import { Router } from "express";
import { AsignacionController } from "../controllers/asignacion.controller.js";

import { verificarTokenEmpleado, verificarAdministrador } from "../middleware/auth.middleware";

const router = Router();

router.get("/", verificarTokenEmpleado, AsignacionController.listar);
router.get("/:id", verificarTokenEmpleado, AsignacionController.obtenerPorId);
router.post("/", verificarAdministrador, AsignacionController.crear);
router.put("/:id", verificarAdministrador, AsignacionController.actualizar);
router.delete("/:id", verificarAdministrador, AsignacionController.eliminar);

export default router;