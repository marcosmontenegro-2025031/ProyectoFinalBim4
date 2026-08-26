import { EstadoRepository } from '../repository/estado.repository';
import { Estado } from '../models/estado.model';

export class EstadoService {
    private repo = new EstadoRepository();

    async listarEstados(): Promise<Estado[]> {
        return await this.repo.obtenerTodos();
    }
}