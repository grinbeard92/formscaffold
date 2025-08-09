// Docker compose generator
import { IPostgresConfig } from '../types/globalFormTypes';
import * as fs from 'fs/promises';
import * as path from 'path';
import { randomBytes } from 'crypto';
import { postgresConfig } from '@/configurations/postgresConfiguration';

/**
 * Creates a Docker Compose file and related setup files
 */
export async function createDockerComposeFiles(
  projectRoot: string,
): Promise<void> {
  // Generate a secure random password
  const password = generateSecurePassword();

  // Create necessary directories
  await ensureDirectories(projectRoot);

  // Write password to file
  const passwordFile = postgresConfig.passwordFile || 'postgres_password.txt';
  await writePasswordFile(projectRoot, password, passwordFile);

  // Generate Docker Compose content
  const dockerComposeContent = generateDockerCompose(postgresConfig, password);

  // Write Docker Compose file
  await fs.writeFile(
    path.join(projectRoot, '.docker', 'docker-compose.yml'),
    dockerComposeContent,
    'utf8',
  );

  console.log('✅ Generated Docker Compose files:');
  console.log('   - .docker/docker-compose.yml');
  console.log('   - postgres_password.txt');
}

/**
 * Generates a secure random password
 */
function generateSecurePassword(): string {
  return randomBytes(16)
    .toString('base64')
    .replace(/[^a-zA-Z0-9]/g, '')
    .substring(0, 16);
}

/**
 * Ensures all necessary directories exist
 */
async function ensureDirectories(projectRoot: string): Promise<void> {
  const directories = [
    path.join(projectRoot, '.docker'),
    path.join(projectRoot, 'data'),
    path.join(projectRoot, 'data', 'postgres'),
    path.join(projectRoot, 'data', 'backups'),
    path.join(projectRoot, 'init-scripts'),
  ];

  for (const dir of directories) {
    try {
      await fs.mkdir(dir, { recursive: true });
    } catch {
      // Directory might already exist, which is fine
    }
  }
}

/**
 * Writes the password to the specified file
 */
async function writePasswordFile(
  projectRoot: string,
  password: string,
  passwordFile: string,
): Promise<void> {
  await fs.writeFile(path.join(projectRoot, passwordFile), password, 'utf8');
}

/**
 * Generates the Docker Compose YAML content
 */
function generateDockerCompose(
  postgresConfig: IPostgresConfig,
  password: string,
): string {
  let composeContent = `services:
  ${postgresConfig.containerName}:
    image: ${postgresConfig.image}
    container_name: ${postgresConfig.containerName}
    restart: unless-stopped
    environment:
      POSTGRES_DB: ${postgresConfig.database}
      POSTGRES_USER: ${postgresConfig.user}
      POSTGRES_PASSWORD: ${password}
      PGDATA: /var/lib/postgresql/data/formscaffold_pgdata
    ports:
      - "${postgresConfig.port}:5432"
    volumes:
      - ./data/postgres:/var/lib/postgresql/formscaffold_pgdata
      - ./init-scripts:/docker-entrypoint-initdb.d
    deploy:
      resources:
        limits:
          memory: ${postgresConfig.memoryLimit}
        reservations:
          memory: ${postgresConfig.memoryReservation}
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${postgresConfig.user} -d ${postgresConfig.database}"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 30s`;

  // Add backup service if enabled
  if (postgresConfig.backupEnabled) {
    const backupInterval = postgresConfig.backupInterval || '6h';
    const intervalHours = backupInterval.replace('h', '');

    composeContent += `

  ${postgresConfig.containerName}-backup:
    image: ${postgresConfig.image}
    container_name: ${postgresConfig.containerName}-backup
    restart: unless-stopped
    environment:
      PGPASSWORD: ${password}
    volumes:
      - ./data/backups:/backups
      - ./data/postgres:/var/lib/postgresql/data:ro
    command: >
      sh -c "
        while true; do
          sleep ${intervalHours}h
          pg_dump -h ${postgresConfig.containerName} -U ${postgresConfig.user} -d ${postgresConfig.database} > /backups/backup_$$(date +%Y%m%d_%H%M%S).sql
          find /backups -name 'backup_*.sql' -mtime +${postgresConfig.backupRetentionDays || 7} -delete
        done
      "
    depends_on:
      ${postgresConfig.containerName}:
        condition: service_healthy`;
  }

  composeContent += `

networks:
  default:
    name: ${postgresConfig.containerName}-network`;

  return composeContent;
}
