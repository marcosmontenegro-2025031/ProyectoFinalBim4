import { Router } from "express";
import { BitacoraCambioEstadoController } from "../controllers/bitacoraCambioEstado.controller.js";

const router = Router();

const controller = new BitacoraCambioEstadoController();

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