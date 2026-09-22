import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmpleadoService } from '../../services/empleado.service';
import { DepartamentoService } from '../../services/departamento.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  standalone: true,
  selector: 'app-empleado-register',
  styleUrl: './empleado-register.css',
  templateUrl: './empleado-register.html',
})
export class EmpleadoRegister implements OnInit {
  RegisterForm: FormGroup;
  departamentos: any[] = [];

  constructor(
    private fb: FormBuilder,
    private empleadoService: EmpleadoService,
    private departamentoService: DepartamentoService,
    private router: Router
  ){
    this.RegisterForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      usuario: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]],
      dpi: ['', [Validators.required, Validators.minLength(13), Validators.maxLength(13)]],
      telefono: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      cargo: ['', Validators.required],
      id_departamento: ['', Validators.required]
    })
  }

  ngOnInit() {
    this.departamentoService.obtenerDepartamentos().subscribe({
      next: (data) => {
        this.departamentos = data;
      },
      error: (err) => {
        console.error('Error al cargar departamentos:', err);
      }
    });
  }

  mostarPassword = false;

  tooglePassword() {
    this.mostarPassword = !this.mostarPassword;
  }

  onSumit() {
    if (this.RegisterForm.valid) {
      this.empleadoService.crearEmpleado(this.RegisterForm.value).subscribe({
        next: (response) => {
          console.log('Empleado registrado exitosamente.');
          this.router.navigate(['/empleado-login']);
        },
        error: (err) => {
          console.error('STATUS:', err.status);
          console.error('ERROR:', err.error);
          console.error('MENSAJE:', err.message);

          alert(JSON.stringify(err.error));
        }
      })
    } else {
      this.RegisterForm.markAllAsTouched();
    }
  }
}