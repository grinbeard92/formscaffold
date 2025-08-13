import postgres from 'postgres';
import * as fs from 'fs';
import * as path from 'path';
import { postgresConfig } from '@/configurations/postgresConfiguration';

/**
 * Get PostgreSQL connection configuration from environment variables
 * with fallbacks to default values
 */
function getPostgresConfig() {
  const passwordPath = path.resolve(process.cwd(), 'postgres_password.txt');
  const password = fs.readFileSync(passwordPath, 'utf8').trim();

  if (!password) {
    console.warn(
      'Warning: Could not read password file. Trying DATABASE_URL or empty password.',
    );
  }

  if (process.env.DATABASE_URL && !password) {
    return process.env.DATABASE_URL;
  }

  return {
    host: postgresConfig.host || '127.0.0.1',
    port: postgresConfig.port,
    database: postgresConfig.database,
    username: postgresConfig.user,
    password: password,
    max: 10, // Maximum number of connections
    idle_timeout: 20, // Seconds before closing idle connections
    connect_timeout: 10, // Seconds before timing out connection attempts
    ssl: process.env.NODE_ENV === 'production' ? ('require' as const) : false,
    transform: {
      undefined: null, // Transform undefined values to null
    },
  };
}

const config = getPostgresConfig();
const sql = typeof config === 'string' ? postgres(config) : postgres(config);

if (process.env.NODE_ENV === 'development') {
  if (typeof config === 'string') {
  } else {
    console.log('📦 PostgreSQL connection configured:', {
      host: config.host,
      port: config.port,
      database: config.database,
      username: config.username,
      ssl: config.ssl,
    });
  }
}

export default sql;
