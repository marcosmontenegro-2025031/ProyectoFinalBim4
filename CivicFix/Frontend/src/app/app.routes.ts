import { Routes } from '@angular/router';
import { LoginUsuario } from './components/login-usuario/login-usuario.component';
import { RegisterUsuario } from './components/register-usuario/register-usuario.component';
import { EmpleadoLogin } from './empleado-login/empleado-login.component';
import { EmpleadoRegister } from './empleado-register/empleado-register.component';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: LoginUsuario },
    { path: 'register',component: RegisterUsuario },
    { path: 'empleado-login', component: EmpleadoLogin },
    { path: 'empleado/register', component: EmpleadoRegister }
];
