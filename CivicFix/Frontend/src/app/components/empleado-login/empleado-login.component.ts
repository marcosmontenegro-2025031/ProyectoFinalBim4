import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmpleadoService } from '../../services/empleado.service';
import { Router } from '@angular/router';
import { SessionService } from '../../services/session.service';

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
    private router: Router,
    private session: SessionService
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
          const rol = this.session.obtenerRol();
          
          if (rol === 'administrador'){
            this.router.navigate(["/home-admin"]);
          }else {
            this.router.navigate(["/empleado/home"]);
          }
        },
        error: (err) => {
          alert(JSON.stringify(err.error));
        }
      })
    }else{
      this.loginForm.markAllAsTouched();
    }
  }
}
