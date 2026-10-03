import bcrypt from 'bcryptjs';

export const encriptarContrasena = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

export const verificarContrasena = async (password: string, passwordEncriptado: string): Promise<boolean> => {
  if (!passwordEncriptado) return false;

  try {
    const coincideConHash = await bcrypt.compare(password, passwordEncriptado);
    if (coincideConHash) return true;
  } catch {
    // Si la contraseña almacenada es legacy y no está hasheada, se valida abajo.
  }

  return password === passwordEncriptado;
};
