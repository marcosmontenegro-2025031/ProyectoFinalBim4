import { Router } from "express";
import { AsignacionController } from "../controllers/asignacion.controller";

const router = Router();

const controller = new AsignacionController();

router.get("/", controller.listar.bind(controller));

router.get("/:id", controller.obtenerPorId.bind(controller));

router.post("/", controller.crear.bind(controller));

router.put("/:id", controller.actualizar.bind(controller));

router.delete("/:id", controller.eliminar.bind(controller));

export default router;