import { Router, Request, Response, NextFunction } from 'express';
import { AsignacionController } from '../controllers/asignacion.controller.js';
import { verificarTokenEmpleado, verificarAdministrador } from '../middleware/auth.middleware.js';
import { pool } from '../config/db';
const router = Router();
router.use(verificarTokenEmpleado);
router.get('/', AsignacionController.listar);
router.get('/reporte/:idReporte', async (req: Request,res: Response) => {
    const actor = (req as any).empleado;
    try {
        const {rows} = await pool.query(`SELECT id_asignacion,id_reporte AS fk_id_reporte,
            id_empleado AS fk_id_empleado,fecha_asignacion,observacion FROM Asignacion
            WHERE id_reporte=$1 AND ($2::boolean OR id_empleado=$3)`,
            [req.params.idReporte, /admin/i.test(actor.cargo??''), actor.id_empleado]);
        res.json(rows);
    } catch (error) {console.error(error);res.status(500).json({mensaje:'Error al consultar las asignaciones'});}
});
router.get('/:id', AsignacionController.obtenerPorId);
router.post('/', verificarAdministrador, AsignacionController.crear);
router.put('/:id', verificarAdministrador, AsignacionController.actualizar);
router.delete('/:id', verificarAdministrador, AsignacionController.eliminar);
export default router;
