import { PostgresConfig } from '@/types/globalFormTypes';

// PostgreSQL Database Configuration
export const postgresConfig: PostgresConfig = {
  host: '127.0.0.1',
  port: 7799,
  database: 'formscaffold_db',
  user: 'formscaffold_user',
  passwordFile: 'postgres_password.txt',
  containerName: 'formscaffold-postgres',
  image: 'postgres:17-alpine3.22',
  backupEnabled: true,
  backupInterval: '6h',
  backupRetentionDays: 7,
  memoryLimit: '1G',
  memoryReservation: '512M',
};
