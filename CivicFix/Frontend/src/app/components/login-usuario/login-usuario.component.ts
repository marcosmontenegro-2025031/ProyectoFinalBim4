import { Component } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { UsuariosService } from '../../services/usuarios.service';
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'app-login-usuario',
  standalone: true,
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
  }
}