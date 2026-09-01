import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Usuario} from '../models/usuarios.model';

@Injectable({
    providedIn: "root",
})
export class UsuariosService {
    private apiUrl = "http://localhost:3000/api/usuarios";

    constructor(private http: HttpClient) {}

    crearUsuario(usuario: Usuario){
        return this.http.post<Usuario>(this.apiUrl, usuario);
    }
}
