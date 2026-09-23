import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
<<<<<<< HEAD
=======
  standalone: true,
>>>>>>> fix-jaquino-2025376
  imports: [],
  selector: 'app-formulario-redireccional',
  styleUrl: './formulario-redireccional.css',
  templateUrl: './formulario-redireccional.html',
})
export class FormularioRedireccional {
  constructor(private router: Router) {}

  redireccionarEmpleado() {
    this.router.navigate(['/empleado-login']);
  }

  redireccionarCiudadano() {
    this.router.navigate(['/login']);
  }
}
