import { Router } from "express";
import { EvidenciaSolucionController } from "../controllers/evidenciaSolucion.controller.js";

const router = Router();

router.get("/", EvidenciaSolucionController.listar);
router.get("/reporte/:idReporte", EvidenciaSolucionController.obtenerPorReporte);
router.get("/:id", EvidenciaSolucionController.obtenerPorId);
router.post("/", EvidenciaSolucionController.crear);
router.put("/:id", EvidenciaSolucionController.actualizar);
router.delete("/:id", EvidenciaSolucionController.eliminar);

export default router;
