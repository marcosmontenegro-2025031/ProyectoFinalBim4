
import {
  obtenerTodasLasNotificaciones,
  obtenerNotificacionPorId,
  marcarComoLeida,
  marcarTodasComoLeidas,
  eliminarNotificacion
} from '../repository/notificacion.repository';

export const obtenerNotificaciones = async () => {
  return await obtenerTodasLasNotificaciones();
};

export const obtenerNotificacion = async (idNotificacion: number) => {
  return await obtenerNotificacionPorId(idNotificacion);
};

export const actualizarComoLeida = async (idNotificacion: number) => {
  return await marcarComoLeida(idNotificacion);
};

export const actualizarTodasComoLeidas = async () => {
  return await marcarTodasComoLeidas();
};

export const borrarNotificacion = async (idNotificacion: number) => {
  return await eliminarNotificacion(idNotificacion);
};
