import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuariosService } from '../../service/usuarios.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-usuario',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login-usuario.html',
  styleUrl: './login-usuario.css',
})
export class LoginUsuario {
  loginForm: FormGroup;

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

  mostrarPassword = false;

  togglePassword() {
    this.mostrarPassword = !this.mostrarPassword;
  }


  onSubmit() {
    if (this.loginForm.valid) {
      this.usuariosService.login(this.loginForm.value).subscribe({
        next: (response) => {
          console.log('Login exitoso. El token ya se guardó.');

          this.router.navigate(['/dashboard']); 
        },
        error: (err) => {
          console.error('Error en el login:', err);
          alert('Credenciales incorrectas. Inténtalo de nuevo.');
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
