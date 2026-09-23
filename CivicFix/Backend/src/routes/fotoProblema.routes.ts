import { Router } from "express";
import { registrarFotoProblema } from "../controllers/fotoProblema.controller.js";
import { FotoProblemaController } from "../controllers/fotoProblema.controller.js";
import { upload } from "../config/upload.middleware.js";

const router = Router();

const controller = new FotoProblemaController();

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
    upload.single("imagen"),
    registrarFotoProblema
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