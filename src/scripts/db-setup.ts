#!/usr/bin/env tsx

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
} from './get-form-configurations';
import { createDockerComposeFiles } from './generate-docker-compose';
import { createDatabaseInitFiles } from './db-init';
import * as path from 'path';
import { postgresConfig } from '@/configurations/postgresConfiguration';

async function main() {
  console.log('🚀 Setting up databases from all FormConfigurations...\n');

  try {
    const projectRoot = path.resolve(__dirname, '..', '..');
    const configurations = await discoverFormConfigurations(projectRoot);

    if (configurations.length === 0) {
      console.log('❌ No FormConfiguration files found.');
      process.exit(1);
    }

    // Validate configurations don't have conflicts
    validateConfigurations(configurations);

    console.log(`\n📋 Processing ${configurations.length} configuration(s):\n`);

    for (const { config, fileName, exportName } of configurations) {
      console.log(`🔧 Setting up database for ${exportName} (${fileName}):`);
      console.log(`   Database: ${postgresConfig.database}`);
      console.log(`   User: ${postgresConfig.user}`);
      console.log(`   Port: ${postgresConfig.port}`);
      console.log(`   Container: ${postgresConfig.containerName}`);
      console.log(`   Table: ${config.postgresTableName}`);
      console.log(`   Backup Enabled: ${postgresConfig.backupEnabled}`);
      console.log('');

      await createDockerComposeFiles(projectRoot);
      await createDatabaseInitFiles(config, projectRoot);
      console.log(
        `   ✅ Database setup completed for ${config.postgresTableName}\n`,
      );
    }

    console.log('🎉 All database setups completed successfully!');
    console.log('\n📖 Next Steps:');
    console.log('   1. Review the generated files (especially passwords)');
    console.log('   2. Start the database: npm run db:start');
    console.log('   3. Check logs: npm run db:logs');
    console.log('   4. Stop the database: npm run db:stop');
    console.log('\n💡 Tips:');
    console.log('   - Passwords are in: postgres_password.txt');
    console.log('   - Data persists in: ./data/postgres');
    console.log('   - Backups stored in: ./data/backups');

    // Show all database ports
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
