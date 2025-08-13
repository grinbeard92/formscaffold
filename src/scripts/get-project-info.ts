/**
 * Form Configuration Discovery Module
 *
 * This module discovers and loads all FormConfiguration files
 * from the configurations directory and provides them to generation scripts.
 */

import * as path from 'path';
import * as fs from 'fs/promises';
import type { IFormConfiguration } from '../types/globalFormTypes';
import { postgresConfig } from '@/configurations/postgresConfiguration';
import { file } from 'zod';

export interface IFormConfigurationModule {
  config: IFormConfiguration;
  fileName: string;
  exportName: string;
  filePath: string;
}

/**
 * Discovers all form configuration files in the configurations directory
 */
export async function discoverFormConfigurations(
  projectRoot: string = process.cwd(),
  production: boolean,
): Promise<IFormConfigurationModule[]> {
  const configurationsDir = path.join(projectRoot, 'src', 'configurations');

  try {
    const files = await fs.readdir(configurationsDir);
    let tsFiles;
    if (production) {
      tsFiles = files.filter((file) => !file.includes('demo'));
      console.log('Production files:', tsFiles);
    } else {
      tsFiles = files.filter(
        (file) => file.endsWith('.ts') || file.endsWith('.tsx'),
      );
      console.log('Development files:', tsFiles);
    }

    console.log(
      `📂 Found ${tsFiles.length} configuration files in /src/configurations:`,
    );

    const configurations: IFormConfigurationModule[] = [];

    for (const file of tsFiles) {
      try {
        const modulePath = path.resolve(configurationsDir, file);
        const fileUrl = `file://${modulePath.replace(/\\/g, '/')}`;
        const configModule = await import(fileUrl);

        const exports = Object.keys(configModule);
        const configExports = exports.filter(
          (exportName) =>
            exportName.toLowerCase().includes('configuration') ||
            exportName.toLowerCase().includes('config'),
        );

        if (configExports.length === 0) {
          continue;
        }

        for (const exportName of configExports) {
          const config = configModule[exportName] as IFormConfiguration;

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

export async function copyPostgresSchemas(
  projectRoot: string,
  production: boolean,
): Promise<void> {
  const schemasDir = path.join(projectRoot, 'init-scripts');
  const schemas = await fs.readdir(schemasDir);
  const destPath = await fs.mkdir(
    path.join(projectRoot, 'export', 'db', 'init'),
    { recursive: true },
  );
  if (!destPath) {
    console.warn('⚠️ Could not create destination directory for schemas');
    return;
  }
  // Filter out demo files if in production mode
  const filteredSchemas = production
    ? schemas.filter((file) => !file.includes('demo'))
    : schemas;
  for (const schema of filteredSchemas) {
    const sourcePath = path.join(schemasDir, schema);
    const content = await fs.readFile(sourcePath, 'utf-8');
    await fs.writeFile(path.join(destPath, schema), content);
  }
}

/**
 * Gets a specific form configuration by table name
 */
export async function getFormConfigurationByTableName(
  tableName: string,
  projectRoot: string = process.cwd(),
): Promise<IFormConfigurationModule | null> {
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
  configurations: IFormConfigurationModule[],
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
