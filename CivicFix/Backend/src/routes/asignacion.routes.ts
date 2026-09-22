<<<<<<< HEAD
import { Router } from 'express';
import { AsignacionController } from '../controllers/asignacion.controller.js';
=======
<<<<<<< HEAD
// routes/asignacion.routes.ts
import { Router } from "express";
import { AsignacionController } from "../controllers/asignacion.controller.js";

const router = Router();

router.get("/", AsignacionController.listar);
router.get("/:id", AsignacionController.obtenerPorId);
router.post("/", AsignacionController.crear);
router.put("/:id", AsignacionController.actualizar);
router.delete("/:id", AsignacionController.eliminar);

export default router;
=======
import { Router } from "express";
import cors from "cors";
import { AsignacionController } from "../controllers/asignacion.controller.js";
>>>>>>> f4894cefaee6ff1f2f4c49035348117ec7f78596

const router = Router();

const controller = new AsignacionController();

router.get('/', (req, res) => {
    controller.listar(req, res);
});

router.get('/:id', (req, res) => {
    controller.obtenerPorId(req, res);
});

router.post('/', (req, res) => {
    controller.crear(req, res);
});

router.put('/:id', (req, res) => {
    controller.actualizar(req, res);
});

router.delete('/:id', (req, res) => {
    controller.eliminar(req, res);
});
<<<<<<< HEAD

export default router;
=======
>>>>>>> Develop
>>>>>>> f4894cefaee6ff1f2f4c49035348117ec7f78596
