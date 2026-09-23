import { pool } from "../config/db"
import { UserRegister,Usuario } from "../models/usuarios.model"
import { encriptarContrasena } from "../utils/bcrypt.util"

export class UsuariosRepository {
    async obtenerUsuarios(): Promise<Usuario[]> {

        const resultado = await pool.query('SELECT id_usuario, nombre, apellido, usuario, correo, telefono, fecha_registro, activo FROM Usuario');
        return resultado.rows;
    }

    async obtenerUsuarioPorId(id: number): Promise<Usuario | undefined> {
        const resultado = await pool.query("SELECT id_usuario, nombre, apellido, usuario, correo, telefono, fecha_registro, activo FROM Usuario WHERE id_usuario = $1",
            [id]
        );
        return resultado.rows[0] as Usuario | undefined;
    }

    async crearUsuario(usuario: UserRegister): Promise<Usuario> {
        const hash = await encriptarContrasena(usuario.password);
        const { rows } = await pool.query(
            `INSERT INTO Usuario (nombre,apellido,usuario,correo,password,telefono)
             VALUES ($1,$2,$3,$4,$5,$6)
             RETURNING id_usuario,nombre,apellido,usuario,correo,telefono,fecha_registro,activo`,
            [usuario.nombre,usuario.apellido,usuario.usuario,usuario.correo,hash,usuario.telefono]
        );
        return rows[0];
    }

    async actualizarUsuario(id: number, usuario: UserRegister): Promise<Usuario | undefined> {
        const hash = usuario.password ? await encriptarContrasena(usuario.password) : null;
        const { rows } = await pool.query(
            `UPDATE Usuario SET nombre=$1, apellido=$2, usuario=$3, correo=$4,
                password=COALESCE($5,password), telefono=$6 WHERE id_usuario=$7
             RETURNING id_usuario,nombre,apellido,usuario,correo,telefono,fecha_registro,activo`,
            [usuario.nombre,usuario.apellido,usuario.usuario,usuario.correo,hash,usuario.telefono,id]
        );
        return rows[0];
    }

    async eliminarUsuario(id: number): Promise<boolean> {
        const resultado = await pool.query("DELETE FROM Usuario WHERE id_usuario=$1", [id]);
        return (resultado.rowCount ?? 0) > 0;
    }

    async obtenerUsuarioPorUsuario(usuario: string): Promise<Usuario | undefined> {
        const resultado = await pool.query(
            "SELECT * FROM Usuario WHERE usuario = $1",
            [usuario]
        );

        return resultado.rows[0] as Usuario | undefined;
    }
}