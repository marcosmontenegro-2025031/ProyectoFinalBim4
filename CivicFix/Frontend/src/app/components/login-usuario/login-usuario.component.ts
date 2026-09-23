import { Component } from '@angular/core';
<<<<<<< HEAD
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { UsuariosService } from '../../services/usuarios.service';
import { SessionService } from '../../services/session.service';
=======
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuariosService } from '../../services/usuarios.service';
import { Router, RouterLink } from '@angular/router';
>>>>>>> fix-jaquino-2025376

@Component({
  selector: 'app-login-usuario',
  standalone: true,
<<<<<<< HEAD
  imports: [
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './login-usuario.html',
  styleUrl: './login-usuario.css'
})
export class LoginUsuario {

  loginForm: FormGroup;

  mostrarPassword = false;

  cargando = false;

  mensajeError = '';

  constructor(
    private fb: FormBuilder,
    private usuariosService: UsuariosService,
    private sessionService: SessionService,
    private router: Router
  ) {

    this.loginForm = this.fb.group({
      usuario: [
        '',
        [
          Validators.required
        ]
      ],

      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8)
        ]
      ]
    });
  }

  togglePassword(): void {
    this.mostrarPassword = !this.mostrarPassword;
  }

  onSubmit(): void {

    this.mensajeError = '';

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.cargando = true;

    const credentials = {
      usuario: this.loginForm.get('usuario')?.value,
      password: this.loginForm.get('password')?.value
    };

    this.usuariosService.login(credentials).subscribe({

      next: (response) => {

        console.log('Login exitoso');
        console.log('Usuario:', this.sessionService.obtenerUsuario());
        console.log('Rol:', this.sessionService.obtenerRol());
        console.log('Token:', !!this.sessionService.obtenerToken());

        this.cargando = false;

        if (!this.sessionService.esCiudadano()) {
          this.mensajeError =
            'La cuenta no corresponde al rol ciudadano.';

          this.sessionService.cerrarSesion();

          return;
        }

        this.router.navigate(['/home-usuario']);
      },

      error: (err) => {

        this.cargando = false;

        console.error('STATUS:', err.status);
        console.error('ERROR:', err.error);
        console.error('MENSAJE:', err.message);

        if (err.status === 401) {

          this.mensajeError =
            'Usuario o contraseña incorrectos.';

        } else if (err.status === 403) {

          this.mensajeError =
            'No tienes permiso para ingresar como ciudadano.';

        } else {

          this.mensajeError =
            'No fue posible iniciar sesión. Verifica que el servidor esté funcionando.';
        }
      }
    });
=======
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login-usuario.html',
  styleUrl: './login-usuario.css',
})
export class LoginUsuario {
  loginForm: FormGroup;
  mostrarPassword = false;

  constructor(
    private fb: FormBuilder,
    private usuariosService: UsuariosService,
    private router: Router 
  ) {
    this.loginForm = this.fb.group({
      usuario: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  togglePassword() {
    this.mostrarPassword = !this.mostrarPassword;
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.usuariosService.login(this.loginForm.value).subscribe({
        next: (response: any) => {
          // Extrae el token de forma segura sin importar cómo lo devuelva el backend
          const token = response.token || response.accessToken || (typeof response === 'string' ? response : null);
          
          if (token) {
            localStorage.setItem('token', typeof token === 'string' ? token : token.token);
          }

          // Redirige al home del usuario una vez guardado el token
          this.router.navigate(['/home-usuario']); 
        },
        error: (err) => {
          alert(JSON.stringify(err.error || 'Error al iniciar sesión'));
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
>>>>>>> fix-jaquino-2025376
  }
}