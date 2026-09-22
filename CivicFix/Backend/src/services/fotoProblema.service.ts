import { FotoProblemaRepository } from '../repository/fotoProblema.repository';
import { FotoProblema } from '../models/fotoProblema.model';

export class FotoProblemaService {
    private repository = new FotoProblemaRepository();

    async registrarFoto(foto: FotoProblema): Promise<FotoProblema> {
        return await this.repository.crear(foto);
    }
}

