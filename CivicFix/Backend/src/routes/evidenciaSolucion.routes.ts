import { Router } from "express";
<<<<<<< HEAD
import { EvidenciaSolucionController } from "../controllers/evidenciaSolucion.controller.js";

const router = Router();

router.get("/", EvidenciaSolucionController.listar);
router.get("/reporte/:idReporte", EvidenciaSolucionController.obtenerPorReporte);
router.get("/:id", EvidenciaSolucionController.obtenerPorId);
router.post("/", EvidenciaSolucionController.crear);
router.put("/:id", EvidenciaSolucionController.actualizar);
router.delete("/:id", EvidenciaSolucionController.eliminar);

export default router;
=======
import cors from "cors";
import { EvidenciaSolucionController } from "../controllers/evidenciaSolucion.controller.js";

export const evidenciaSolucionRouter = Router();

evidenciaSolucionRouter.get("/api/evidencia", cors(), (req, res) => {
    const controller = new EvidenciaSolucionController();
    controller.listar(req, res);
});

evidenciaSolucionRouter.get("/api/evidencia/reporte/:idReporte", cors(), (req, res) => {
    const controller = new EvidenciaSolucionController();
    controller.obtenerPorReporte(req, res);
});

evidenciaSolucionRouter.get("/api/evidencia/:id", cors(), (req, res) => {
    const controller = new EvidenciaSolucionController();
    controller.obtenerPorId(req, res);
});

evidenciaSolucionRouter.post("/api/evidencia", cors(), (req, res) => {
    const controller = new EvidenciaSolucionController();
    controller.crear(req, res);
});

evidenciaSolucionRouter.put("/api/evidencia/:id", cors(), (req, res) => {
    const controller = new EvidenciaSolucionController();
    controller.actualizar(req, res);
});

evidenciaSolucionRouter.delete("/api/evidencia/:id", cors(), (req, res) => {
    const controller = new EvidenciaSolucionController();
    controller.eliminar(req, res);
});
>>>>>>> Develop
