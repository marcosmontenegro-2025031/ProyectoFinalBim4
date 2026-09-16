import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuariosService } from '../../service/usuarios.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  imports: [ReactiveFormsModule,RouterLink],
  standalone: true,
  selector: 'app-register-usuario',
  styleUrl: './register-usuario.css',
  templateUrl: './register-usuario.html',
})
export class RegisterUsuario {
  RegisterForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private usuariosService: UsuariosService,
    private router: Router
  ){
    this.RegisterForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      usuario: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      telefono: ['', Validators.required]
    })
  }

  mostarPassword = false;

  tooglePassword() {
    this.mostarPassword = !this.mostarPassword;
  }

  onSumit() {
    if (this.RegisterForm.valid) {
      this.usuariosService.crearUsuario(this.RegisterForm.value).subscribe({
        next: (response) => {
          console.log('Usuario registrado exitosamente.');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error('STATUS:', err.status);
          console.error('ERROR:', err.error);
          console.error('MENSAJE:', err.message);

          alert(JSON.stringify(err.error));
        }
      })
    }
  }
}
