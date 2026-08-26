import { UserLogin } from "../models/usuarios.model";
import { UsuariosRepository } from "../repository/usuarios.repository";
import { verificarContrasena } from "../utils/bcrypt.util";
import { generarToken } from "../utils/jwt.util";

export class AuthService {

    private usuariosRepository: UsuariosRepository;

    constructor() {
        this.usuariosRepository = new UsuariosRepository();
    }

    async login(datos: UserLogin) {
        
        const usuario = await this.usuariosRepository.obtenerUsuarioPorUsuario(
            datos.usuario
        );

        if (!usuario) {
            throw new Error("Usuario o contraseña incorrectos");
        }

        const passwordCorrecto = await verificarContrasena(
            datos.password,
            usuario.password
        );

        if (!passwordCorrecto) {
            throw new Error("Usuario o contraseña incorrectos");
        }

        const payload = {
            id_usuario: usuario.id_usuario!,
            usuario: usuario.usuario,
            correo: usuario.correo
        };

        const token = generarToken(payload);
        
        return {
            token,
            usuario: {
                id_usuario: usuario.id_usuario,
                nombre: usuario.nombre,
                apellido: usuario.apellido,
                usuario: usuario.usuario,
                correo: usuario.correo,
                telefono: usuario.telefono
            }
        };
    }
}
