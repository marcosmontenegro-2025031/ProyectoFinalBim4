import { FotoProblemaRepository } from '../repository/fotoProblema.repository';
import { FotoProblema } from '../models/fotoProblema.model';

export class FotoProblemaService {
    private repository = new FotoProblemaRepository();

    async listar(): Promise<FotoProblema[]> {
        return await this.repository.obtenerTodos();
    }

    async obtenerPorId(id: number): Promise<FotoProblema | null> {
        return await this.repository.obtenerPorId(id);
    }

    async obtenerPorReporte(idReporte: number): Promise<FotoProblema[]> {
        return await this.repository.obtenerPorReporte(idReporte);
    }

    async crear(foto: FotoProblema): Promise<FotoProblema> {
        return await this.repository.crear(foto);
    }

    async registrarFoto(foto: FotoProblema): Promise<FotoProblema> {
        return await this.repository.crear(foto);
    }

    async actualizar(
        id: number,
        foto: FotoProblema
    ): Promise<FotoProblema | null> {
        return await this.repository.actualizar(id, foto);
    }

    async eliminar(id: number): Promise<FotoProblema | null> {
        return await this.repository.eliminar(id);
    }
}