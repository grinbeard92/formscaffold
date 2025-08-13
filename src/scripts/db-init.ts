import {
  IFormConfiguration,
  IFormSectionDefinition,
} from '../types/globalFormTypes';
import * as fs from 'fs/promises';
import * as path from 'path';
import { postgresConfig } from '@/configurations/postgresConfiguration';
import sql from '@/db/postgres-js';

/**
 * Generates the SQL initialization script for database setup
 */
export function generateInitScript(config: IFormConfiguration): string {
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

  for (const section of sections) {
    for (const field of section.fields) {
      const pgConfig = field.pgConfig;
      if (!pgConfig) continue;

      let columnDef = `\n  ${field.name} `;

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

      if (pgConfig.nullable === false || field.required) {
        columnDef += ' NOT NULL';
      }

      if (pgConfig.unique) {
        columnDef += ' UNIQUE';
      }

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
            columnDef += ` DEFAULT '${pgConfig.default}'`;
        }
      }

      columnDef += ',';
      sqlContent += columnDef;
    }
  }

  sqlContent = sqlContent.slice(0, -1); // Remove last comma
  sqlContent += '\n);\n\n';

  for (const section of sections) {
    for (const field of section.fields) {
      const pgConfig = field.pgConfig;
      if (pgConfig?.index) {
        sqlContent += `CREATE INDEX idx_${postgresTableName}_${field.name} ON ${postgresTableName}(${field.name});\n`;
      }
    }
  }

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
  config: IFormConfiguration,
): Promise<void> {
  const initSql = generateInitScript(config);

  try {
    console.log(
      `🔄 Executing database initialization for table: ${config.postgresTableName}`,
    );

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
  config: IFormConfiguration,
  projectRoot: string,
): Promise<void> {
  const initScriptsDir = path.join(projectRoot, 'init-scripts');
  try {
    await fs.mkdir(initScriptsDir, { recursive: true });
  } catch {}

  const initSqlContent = generateInitScript(config);
  const tableName = config.postgresTableName;

  await fs.writeFile(
    path.join(initScriptsDir, `${tableName}-init-tables.sql`),
    initSqlContent,
    'utf8',
  );
}

/**
 * Main function to run database initialization generation
 */
export async function main(executeDatabase: boolean = true): Promise<void> {
  try {
    const projectRoot = process.cwd();

    const { discoverFormConfigurations } = await import('./get-project-info');
    const formConfigurations = await discoverFormConfigurations(
      projectRoot,
      false,
    );

    if (formConfigurations.length === 0) {
      return;
    }

    for (const { config, fileName, exportName } of formConfigurations) {
      console.log(
        `   Fields: ${config.sections.flatMap((s: IFormSectionDefinition) => s.fields).length}`,
      );

      await createDatabaseInitFiles(config, projectRoot);

      if (executeDatabase) {
        await executeInitScript(config);
      }
    }

    console.log(
      `\n🎉 Database initialization generation${executeDatabase ? ' and execution' : ''} completed!`,
    );

    if (executeDatabase) {
      await sql.end();
    }
  } catch (error) {
    console.error('❌ Error generating database initialization:', error);

    try {
      await sql.end();
    } catch {}
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
