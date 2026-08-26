import bcrypt from 'bcryptjs';

export const encriptarContrasena = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10); 
  return await bcrypt.hash(password, salt);
};


export const verificarContrasena = async (password: string, passwordEncriptado: string): Promise<boolean> => {
  return await bcrypt.compare(password, passwordEncriptado);
};
