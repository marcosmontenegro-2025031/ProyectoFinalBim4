import { UbicacionRepository } from '../repository/ubicacion.repository';
import { Ubicacion } from '../models/ubicacion.model';

export class UbicacionService {
    private repo = new UbicacionRepository();

    validarCoordenadas(latitud: number, longitud: number): boolean {
        return latitud >= -90 && latitud <= 90 && longitud >= -180 && longitud <= 180;
    }

    async consultarPorId(idUbicacion: number): Promise<Ubicacion | null> {
        return await this.repo.obtenerPorId(idUbicacion);
    }
}