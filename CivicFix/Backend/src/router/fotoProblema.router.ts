import { Router } from "express";
import { FotoProblemaController } from "../controllers/fotoProblema.controller.js";

const router = Router();

router.get("/", FotoProblemaController.listar);
router.get("/reporte/:idReporte", FotoProblemaController.obtenerPorReporte);
router.get("/:id", FotoProblemaController.obtenerPorId);
router.post("/", FotoProblemaController.crear);
router.put("/:id", FotoProblemaController.actualizar);
router.delete("/:id", FotoProblemaController.eliminar);

export default router;
