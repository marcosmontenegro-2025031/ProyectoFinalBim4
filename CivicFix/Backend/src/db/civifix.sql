DROP TABLE IF EXISTS BitacoraCambioEstado, Notificacion, Asignacion, EvidenciaSolucion, FotografiaProblema, Reporte, EmpleadoMunicipal, ServicioMunicipal, Prioridad, Estado, Ubicacion, TipoIncidencia, Usuario, DepartamentoMunicipal, Municipalidad CASCADE;

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
    id_municipalidad INT NOT NULL,
    FOREIGN KEY (id_municipalidad) REFERENCES Municipalidad(id_municipalidad)
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
    nombre VARCHAR(50) NOT NULL UNIQUE,
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
    id_departamento INT NOT NULL,
    FOREIGN KEY (id_departamento) REFERENCES DepartamentoMunicipal(id_departamento)
);

CREATE TABLE EmpleadoMunicipal (
    id_empleado INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    usuario VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    dpi VARCHAR(20) UNIQUE,
    telefono VARCHAR(20),
    direccion VARCHAR(80),
    correo VARCHAR(150),
    cargo VARCHAR(100),
    id_departamento INT NOT NULL,
    id_municipalidad INT NOT NULL,
    FOREIGN KEY (id_departamento) REFERENCES DepartamentoMunicipal(id_departamento),
    FOREIGN KEY (id_municipalidad) REFERENCES Municipalidad(id_municipalidad)
);

CREATE TABLE Reporte (
    id_reporte INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    descripcion TEXT NOT NULL,
    fecha_reporte TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    id_usuario INT NOT NULL,
    id_tipo_incidencia INT NOT NULL,
    id_ubicacion INT NOT NULL,
    id_estado INT NOT NULL,
    id_prioridad INT NOT NULL,
    id_servicio INT,
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario),
    FOREIGN KEY (id_tipo_incidencia) REFERENCES TipoIncidencia(id_tipo_incidencia),
    FOREIGN KEY (id_ubicacion) REFERENCES Ubicacion(id_ubicacion),
    FOREIGN KEY (id_estado) REFERENCES Estado(id_estado),
    FOREIGN KEY (id_prioridad) REFERENCES Prioridad(id_prioridad),
    FOREIGN KEY (id_servicio) REFERENCES ServicioMunicipal(id_servicio)
);

CREATE TABLE FotografiaProblema (
    id_fotografia INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_reporte INT NOT NULL,
    ruta_fotografia VARCHAR(500) NOT NULL,
    descripcion VARCHAR(255),
    fecha_subida TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_reporte) REFERENCES Reporte(id_reporte)
);

CREATE TABLE EvidenciaSolucion (
    id_evidencia INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_reporte INT NOT NULL,
    ruta_fotografia VARCHAR(500) NOT NULL,
    descripcion VARCHAR(255),
    fecha_subida TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_reporte) REFERENCES Reporte(id_reporte)
);

CREATE TABLE Asignacion (
    id_asignacion INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_reporte INT NOT NULL,
    id_empleado INT NOT NULL,
    fecha_asignacion TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    observacion VARCHAR(255),
    FOREIGN KEY (id_reporte) REFERENCES Reporte(id_reporte),
    FOREIGN KEY (id_empleado) REFERENCES EmpleadoMunicipal(id_empleado)
);

CREATE TABLE Notificacion (
    id_notificacion INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_reporte INT NOT NULL,
    titulo VARCHAR(150) NOT NULL,
    mensaje VARCHAR(255) NOT NULL,
    fecha_notificacion TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    leida BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario),
    FOREIGN KEY (id_reporte) REFERENCES Reporte(id_reporte)
);

CREATE TABLE BitacoraCambioEstado (
    id_bitacora INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_reporte INT NOT NULL,
    id_estado_anterior INT,
    id_estado_nuevo INT NOT NULL,
    id_empleado INT,
    comentario VARCHAR(255),
    fecha_cambio TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_reporte) REFERENCES Reporte(id_reporte),
    FOREIGN KEY (id_estado_anterior) REFERENCES Estado(id_estado),
    FOREIGN KEY (id_estado_nuevo) REFERENCES Estado(id_estado),
    FOREIGN KEY (id_empleado) REFERENCES EmpleadoMunicipal(id_empleado)
);

INSERT INTO Municipalidad (
    nombre,
    direccion,
    telefono,
    correo
) VALUES (
    'Municipalidad de Guatemala',
    'Centro Cívico, Zona 1, Ciudad de Guatemala',
    '1551',
    'contacto@muniguate.com'
);

INSERT INTO DepartamentoMunicipal (
    nombre,
    descripcion,
    id_municipalidad
) VALUES
(
    'Infraestructura',
    'Atención y mantenimiento de infraestructura vial.',
    1
),
(
    'Servicios Públicos',
    'Gestión de servicios públicos municipales.',
    1
),
(
    'Medio Ambiente',
    'Mantenimiento de espacios públicos y áreas verdes.',
    1
);

INSERT INTO Usuario (
    nombre,
    apellido,
    usuario,
    correo,
    password,
    telefono
) VALUES
(
    'Estuardo',
    'Pérez',
    'eperez',
    'estuardo@correo.com',
    '123456',
    '55550001'
),
(
    'María',
    'Gómez',
    'mgomez',
    'maria.gomez@correo.com',
    'abcdef',
    '55550002'
),
(
    'Carlos',
    'López',
    'clopez',
    'carlos.lopez@correo.com',
    'qwerty',
    '55550003'
);

INSERT INTO TipoIncidencia (
    codigo_ia,
    nombre,
    descripcion
) VALUES
(
    'BACHE',
    'Bache',
    'Daño o deterioro en la superficie de una calle.'
),
(
    'AGUA',
    'Fuga de Agua',
    'Fuga de agua en vía pública o infraestructura municipal.'
),
(
    'LUMINARIA',
    'Luminaria Dañada',
    'Luminaria pública que presenta fallas.'
),
(
    'BASURA',
    'Basura Acumulada',
    'Acumulación de residuos en espacios públicos.'
),
(
    'SENALIZACION',
    'Señalización Dañada',
    'Señal de tránsito dañada o deteriorada.'
),
(
    'ARBOL',
    'Árbol Caído',
    'Árbol caído o situación relacionada con áreas verdes.'
);

INSERT INTO Estado (
    nombre,
    descripcion
) VALUES
(
    'Pendiente',
    'Reporte recibido y pendiente de revisión.'
),
(
    'En Proceso',
    'El reporte ha sido asignado y se está atendiendo.'
),
(
    'Resuelto',
    'La incidencia ha sido solucionada.'
);

INSERT INTO Prioridad (
    codigo_ia,
    nombre,
    descripcion
) VALUES
(
    'BAJA',
    'Baja',
    'Incidencia menor que no representa riesgo inmediato.'
),
(
    'MEDIA',
    'Media',
    'Incidencia que requiere atención en un plazo prudente.'
),
(
    'ALTA',
    'Alta',
    'Incidencia grave que afecta la movilidad o seguridad.'
),
(
    'CRITICA',
    'Crítica',
    'Emergencia que requiere atención inmediata.'
);

INSERT INTO ServicioMunicipal (
    nombre,
    descripcion,
    id_departamento
) VALUES
(
    'Mantenimiento Vial',
    'Reparación y mantenimiento de calles y avenidas.',
    1
),
(
    'Alumbrado Público',
    'Mantenimiento de luminarias públicas.',
    2
),
(
    'Agua y Drenajes',
    'Atención de fugas y problemas relacionados con agua.',
    2
),
(
    'Limpieza Urbana',
    'Recolección y atención de residuos en espacios públicos.',
    2
),
(
    'Áreas Verdes',
    'Mantenimiento de parques, árboles y áreas verdes.',
    3
);

INSERT INTO EmpleadoMunicipal (
    nombre,
    apellido,
    usuario,
    password,
    dpi,
    telefono,
    direccion,
    correo,
    cargo,
    id_departamento,
    id_municipalidad
) VALUES
(
    'Juan',
    'Ramírez',
    'jramirez',
    '123456',
    '1234567890101',
    '55551001',
    'Zona 1',
    'juan.ramirez@muniguate.com',
    'Supervisor de Infraestructura',
    1,
    1
),
(
    'Ana',
    'Morales',
    'amorales',
    '123456',
    '1234567890102',
    '55551002',
    'Zona 2',
    'ana.morales@muniguate.com',
    'Técnico de Servicios Públicos',
    2,
    1
),
(
    'Luis',
    'Castillo',
    'lcastillo',
    '123456',
    '1234567890103',
    '55551003',
    'Zona 3',
    'luis.castillo@muniguate.com',
    'Encargado de Áreas Verdes',
    3,
    1
);

INSERT INTO Ubicacion (
    direccion,
    zona,
    referencia,
    latitud,
    longitud
) VALUES
(
    'Avenida Reforma',
    'Zona 10',
    'Frente a Plaza Obelisco',
    14.60370000,
    -90.48950000
),
(
    'Avenida Petapa',
    'Zona 12',
    'Cerca de la Universidad de San Carlos',
    14.58380000,
    -90.51080000
),
(
    '6a Avenida',
    'Zona 1',
    'Cerca del Parque Central',
    14.63490000,
    -90.50690000
),
(
    'Calzada Roosevelt',
    'Zona 7',
    'Frente al centro comercial',
    14.60890000,
    -90.51950000
),
(
    'Avenida Bolívar',
    'Zona 5',
    'Cerca del mercado',
    14.62020000,
    -90.51400000
),
(
    'Boulevard Vista Hermosa',
    'Zona 15',
    'Cerca del ingreso a Vista Hermosa',
    14.58800000,
    -90.49600000
),
(
    'Calle Martí',
    'Zona 6',
    'Cerca de la estación de transporte',
    14.64450000,
    -90.50750000
),
(
    'Calzada San Juan',
    'Zona 7',
    'Frente a área comercial',
    14.62500000,
    -90.55000000
);

INSERT INTO Reporte (
    titulo,
    descripcion,
    id_usuario,
    id_tipo_incidencia,
    id_ubicacion,
    id_estado,
    id_prioridad,
    id_servicio
) VALUES
(
    'Bache en carretera',
    'Bache de gran tamaño que dificulta la circulación.',
    1,
    1,
    1,
    1,
    3,
    1
),
(
    'Luminaria dañada',
    'Lámpara pública que no funciona durante la noche.',
    2,
    3,
    2,
    2,
    2,
    2
),
(
    'Basura acumulada',
    'Acumulación de residuos en un área pública.',
    3,
    4,
    3,
    1,
    2,
    4
),
(
    'Señal de tránsito dañada',
    'Señal vial deteriorada que necesita reemplazo.',
    1,
    5,
    4,
    3,
    1,
    1
),
(
    'Fuga de agua',
    'Fuga de agua en la vía pública.',
    2,
    2,
    5,
    2,
    3,
    3
),
(
    'Árbol caído',
    'Árbol caído que obstruye parcialmente la vía.',
    3,
    6,
    6,
    1,
    3,
    5
),
(
    'Bache en avenida',
    'Deterioro de la superficie de la calle que requiere reparación.',
    1,
    1,
    7,
    1,
    2,
    1
),
(
    'Luminaria sin funcionamiento',
    'Luminaria pública apagada durante la noche.',
    2,
    3,
    8,
    2,
    2,
    2
);

INSERT INTO Asignacion (
    id_reporte,
    id_empleado,
    observacion
) VALUES
(
    2,
    2,
    'Se asigna para revisión y reparación de luminaria.'
),
(
    4,
    1,
    'Se asigna para revisión de señalización.'
),
(
    5,
    2,
    'Se requiere inspección de fuga de agua.'
),
(
    8,
    2,
    'Se asigna revisión de luminaria.'
);

INSERT INTO Notificacion (
    id_usuario,
    id_reporte,
    titulo,
    mensaje,
    leida
) VALUES
(
    1,
    1,
    'Reporte recibido',
    'Tu reporte de bache fue recibido correctamente.',
    FALSE
),
(
    2,
    2,
    'Reporte en proceso',
    'Tu reporte de luminaria está siendo atendido.',
    FALSE
),
(
    3,
    3,
    'Reporte recibido',
    'Tu reporte de basura acumulada fue recibido.',
    TRUE
);

INSERT INTO BitacoraCambioEstado (
    id_reporte,
    id_estado_anterior,
    id_estado_nuevo,
    id_empleado,
    comentario
) VALUES
(
    2,
    1,
    2,
    2,
    'Reporte asignado al área de alumbrado público.'
),
(
    4,
    1,
    3,
    1,
    'Se realizó la reparación de la señalización.'
),
(
    5,
    1,
    2,
    2,
    'Se inició la inspección de la fuga.'
),
(
    8,
    1,
    2,
    2,
    'Reporte asignado para revisión.'
);