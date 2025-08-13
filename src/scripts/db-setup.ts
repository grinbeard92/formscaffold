/**
 * Database Setup Script
 *
 * This script generates Docker Compose and related database files
 * for all FormConfiguration files found in the configurations directory.
 *
 * Usage: npm run db:setup
 */

import {
  discoverFormConfigurations,
  validateConfigurations,
} from './get-project-info';
import { createDockerComposeFiles } from './generate-docker-compose';
import { createDatabaseInitFiles } from './db-init';
import * as path from 'path';
import { postgresConfig } from '@/configurations/postgresConfiguration';

async function main() {
  try {
    const projectRoot = path.resolve(__dirname, '..', '..');
    const configurations = await discoverFormConfigurations(projectRoot, false);

    if (configurations.length === 0) {
      process.exit(1);
    }

    validateConfigurations(configurations);

    for (const { config, fileName, exportName } of configurations) {
      await createDockerComposeFiles(projectRoot);
      await createDatabaseInitFiles(config, projectRoot);
      console.log(
        `   ✅ Database setup completed for ${config.postgresTableName}\n`,
      );
    }

    configurations.forEach(({ config }) => {
      console.log(
        `   - ${config.title} accessible at: localhost:${postgresConfig.port}`,
      );
    });
  } catch (error) {
    console.error('❌ Error setting up databases:', error);
    process.exit(1);
  }
}

main().catch(console.error);
