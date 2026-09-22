import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmpleadoService } from '../../service/empleado.service';
import { Router } from '@angular/router';

@Component({
  imports: [ReactiveFormsModule],
  standalone: true,
  selector: 'app-empleado-login',
  templateUrl: './empleado-login.html',
  styleUrl: './empleado-login.css',
})
export class EmpleadoLogin {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private empleadoService: EmpleadoService,
    private router: Router
  ){
    this.loginForm = this.fb.group({
      usuario: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    })
  }
  
  mostrarPassword = false;

  togglePassword() {
    this.mostrarPassword = !this.mostrarPassword;
  }

  onSubmit(){
    if (this.loginForm.valid){
      this.empleadoService.login(this.loginForm.value).subscribe({
        next: (response) => {
          console.log('Login exitoso. El token ya se guardó.');
          const rol = response?.usuario?.rol;
          
          if (rol === "Adminitrador"){
            this.router.navigate(["/home-admin"]);
          }else {
            this.router.navigate(["/home-empleado"]);
          }
        },
        error: (err) => {
          console.error('STATUS:', err.status);
          console.error('ERROR:', err.error);
          console.error('MENSAJE:', err.message);

          alert(JSON.stringify(err.error));
        }
      })
    }else{
      this.loginForm.markAllAsTouched();
    }
  }
}
