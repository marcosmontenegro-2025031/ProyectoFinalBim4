import { Component, ChangeDetectorRef, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { forkJoin, Observable, of } from 'rxjs';

import { AdminApiService } from '../../services/admin-api.service';
import { AdminSidebarComponent } from '../../shared/admin-sidebar/admin-sidebar.component';

interface Campo {
  clave: string;
  etiqueta: string;
  tipo?: 'text' | 'email' | 'tel' | 'password' | 'textarea' | 'number' | 'select';
  obligatorio?: boolean;
  opciones?: string;
  maximo?: number;
  ayuda?: string;
}

interface Definicion {
  titulo: string;
  singular: string;
  campos: Campo[];
}

const campo = (
  clave: string,
  etiqueta: string,
  obligatorio = false,
  tipo: Campo['tipo'] = 'text',
  maximo?: number,
  ayuda?: string
): Campo => ({
  clave,
  etiqueta,
  obligatorio,
  tipo,
  maximo,
  ayuda
});

const select = (
  clave: string,
  etiqueta: string,
  opciones: string,
  obligatorio = true
): Campo => ({
  clave,
  etiqueta,
  opciones,
  tipo: 'select',
  obligatorio
});

const descripcion = () =>
  campo('descripcion', 'Descripción', false, 'textarea', 255);

const nombre = (maximo = 150) =>
  campo('nombre', 'Nombre', true, 'text', maximo);

const contacto = [
  campo(
    'telefono',
    'Teléfono',
    false,
    'tel',
    20,
    'Solo dígitos (8 a 20).'
  ),
  campo(
    'correo',
    'Correo electrónico',
    false,
    'email',
    150
  )
];

const persona = [
  nombre(100),
  campo('apellido', 'Apellido', true, 'text', 100),
  campo('usuario', 'Nombre de usuario', true, 'text', 50),
  campo('correo', 'Correo electrónico', true, 'email', 150),
  campo('telefono', 'Teléfono', false, 'tel', 20),
  campo(
    'password',
    'Contraseña',
    true,
    'password',
    255,
    'Mínimo 8 caracteres. Al editar, déjala vacía para conservar la actual.'
  )
];

export const DEFINICIONES_ADMIN: Record<string, Definicion> = {
  usuarios: {
    titulo: 'Usuarios',
    singular: 'usuario',
    campos: persona
  },

  empleados: {
    titulo: 'Empleados municipales',
    singular: 'empleado',
    campos: [
      ...persona,
      campo('dpi', 'DPI', false, 'text', 20),
      campo('direccion', 'Dirección', false, 'text', 80),
      campo(
        'cargo',
        'Cargo',
        true,
        'text',
        100,
        'Para otorgar acceso al panel, utiliza el cargo Administrador.'
      ),
      select(
        'id_municipalidad',
        'Municipalidad',
        'municipalidades'
      ),
      select(
        'id_departamento',
        'Departamento municipal',
        'departamentos'
      )
    ]
  },

  municipalidades: {
    titulo: 'Municipalidades',
    singular: 'municipalidad',
    campos: [
      nombre(),
      campo('direccion', 'Dirección', false, 'text', 250),
      ...contacto
    ]
  },

  departamentos: {
    titulo: 'Departamentos',
    singular: 'departamento',
    campos: [
      nombre(),
      descripcion(),
      select(
        'id_municipalidad',
        'Municipalidad',
        'municipalidades'
      )
    ]
  },

  servicios: {
    titulo: 'Servicios municipales',
    singular: 'servicio',
    campos: [
      nombre(),
      descripcion(),
      select(
        'id_departamento',
        'Departamento',
        'departamentos'
      )
    ]
  },

  'tipos-incidencia': {
    titulo: 'Tipos de incidencia',
    singular: 'tipo de incidencia',
    campos: [
      nombre(100),
      campo(
        'codigo_ia',
        'Código de IA',
        true,
        'text',
        50,
        'Ejemplo: INC_BACHE. Debe ser único.'
      ),
      descripcion()
    ]
  },

  prioridades: {
    titulo: 'Prioridades',
    singular: 'prioridad',
    campos: [
      nombre(50),
      campo(
        'codigo_ia',
        'Código de IA',
        true,
        'text',
        50,
        'Ejemplo: PRIO_ALTA. Debe ser único.'
      ),
      descripcion()
    ]
  },

  estados: {
    titulo: 'Estados',
    singular: 'estado',
    campos: [
      nombre(50),
      descripcion()
    ]
  },

  ubicaciones: {
    titulo: 'Ubicaciones',
    singular: 'ubicación',
    campos: [
      campo(
        'direccion',
        'Dirección',
        true,
        'text',
        255
      ),
      campo(
        'zona',
        'Zona',
        false,
        'text',
        100
      ),
      campo(
        'referencia',
        'Referencia',
        false,
        'text',
        255
      ),
      campo(
        'latitud',
        'Latitud',
        false,
        'number',
        undefined,
        'Entre -90 y 90.'
      ),
      campo(
        'longitud',
        'Longitud',
        false,
        'number',
        undefined,
        'Entre -180 y 180.'
      )
    ]
  },

  asignaciones: {
    titulo: 'Asignaciones',
    singular: 'asignación',
    campos: [
      select(
        'id_reporte',
        'Reporte',
        'reportes'
      ),
      select(
        'id_empleado',
        'Empleado responsable',
        'empleados'
      ),
      campo(
        'observacion',
        'Observación',
        false,
        'textarea',
        255
      )
    ]
  },

  reportes: {
    titulo: 'Reportes ciudadanos',
    singular: 'reporte',
    campos: [
      campo(
        'titulo',
        'Título',
        true,
        'text',
        150
      ),
      campo(
        'descripcion',
        'Descripción',
        true,
        'textarea'
      ),
      select(
        'id_usuario',
        'Ciudadano',
        'usuarios'
      ),
      select(
        'id_tipo_incidencia',
        'Tipo de incidencia',
        'tipos-incidencia'
      ),
      select(
        'id_ubicacion',
        'Ubicación',
        'ubicaciones'
      ),
      select(
        'id_estado',
        'Estado',
        'estados'
      ),
      select(
        'id_prioridad',
        'Prioridad',
        'prioridades'
      ),
      select(
        'id_servicio',
        'Servicio municipal (opcional)',
        'servicios',
        false
      )
    ]
  }
};

type Registro = Record<string, any>;

@Component({
  selector: 'app-admin-formulario',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    AdminSidebarComponent
  ],
  templateUrl: './admin-formulario.html',
  styleUrl: './admin-formulario.css'
})
export class AdminFormularioComponent implements OnInit {

  private ruta = inject(ActivatedRoute);
  private navegar = inject(Router);
  private api = inject(AdminApiService);
  private cd = inject(ChangeDetectorRef);

  modulo = '';
  id: number | null = null;

  definicion: Definicion = {
    titulo: '',
    singular: '',
    campos: []
  };

  valores: Registro = {};
  catalogos: Record<string, Registro[]> = {};

  cargando = true;
  guardando = false;

  error = '';
  exito = '';

  get editando(): boolean {
    return this.id !== null;
  }

  get volver(): string {
    return '/admin/' + this.modulo;
  }

  get titulo(): string {
    return (
      (this.editando ? 'Editar ' : 'Agregar ') +
      this.definicion.singular
    );
  }

  ngOnInit(): void {
    this.modulo =
      this.ruta.snapshot.paramMap.get('modulo') || '';

    const def = DEFINICIONES_ADMIN[this.modulo];

    if (!def) {
      this.navegar.navigateByUrl('/home-admin');
      return;
    }

    this.definicion = def;

    const texto =
      this.ruta.snapshot.paramMap.get('id');

    if (texto !== null) {
      this.id = Number(texto);

      if (
        !Number.isSafeInteger(this.id) ||
        this.id <= 0
      ) {
        this.navegar.navigateByUrl(this.volver);
        return;
      }
    }

    const claves = [
      ...new Set(
        def.campos
          .map(c => c.opciones)
          .filter(
            (v): v is string => !!v
          )
      )
    ];

    const peticiones: Record<
      string,
      Observable<any>
    > = {};

    for (const key of claves) {
      peticiones[key] =
        this.api.listar<Registro>(key);
    }

    if (this.editando) {
      peticiones['registro'] =
        this.api.detalle<Registro>(
          this.modulo,
          this.id!
        );
    }

    if (!Object.keys(peticiones).length) {
      peticiones['inicio'] = of(true);
    }

    // Evitar forkJoin vacío.
    // Los formularios sencillos también se habilitan.
    forkJoin(peticiones).subscribe({
      next: respuesta => {

        for (const clave of claves) {
          this.catalogos[clave] =
            (respuesta[clave] as Registro[]) || [];
        }

        const registro =
          respuesta['registro'] as Registro | undefined;

        for (const c of def.campos) {
          const original =
            registro?.[c.clave];

          this.valores[c.clave] =
            c.tipo === 'password'
              ? ''
              : original ??
                (c.tipo === 'select'
                  ? null
                  : '');
        }

        this.cargando = false;

        this.cd.markForCheck();
      },

      error: e => {
        this.error =
          e?.error?.message ||
          'No se pudo cargar el formulario. Revisa la sesión y la base de datos.';

        this.cargando = false;

        this.cd.markForCheck();
      }
    });
  }

  opciones(c: Campo): Registro[] {
    const registros =
      this.catalogos[c.opciones || ''] || [];

    // El departamento del empleado debe
    // pertenecer a su municipalidad.
    if (
      this.modulo === 'empleados' &&
      c.clave === 'id_departamento' &&
      this.valores['id_municipalidad']
    ) {
      return registros.filter(
        d =>
          Number(d['id_municipalidad']) ===
          Number(
            this.valores['id_municipalidad']
          )
      );
    }

    return registros;
  }

  etiqueta(
    opcion: Registro,
    coleccion: string
  ): string {

    if (
      coleccion === 'usuarios' ||
      coleccion === 'empleados'
    ) {
      return `${opcion['nombre']} ${opcion['apellido']} (${
        opcion['usuario'] ||
        opcion['correo'] ||
        '#' + opcion['id']
      })`;
    }

    if (coleccion === 'reportes') {
      return `#${opcion['id']} - ${opcion['titulo']}`;
    }

    if (coleccion === 'ubicaciones') {
      return `#${opcion['id']} - ${opcion['direccion']}${
        opcion['zona']
          ? ' (' + opcion['zona'] + ')'
          : ''
      }`;
    }

    return `${
      opcion['nombre'] ||
      opcion['direccion']
    } (#${opcion['id']})`;
  }

  cambioSelect(clave: string): void {
    if (
      clave === 'id_municipalidad' &&
      this.modulo === 'empleados'
    ) {
      this.municipalidadCambiada();
    }
  }

  municipalidadCambiada(): void {

    const dep =
      (this.catalogos['departamentos'] || [])
        .find(
          d =>
            Number(d['id']) ===
            Number(
              this.valores['id_departamento']
            )
        );

    if (
      dep &&
      Number(dep['id_municipalidad']) !==
        Number(
          this.valores['id_municipalidad']
        )
    ) {
      this.valores['id_departamento'] = null;
    }
  }

  esObligatorio(c: Campo): boolean {
    return (
      !!c.obligatorio &&
      !(
        this.editando &&
        c.clave === 'password'
      )
    );
  }

  guardar(form: NgForm): void {

    if (
      this.guardando ||
      this.cargando
    ) {
      return;
    }

    this.error = '';
    this.exito = '';

    if (form.invalid) {
      form.control.markAllAsTouched();

      this.error =
        'Completa correctamente los campos obligatorios.';

      return;
    }

    const datos: Registro = {};

    for (const c of this.definicion.campos) {

      const raw =
        this.valores[c.clave];

      // Al editar, una contraseña vacía
      // conserva la contraseña existente.
      if (
        c.clave === 'password' &&
        !raw
      ) {
        continue;
      }

      const valor =
        typeof raw === 'string'
          ? raw.trim()
          : raw;

      if (
        c.obligatorio &&
        !(
          this.editando &&
          c.clave === 'password'
        ) &&
        (
          valor === null ||
          valor === undefined ||
          valor === ''
        )
      ) {
        this.error =
          `Completa el campo ${c.etiqueta}.`;

        return;
      }

      if (
        c.clave === 'password' &&
        String(raw).length < 8
      ) {
        this.error =
          'La contraseña debe tener mínimo 8 caracteres.';

        return;
      }

      if (
        c.tipo === 'number' &&
        valor !== null &&
        valor !== '' &&
        !Number.isFinite(
          Number(valor)
        )
      ) {
        this.error =
          'Coordenadas no válidas.';

        return;
      }

      if (
        c.tipo === 'select' &&
        valor !== null &&
        valor !== '' &&
        (
          !Number.isSafeInteger(
            Number(valor)
          ) ||
          Number(valor) <= 0
        )
      ) {
        this.error =
          `Selecciona ${c.etiqueta}.`;

        return;
      }

      datos[c.clave] =
        valor === '' &&
        !c.obligatorio &&
        c.tipo === 'select'
          ? null
          : valor;
    }

    this.guardando = true;

    const solicitud =
      this.editando
        ? this.api.editar(
            this.modulo,
            this.id!,
            datos
          )
        : this.api.crear(
            this.modulo,
            datos
          );

    solicitud.subscribe({

      next: () => {
        this.guardando = false;

        this.navegar.navigateByUrl(
          this.volver
        );
      },

      error: e => {
        this.guardando = false;

        this.error =
          e?.error?.message ||
          'No se pudo guardar. Comprueba tus datos y permisos.';

        this.cd.markForCheck();
      }
    });
  }
}
