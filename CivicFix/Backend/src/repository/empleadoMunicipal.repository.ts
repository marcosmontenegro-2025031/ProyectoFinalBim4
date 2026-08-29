import { pool } from "../config/db";
import { EmpleadoMunicipal, EmpleadoRegister } from "../models/empleadoMunicipal.mode";
import { encriptarContrasena } from "../utils/bcrypt.util";

export class EmpleadoMunicipalRepository{
    async obtenerEmpleado(): Promise<EmpleadoMunicipal[]> {
        const resultado = await pool.query("SELECT * FROM EmpleadoMunicipal");
        return resultado.rows;
    }

    async obtenerEmpleadoPorId(id: number): Promise<EmpleadoMunicipal | undefined> {
        const resultado = await pool.query("SELECT * FROM EmpleadoMunicipal WHERE id_empleado=$1");
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
            correo: empleado.correo,
            cargo: empleado.cargo,
            id_departamento: empleado.id_departamento
        }
        const passworEncriptado = await encriptarContrasena(body.password);
        const resultado = await pool.query(`INSERT INTO EmpleadoMunicipal (nombre,apellido,usuario,password,dpi,telefono,correo,
            cargo,id_departamento) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
            [body.nombre,body.apellido,body.usuario,passworEncriptado,body.dpi,body.telefono,body.correo,body.cargo,body.id_departamento]
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
            correo: empleado.correo,
            cargo: empleado.cargo,
            id_departamento: empleado.id_departamento
        }
        const passworEncriptado = await encriptarContrasena(body.password);
        const resultado = await pool.query(`UPDATE EmpleadoMunicipal SET nombre=$1, apellido=$2,usuario=$3, password=$4, dpi=$5,
            telefono=$6, correo=$7, cargo=$8, id_departamento=$9 WHERE id_empleado=$10`,
            [body.nombre,body.apellido,body.usuario,passworEncriptado,body.dpi,body.telefono,body.correo,body.cargo,body.id_departamento,id]
        );
        return (resultado.rowCount ?? 0) > 0 ? empleado : undefined;
    }

    async eliminarEmpleado(id: number): Promise<boolean> {
        const resultado = await pool.query("DELETE FROM EmpleadoMunicipal WHERE id_empleado = $1"
            [id]
        );
        return (resultado.rowCount ?? 0) > 0;
    }
}