/**
 * Borra la tabla `usuarios` si quedó en un estado incompatible con synchronize
 * (columnas a medias, NULLs, etc.). Usa las mismas variables que el backend (.env).
 */
const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

function loadEnv(filePath) {
  if (!fs.existsSync(filePath)) {
    console.warn('No se encontró .env en', filePath);
    return;
  }
  const text = fs.readFileSync(filePath, 'utf8');
  for (const line of text.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = val;
  }
}

const root = path.join(__dirname, '..');
loadEnv(path.join(root, '.env'));

const client = new Client({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || 'postgres',
  database: process.env.DB_NAME || 'gestion_proyectos',
});

(async () => {
  await client.connect();
  await client.query('DROP TABLE IF EXISTS usuarios CASCADE');
  console.log('Listo: tabla usuarios eliminada. Ejecutá: npm run start:dev');
  await client.end();
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
