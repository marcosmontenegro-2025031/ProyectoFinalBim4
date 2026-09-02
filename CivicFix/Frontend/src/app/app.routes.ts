import { Routes } from '@angular/router';
import { LoginUsuario } from './components/login-usuario/login-usuario.component';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: LoginUsuario },
];
