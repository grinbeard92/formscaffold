import postgres from 'postgres';
import { demoFormConfiguration } from '@/components/form/DemoFormConfiguration';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Get PostgreSQL connection configuration from FormConfiguration
 */
function getPostgresConfig() {
  const { postgresConfig } = demoFormConfiguration;
  
  // Try to get password from multiple sources (in order of preference):
  // 1. Environment variable POSTGRES_PASSWORD
  // 2. Password file specified in config
  // 3. Environment variable DATABASE_URL
  let password = process.env.POSTGRES_PASSWORD || '';
  
  if (!password) {
    try {
      const passwordPath = path.resolve(process.cwd(), postgresConfig.passwordFile || 'postgres_password.txt');
      password = fs.readFileSync(passwordPath, 'utf8').trim();
    } catch {
      console.warn('Warning: Could not read password file. Trying DATABASE_URL or empty password.');
    }
  }
  
  // If DATABASE_URL is provided, use it directly
  if (process.env.DATABASE_URL && !password) {
    return process.env.DATABASE_URL;
  }
  
  return {
    host: process.env.POSTGRES_HOST || postgresConfig.host || '127.0.0.1',
    port: parseInt(process.env.POSTGRES_PORT || postgresConfig.port?.toString() || '5432'),
    database: process.env.POSTGRES_DB || postgresConfig.database,
    username: process.env.POSTGRES_USER || postgresConfig.user,
    password: password,
    // Additional postgres.js options
    max: 10, // Maximum number of connections
    idle_timeout: 20, // Seconds before closing idle connections
    connect_timeout: 10, // Seconds before timing out connection attempts
    ssl: process.env.NODE_ENV === 'production' ? 'require' as const : false,
    transform: {
      undefined: null, // Transform undefined values to null
    },
  };
}

// Create postgres connection with configuration from FormConfiguration
const config = getPostgresConfig();
const sql = typeof config === 'string' ? postgres(config) : postgres(config);

// Log connection info (without password) in development
if (process.env.NODE_ENV === 'development') {
  if (typeof config === 'string') {
    console.log('📦 PostgreSQL connection configured with DATABASE_URL');
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
