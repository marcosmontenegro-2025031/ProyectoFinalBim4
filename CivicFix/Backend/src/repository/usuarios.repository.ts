import { pool } from "../config/db"
import { UserRegister,Usuario } from "../models/usuarios.model"
import { encriptarContrasena } from "../utils/bcrypt.util"

export class UsuariosRepository {
    async obtenerUsuarios(): Promise<Usuario[]> {
        const resultado = await pool.query('SELECT * FROM Usuario');
        return resultado.rows;
    }

    async obtenerUsuarioPorId(id: number): Promise<Usuario | undefined> {
        const resultado = await pool.query("SELECT * FROM Usuario WHERE id_usuario = $1",
            [id]
        );
        return resultado.rows[0] as Usuario | undefined;
    }

    async crearUsuario(usuario: UserRegister): Promise<Usuario> {
        const body : UserRegister = {
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            usuario: usuario.usuario,
            correo: usuario.correo,
            password: usuario.password,
            telefono: usuario.telefono
        };
        const passwordEncriptado = await encriptarContrasena(body.password);
        const resultado = await pool.query("INSERT INTO Usuario (nombre,apellido,usuario,correo,password,telefono) VALUES ($1,$2,$3,$4,$5,$6)",
            [body.nombre, body.apellido, body.usuario, body.correo, passwordEncriptado, body.telefono]
        );
        return usuario;
    }

    async actualizarUsuario(id: number, usuario: UserRegister): Promise<Usuario | undefined> {
        const body : UserRegister = {
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            usuario: usuario.usuario,
            correo: usuario.correo,
            password: usuario.password,
            telefono: usuario.telefono
        };
        const passwordEncriptado = await encriptarContrasena(body.password);
        const resultado = await pool.query("UPDATE Usuario SET nombre=$1, apellido=$2, usuario=$3, correo=$4, password=$5, telefono=$6 WHERE id_usuario=$7",
            [body.nombre, body.apellido, body.usuario, body.correo, passwordEncriptado, body.telefono, id]
        );
        return (resultado.rowCount ?? 0)  > 0 ? usuario : undefined;
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