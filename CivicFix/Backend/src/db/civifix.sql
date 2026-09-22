-- ==========================================
-- 1. LIMPIEZA Y RECREACIÓN DEL ESQUEMA
-- ==========================================
CREATE SCHEMA IF NOT EXISTS public;
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;

GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;

-- ==========================================
-- 2. CREACIÓN DE TABLAS
-- ==========================================

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
    CONSTRAINT fk_dept_muni FOREIGN KEY (fk_id_municipalidad) REFERENCES Municipalidad(id_municipalidad) ON DELETE CASCADE
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
    CONSTRAINT fk_servicio_dept FOREIGN KEY (fk_id_departamento) REFERENCES DepartamentoMunicipal(id_departamento) ON DELETE CASCADE
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
    CONSTRAINT fk_emp_dept FOREIGN KEY (id_departamento) REFERENCES DepartamentoMunicipal(id_departamento),
    CONSTRAINT fk_emp_muni FOREIGN KEY (id_municipalidad) REFERENCES Municipalidad(id_municipalidad)
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
    CONSTRAINT fk_rep_usuario FOREIGN KEY (fk_id_usuario) REFERENCES Usuario(id_usuario),
    CONSTRAINT fk_rep_tipo FOREIGN KEY (fk_id_tipo_incidencia) REFERENCES TipoIncidencia(id_tipo_incidencia),
    CONSTRAINT fk_rep_ubicacion FOREIGN KEY (fk_id_ubicacion) REFERENCES Ubicacion(id_ubicacion),
    CONSTRAINT fk_rep_estado FOREIGN KEY (fk_id_estado) REFERENCES Estado(id_estado),
    CONSTRAINT fk_rep_prioridad FOREIGN KEY (fk_id_prioridad) REFERENCES Prioridad(id_prioridad),
    CONSTRAINT fk_rep_servicio FOREIGN KEY (fk_id_servicio) REFERENCES ServicioMunicipal(id_servicio)
);

CREATE TABLE FotografiaProblema (
    id_fotografia INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    fk_id_reporte INT NOT NULL,
    ruta_fotografia VARCHAR(500) NOT NULL,
    descripcion VARCHAR(255),
    fecha_subida TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_fotoprob_reporte FOREIGN KEY (fk_id_reporte) REFERENCES Reporte(id_reporte) ON DELETE CASCADE
);

CREATE TABLE EvidenciaSolucion (
    id_evidencia INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    fk_id_reporte INT NOT NULL,
    ruta_fotografia VARCHAR(500) NOT NULL,
    descripcion VARCHAR(255),
    fecha_subida TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_evidsol_reporte FOREIGN KEY (fk_id_reporte) REFERENCES Reporte(id_reporte) ON DELETE CASCADE
);

CREATE TABLE Asignacion (
    id_asignacion INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    fk_id_reporte INT NOT NULL,
    fk_id_empleado INT NOT NULL,
    fecha_asignacion TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    observacion VARCHAR(255),
    CONSTRAINT fk_asig_reporte FOREIGN KEY (fk_id_reporte) REFERENCES Reporte(id_reporte) ON DELETE CASCADE,
    CONSTRAINT fk_asig_empleado FOREIGN KEY (fk_id_empleado) REFERENCES EmpleadoMunicipal(id_empleado)
);

CREATE TABLE Notificacion (
    id_notificacion INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    fk_id_usuario INT NOT NULL,
    fk_id_reporte INT NOT NULL,
    titulo VARCHAR(150) NOT NULL,
    mensaje VARCHAR(255) NOT NULL,
    fecha_notificacion TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    leida BOOLEAN DEFAULT FALSE,
    CONSTRAINT fk_notif_usuario FOREIGN KEY (fk_id_usuario) REFERENCES Usuario(id_usuario),
    CONSTRAINT fk_notif_reporte FOREIGN KEY (fk_id_reporte) REFERENCES Reporte(id_reporte) ON DELETE CASCADE
);

CREATE TABLE BitacoraCambioEstado (
    id_bitacora INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    fk_id_reporte INT NOT NULL,
    fk_id_estado_anterior INT,
    fk_id_estado_nuevo INT NOT NULL,
    fk_id_empleado INT,
    comentario VARCHAR(255),
    fecha_cambio TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_bit_reporte FOREIGN KEY (fk_id_reporte) REFERENCES Reporte(id_reporte) ON DELETE CASCADE,
    CONSTRAINT fk_bit_est_ant FOREIGN KEY (fk_id_estado_anterior) REFERENCES Estado(id_estado),
    CONSTRAINT fk_bit_est_nuev FOREIGN KEY (fk_id_estado_nuevo) REFERENCES Estado(id_estado),
    CONSTRAINT fk_bit_empleado FOREIGN KEY (fk_id_empleado) REFERENCES EmpleadoMunicipal(id_empleado)
);

-- ==========================================
-- 3. ÍNDICES DE RENDIMIENTO
-- ==========================================
CREATE INDEX idx_reporte_usuario ON Reporte(fk_id_usuario);
CREATE INDEX idx_reporte_estado ON Reporte(fk_id_estado);
CREATE INDEX idx_notificacion_usuario ON Notificacion(fk_id_usuario, leida);

-- ==========================================
-- 4. INSERCIÓN DE DATOS INICIALES
-- ==========================================

INSERT INTO Municipalidad (nombre, direccion, telefono, correo) VALUES
('Municipalidad Central', '6a Avenida 0-61 Zona 1, Guatemala', '22223333', 'contacto@muni.gob.gt'),
('Municipalidad Demo', 'Ciudad de Guatemala', '24445555', 'demo@civicfix.com');

INSERT INTO DepartamentoMunicipal (nombre, descripcion, fk_id_municipalidad) VALUES
('Obras Públicas', 'Mantenimiento de infraestructura vial y aceras', 1),
('Servicios Eléctricos', 'Alumbrado público y red eléctrica', 1),
('Atención Ciudadana', 'Departamento para pruebas de CivicFix', 2);

INSERT INTO ServicioMunicipal (nombre, descripcion, fk_id_departamento) VALUES
('Bacheo y Asfalto', 'Reparación de agujeros en la vía pública', 1),
('Mantenimiento de Red Eléctrica', 'Reparación de luminarias caídas o en mal estado', 2),
('Atención General', 'Gestión técnica y administrativa de reportes', 3);

INSERT INTO Estado (nombre, descripcion) VALUES
('Recibido', 'El reporte ha sido registrado por el ciudadano'),
('En Revisión', 'El reporte está siendo evaluado por el área correspondiente'),
('Asignado', 'Se ha asignado personal técnico para resolver la incidencia'),
('En Proceso', 'Los técnicos están trabajando en la solución'),
('Resuelto', 'La incidencia ha sido solucionada exitosamente'),
('Rechazado', 'El reporte fue descartado por información insuficiente o no procedente');

INSERT INTO Prioridad (codigo_ia, nombre, descripcion) VALUES
('PRIO_BAJA', 'Baja', 'Inconvenientes menores que no representan riesgo inminente'),
('PRIO_MEDIA', 'Media', 'Fallas operativas que requieren atención a mediano plazo'),
('PRIO_ALTA', 'Alta', 'Situaciones críticas que comprometen la seguridad ciudadana');

INSERT INTO TipoIncidencia (codigo_ia, nombre, descripcion) VALUES
('INC_BACHE', 'Bache o Daño en la Vía', 'Deterioro en la cinta asfáltica o adoquín'),
('INC_LUMINARIA', 'Falla de Alumbrado Público', 'Lámpara fundida, parpadeante o sin suministro'),
('INC_BASURA', 'Acumulación de Basura', 'Desechos sólidos acumulados en vía pública');

-- Se corrigen los parámetros de inserción para Usuario (6 campos exactos por fila):
INSERT INTO Usuario (nombre, apellido, usuario, correo, password, telefono) VALUES
('Carlos', 'Mendoza', 'cmendoza', 'cmendoza@example.com', '$2b$10$hprvJ799.VNgJdwu1Z.h3.t.MZsy913qJVRB1uciPkXZK6JwnRroy', '55551111'),
('Ana', 'Gómez', 'agomez', 'agomez@example.com', '$2b$10$hprvJ799.VNgJdwu1Z.h3.t.MZsy913qJVRB1uciPkXZK6JwnRroy', '55552222'),
('Ciudadano', 'Demo', 'ciudadano.demo', 'ciudadano.demo@example.com', '$2b$10$hprvJ799.VNgJdwu1Z.h3.t.MZsy913qJVRB1uciPkXZK6JwnRroy', '55554444');

INSERT INTO EmpleadoMunicipal (nombre, apellido, usuario, password, dpi, telefono, direccion, correo, cargo, id_departamento, id_municipalidad) VALUES
('Juan', 'Pérez', 'jperez', '$2b$10$P9jfauxXczzdR0sAR770wuPMnHgtB9HU6JL3dm4mPk.yMlxfngDbC', '2580123450101', '44441111', 'Zona 1, Guatemala', 'jperez@muni.gob.gt', 'Técnico de Campo', 1, 1),
('Empleado', 'Demo', 'empleado.demo', '$2b$10$P9jfauxXczzdR0sAR770wuPMnHgtB9HU6JL3dm4mPk.yMlxfngDbC', '1234567890101', '55556666', 'Ciudad de Guatemala', 'empleado.demo@civicfix.com', 'Empleado', 3, 2),
('Administrador', 'Demo', 'admin.demo', '$2b$10$BsDabARpfKjBPVCa6Xh1OuSsVN7zkuhvuX5zXwtvV6hGt7P3h2m.2', '1234567890102', '55557777', 'Ciudad de Guatemala', 'admin.demo@civicfix.com', 'Administrador', 3, 2);

INSERT INTO Ubicacion (direccion, zona, referencia, latitud, longitud) VALUES
('10a Avenida y 4a Calle', 'Zona 1', 'Frente a la farmacia principal', 14.63491500, -90.50688200),
('Diagonal 6 12-42', 'Zona 10', 'Cerca del centro comercial', 14.59881200, -90.51329100);

INSERT INTO Reporte (titulo, descripcion, fk_id_usuario, fk_id_tipo_incidencia, fk_id_ubicacion, fk_id_estado, fk_id_prioridad, fk_id_servicio) VALUES
('Bache profundo en el carril derecho', 'Un bache de gran dimensión está causando tráfico y posibles daños a vehículos.', 1, 1, 1, 4, 3, 1),
('Poste de luz sin funcionar', 'Luminaria apagada por las noches desde hace 3 días.', 2, 2, 2, 1, 2, 2);

INSERT INTO FotografiaProblema (fk_id_reporte, ruta_fotografia, descripcion) VALUES
(1, 'https://storage.civicfix.com/uploads/bache_z1_1.jpg', 'Vista frontal del bache en la carretera'),
(2, 'https://storage.civicfix.com/uploads/poste_z10_1.jpg', 'Luminaria apagada de noche');

INSERT INTO Asignacion (fk_id_reporte, fk_id_empleado, observacion) VALUES
(1, 1, 'Cuadrilla programada para reparación en horario nocturno.');

INSERT INTO BitacoraCambioEstado (fk_id_reporte, fk_id_estado_anterior, fk_id_estado_nuevo, fk_id_empleado, comentario) VALUES
(1, 1, 2, 1, 'Reporte validado e inspeccionado por el sistema.'),
(1, 2, 3, 1, 'Asignado al personal de campo para su atención.'),
(1, 3, 4, 1, 'Cuadrilla inicia trabajos de bacheo.');

INSERT INTO EvidenciaSolucion (fk_id_reporte, ruta_fotografia, descripcion) VALUES
(1, 'https://storage.civicfix.com/uploads/bache_reparado_z1.jpg', 'Trabajos de bacheo y nivelación completados');

INSERT INTO Notificacion (fk_id_usuario, fk_id_reporte, titulo, mensaje, leida) VALUES
(1, 1, 'Estado de reporte actualizado', 'Su reporte "Bache profundo en el carril derecho" se encuentra actualmente En Proceso.', FALSE);