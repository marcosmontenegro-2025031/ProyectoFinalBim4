import { Router } from "express";
import { EvidenciaSolucionController } from "../controllers/evidenciaSolucion.controller";

const router = Router();

const controller = new EvidenciaSolucionController();

router.get(
    "/",
    controller.listar.bind(controller)
);

router.get(
    "/reporte/:idReporte",
    controller.obtenerPorReporte.bind(controller)
);

router.get(
    "/:id",
    controller.obtenerPorId.bind(controller)
);

router.post(
    "/",
    controller.crear.bind(controller)
);

router.put(
    "/:id",
    controller.actualizar.bind(controller)
);

router.delete(
    "/:id",
    controller.eliminar.bind(controller)
);

export default router;