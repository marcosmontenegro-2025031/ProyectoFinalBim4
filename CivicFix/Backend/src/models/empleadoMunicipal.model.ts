export interface EmpleadoMunicipal{
    id_empleado?: number;
    nombre: string;
    apellido: string;
    usuario: string;
    password: string;
    dpi: string;
    telefono: string;
    correo: string;
    cargo: string;
    id_departamento: number;
}

export type EmpleadoRegister = Omit<EmpleadoMunicipal,'id_empleado'>

export type EmpleadoLogin = Pick<EmpleadoMunicipal,'usuario' | 'password'>

export interface JwtPayloadEmpleado{
    id_empleado: number;
    usuario: string;
    correo: string;
}
