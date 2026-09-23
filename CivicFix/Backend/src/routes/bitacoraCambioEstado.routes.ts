import { Router, Request, Response, NextFunction } from 'express';
import { pool } from '../config/db';
import { BitacoraCambioEstadoController } from '../controllers/bitacoraCambioEstado.controller.js';
import { verificarTokenEmpleado, verificarAdministrador } from '../middleware/auth.middleware.js';

const router = Router();
router.use(verificarTokenEmpleado);
const autorizado = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const empleado = (req as any).empleado;
    if (/admin/i.test(empleado.cargo ?? '')) { next(); return; }
    const reporte = req.params.idReporte ? Number(req.params.idReporte) :
      req.params.id ? (await pool.query('SELECT id_reporte FROM BitacoraCambioEstado WHERE id_bitacora=$1', [req.params.id])).rows[0]?.id_reporte :
      Number(req.body?.fk_id_reporte);
    if (!Number.isInteger(reporte) || reporte <= 0) { res.status(400).json({message:'Reporte no válido'});return; }
    const {rowCount} = await pool.query('SELECT 1 FROM Asignacion WHERE id_reporte=$1 AND id_empleado=$2', [reporte, empleado.id_empleado]);
    if (!rowCount) { res.status(403).json({message:'El reporte no está asignado a tu usuario'});return; }
    next();
  } catch (error) { console.error(error); res.status(500).json({message:'No fue posible verificar la asignación'}); }
};
router.get('/', verificarAdministrador, BitacoraCambioEstadoController.listar);
router.get('/reporte/:idReporte', autorizado, BitacoraCambioEstadoController.obtenerPorReporte);
router.get('/:id', autorizado, BitacoraCambioEstadoController.obtenerPorId);
router.post('/', verificarAdministrador, BitacoraCambioEstadoController.crear);
router.put('/:id', autorizado, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const actor = (req as any).empleado;
    if (/admin/i.test(actor.cargo ?? '')) { next(); return; }
    const {rowCount} = await pool.query('SELECT 1 FROM BitacoraCambioEstado WHERE id_bitacora=$1 AND id_empleado=$2',
       [req.params.id, actor.id_empleado]);
    if (!rowCount) {res.status(403).json({message:'Solo puedes editar tus propias observaciones'});return;}
    next();
  } catch(error) {console.error(error);res.status(500).json({message:'Error verificando autoría'});}
}, BitacoraCambioEstadoController.actualizar);
router.delete('/:id', verificarAdministrador, BitacoraCambioEstadoController.eliminar);
export default router;
