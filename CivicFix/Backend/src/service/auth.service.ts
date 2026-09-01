import { UserLogin } from "../models/usuarios.model";
import { UsuariosRepository } from "../repository/usuarios.repository";
import { EmpleadoLogin } from "../models/empleadoMunicipal.model";
import { EmpleadoMunicipalRepository } from "../repository/empleadoMunicipal.repository";
import { verificarContrasena } from "../utils/bcrypt.util";
import { generarTokenUsuario, generarTokenEmpleado } from "../utils/jwt.util";

export class AuthService {

    private usuariosRepository: UsuariosRepository;
    private empleadoRepository: EmpleadoMunicipalRepository;

    constructor() {
        this.usuariosRepository = new UsuariosRepository();
        this.empleadoRepository = new EmpleadoMunicipalRepository();
    }

    async loginUsuario(datos: UserLogin) {
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

        const token = generarTokenUsuario(payload);
        
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

    async loginEmpleado(datos: EmpleadoLogin) {
        const empleado = await this.empleadoRepository.obtenerEmpleadoPorUsuario(
            datos.usuario
        );

        if (!empleado) {
            throw new Error("Usuario o contraseña incorrectos");
        }

        const passwordCorrecto = await verificarContrasena(
            datos.password,
            empleado.password
        );

        if (!passwordCorrecto) {
            throw new Error("Usuario o contraseña incorrectos");
        }

        const payload = {
            id_empleado: empleado.id_empleado!,
            usuario: empleado.usuario,
            correo: empleado.correo
        };

        const token = generarTokenEmpleado(payload);
        
        return {
            token,
            usuario: {
                id_empleado: empleado.id_empleado,
                nombre: empleado.nombre,
                apellido: empleado.apellido,
                usuario: empleado.usuario,
                correo: empleado.correo,
                telefono: empleado.telefono
            }
        };
    }
}
