#!/usr/bin/env tsx

/**
 * Database Connection Test Script
 *
 * This script tests the PostgreSQL connection using all discovered configurations
 *
 * Usage: npm run db:test
 */

import { postgresConfig } from '@/configurations/postgresConfiguration';
import sql from '../db/postgres-js';
import { discoverFormConfigurations } from './get-form-configurations';
import * as path from 'path';

async function testConnection() {
  console.log('🔌 Testing PostgreSQL connections...\n');

  try {
    const projectRoot = path.resolve(__dirname, '..', '..');
    const configurations = await discoverFormConfigurations(projectRoot);

    if (configurations.length === 0) {
      console.log('❌ No FormConfiguration files found.');
      process.exit(1);
    }

    for (const { config, fileName, exportName } of configurations) {
      console.log(`\n🔍 Testing ${exportName} (${fileName})...`);
      console.log(`   Table: ${config.postgresTableName}`);
      console.log(`   Database: ${postgresConfig.database}`);
      console.log(`   Port: ${postgresConfig.port}`);

      // Test basic connection
      const result =
        await sql`SELECT version(), current_database(), current_user`;
      console.log('✅ Connection successful!');
      console.log(
        `   PostgreSQL Version: ${result[0].version.split(' ')[0]} ${result[0].version.split(' ')[1]}`,
      );
      console.log(`   Database: ${result[0].current_database}`);
      console.log(`   User: ${result[0].current_user}`);

      // Test if our table exists
      const tables = await sql`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = ${config.postgresTableName}
      `;

      if (tables.length > 0) {
        console.log(`✅ ${config.postgresTableName} table exists`);

        // Get table info
        const columns = await sql`
          SELECT column_name, data_type, is_nullable, column_default
          FROM information_schema.columns 
          WHERE table_name = ${config.postgresTableName}
          ORDER BY ordinal_position
        `;

        console.log('\n📋 Table Structure:');
        columns.forEach((col) => {
          console.log(
            `   ${col.column_name}: ${col.data_type}${col.is_nullable === 'NO' ? ' NOT NULL' : ''}${col.column_default ? ` DEFAULT ${col.column_default}` : ''}`,
          );
        });

        // Get count of records
        const count =
          await sql`SELECT COUNT(*) as count FROM ${sql(config.postgresTableName)}`;
        console.log(`\n📊 Records in table: ${count[0].count}`);
      } else {
        console.log(
          `⚠️  ${config.postgresTableName} table does not exist yet - it will be created on first database startup`,
        );
      }
    }

    console.log('\n🎉 All database tests completed!');
  } catch (error) {
    console.error('❌ Connection failed:', error);
    console.log('\n💡 Make sure the database is running:');
    console.log('   npm run db:start');
    process.exit(1);
  } finally {
    await sql.end();
  }
}

testConnection().catch(console.error);
