import {
  FormConfiguration,
  FormSectionDefinition,
} from '../types/globalFormTypes';
import * as fs from 'fs/promises';
import * as path from 'path';
import { postgresConfig } from '@/configurations/postgresConfiguration';
import sql from '@/db/postgres-js';

/**
 * Generates the SQL initialization script for database setup
 */
export function generateInitScript(config: FormConfiguration): string {
  const { postgresTableName, sections } = config;

  let sqlContent = `-- Database initialization script
-- Generated automatically from FormConfiguration

-- Drop existing table and related objects if they exist
DROP TABLE IF EXISTS ${postgresTableName} CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- Create the main table
CREATE TABLE ${postgresTableName} (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,`;

  // Add columns based on form fields
  for (const section of sections) {
    for (const field of section.fields) {
      const pgConfig = field.pgConfig;
      if (!pgConfig) continue;

      let columnDef = `\n  ${field.name} `;

      // Add column type with proper formatting
      switch (pgConfig.type) {
        case 'VARCHAR':
          columnDef += pgConfig.length
            ? `VARCHAR(${pgConfig.length})`
            : 'VARCHAR(255)';
          break;

        case 'DECIMAL':
        case 'NUMERIC':
          if (pgConfig.precision && pgConfig.scale) {
            columnDef += `${pgConfig.type}(${pgConfig.precision}, ${pgConfig.scale})`;
          } else if (pgConfig.precision) {
            columnDef += `${pgConfig.type}(${pgConfig.precision})`;
          } else {
            columnDef += pgConfig.type;
          }
          break;

        case 'ARRAY':
          if (pgConfig.arrayType) {
            columnDef += `${pgConfig.arrayType}[]`;
          } else {
            columnDef += 'TEXT[]'; // Default to text array
          }
          break;

        case 'TIMESTAMP WITH TIME ZONE':
          columnDef += 'TIMESTAMP WITH TIME ZONE';
          break;

        case 'DOUBLE PRECISION':
          columnDef += 'DOUBLE PRECISION';
          break;

        default:
          columnDef += pgConfig.type || 'TEXT';
      }

      // Add nullable/not null
      if (pgConfig.nullable === false || field.required) {
        columnDef += ' NOT NULL';
      }

      // Add unique constraint
      if (pgConfig.unique) {
        columnDef += ' UNIQUE';
      }

      // Add default value with proper type handling
      if (pgConfig.default !== undefined && pgConfig.default !== null) {
        switch (pgConfig.type) {
          case 'BOOLEAN':
            columnDef += ` DEFAULT ${pgConfig.default}`;
            break;
          case 'INTEGER':
          case 'BIGINT':
          case 'DECIMAL':
          case 'NUMERIC':
          case 'REAL':
          case 'DOUBLE PRECISION':
            columnDef += ` DEFAULT ${pgConfig.default}`;
            break;
          case 'JSON':
          case 'JSONB':
            columnDef += ` DEFAULT '${JSON.stringify(pgConfig.default)}'::${pgConfig.type}`;
            break;
          case 'ARRAY':
            if (Array.isArray(pgConfig.default)) {
              const arrayValues = pgConfig.default
                .map((val) => `'${val}'`)
                .join(',');
              columnDef += ` DEFAULT ARRAY[${arrayValues}]`;
            } else {
              columnDef += ` DEFAULT '{}'`;
            }
            break;
          case 'TIMESTAMP':
          case 'TIMESTAMP WITH TIME ZONE':
            if (
              pgConfig.default === 'now' ||
              pgConfig.default === 'CURRENT_TIMESTAMP'
            ) {
              columnDef += ' DEFAULT CURRENT_TIMESTAMP';
            } else {
              columnDef += ` DEFAULT '${pgConfig.default}'`;
            }
            break;
          case 'UUID':
            if (pgConfig.default === 'gen_random_uuid()') {
              columnDef += ' DEFAULT gen_random_uuid()';
            } else {
              columnDef += ` DEFAULT '${pgConfig.default}'`;
            }
            break;
          default:
            // String types (VARCHAR, TEXT, etc.)
            columnDef += ` DEFAULT '${pgConfig.default}'`;
        }
      }

      columnDef += ',';
      sqlContent += columnDef;
    }
  }

  sqlContent = sqlContent.slice(0, -1); // Remove last comma
  sqlContent += '\n);\n\n';

  // Add indexes
  for (const section of sections) {
    for (const field of section.fields) {
      const pgConfig = field.pgConfig;
      if (pgConfig?.index) {
        sqlContent += `CREATE INDEX idx_${postgresTableName}_${field.name} ON ${postgresTableName}(${field.name});\n`;
      }
    }
  }

  // Add updated_at trigger
  sqlContent += `
-- Create function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_${postgresTableName}_updated_at
    BEFORE UPDATE ON ${postgresTableName}
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions
GRANT ALL PRIVILEGES ON TABLE ${postgresTableName} TO ${postgresConfig.user};
GRANT USAGE, SELECT ON SEQUENCE ${postgresTableName}_id_seq TO ${postgresConfig.user};
`;

  return sqlContent;
}

/**
 * Executes the initialization SQL against the database
 */
export async function executeInitScript(
  config: FormConfiguration,
): Promise<void> {
  const initSql = generateInitScript(config);

  try {
    console.log(
      `🔄 Executing database initialization for table: ${config.postgresTableName}`,
    );

    // Execute the SQL script
    await sql.unsafe(initSql);

    console.log(
      `✅ Successfully initialized database table: ${config.postgresTableName}`,
    );
  } catch (error) {
    console.error(
      `❌ Error executing database initialization for ${config.postgresTableName}:`,
      error,
    );
    throw error;
  }
}

/**
 * Creates database initialization files based on the provided FormConfiguration
 */
export async function createDatabaseInitFiles(
  config: FormConfiguration,
  projectRoot: string,
): Promise<void> {
  // Ensure init-scripts directory exists
  const initScriptsDir = path.join(projectRoot, 'init-scripts');
  try {
    await fs.mkdir(initScriptsDir, { recursive: true });
  } catch {
    // Directory might already exist, which is fine
  }

  // Generate initialization SQL script
  const initSqlContent = generateInitScript(config);

  // Write initialization script
  await fs.writeFile(
    path.join(initScriptsDir, '01-init-tables.sql'),
    initSqlContent,
    'utf8',
  );

  console.log('✅ Generated database initialization files:');
  console.log('   - init-scripts/01-init-tables.sql');
}

/**
 * Main function to run database initialization generation
 */
export async function main(executeDatabase: boolean = true): Promise<void> {
  try {
    const projectRoot = process.cwd();

    // Get all form configurations
    const { discoverFormConfigurations } = await import(
      './get-form-configurations'
    );
    const formConfigurations = await discoverFormConfigurations();

    if (formConfigurations.length === 0) {
      console.log('❌ No form configurations found.');
      return;
    }

    console.log('🔧 Generating database initialization scripts...\n');

    for (const { config, fileName, exportName } of formConfigurations) {
      console.log(`📝 Processing ${exportName} from ${fileName}:`);
      console.log(`   Database: ${postgresConfig.database}`);
      console.log(`   Table: ${config.postgresTableName}`);
      console.log(
        `   Fields: ${config.sections.flatMap((s: FormSectionDefinition) => s.fields).length}`,
      );

      // Generate SQL files
      await createDatabaseInitFiles(config, projectRoot);

      // Execute SQL against the database if requested
      if (executeDatabase) {
        await executeInitScript(config);
      }
    }

    console.log(
      `\n🎉 Database initialization generation${executeDatabase ? ' and execution' : ''} completed!`,
    );

    // Close database connection if we used it
    if (executeDatabase) {
      await sql.end();
    }
  } catch (error) {
    console.error('❌ Error generating database initialization:', error);

    // Close database connection on error
    try {
      await sql.end();
    } catch {
      // Ignore cleanup errors
    }
    process.exit(1);
  }
}

// Run the script if called directly
if (require.main === module) {
  main();
}
