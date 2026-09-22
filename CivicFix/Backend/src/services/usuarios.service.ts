import { UsuariosRepository } from "../repository/usuarios.repository";
import { UserRegister,Usuario } from "../models/usuarios.model";

export class UsuariosService {
    private usuariosRepository = new UsuariosRepository();

    async obtenerUsuarios(): Promise<Usuario[]> {
        return this.usuariosRepository.obtenerUsuarios();
    }

    async obtenerUsuarioPorId(id: number): Promise<Usuario | undefined> {
        if (id === undefined || id === null) {
            throw new Error("ID de usuario inválido");
        }

        if(!Number.isInteger(id) || id <= 0) {
            throw new Error("El id proporcionado no es válido.");
        }

        return this.usuariosRepository.obtenerUsuarioPorId(id);
    }

    async crearUsuario(usuario: UserRegister): Promise<Usuario> {
        if (!usuario.nombre || !usuario.apellido || !usuario.usuario || !usuario.correo || !usuario.password || !usuario.telefono) {
            throw new Error("Todos los campos son obligatorios");
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(usuario.correo)) {
            throw new Error("Correo electrónico inválido");
        }

        if (!/^\d{8}$/.test(usuario.telefono)) {
            throw new Error("El número de teléfono debe tener 8 dígitos");
        }

        if (usuario.password.length < 8) {
            throw new Error("La contraseña debe tener al menos 8 caracteres");
        }

        if(!usuario.correo.endsWith("@gmail.com") && !usuario.correo.endsWith("@hotmail.com") && !usuario.correo.endsWith("@outlook.com") && !usuario.correo.endsWith("@yahoo.com") && !usuario.correo.endsWith("@icloud.com")) {
            throw new Error("El correo electrónico no pertenece a un dominio válido");
        }

        return this.usuariosRepository.crearUsuario(usuario);
    }

    async actualizarUsuario(id: number, usuario: UserRegister): Promise<Usuario | undefined> {
        if (id === undefined || id === null) {
            throw new Error("ID de usuario inválido");
        }

        if(!Number.isInteger(id) || id <= 0) {
            throw new Error("El id proporcionado no es válido.");
        }

        if (!usuario.nombre || !usuario.apellido || !usuario.usuario || !usuario.correo || !usuario.password || !usuario.telefono) {
            throw new Error("Todos los campos son obligatorios");
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(usuario.correo)) {
            throw new Error("Correo electrónico inválido");
        }

        if (!/^\d{8}$/.test(usuario.telefono)) {
            throw new Error("El número de teléfono debe tener 8 dígitos");
        }

        if (usuario.password.length < 8) {
            throw new Error("La contraseña debe tener al menos 8 caracteres");
        }

        if(!usuario.correo.endsWith("@gmail.com") && !usuario.correo.endsWith("@hotmail.com") && !usuario.correo.endsWith("@outlook.com") && !usuario.correo.endsWith("@yahoo.com") && !usuario.correo.endsWith("@icloud.com")) {
            throw new Error("El correo electrónico no pertenece a un dominio válido");
        }

        return this.usuariosRepository.actualizarUsuario(id, usuario);
    }

    async eliminarUsuario(id: number): Promise<boolean> {
        if (id === undefined || id === null) {
            throw new Error("ID de usuario inválido");
        }
        if(!Number.isInteger(id) || id <= 0) {
            throw new Error("El id proporcionado no es válido.");
        }
        return this.usuariosRepository.eliminarUsuario(id);
    }
}