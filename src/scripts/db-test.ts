/**
 * Database Connection Test Script
 *
 * This script tests the PostgreSQL connection using all discovered configurations
 *
 * Usage: npm run db:test
 */

import { postgresConfig } from '@/configurations/postgresConfiguration';
import sql from '../db/postgres-js';
import { discoverFormConfigurations } from './get-project-info';
import * as path from 'path';

async function testConnection() {
  try {
    const projectRoot = path.resolve(__dirname, '..', '..');
    const configurations = await discoverFormConfigurations(projectRoot);

    if (configurations.length === 0) {
      process.exit(1);
    }

    for (const { config, fileName, exportName } of configurations) {
      const result =
        await sql`SELECT version(), current_database(), current_user`;

      console.log(
        `   PostgreSQL Version: ${result[0].version.split(' ')[0]} ${result[0].version.split(' ')[1]}`,
      );

      const tables = await sql`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = ${config.postgresTableName}
      `;

      if (tables.length > 0) {
        const columns = await sql`
          SELECT column_name, data_type, is_nullable, column_default
          FROM information_schema.columns 
          WHERE table_name = ${config.postgresTableName}
          ORDER BY ordinal_position
        `;

        columns.forEach((col) => {
          console.log(
            `   ${col.column_name}: ${col.data_type}${col.is_nullable === 'NO' ? ' NOT NULL' : ''}${col.column_default ? ` DEFAULT ${col.column_default}` : ''}`,
          );
        });

        const count =
          await sql`SELECT COUNT(*) as count FROM ${sql(config.postgresTableName)}`;
      } else {
        console.log(
          `⚠️  ${config.postgresTableName} table does not exist yet - it will be created on first database startup`,
        );
      }
    }
  } catch (error) {
    console.error('❌ Connection failed:', error);

    process.exit(1);
  } finally {
    await sql.end();
  }
}

testConnection().catch(console.error);
