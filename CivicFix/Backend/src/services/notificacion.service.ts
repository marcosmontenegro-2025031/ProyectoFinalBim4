
import {
  obtenerTodasLasNotificaciones,
  obtenerNotificacionPorId,
  marcarComoLeida,
  marcarComoNoLeida,
  marcarTodasComoLeidas,
  eliminarNotificacion
} from '../repository/notificacion.repository';

export const obtenerNotificaciones = async (idUsuario: number) => {
  return await obtenerTodasLasNotificaciones(idUsuario);
};

export const obtenerNotificacion = async (idNotificacion: number, idUsuario: number) => {
  return await obtenerNotificacionPorId(idNotificacion, idUsuario);
};

export const actualizarComoLeida = async (idNotificacion: number, idUsuario: number) => {
  return await marcarComoLeida(idNotificacion, idUsuario);
};

export const actualizarComoNoLeida = async (idNotificacion: number, idUsuario: number) => {
  return await marcarComoNoLeida(idNotificacion, idUsuario);
};

export const actualizarTodasComoLeidas = async (idUsuario: number) => {
  return await marcarTodasComoLeidas(idUsuario);
};

export const borrarNotificacion = async (idNotificacion: number, idUsuario: number) => {
  return await eliminarNotificacion(idNotificacion, idUsuario);
};
