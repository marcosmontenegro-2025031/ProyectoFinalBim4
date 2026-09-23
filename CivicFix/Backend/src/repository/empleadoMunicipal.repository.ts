import { pool } from "../config/db";
import { EmpleadoMunicipal, EmpleadoRegister } from "../models/empleadoMunicipal.model";
import { encriptarContrasena } from "../utils/bcrypt.util";

export class EmpleadoMunicipalRepository{
    async obtenerEmpleado(): Promise<EmpleadoMunicipal[]> {
        const resultado = await pool.query("SELECT id_empleado,nombre,apellido,usuario,dpi,telefono,direccion,correo,cargo,id_departamento,id_municipalidad FROM EmpleadoMunicipal");
        return resultado.rows;
    }

    async obtenerEmpleadoPorId(id: number): Promise<EmpleadoMunicipal | undefined> {
        const resultado = await pool.query(
            "SELECT id_empleado,nombre,apellido,usuario,dpi,telefono,direccion,correo,cargo,id_departamento,id_municipalidad FROM EmpleadoMunicipal WHERE id_empleado=$1",
            [id]
        );
        return resultado.rows[0] as EmpleadoMunicipal | undefined;
    }

    async crearEmpleado(empleado: EmpleadoRegister): Promise<EmpleadoRegister> {
        const body : EmpleadoRegister = {
            nombre: empleado.nombre,
            apellido: empleado.apellido,
            usuario: empleado.usuario,
            password: empleado.password,
            dpi: empleado.dpi,
            telefono: empleado.telefono,
            direccion: empleado.direccion,
            correo: empleado.correo,
            cargo: empleado.cargo,
            id_departamento: empleado.id_departamento,
            id_municipalidad: empleado.id_municipalidad
        }
        const passworEncriptado = await encriptarContrasena(body.password);
        const resultado = await pool.query(`INSERT INTO EmpleadoMunicipal (nombre,apellido,usuario,password,dpi,telefono,direccion,correo,
            cargo,id_departamento,id_municipalidad) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
            [body.nombre,body.apellido,body.usuario,passworEncriptado,body.dpi,body.telefono,body.direccion,body.correo,body.cargo,body.id_departamento,body.id_municipalidad]
        );
        return empleado;
    }

    async actualizarEmpleado(id:number, empleado: EmpleadoRegister): Promise<EmpleadoRegister | undefined> {
        const body : EmpleadoRegister = {
            nombre: empleado.nombre,
            apellido: empleado.apellido,
            usuario: empleado.usuario,
            password: empleado.password,
            dpi: empleado.dpi,
            telefono: empleado.telefono,
            direccion: empleado.direccion,
            correo: empleado.correo,
            cargo: empleado.cargo,
            id_departamento: empleado.id_departamento,
            id_municipalidad: empleado.id_municipalidad
        }
        const passworEncriptado = await encriptarContrasena(body.password);
        const resultado = await pool.query(`UPDATE EmpleadoMunicipal SET nombre=$1, apellido=$2,usuario=$3, password=$4, dpi=$5,
            telefono=$6, direccion=$7, correo=$8, cargo=$9, id_departamento=$10, id_municipalidad=$11 WHERE id_empleado=$12`,
            [body.nombre,body.apellido,body.usuario,passworEncriptado,body.dpi,body.telefono,body.direccion,body.correo,body.cargo,body.id_departamento,body.id_municipalidad,id]
        );
        if (!(resultado.rowCount ?? 0)) return undefined;
        const {password: _password, ...publico} = empleado;
        return publico as EmpleadoRegister;
    }

    async actualizarPerfil(id: number, datos: {
        nombre: string; apellido: string; usuario: string; correo: string; telefono: string;
    }): Promise<EmpleadoMunicipal | undefined> {
        const resultado = await pool.query(`
            UPDATE EmpleadoMunicipal
            SET nombre=$1, apellido=$2, usuario=$3, correo=$4, telefono=$5
            WHERE id_empleado=$6
            RETURNING id_empleado,nombre,apellido,usuario,dpi,telefono,direccion,correo,cargo,id_departamento,id_municipalidad
        `, [datos.nombre, datos.apellido, datos.usuario, datos.correo, datos.telefono, id]);
        return resultado.rows[0];
    }

    async eliminarEmpleado(id: number): Promise<boolean> {
        const resultado = await pool.query("DELETE FROM EmpleadoMunicipal WHERE id_empleado = $1",
            [id]
        );
        return (resultado.rowCount ?? 0) > 0;
    }

    async obtenerEmpleadoPorUsuario(usuario: string): Promise<EmpleadoMunicipal | undefined> {
        const resultado = await pool.query("SELECT * FROM EmpleadoMunicipal WHERE usuario = $1",
            [usuario]
        );
        return resultado.rows[0] as EmpleadoMunicipal | undefined;
    }

    async actualizarPassword(usuario: string, password: string): Promise<boolean> {
        const passworEncriptado = await encriptarContrasena(password);
        const resultado = await pool.query("UPDATE EmpleadoMunicipal SET password = $1 WHERE usuario = $2",
            [passworEncriptado, usuario]
        );
        return (resultado.rowCount ?? 0) > 0;
    }
}