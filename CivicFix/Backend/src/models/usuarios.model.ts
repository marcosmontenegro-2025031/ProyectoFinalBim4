export interface Usuario {
    id_usuario?: number;
    nombre: string;
    apellido: string;
    usuario: string;
    correo: string;
    password: string;
    telefono: string;
    fecha_registro?: Date;
}

export type UserRegister = Omit<Usuario, 'id_usuario' | 'fecha_registro'>;  

export type UserLogin = Pick<Usuario, 'usuario' | 'password'>;

export interface JwtPayload {
    id_usuario: number;
    usuario: string;
    correo: string;
}