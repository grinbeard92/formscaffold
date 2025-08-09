#!/usr/bin/env tsx

/**
 * Export Generator - Server Side Rendering (SSR)
 *
 * Server-side implementation of the FormScaffold export functionality.
 * This version uses Node.js file system APIs and is intended for server-side execution.
 *
 * Generates a portable FormScaffold package in the /export directory
 * containing all generated artifacts and runtime components.
 *
 * This creates a drop-in package for other Next.js projects with:
 * - Generated types, actions, schemas, and pages per form
 * - Runtime form components
 * - Minimal dependencies and styles
 *
 * Usage: npm run export or via API route
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import {
  discoverFormConfigurations,
  IFormConfigurationModule,
} from './get-form-configurations';
import { IFormConfiguration } from '../types/globalFormTypes';

interface IExportFileMapping {
  source: string;
  destination: string;
  transform?: (content: string) => string;
}

/**
 * Main export generation function (Server-side)
 */
export async function generateExportSSR(): Promise<void> {
  console.log('🚀 Generating FormScaffold Export Package (Server-side)...\n');

  const projectRoot = path.resolve(__dirname, '../', '../');
  const exportDir = path.join(projectRoot, 'export');

  try {
    // Step 1: Run generate-all to ensure all artifacts are up to date
    console.log('📋 Step 1: Generating all FormScaffold artifacts...');
    const { exec } = await import('child_process');
    const { promisify } = await import('util');
    const execAsync = promisify(exec);
    await execAsync('npm run generate:all', { cwd: projectRoot });
    console.log('✅ All artifacts generated\n');

    // Step 2: Discover form configurations
    console.log('📋 Step 2: Discovering form configurations...');
    const configurations = await discoverFormConfigurations(projectRoot);
    console.log(`✅ Found ${configurations.length} form configurations\n`);

    // Step 3: Clean and create export directory
    console.log('📋 Step 3: Preparing export directory...');
    await cleanAndCreateExportDir(exportDir);
    console.log('✅ Export directory ready\n');

    // Step 4: Copy runtime components
    console.log('📋 Step 4: Copying runtime components...');
    await copyRuntimeComponents(projectRoot, exportDir);
    console.log('✅ Runtime components copied\n');

    // Step 5: Copy generated artifacts for each form
    console.log('📋 Step 5: Copying generated artifacts...');
    for (const { config } of configurations) {
      console.log(`   📝 Processing ${config.postgresTableName}...`);
      await copyFormArtifacts(projectRoot, exportDir, config);
    }
    console.log('✅ All form artifacts copied\n');

    // Step 6: Generate package.json and documentation
    console.log('📋 Step 6: Creating package files...');
    await createPackageFiles(exportDir, configurations);
    console.log('✅ Package files created\n');

    // Step 7: Copy and rename globals.css
    console.log('📋 Step 7: Copying styles...');
    await copyStyles(projectRoot, exportDir);
    console.log('✅ Styles copied\n');

    console.log('🎉 FormScaffold export package generated successfully!');
    console.log(`📦 Location: ${exportDir}`);
    console.log('\n💡 Next steps:');
    console.log(
      '   1. Copy the export folder contents to your Next.js project',
    );
    console.log('   2. Install dependencies: npm install');
    console.log('   3. Import form-scaffold.css in your app');
    console.log('   4. Use the generated components and actions');
  } catch (error) {
    console.error('❌ Error generating export:', error);
    throw error;
  }
}

/**
 * Clean and create the export directory
 */
async function cleanAndCreateExportDir(exportDir: string): Promise<void> {
  try {
    await fs.rm(exportDir, { recursive: true, force: true });
  } catch {
    // Directory might not exist, which is fine
  }

  await fs.mkdir(exportDir, { recursive: true });

  // Create subdirectories
  const subdirs = [
    'components/form-scaffold/utils',
    'components/ui',
    'types',
    'actions',
    'schemas',
    'pages',
    'db',
    'utils',
    'configurations',
  ];

  for (const subdir of subdirs) {
    await fs.mkdir(path.join(exportDir, subdir), { recursive: true });
  }
}

/**
 * Copy runtime components that don't change per form
 */
async function copyRuntimeComponents(
  projectRoot: string,
  exportDir: string,
): Promise<void> {
  const componentMappings: IExportFileMapping[] = [
    // Form components -> form-scaffold
    {
      source: 'src/components/form/ClientForm.tsx',
      destination: 'components/form-scaffold/ClientForm.tsx',
      transform: updateImportPaths,
    },
    {
      source: 'src/components/form/ServerForm.tsx',
      destination: 'components/form-scaffold/ServerForm.tsx',
      transform: updateImportPaths,
    },
    {
      source: 'src/components/form/FormSectionTemplate.tsx',
      destination: 'components/form-scaffold/FormSectionTemplate.tsx',
      transform: updateImportPaths,
    },

    // Form utilities
    {
      source: 'src/components/form/utils/formSectionUtils.ts',
      destination: 'components/form-scaffold/utils/formSectionUtils.ts',
      transform: updateImportPaths,
    },
    {
      source: 'src/components/form/utils/renderInputSection.tsx',
      destination: 'components/form-scaffold/utils/renderInputSection.tsx',
      transform: updateImportPaths,
    },

    // UI components
    {
      source: 'src/components/ui/card.tsx',
      destination: 'components/ui/card.tsx',
      transform: updateImportPaths,
    },

    // Core types
    {
      source: 'src/types/globalFormTypes.ts',
      destination: 'types/globalFormTypes.ts',
    },

    // Database utilities
    {
      source: 'src/db/generic-db-actions.ts',
      destination: 'db/generic-db-actions.ts',
      transform: updateImportPaths,
    },
    {
      source: 'src/db/postgres-js.ts',
      destination: 'db/postgres-js.ts',
      transform: updateImportPaths,
    },

    // General utilities
    {
      source: 'src/utils/utils.ts',
      destination: 'utils/utils.ts',
    },
    // Configurations
    {
      source: 'src/configurations/*.ts',
      destination: 'configurations/',
    },
  ];

  for (const mapping of componentMappings) {
    const sourcePath = path.join(projectRoot, mapping.source);
    const destPath = path.join(exportDir, mapping.destination);

    try {
      const content = await fs.readFile(sourcePath, 'utf8');
      const transformedContent = mapping.transform
        ? mapping.transform(content)
        : content;
      await fs.writeFile(destPath, transformedContent, 'utf8');
    } catch (error) {
      console.warn(`⚠️  Could not copy ${mapping.source}:`, error);
    }
  }
}

/**
 * Copy generated artifacts for a specific form
 */
async function copyFormArtifacts(
  projectRoot: string,
  exportDir: string,
  config: IFormConfiguration,
): Promise<void> {
  const tableName = config.postgresTableName;

  const artifactMappings: IExportFileMapping[] = [
    // Generated types
    {
      source: `src/types/${tableName}Types.d.ts`,
      destination: `types/${tableName}Types.d.ts`,
    },

    // Generated server actions
    {
      source: `src/actions/${tableName}.ts`,
      destination: `actions/${tableName}.ts`,
      transform: updateImportPaths,
    },

    // Generated demo pages
    {
      source: `src/app/${tableName}/page.tsx`,
      destination: `pages/${tableName}/page.tsx`,
      transform: updateImportPaths,
    },
  ];

  for (const mapping of artifactMappings) {
    const sourcePath = path.join(projectRoot, mapping.source);
    const destPath = path.join(exportDir, mapping.destination);

    try {
      // Ensure directory exists
      await fs.mkdir(path.dirname(destPath), { recursive: true });

      const content = await fs.readFile(sourcePath, 'utf8');
      const transformedContent = mapping.transform
        ? mapping.transform(content)
        : content;
      await fs.writeFile(destPath, transformedContent, 'utf8');
    } catch (error) {
      console.warn(
        `⚠️  Could not copy ${mapping.source} for ${tableName}:`,
        error,
      );
    }
  }

  // Generate separate Zod schema file
  await generateZodSchemaFile(exportDir, config);

  // Generate separate SQL schema file
  await generateSqlSchemaFile(projectRoot, exportDir, config);
}

/**
 * Generate a standalone Zod schema file for a form
 */
async function generateZodSchemaFile(
  exportDir: string,
  config: IFormConfiguration,
): Promise<void> {
  const tableName = config.postgresTableName;
  const capitalizedTableName =
    tableName.charAt(0).toUpperCase() + tableName.slice(1);

  const zodSchemaContent = `import { z } from 'zod';

/**
 * Generated Zod Schema for ${capitalizedTableName}
 * 
 * This file is automatically generated from FormConfiguration.
 * Import and use this schema for validation in your application.
 */

// Form validation schema (excludes database-generated fields)
export const ${tableName}Schema = z.object({
${generateZodSchemaFields(config)}
});

// Complete schema including database fields (for type generation)
export const complete${capitalizedTableName}Schema = z.object({
  id: z.string().uuid(),
  created_at: z.date(),
  updated_at: z.date(),
${generateZodSchemaFields(config)}
});

export type ${capitalizedTableName}FormData = z.infer<typeof ${tableName}Schema>;
export type Complete${capitalizedTableName} = z.infer<typeof complete${capitalizedTableName}Schema>;
`;

  const destPath = path.join(exportDir, 'schemas', `${tableName}-zod.ts`);
  await fs.writeFile(destPath, zodSchemaContent, 'utf8');
}

/**
 * Generate Zod schema fields from configuration
 */
function generateZodSchemaFields(config: IFormConfiguration): string {
  const fields: string[] = [];

  config.sections.forEach((section) => {
    section.fields.forEach((field) => {
      let zodType = 'z.string()';

      switch (field.type) {
        case 'number':
          zodType = 'z.number()';
          break;
        case 'checkbox':
          zodType = 'z.boolean()';
          break;
        case 'date':
          zodType = 'z.date()';
          break;
        default:
          zodType = 'z.string()';
      }

      if (!field.required) {
        zodType += '.optional()';
      }

      fields.push(`  ${field.name}: ${zodType},`);
    });
  });

  return fields.join('\n');
}

/**
 * Copy the SQL schema file
 */
async function generateSqlSchemaFile(
  projectRoot: string,
  exportDir: string,
  config: IFormConfiguration,
): Promise<void> {
  const tableName = config.postgresTableName;

  try {
    const sourcePath = path.join(
      projectRoot,
      'init-scripts',
      `${tableName}-init-tables.sql`,
    );
    const destPath = path.join(
      exportDir,
      'schemas',
      `${tableName}-postgres.sql`,
    );

    const content = await fs.readFile(sourcePath, 'utf8');
    await fs.writeFile(destPath, content, 'utf8');
  } catch (error) {
    console.warn(`⚠️  Could not copy SQL schema for ${tableName}:`, error);
  }
}

/**
 * Create package.json and documentation files
 */
async function createPackageFiles(
  exportDir: string,
  configurations: IFormConfigurationModule[],
): Promise<void> {
  // Generate package.json
  const packageJson = {
    name: 'formscaffold-generated',
    version: '1.0.0',
    description: 'Generated FormScaffold components and artifacts',
    main: 'components/form-scaffold/index.js',
    types: 'types/index.d.ts',
    dependencies: {
      react: '^19.0.0',
      'react-dom': '^19.0.0',
      'react-hook-form': '^7.62.0',
      zod: '^4.0.0',
      '@radix-ui/react-icons': '^1.3.0',
      '@radix-ui/react-checkbox': '^1.3.0',
      '@radix-ui/react-label': '^2.1.0',
      '@radix-ui/react-select': '^2.2.0',
      postgres: '^3.4.0',
      clsx: '^2.1.0',
      'tailwind-merge': '^3.3.0',
    },
    peerDependencies: {
      next: '^15.0.0',
      tailwindcss: '^4.0.0',
    },
  };

  await fs.writeFile(
    path.join(exportDir, 'package.json'),
    JSON.stringify(packageJson, null, 2),
    'utf8',
  );

  // Generate README.md
  const readmeContent = `# FormScaffold Generated Package

This package contains generated FormScaffold components and artifacts for integration into Next.js projects.

## Generated Forms

${configurations.map(({ config }) => `- **${config.title}** (table: \`${config.postgresTableName}\`)`).join('\n')}

## Installation

1. Copy this package to your Next.js project
2. Install dependencies: \`npm install\`
3. Import the CSS file in your app:
   \`\`\`tsx
   import './form-scaffold.css'
   \`\`\`

## Usage

\`\`\`tsx
import { ServerForm } from './components/form-scaffold/ServerForm';
import { ${configurations[0]?.config.postgresTableName}Schema } from './schemas/${configurations[0]?.config.postgresTableName}-zod';

// Use in your component
<ServerForm 
  config={yourFormConfiguration}
  autoSaveToDatabase={true}
/>
\`\`\`

## Generated Files

- \`/components/form-scaffold/\` - Form components
- \`/types/\` - TypeScript type definitions  
- \`/actions/\` - Server actions for database operations
- \`/schemas/\` - Zod validation and SQL schemas
- \`/pages/\` - Demo pages

Generated by FormScaffold v1.0.0
`;

  await fs.writeFile(path.join(exportDir, 'README.md'), readmeContent, 'utf8');
}

/**
 * Copy and rename styles
 */
async function copyStyles(
  projectRoot: string,
  exportDir: string,
): Promise<void> {
  try {
    const sourcePath = path.join(projectRoot, 'src', 'app', 'globals.css');
    const destPath = path.join(exportDir, 'form-scaffold.css');

    const content = await fs.readFile(sourcePath, 'utf8');

    // Add header comment to the CSS
    const cssWithHeader = `/**
 * FormScaffold Styles
 * 
 * Import this file in your Next.js app to use FormScaffold components.
 * Requires Tailwind CSS v4+ for proper styling.
 */

${content}`;

    await fs.writeFile(destPath, cssWithHeader, 'utf8');
  } catch (error) {
    console.warn('⚠️  Could not copy styles:', error);
  }
}

/**
 * Transform import paths for exported components
 */
function updateImportPaths(content: string): string {
  return content
    .replace(/from '@\/components\/form\//g, 'from "../')
    .replace(/from '@\/components\/ui\//g, 'from "../ui/')
    .replace(/from '@\/types\//g, 'from "../../types/')
    .replace(/from '@\/utils\//g, 'from "../../utils/')
    .replace(/from '@\/db\//g, 'from "../../db/')
    .replace(/from '@\/actions\//g, 'from "../../actions/')
    .replace(/from '@\/scripts\/generate-schema'/g, 'from "../../schemas/')
    .replace(/from '@\/configurations\//g, 'from "../../configurations/');
}

/**
 * Standalone execution
 */
async function main(): Promise<void> {
  await generateExportSSR();
}

// Only run main if this file is executed directly
if (require.main === module) {
  main().catch((error) => {
    console.error('Failed to generate export:', error);
    process.exit(1);
  });
}

// Backward compatibility - keep the old export name
export { generateExportSSR as generateExport };
export { generateExportSSR as main };
