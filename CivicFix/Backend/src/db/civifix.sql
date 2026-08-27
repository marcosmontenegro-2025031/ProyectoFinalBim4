CREATE TABLE Municipalidad (
    id_municipalidad INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    direccion VARCHAR(250),
    telefono VARCHAR(20),
    correo VARCHAR(150)
);
 
CREATE TABLE DepartamentoMunicipal (
    id_departamento INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    descripcion VARCHAR(255),
    fk_id_municipalidad INT NOT NULL,
    FOREIGN KEY (fk_id_municipalidad) REFERENCES Municipalidad(id_municipalidad)
);
 
CREATE TABLE Usuario (
    id_usuario INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    usuario VARCHAR(50) NOT NULL UNIQUE,
    correo VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    telefono VARCHAR(20),
    fecha_registro TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
 
CREATE TABLE TipoIncidencia (
    id_tipo_incidencia INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    codigo_ia VARCHAR(50) NOT NULL UNIQUE,
    nombre VARCHAR(100) NOT NULL,
    descripcion VARCHAR(255)
);
 
CREATE TABLE Ubicacion (
    id_ubicacion INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    direccion VARCHAR(255) NOT NULL,
    zona VARCHAR(100),
    referencia VARCHAR(255),
    latitud DECIMAL(10,8),
    longitud DECIMAL(11,8)
);
 
CREATE TABLE Estado (
    id_estado INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    descripcion VARCHAR(255)
);
 
CREATE TABLE Prioridad (
    id_prioridad INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    codigo_ia VARCHAR(50) NOT NULL UNIQUE,
    nombre VARCHAR(50) NOT NULL,
    descripcion VARCHAR(255)
);
 
CREATE TABLE ServicioMunicipal (
    id_servicio INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    descripcion VARCHAR(255),
    fk_id_departamento INT NOT NULL,
    FOREIGN KEY (fk_id_departamento) REFERENCES DepartamentoMunicipal(id_departamento)
);
 
CREATE TABLE EmpleadoMunicipal (
    id_empleado INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    usuario VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    dpi VARCHAR(20) UNIQUE,
    telefono VARCHAR(20),
    correo VARCHAR(150),
    cargo VARCHAR(100),
    fk_id_departamento INT NOT NULL,
    FOREIGN KEY (fk_id_departamento) REFERENCES DepartamentoMunicipal(id_departamento)
);
 
CREATE TABLE Reporte (
    id_reporte INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    descripcion TEXT NOT NULL,
    fecha_reporte TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    fk_id_usuario INT NOT NULL,
    fk_id_tipo_incidencia INT NOT NULL,
    fk_id_ubicacion INT NOT NULL,
    fk_id_estado INT NOT NULL,
    fk_id_prioridad INT NOT NULL,
    fk_id_servicio INT,
    FOREIGN KEY (fk_id_usuario) REFERENCES Usuario(id_usuario),
    FOREIGN KEY (fk_id_tipo_incidencia) REFERENCES TipoIncidencia(id_tipo_incidencia),
    FOREIGN KEY (fk_id_ubicacion) REFERENCES Ubicacion(id_ubicacion),
    FOREIGN KEY (fk_id_estado) REFERENCES Estado(id_estado),
    FOREIGN KEY (fk_id_prioridad) REFERENCES Prioridad(id_prioridad),
    FOREIGN KEY (fk_id_servicio) REFERENCES ServicioMunicipal(id_servicio)
);
 
CREATE TABLE FotografiaProblema (
    id_fotografia INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    fk_id_reporte INT NOT NULL,
    ruta_fotografia VARCHAR(500) NOT NULL,
    descripcion VARCHAR(255),
    fecha_subida TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (fk_id_reporte) REFERENCES Reporte(id_reporte)
);
 
CREATE TABLE EvidenciaSolucion (
    id_evidencia INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    fk_id_reporte INT NOT NULL,
    ruta_fotografia VARCHAR(500) NOT NULL,
    descripcion VARCHAR(255),
    fecha_subida TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (fk_id_reporte) REFERENCES Reporte(id_reporte)
);
 
CREATE TABLE Asignacion (
    id_asignacion INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    fk_id_reporte INT NOT NULL,
    fk_id_empleado INT NOT NULL,
    fecha_asignacion TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    observacion VARCHAR(255),
    FOREIGN KEY (fk_id_reporte) REFERENCES Reporte(id_reporte),
    FOREIGN KEY (fk_id_empleado) REFERENCES EmpleadoMunicipal(id_empleado)
);
 
CREATE TABLE Notificacion (
    id_notificacion INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    fk_id_usuario INT NOT NULL,
    fk_id_reporte INT NOT NULL,
    titulo VARCHAR(150) NOT NULL,
    mensaje VARCHAR(255) NOT NULL,
    fecha_notificacion TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    leida BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (fk_id_usuario) REFERENCES Usuario(id_usuario),
    FOREIGN KEY (fk_id_reporte) REFERENCES Reporte(id_reporte)
);
 
CREATE TABLE BitacoraCambioEstado (
    id_bitacora INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    fk_id_reporte INT NOT NULL,
    fk_id_estado_anterior INT,
    fk_id_estado_nuevo INT NOT NULL,
    fk_id_empleado INT,
    comentario VARCHAR(255),
    fecha_cambio TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (fk_id_reporte) REFERENCES Reporte(id_reporte),
    FOREIGN KEY (fk_id_estado_anterior) REFERENCES Estado(id_estado),
    FOREIGN KEY (fk_id_estado_nuevo) REFERENCES Estado(id_estado),
    FOREIGN KEY (fk_id_empleado) REFERENCES EmpleadoMunicipal(id_empleado)
);