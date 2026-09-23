import { pool } from "../config/db.js";
import { EmpleadoMunicipal, EmpleadoRegister } from "../models/empleadoMunicipal.model.js";
import { encriptarContrasena } from "../utils/bcrypt.util.js";

export class EmpleadoMunicipalRepository {
    async obtenerEmpleado(): Promise<EmpleadoMunicipal[]> {
        const resultado = await pool.query<EmpleadoMunicipal>(
            "SELECT id_empleado,nombre,apellido,usuario,dpi,telefono,direccion,correo,cargo,id_departamento,id_municipalidad,activo FROM EmpleadoMunicipal ORDER BY id_empleado"
        );
        return resultado.rows;
    }

    async obtenerEmpleadoPorId(id: number): Promise<EmpleadoMunicipal | undefined> {
        const resultado = await pool.query<EmpleadoMunicipal>(
            "SELECT id_empleado,nombre,apellido,usuario,dpi,telefono,direccion,correo,cargo,id_departamento,id_municipalidad,activo FROM EmpleadoMunicipal WHERE id_empleado = $1",
            [id]
        );
        return resultado.rows[0];
    }

    async crearEmpleado(empleado: EmpleadoRegister): Promise<EmpleadoRegister> {
        const passworEncriptado = await encriptarContrasena(empleado.password);

        const resultado = await pool.query(
            `INSERT INTO EmpleadoMunicipal
                (nombre, apellido, usuario, password, dpi, telefono, direccion, correo,
                 cargo, id_departamento, id_municipalidad)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
             RETURNING id_empleado,nombre,apellido,usuario,dpi,telefono,direccion,correo,cargo,id_departamento,id_municipalidad,activo`,
            [
                empleado.nombre,
                empleado.apellido,
                empleado.usuario,
                passworEncriptado,
                empleado.dpi,
                empleado.telefono,
                empleado.direccion,
                empleado.correo,
                empleado.cargo,
                empleado.id_departamento,
                empleado.id_municipalidad
            ]
        );

        return resultado.rows[0];
    }

    async actualizarEmpleado(
        id: number,
        empleado: EmpleadoRegister
    ): Promise<EmpleadoRegister | undefined> {
        const passworEncriptado = empleado.password ? await encriptarContrasena(empleado.password) : null;

        const resultado = await pool.query(
            `UPDATE EmpleadoMunicipal
             SET nombre = $1,
                 apellido = $2,
                 usuario = $3,
                 password = COALESCE($4, password),
                 dpi = $5,
                 telefono = $6,
                 direccion = $7,
                 correo = $8,
                 cargo = $9,
                 id_departamento = $10,
                 id_municipalidad = $11
             WHERE id_empleado = $12
             RETURNING id_empleado,nombre,apellido,usuario,dpi,telefono,direccion,correo,cargo,id_departamento,id_municipalidad,activo`,
            [
                empleado.nombre,
                empleado.apellido,
                empleado.usuario,
                passworEncriptado,
                empleado.dpi,
                empleado.telefono,
                empleado.direccion,
                empleado.correo,
                empleado.cargo,
                empleado.id_departamento,
                empleado.id_municipalidad,
                id
            ]
        );

        return resultado.rows[0];
    }

    async eliminarEmpleado(id: number): Promise<boolean> {
        const resultado = await pool.query(
            "DELETE FROM EmpleadoMunicipal WHERE id_empleado = $1",
            [id]
        );
        return (resultado.rowCount ?? 0) > 0;
    }

    async obtenerEmpleadoPorUsuario(usuario: string): Promise<EmpleadoMunicipal | undefined> {
        const resultado = await pool.query<EmpleadoMunicipal>(
            "SELECT * FROM EmpleadoMunicipal WHERE usuario = $1",
            [usuario]
        );
        return resultado.rows[0];
    }

    async actualizarPassword(usuario: string, password: string): Promise<boolean> {
        const passworEncriptado = await encriptarContrasena(password);
        const resultado = await pool.query(
            "UPDATE EmpleadoMunicipal SET password = $1 WHERE usuario = $2",
            [passworEncriptado, usuario]
        );
        return (resultado.rowCount ?? 0) > 0;
    }
}
