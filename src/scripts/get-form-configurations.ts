/**
 * Form Configuration Discovery Module
 *
 * This module discovers and loads all FormConfiguration files
 * from the configurations directory and provides them to generation scripts.
 */

import * as path from 'path';
import * as fs from 'fs/promises';
import type { FormConfiguration } from '../types/globalFormTypes';
import { postgresConfig } from '@/configurations/postgresConfiguration';

export interface FormConfigurationModule {
  config: FormConfiguration;
  fileName: string;
  exportName: string;
  filePath: string;
}

/**
 * Discovers all form configuration files in the configurations directory
 */
export async function discoverFormConfigurations(
  projectRoot: string = process.cwd(),
): Promise<FormConfigurationModule[]> {
  const configurationsDir = path.join(projectRoot, 'src', 'configurations');

  try {
    const files = await fs.readdir(configurationsDir);
    const tsFiles = files.filter(
      (file) => file.endsWith('.ts') || file.endsWith('.tsx'),
    );

    console.log(
      `📂 Found ${tsFiles.length} configuration files in /src/configurations:`,
    );

    const configurations: FormConfigurationModule[] = [];

    for (const file of tsFiles) {
      try {
        console.log(`   📄 Processing: ${file}`);

        // Dynamic import of the configuration file
        const modulePath = path.resolve(configurationsDir, file);
        const fileUrl = `file://${modulePath.replace(/\\/g, '/')}`;
        const configModule = await import(fileUrl);

        // Look for exports that might be FormConfiguration objects
        const exports = Object.keys(configModule);
        const configExports = exports.filter(
          (exportName) =>
            exportName.toLowerCase().includes('configuration') ||
            exportName.toLowerCase().includes('config'),
        );

        if (configExports.length === 0) {
          console.log(`   ⚠️  No configuration exports found in ${file}`);
          continue;
        }

        for (const exportName of configExports) {
          const config = configModule[exportName] as FormConfiguration;

          // Validate that this is a proper FormConfiguration
          if (
            config &&
            typeof config === 'object' &&
            config.postgresTableName &&
            config.sections &&
            Array.isArray(config.sections) &&
            postgresConfig
          ) {
            configurations.push({
              config,
              fileName: file,
              exportName,
              filePath: modulePath,
            });

            console.log(
              `   ✅ Found valid configuration: ${exportName} (table: ${config.postgresTableName})`,
            );
          } else {
            console.log(
              `   ⚠️  Export '${exportName}' in ${file} is not a valid FormConfiguration`,
            );
          }
        }
      } catch (error) {
        console.log(
          `   ❌ Error loading ${file}:`,
          error instanceof Error ? error.message : 'Unknown error',
        );
      }
    }

    if (configurations.length === 0) {
      console.log(
        '\n❌ No valid FormConfiguration files found in /configurations directory.',
      );
      console.log(
        '💡 Make sure your configuration files export objects with names containing "configuration" or "config"',
      );
    }

    return configurations;
  } catch (error) {
    console.error(
      `❌ Error reading configurations directory: ${configurationsDir}`,
    );
    throw error;
  }
}

/**
 * Gets a specific form configuration by table name
 */
export async function getFormConfigurationByTableName(
  tableName: string,
  projectRoot: string = process.cwd(),
): Promise<FormConfigurationModule | null> {
  const configurations = await discoverFormConfigurations(projectRoot);
  return (
    configurations.find(
      (config) => config.config.postgresTableName === tableName,
    ) || null
  );
}

/**
 * Gets all unique table names from discovered configurations
 */
export async function getAllTableNames(
  projectRoot: string = process.cwd(),
): Promise<string[]> {
  const configurations = await discoverFormConfigurations(projectRoot);
  return configurations.map((config) => config.config.postgresTableName);
}

/**
 * Validates that configurations don't have conflicting table names
 */
export function validateConfigurations(
  configurations: FormConfigurationModule[],
): void {
  const tableNames = configurations.map(
    (config) => config.config.postgresTableName,
  );
  const duplicates = tableNames.filter(
    (name, index) => tableNames.indexOf(name) !== index,
  );

  if (duplicates.length > 0) {
    throw new Error(
      `Duplicate table names found: ${duplicates.join(', ')}. Each FormConfiguration must have a unique postgresTableName.`,
    );
  }
}
