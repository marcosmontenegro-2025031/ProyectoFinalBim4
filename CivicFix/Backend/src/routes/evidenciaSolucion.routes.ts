import { Router, Request, Response, NextFunction } from 'express';
import { pool } from '../config/db';
import { EvidenciaSolucionController } from '../controllers/evidenciaSolucion.controller.js';
import { verificarTokenEmpleado } from '../middleware/auth.middleware.js';
const router = Router();
router.use(verificarTokenEmpleado);
const autorizado = async (req: Request,res: Response,next: NextFunction) => {
  try {
    const empleado = (req as any).empleado;
    if (/admin/i.test(empleado.cargo ?? '')) {next();return;}
    const idReporte = req.params.idReporte ? Number(req.params.idReporte) :
      req.params.id ? (await pool.query('SELECT id_reporte FROM EvidenciaSolucion WHERE id_evidencia=$1',[req.params.id])).rows[0]?.id_reporte :
      Number(req.body?.fk_id_reporte);
    if (!Number.isInteger(idReporte) || idReporte <= 0) {res.status(400).json({mensaje:'ID de reporte inválido'});return;}
    const {rowCount} = await pool.query('SELECT 1 FROM Asignacion WHERE id_reporte=$1 AND id_empleado=$2',[idReporte,empleado.id_empleado]);
    if (!rowCount) {res.status(403).json({mensaje:'Este reporte no está asignado a tu usuario'});return;}
    next();
  } catch(error) {console.error(error);res.status(500).json({mensaje:'Error verificando asignación'});}
};
router.get('/', EvidenciaSolucionController.listar);
router.get('/reporte/:idReporte', autorizado, EvidenciaSolucionController.obtenerPorReporte);
router.get('/:id', autorizado, EvidenciaSolucionController.obtenerPorId);
router.post('/', autorizado, EvidenciaSolucionController.crear);
router.put('/:id', autorizado, EvidenciaSolucionController.actualizar);
router.delete('/:id', autorizado, EvidenciaSolucionController.eliminar);
export default router;
