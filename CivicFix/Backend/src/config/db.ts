import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT) || 5432,
  max: 10,
  idleTimeoutMillis: 30000 
});

pool.on('connect', () => {
  console.log('Conexión exitosa con el Pool de PostgreSQL');
});

pool.on('error', (err) => {
  console.error('Error inesperado en el cliente de Postgres', err);
});