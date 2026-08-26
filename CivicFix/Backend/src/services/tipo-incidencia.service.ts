import { TipoIncidenciaRepository } from '../repository/tipo-incidencia.repository';
import { TipoIncidencia } from '../models/tipo-incidencia.model';

export class TipoIncidenciaService {
    private repo = new TipoIncidenciaRepository();

    async listarTipos(): Promise<TipoIncidencia[]> {
        return await this.repo.obtenerTodos();
    }

    async validarTipoExiste(codigoIa: string): Promise<boolean> {
        const tipo = await this.repo.obtenerPorCodigoIa(codigoIa);
        return tipo !== null;
    }
}