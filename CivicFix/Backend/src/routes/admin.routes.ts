import { Router, Request, Response } from 'express';
import { pool } from '../config/db';
import { verificarAdministrador } from '../middleware/auth.middleware';
import { encriptarContrasena } from '../utils/bcrypt.util';

/** Endpoints propios del panel: todas las operaciones se consultan en PostgreSQL. */
export const adminRouter = Router();
adminRouter.use('/api/admin', verificarAdministrador);

type Modulo = 'usuarios'|'empleados'|'departamentos'|'servicios'|'tipos-incidencia'|'prioridades'|'estados'|'asignaciones'|'municipalidades'|'ubicaciones'|'reportes';
type Config = { tabla: string; pk: string; campos: string[]; requeridos: string[]; password?: boolean; activo?: boolean };
const configs: Record<Modulo, Config> = {
  usuarios: { tabla:'Usuario', pk:'id_usuario', campos:['nombre','apellido','usuario','correo','telefono','password'], requeridos:['nombre','apellido','usuario','correo'],password:true,activo:true },
  empleados: { tabla:'EmpleadoMunicipal', pk:'id_empleado', campos:['nombre','apellido','usuario','correo','telefono','password','dpi','direccion','cargo','id_departamento','id_municipalidad'], requeridos:['nombre','apellido','usuario','correo','cargo','id_departamento','id_municipalidad'],password:true,activo:true },
  departamentos: { tabla:'DepartamentoMunicipal', pk:'id_departamento', campos:['nombre','descripcion','id_municipalidad'], requeridos:['nombre','id_municipalidad'],activo:true },
  servicios: { tabla:'ServicioMunicipal', pk:'id_servicio', campos:['nombre','descripcion','id_departamento'], requeridos:['nombre','id_departamento'],activo:true },
  'tipos-incidencia': { tabla:'TipoIncidencia', pk:'id_tipo_incidencia', campos:['nombre','descripcion','codigo_ia'], requeridos:['nombre','codigo_ia'],activo:true },
  prioridades: { tabla:'Prioridad',pk:'id_prioridad',campos:['nombre','descripcion','codigo_ia'],requeridos:['nombre','codigo_ia'],activo:true },
  estados: { tabla:'Estado',pk:'id_estado',campos:['nombre','descripcion'],requeridos:['nombre'],activo:true },
  asignaciones: { tabla:'Asignacion',pk:'id_asignacion',campos:['id_reporte','id_empleado','observacion'],requeridos:['id_reporte','id_empleado'] },
  municipalidades: { tabla:'Municipalidad',pk:'id_municipalidad',campos:['nombre','direccion','telefono','correo'],requeridos:['nombre'] },
  ubicaciones: { tabla:'Ubicacion',pk:'id_ubicacion',campos:['direccion','zona','referencia','latitud','longitud'],requeridos:['direccion'] },
  reportes: { tabla:'Reporte',pk:'id_reporte',campos:['titulo','descripcion','id_usuario','id_tipo_incidencia','id_ubicacion','id_estado','id_prioridad','id_servicio'],requeridos:['titulo','descripcion','id_usuario','id_tipo_incidencia','id_ubicacion','id_estado','id_prioridad'] }
};
const codigos = new Set(['id_departamento','id_municipalidad','id_empleado','id_reporte','id_usuario','id_tipo_incidencia','id_ubicacion','id_estado','id_prioridad','id_servicio']);
const toId=(raw:unknown):number|null=>{const value=Number(raw);return Number.isSafeInteger(value)&&value>0?value:null;};
const fail=(res:Response,e:any)=>{
  if(e?.code==='23505')return res.status(409).json({message:'El nombre, usuario, correo o código ya está registrado'});
  if(e?.code==='23503')return res.status(409).json({message:'No es posible completar la operación: existen datos relacionados o referencia inexistente'});
  if(e?.code==='23502'||e?.code==='22P02'||e?.code==='23514'||e?.code==='22003'||e?.code==='22001')return res.status(400).json({message:'Datos incompletos o inválidos'});
  console.error('Error en administración:',e);
  return res.status(500).json({message:'Error de base de datos al procesar la operación'});
};
const requestBody=(config:Config, raw:any, crear:boolean)=>{
  if(!raw||typeof raw!=='object'||Array.isArray(raw))throw new Error('Envía un objeto JSON válido');
  const datos:Record<string,any>={};
  for(const campo of config.campos){
    if(raw[campo]===undefined)continue;
    const v=raw[campo];
    if(campo==='password'){
      if(v!==''&&v!==null){if(typeof v!=='string'||v.length<8)throw new Error('La contraseña debe tener al menos 8 caracteres');datos[campo]=v;}
    }else if(codigos.has(campo)){
      if(campo==='id_servicio'&&(v===null||v===''||v===0)){datos[campo]=null;continue;}
      const id=toId(v);if(!id)throw new Error(`${campo} debe ser un entero positivo`);datos[campo]=id;
    }else if(campo==='latitud'||campo==='longitud'){
      if(v===null||v===''){datos[campo]=null;continue;}
      const numero=Number(v);if(!Number.isFinite(numero)||numero<(campo==='latitud'?-90:-180)||numero>(campo==='latitud'?90:180))throw new Error(`${campo} no tiene coordenadas válidas`);datos[campo]=numero;
    }else{if(v!==null&&typeof v!=='string')throw new Error(`${campo} debe ser texto`);datos[campo]=typeof v==='string'?v.trim():null;}
  }
  if(crear){for(const requerido of config.requeridos){if(datos[requerido]===undefined||datos[requerido]==='')throw new Error(`Falta el campo ${requerido}`);}
    if(config.password&&!datos.password)throw new Error('La contraseña es obligatoria al crear');
  }
  if('correo'in datos&&datos.correo&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.correo))throw new Error('Correo inválido');
  if('telefono'in datos&&datos.telefono&&!/^\d{8,20}$/.test(datos.telefono))throw new Error('El teléfono debe contener entre 8 y 20 dígitos');
  return datos;
};
const sinPassword=(obj:any)=>{const {password,...rest}=obj;return rest;};
const log=async(client:any,req:Request,accion:string,modulo:string,descripcion:string)=>{
  const actor=(req as any).empleado;
  await client.query(`INSERT INTO BitacoraAdministracion (id_empleado,usuario,accion,modulo,descripcion,ip)
     VALUES ($1,$2,$3,$4,$5,$6)`,[actor.id_empleado,actor.usuario,accion,modulo,descripcion,req.ip||null]);
};

// GET devuelve datos de las tablas REALES, enriquecidos para las tarjetas de Angular.
adminRouter.get('/api/admin/:modulo',async(req,res)=>{
 const modulo=String(req.params.modulo);
 try{
  let sql:string;
  switch(modulo){
   case 'usuarios':sql=`SELECT id_usuario AS id,nombre,apellido,usuario,correo,COALESCE(telefono,'') AS telefono, fecha_registro AS "fechaRegistro",CASE WHEN activo THEN 'Activo' ELSE 'Inactivo' END AS estado FROM Usuario ORDER BY id_usuario`;break;
   case 'empleados':sql=`SELECT e.id_empleado AS id,e.nombre,e.apellido,e.usuario,e.correo,COALESCE(e.telefono,'') AS telefono,COALESCE(d.nombre,'') AS departamento,e.cargo,e.id_departamento,e.id_municipalidad,COALESCE(e.dpi,'') AS dpi,COALESCE(e.direccion,'') AS direccion,CASE WHEN e.activo THEN 'Activo' ELSE 'Inactivo' END AS estado,NULL::date AS "fechaIngreso" FROM EmpleadoMunicipal e JOIN DepartamentoMunicipal d ON d.id_departamento=e.id_departamento ORDER BY e.id_empleado`;break;
   case 'departamentos':sql=`SELECT d.id_departamento AS id,d.nombre,COALESCE(d.descripcion,'') AS descripcion,d.id_municipalidad,COALESCE((SELECT e.nombre||' '||e.apellido FROM EmpleadoMunicipal e WHERE e.id_departamento=d.id_departamento ORDER BY e.id_empleado LIMIT 1),'Sin asignar') AS encargado,(SELECT COUNT(*)::int FROM EmpleadoMunicipal e WHERE e.id_departamento=d.id_departamento) AS empleados,(SELECT COUNT(*)::int FROM ServicioMunicipal s WHERE s.id_departamento=d.id_departamento) AS servicios,CASE WHEN d.activo THEN 'Activo' ELSE 'Inactivo' END AS estado,NULL::date AS "fechaCreacion" FROM DepartamentoMunicipal d ORDER BY d.id_departamento`;break;
   case 'servicios':sql=`SELECT s.id_servicio AS id,s.nombre,COALESCE(s.descripcion,'') AS descripcion,s.id_departamento,d.nombre AS departamento,COALESCE((SELECT e.nombre||' '||e.apellido FROM EmpleadoMunicipal e WHERE e.id_departamento=s.id_departamento ORDER BY e.id_empleado LIMIT 1),'Sin asignar') AS responsable,(SELECT COUNT(*)::int FROM Reporte r WHERE r.id_servicio=s.id_servicio) AS reportes,CASE WHEN s.activo THEN 'Activo' ELSE 'Inactivo' END AS estado,NULL::date AS "fechaCreacion" FROM ServicioMunicipal s JOIN DepartamentoMunicipal d ON d.id_departamento=s.id_departamento ORDER BY s.id_servicio`;break;
   case 'tipos-incidencia':sql=`SELECT t.id_tipo_incidencia AS id,t.nombre,COALESCE(t.descripcion,'') AS descripcion,t.codigo_ia,'bi-tag-fill' AS icono,'#0874dc' AS color,(SELECT COUNT(*)::int FROM Reporte r WHERE r.id_tipo_incidencia=t.id_tipo_incidencia) AS reportes,CASE WHEN t.activo THEN 'Activo' ELSE 'Inactivo' END AS estado,NULL::date AS "fechaCreacion" FROM TipoIncidencia t ORDER BY t.id_tipo_incidencia`;break;
   case 'prioridades':sql=`SELECT p.id_prioridad AS id,p.nombre,COALESCE(p.descripcion,'') AS descripcion,p.codigo_ia,CASE LOWER(p.nombre) WHEN 'crítica' THEN 4 WHEN 'alta' THEN 3 WHEN 'media' THEN 2 ELSE 1 END AS nivel,'#0874dc' AS color,(SELECT COUNT(*)::int FROM Reporte r WHERE r.id_prioridad=p.id_prioridad) AS reportes,CASE WHEN p.activo THEN 'Activo' ELSE 'Inactivo' END AS estado,'No definido' AS "tiempoRespuesta" FROM Prioridad p ORDER BY p.id_prioridad`;break;
   case 'estados':sql=`SELECT e.id_estado AS id,e.nombre,COALESCE(e.descripcion,'') AS descripcion,'#0874dc' AS color,'bi-circle' AS icono,(SELECT COUNT(*)::int FROM Reporte r WHERE r.id_estado=e.id_estado) AS reportes,CASE WHEN e.activo THEN 'Activo' ELSE 'Inactivo' END AS estado FROM Estado e ORDER BY e.id_estado`;break;
   case 'asignaciones':sql=`SELECT a.id_asignacion AS id,a.id_reporte,a.id_empleado,r.titulo AS reporte,em.nombre||' '||em.apellido AS empleado,d.nombre AS departamento,p.nombre AS prioridad,e.nombre AS estado,a.fecha_asignacion AS "fechaAsignacion",NULL::date AS "fechaLimite",COALESCE(a.observacion,'') AS observacion FROM Asignacion a JOIN Reporte r ON r.id_reporte=a.id_reporte JOIN EmpleadoMunicipal em ON em.id_empleado=a.id_empleado JOIN DepartamentoMunicipal d ON d.id_departamento=em.id_departamento JOIN Prioridad p ON p.id_prioridad=r.id_prioridad JOIN Estado e ON e.id_estado=r.id_estado ORDER BY a.id_asignacion DESC`;break;
   case 'municipalidades':sql=`SELECT m.id_municipalidad AS id,m.nombre,COALESCE(m.direccion,'') AS direccion,COALESCE(m.telefono,'') AS telefono,COALESCE(m.correo,'') AS correo,(SELECT COUNT(*)::int FROM DepartamentoMunicipal d WHERE d.id_municipalidad=m.id_municipalidad) AS departamentos FROM Municipalidad m ORDER BY m.id_municipalidad`;break;
   case 'ubicaciones':sql=`SELECT u.id_ubicacion AS id,u.direccion,COALESCE(u.zona,'') AS zona,COALESCE(u.referencia,'') AS referencia,u.latitud,u.longitud,(SELECT COUNT(*)::int FROM Reporte r WHERE r.id_ubicacion=u.id_ubicacion) AS reportes FROM Ubicacion u ORDER BY u.id_ubicacion`;break;
   case 'reportes':sql=`SELECT r.id_reporte AS id,r.titulo,r.descripcion,r.id_usuario,r.id_tipo_incidencia,r.id_ubicacion,r.id_estado,r.id_prioridad,r.id_servicio,r.fecha_reporte FROM Reporte r ORDER BY r.id_reporte DESC`;break;
   case 'bitacora':sql=`SELECT b.id,b.usuario,'Administrador' AS rol,b.accion,b.modulo,b.descripcion,TO_CHAR(b.fecha,'YYYY-MM-DD') AS fecha,TO_CHAR(b.fecha,'HH24:MI') AS hora,COALESCE(b.ip,'') AS ip,b.resultado FROM BitacoraAdministracion b ORDER BY b.fecha DESC LIMIT 1000`;break;
   default:return res.status(404).json({message:'Módulo administrativo no encontrado'});
  }
  const {rows}=await pool.query(sql);return res.json(rows);
 }catch(e){return fail(res,e);}
});

// Vista administrativa real del reporte y su historial; sin datos de muestra.
adminRouter.get('/api/admin/reportes/:id/resumen',async(req,res)=>{
 const id=toId(req.params.id);if(!id)return res.status(400).json({message:'ID inválido'});
 try{
  const info=await pool.query(`SELECT r.id_reporte,r.titulo,r.descripcion,r.fecha_reporte,
    u.nombre||' '||u.apellido AS ciudadano,u.correo,t.nombre AS tipo,
    ub.direccion,ub.zona,ub.referencia,es.nombre AS estado,p.nombre AS prioridad,
    COALESCE(s.nombre,'Sin servicio asignado') AS servicio
    FROM Reporte r JOIN Usuario u ON u.id_usuario=r.id_usuario
    JOIN TipoIncidencia t ON t.id_tipo_incidencia=r.id_tipo_incidencia
    JOIN Ubicacion ub ON ub.id_ubicacion=r.id_ubicacion
    JOIN Estado es ON es.id_estado=r.id_estado
    JOIN Prioridad p ON p.id_prioridad=r.id_prioridad
    LEFT JOIN ServicioMunicipal s ON s.id_servicio=r.id_servicio
    WHERE r.id_reporte=$1`,[id]);
  if(!info.rows.length)return res.status(404).json({message:'Reporte no encontrado'});
  const cambios=await pool.query(`SELECT b.fecha_cambio,b.comentario,
    COALESCE(ea.nombre,'Inicio') AS estado_anterior,en.nombre AS estado_nuevo,
    COALESCE(em.nombre||' '||em.apellido,'Sistema') AS empleado
    FROM BitacoraCambioEstado b
    LEFT JOIN Estado ea ON ea.id_estado=b.id_estado_anterior
    JOIN Estado en ON en.id_estado=b.id_estado_nuevo
    LEFT JOIN EmpleadoMunicipal em ON em.id_empleado=b.id_empleado
    WHERE b.id_reporte=$1 ORDER BY b.fecha_cambio,b.id_bitacora`,[id]);
  return res.json({reporte:info.rows[0],historial:cambios.rows});
 }catch(e){return fail(res,e);}
});

// Ficha de edición: columnas originales y relaciones por ID; nunca exponer hashes.
adminRouter.get('/api/admin/:modulo/:id',async(req,res)=>{
 const modulo=String(req.params.modulo) as Modulo,c=configs[modulo],id=toId(req.params.id);
 if(!c)return res.status(404).json({message:'Módulo no encontrado'});
 if(!id)return res.status(400).json({message:'ID inválido'});
 try{
  const cols=c.campos.filter(x=>x!=='password').concat(c.pk);
  const {rows}=await pool.query(`SELECT ${cols.join(',')} FROM ${c.tabla} WHERE ${c.pk}=$1`,[id]);
  return rows.length?res.json(rows[0]):res.status(404).json({message:'Registro no encontrado'});
 }catch(e){return fail(res,e);}
});

// Integridad: el empleado debe pertenecer a la misma municipalidad que su departamento.
async function validarDependencias(client:any,modulo:Modulo,datos:Record<string,any>,id?:number){
 if(modulo==='empleados'&&(datos.id_departamento!==undefined||datos.id_municipalidad!==undefined)){
  const previo=id?await client.query('SELECT id_departamento,id_municipalidad FROM EmpleadoMunicipal WHERE id_empleado=$1',[id]):{rows:[]};
  const dep=datos.id_departamento??previo.rows[0]?.id_departamento;
  const muni=datos.id_municipalidad??previo.rows[0]?.id_municipalidad;
  if(dep&&muni){const {rows}=await client.query('SELECT 1 FROM DepartamentoMunicipal WHERE id_departamento=$1 AND id_municipalidad=$2 AND activo=TRUE',[dep,muni]);
   if(!rows.length)throw new Error('El departamento debe pertenecer a la municipalidad seleccionada y estar activo');}
 }
 if(modulo==='asignaciones'&&datos.id_empleado){
  const {rows}=await client.query('SELECT 1 FROM EmpleadoMunicipal WHERE id_empleado=$1 AND activo=TRUE',[datos.id_empleado]);
  if(!rows.length)throw new Error('Selecciona un empleado activo');
 }
 if(modulo==='reportes'){
  for(const [col,tabla,pk] of [['id_estado','Estado','id_estado'],['id_prioridad','Prioridad','id_prioridad'],['id_tipo_incidencia','TipoIncidencia','id_tipo_incidencia'],['id_servicio','ServicioMunicipal','id_servicio']] as const){
   if(datos[col]){const {rows}=await client.query(`SELECT 1 FROM ${tabla} WHERE ${pk}=$1 AND activo=TRUE`,[datos[col]]);
    if(!rows.length)throw new Error('La opción seleccionada para '+col+' está inactiva o no existe');}
  }
 }
}
const failValidation=(res:Response,e:any)=>e instanceof Error && (/^(El departamento|Selecciona un empleado|La opción seleccionada)/).test(e.message)?res.status(400).json({message:e.message}):fail(res,e);

adminRouter.post('/api/admin/:modulo',async(req,res)=>{
 const modulo=String(req.params.modulo) as Modulo;const c=configs[modulo];if(!c)return res.status(404).json({message:'Módulo no encontrado'});
 let datos:Record<string,any>;
 try{datos=requestBody(c,req.body,true);}catch(e:any){return res.status(400).json({message:e.message});}
 if(c.password)datos.password=await encriptarContrasena(datos.password);
 const client=await pool.connect();
 try{
  await client.query('BEGIN');await validarDependencias(client,modulo,datos);const cols=Object.keys(datos);
  const {rows}=await client.query(`INSERT INTO ${c.tabla} (${cols.join(',')}) VALUES (${cols.map((_,i)=>'$'+(i+1)).join(',')}) RETURNING *`,Object.values(datos));
  if(modulo==='reportes'){
    await client.query('INSERT INTO BitacoraCambioEstado(id_reporte,id_estado_anterior,id_estado_nuevo,id_empleado,comentario) VALUES ($1,NULL,$2,$3,$4)',[rows[0].id_reporte,datos.id_estado,(req as any).empleado.id_empleado,'Creado desde administración']);
  }
  if (modulo === 'asignaciones') {
    const rep = await client.query('SELECT id_estado FROM Reporte WHERE id_reporte=$1 FOR UPDATE',[datos.id_reporte]);
    const assigned = await client.query("SELECT id_estado FROM Estado WHERE LOWER(nombre)='asignado' AND activo=TRUE LIMIT 1");
    const current = await client.query('SELECT nombre FROM Estado WHERE id_estado=$1',[rep.rows[0]?.id_estado]);
    // No reabrir reportes finalizados al reasignarlos.
    if (rep.rows.length && assigned.rows.length && ['recibido','en revisión'].includes(String(current.rows[0]?.nombre||'').toLowerCase())) {
      const before=rep.rows[0].id_estado,after=assigned.rows[0].id_estado;
      await client.query('UPDATE Reporte SET id_estado=$1 WHERE id_reporte=$2',[after,datos.id_reporte]);
      await client.query('INSERT INTO BitacoraCambioEstado(id_reporte,id_estado_anterior,id_estado_nuevo,id_empleado,comentario) VALUES($1,$2,$3,$4,$5)',[datos.id_reporte,before,after,(req as any).empleado.id_empleado,'Asignación creada desde administración']);
    }
  }
  await log(client,req,'Crear',modulo,`Registró ${modulo} #${rows[0][c.pk]}`);await client.query('COMMIT');
  return res.status(201).json(sinPassword(rows[0]));
 }catch(e){await client.query('ROLLBACK');return failValidation(res,e);}finally{client.release();}
});
adminRouter.put('/api/admin/:modulo/:id',async(req,res)=>{
 const modulo=String(req.params.modulo) as Modulo;const c=configs[modulo],id=toId(req.params.id);
 if(!c)return res.status(404).json({message:'Módulo no encontrado'});if(!id)return res.status(400).json({message:'ID inválido'});
 let datos:Record<string,any>;
 try{datos=requestBody(c,req.body,false);}catch(e:any){return res.status(400).json({message:e.message});}
 if(!Object.keys(datos).length)return res.status(400).json({message:'No se enviaron campos para actualizar'});
 if(c.password&&datos.password)datos.password=await encriptarContrasena(datos.password);
 const client=await pool.connect();
 try{
  await client.query('BEGIN');
  if(modulo==='empleados'&&id===(req as any).empleado.id_empleado&&datos.cargo!==undefined&&String(datos.cargo).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase()!=='administrador'){throw new Error('No puedes quitarte tu propio rol de administrador');}
  await validarDependencias(client,modulo,datos,id);
  const previo=modulo==='reportes'?await client.query('SELECT id_estado FROM Reporte WHERE id_reporte=$1 FOR UPDATE',[id]):null;
  const cols=Object.keys(datos);
  const {rows}=await client.query(`UPDATE ${c.tabla} SET ${cols.map((x,i)=>x+'=$'+(i+1)).join(',')} WHERE ${c.pk}=$${cols.length+1} RETURNING *`,[...Object.values(datos),id]);
  if(!rows.length){await client.query('ROLLBACK');return res.status(404).json({message:'Registro no encontrado'});}
  if(modulo==='reportes'&&datos.id_estado&&previo?.rows.length&&previo.rows[0].id_estado!==datos.id_estado){
   await client.query('INSERT INTO BitacoraCambioEstado(id_reporte,id_estado_anterior,id_estado_nuevo,id_empleado,comentario) VALUES ($1,$2,$3,$4,$5)',[id,previo.rows[0].id_estado,datos.id_estado,(req as any).empleado.id_empleado,'Editado desde formulario de administración']);
  }
  await log(client,req,'Actualizar',modulo,`Actualizó ${modulo} #${id}`);await client.query('COMMIT');return res.json(sinPassword(rows[0]));
 }catch(e){await client.query('ROLLBACK');return failValidation(res,e);}finally{client.release();}
});
adminRouter.patch('/api/admin/:modulo/:id/estado',async(req,res)=>{
 const modulo=String(req.params.modulo) as Modulo;const c=configs[modulo],id=toId(req.params.id);
 if(!c?.activo)return res.status(404).json({message:'Este módulo no permite activación'});
 if(!id||typeof req.body?.activo!=='boolean')return res.status(400).json({message:'Se requiere ID válido y activo: boolean'});
 const actor=(req as any).empleado;
 if(modulo==='empleados'&&id===actor.id_empleado&&!req.body.activo)return res.status(409).json({message:'No puedes desactivar tu propia cuenta'});
 const client=await pool.connect();
 try{
  await client.query('BEGIN');const {rows}=await client.query(`UPDATE ${c.tabla} SET activo=$1 WHERE ${c.pk}=$2 RETURNING ${c.pk},activo`,[req.body.activo,id]);
  if(!rows.length){await client.query('ROLLBACK');return res.status(404).json({message:'Registro no encontrado'});}
  await log(client,req,'Actualizar',modulo,`${req.body.activo?'Activó':'Desactivó'} ${modulo} #${id}`);await client.query('COMMIT');return res.json(rows[0]);
 }catch(e){await client.query('ROLLBACK');return fail(res,e);}finally{client.release();}
});
adminRouter.delete('/api/admin/:modulo/:id',async(req,res)=>{
 const modulo=String(req.params.modulo) as Modulo;const c=configs[modulo],id=toId(req.params.id);
 if(!c)return res.status(404).json({message:'Módulo no encontrado'});if(!id)return res.status(400).json({message:'ID inválido'});
 if(modulo==='empleados'&&id===(req as any).empleado.id_empleado)return res.status(409).json({message:'No puedes eliminar tu propia cuenta'});
 const client=await pool.connect();
 try{
  await client.query('BEGIN');
  // La FK de ServicioMunicipal usa ON DELETE CASCADE: impedir borrar servicios por accidente.
  if (modulo === 'departamentos') {
    const related = await client.query(`SELECT
       (SELECT COUNT(*)::int FROM ServicioMunicipal WHERE id_departamento=$1) AS servicios,
       (SELECT COUNT(*)::int FROM EmpleadoMunicipal WHERE id_departamento=$1) AS empleados`,[id]);
    if (related.rows[0].servicios || related.rows[0].empleados) {
      await client.query('ROLLBACK');return res.status(409).json({message:'No se puede eliminar: reasigna o elimina sus servicios y empleados primero'});
    }
  }
  if(modulo==='municipalidades'){
   const related=await client.query('SELECT COUNT(*)::int AS total FROM DepartamentoMunicipal WHERE id_municipalidad=$1',[id]);
   if(related.rows[0].total){await client.query('ROLLBACK');return res.status(409).json({message:'Reasigna los departamentos antes de eliminar la municipalidad'});}
  }
  const {rows}=await client.query(`DELETE FROM ${c.tabla} WHERE ${c.pk}=$1 RETURNING ${c.pk}`,[id]);
  if(!rows.length){await client.query('ROLLBACK');return res.status(404).json({message:'Registro no encontrado'});}
  await log(client,req,'Eliminar',modulo,`Eliminó ${modulo} #${id}`);await client.query('COMMIT');return res.json({message:'Eliminado correctamente',id});
 }catch(e){await client.query('ROLLBACK');return fail(res,e);}finally{client.release();}
});

// Cambiar estado/prioridad de un reporte afecta la misma transacción que su historial.
adminRouter.patch('/api/admin/reportes/:id/estado',async(req,res)=>{
 const id=toId(req.params.id),idEstado=toId(req.body?.idEstado);
 if(!id||!idEstado)return res.status(400).json({message:'id e idEstado deben ser enteros positivos'});
 const client=await pool.connect();
 try{
  await client.query('BEGIN');
  const current=await client.query('SELECT id_estado FROM Reporte WHERE id_reporte=$1 FOR UPDATE',[id]);
  if(!current.rows.length){await client.query('ROLLBACK');return res.status(404).json({message:'Reporte no encontrado'});}
  const valid=await client.query('SELECT 1 FROM Estado WHERE id_estado=$1 AND activo=TRUE',[idEstado]);
  if(!valid.rows.length){await client.query('ROLLBACK');return res.status(400).json({message:'Estado inexistente o inactivo'});}
  const viejo=current.rows[0].id_estado;
  await client.query('UPDATE Reporte SET id_estado=$1 WHERE id_reporte=$2',[idEstado,id]);
  if(viejo!==idEstado){await client.query('INSERT INTO BitacoraCambioEstado(id_reporte,id_estado_anterior,id_estado_nuevo,id_empleado,comentario) VALUES($1,$2,$3,$4,$5)',[id,viejo,idEstado,(req as any).empleado.id_empleado,'Actualizado desde administración']);}
  await log(client,req,'Actualizar','reportes',`Estado del reporte #${id}: ${viejo} → ${idEstado}`);await client.query('COMMIT');
  return res.json({message:'Estado actualizado',id_reporte:id,id_estado:idEstado});
 }catch(e){await client.query('ROLLBACK');return fail(res,e);}finally{client.release();}
});
adminRouter.patch('/api/admin/reportes/:id/prioridad',async(req,res)=>{
 const id=toId(req.params.id),idPrioridad=toId(req.body?.idPrioridad);
 if(!id||!idPrioridad)return res.status(400).json({message:'IDs inválidos'});
 const client=await pool.connect();try{await client.query('BEGIN');
  const {rows}=await client.query('UPDATE Reporte SET id_prioridad=$1 WHERE id_reporte=$2 AND EXISTS(SELECT 1 FROM Prioridad WHERE id_prioridad=$1 AND activo=TRUE) RETURNING id_reporte',[idPrioridad,id]);
  if(!rows.length){await client.query('ROLLBACK');return res.status(404).json({message:'Reporte o prioridad activa no encontrados'});}
  await log(client,req,'Actualizar','reportes',`Prioridad del reporte #${id} a ${idPrioridad}`);await client.query('COMMIT');return res.json({message:'Prioridad actualizada'});
 }catch(e){await client.query('ROLLBACK');return fail(res,e);}finally{client.release();}
});
