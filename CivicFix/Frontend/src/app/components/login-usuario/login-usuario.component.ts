import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuariosService } from '../../services/usuarios.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login-usuario',
  standalone: true,
  imports: [ReactiveFormsModule,RouterLink],
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

          this.router.navigate(['/home-usuario']); 
        },
        error: (err) => {
          console.error('STATUS:', err.status);
          console.error('ERROR:', err.error);
          console.error('MENSAJE:', err.message);

          alert(JSON.stringify(err.error));
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
