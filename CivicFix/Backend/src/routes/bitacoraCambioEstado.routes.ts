import { Router } from "express";
import { BitacoraCambioEstadoController } from "../controllers/bitacoraCambioEstado.controller.js";

import { verificarTokenEmpleado, verificarAdministrador } from "../middleware/auth.middleware";

const router = Router();

router.get("/", verificarTokenEmpleado, BitacoraCambioEstadoController.listar);
router.get("/reporte/:idReporte", verificarTokenEmpleado, BitacoraCambioEstadoController.obtenerPorReporte);
router.get("/:id", verificarTokenEmpleado, BitacoraCambioEstadoController.obtenerPorId);
router.post("/", verificarAdministrador, BitacoraCambioEstadoController.crear);
router.put("/:id", verificarAdministrador, BitacoraCambioEstadoController.actualizar);
router.delete("/:id", verificarAdministrador, BitacoraCambioEstadoController.eliminar);

export default router;
