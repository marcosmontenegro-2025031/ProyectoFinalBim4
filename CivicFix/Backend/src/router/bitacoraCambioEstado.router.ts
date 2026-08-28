import { Router } from "express";
import { BitacoraCambioEstadoController } from "../controllers/bitacoraCambioEstado.controller.js";

const router = Router();

router.get("/", BitacoraCambioEstadoController.listar);
router.get("/reporte/:idReporte", BitacoraCambioEstadoController.obtenerPorReporte);
router.get("/:id", BitacoraCambioEstadoController.obtenerPorId);
router.post("/", BitacoraCambioEstadoController.crear);
router.put("/:id", BitacoraCambioEstadoController.actualizar);
router.delete("/:id", BitacoraCambioEstadoController.eliminar);

export default router;
