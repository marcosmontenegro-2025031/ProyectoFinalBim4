import { Routes } from '@angular/router';
import { LoginUsuario } from './components/login-usuario/login-usuario.component';
import { RegisterUsuario } from './components/register-usuario/register-usuario.component';
import { EmpleadoLogin } from './components/empleado-login/empleado-login.component';
import { EmpleadoRegister } from './components/empleado-register/empleado-register.component';
import { FormularioRedireccional } from './components/formulario-redireccional/formulario-redireccional.component';

export const routes: Routes = [
    { path: '', redirectTo: '/formulario', pathMatch: 'full' },
    { path: 'formulario', component: FormularioRedireccional },
    { path: 'login', component: LoginUsuario },
    { path: 'register',component: RegisterUsuario },
    { path: 'empleado-login', component: EmpleadoLogin },
    { path: 'empleado/register', component: EmpleadoRegister }
];
