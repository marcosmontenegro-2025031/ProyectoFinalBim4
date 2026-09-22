import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuariosService } from '../../services/usuarios.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login-usuario',
  standalone: true,
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
  }
}