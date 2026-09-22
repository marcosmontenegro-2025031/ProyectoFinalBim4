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