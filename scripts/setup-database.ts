#!/usr/bin/env tsx

/**
 * Database Setup Script
 *
 * This script generates Docker Compose and related database files
 * based on the FormConfiguration settings.
 *
 * Usage: npm run db:setup
 */

import { demoFormConfiguration } from '../src/components/form/DemoFormConfiguration';
import { createDatabaseFiles } from '@/lib/dockerCompose';
import * as path from 'path';

async function main() {
  console.log('🚀 Setting up database from FormConfiguration...\n');

  console.log('📋 Configuration Summary:');
  console.log(`   Database: ${demoFormConfiguration.postgresConfig.database}`);
  console.log(`   User: ${demoFormConfiguration.postgresConfig.user}`);
  console.log(`   Port: ${demoFormConfiguration.postgresConfig.port}`);
  console.log(
    `   Container: ${demoFormConfiguration.postgresConfig.containerName}`,
  );
  console.log(`   Table: ${demoFormConfiguration.postgresTableName}`);
  console.log(
    `   Backup Enabled: ${demoFormConfiguration.postgresConfig.backupEnabled}`,
  );
  console.log('');

  try {
    const projectRoot = path.resolve(__dirname, '..');
    await createDatabaseFiles(demoFormConfiguration, projectRoot);

    console.log('\n🎉 Database setup completed successfully!');
    console.log('\n📖 Next Steps:');
    console.log('   1. Review the generated files (especially the password)');
    console.log('   2. Start the database: npm run db:start');
    console.log('   3. Check logs: npm run db:logs');
    console.log('   4. Stop the database: npm run db:stop');
    console.log('\n💡 Tips:');
    console.log('   - Password is in: postgres_password.txt');
    console.log('   - Data persists in: ./data/postgres');
    console.log('   - Backups stored in: ./data/backups');
    console.log(
      '   - Database accessible at: localhost:' +
        demoFormConfiguration.postgresConfig.port,
    );
  } catch (error) {
    console.error('❌ Error setting up database:', error);
    process.exit(1);
  }
}

main().catch(console.error);
