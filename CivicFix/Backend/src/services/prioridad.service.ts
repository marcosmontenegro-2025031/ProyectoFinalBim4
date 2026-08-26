import { PrioridadRepository } from '../repository/prioridad.repository';
import { Prioridad } from '../models/prioridad.model';

export class PrioridadService {
    private repo = new PrioridadRepository();

    async listarPrioridades(): Promise<Prioridad[]> {
        return await this.repo.obtenerTodas();
    }
}