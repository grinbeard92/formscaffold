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
  copyPostgresSchemas,
  discoverFormConfigurations,
  IFormConfigurationModule,
} from './get-project-info';
import { IFormConfiguration } from '../types/globalFormTypes';
import { reactifyLowercase, reactifyName } from '@/utils/utils';

interface IExportFileMapping {
  source: string;
  destination: string;
  transform?: (content: string) => string;
}

/**
 * Main export generation function (Server-side)
 */
export async function generateExportSSR(): Promise<void> {
  const projectRoot = path.resolve(__dirname, '../', '../');
  const exportDir = path.join(projectRoot, 'export');

  try {
    const { exec } = await import('child_process');
    const { promisify } = await import('util');
    const execAsync = promisify(exec);
    await execAsync('npm run generate:all-prod', { cwd: projectRoot });

    const configurations = await discoverFormConfigurations(projectRoot, true);

    await cleanAndCreateExportDir(exportDir);

    await copyRuntimeComponents(projectRoot, exportDir);

    await copyPostgresSchemas(projectRoot, true);

    for (const { config } of configurations) {
      await copyFormArtifacts(projectRoot, exportDir, config);
    }

    await createPackageFiles(exportDir, configurations);

    await copyStyles(projectRoot, exportDir);
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
  } catch {}

  await fs.mkdir(exportDir, { recursive: true });

  const subdirs = [
    'components/form-scaffold/utils',
    'components/ui',
    'types',
    'actions',
    'app',
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
    {
      source: 'src/components/form-scaffold/ClientForm.tsx',
      destination: 'components/form-scaffold/ClientForm.tsx',
    },
    {
      source: 'src/components/form-scaffold/ServerForm.tsx',
      destination: 'components/form-scaffold/ServerForm.tsx',
    },
    {
      source: 'src/components/form-scaffold/FormSectionTemplate.tsx',
      destination: 'components/form-scaffold/FormSectionTemplate.tsx',
    },

    {
      source: 'src/components/form-scaffold/utils/formSectionUtils.ts',
      destination: 'components/form-scaffold/utils/formSectionUtils.ts',
    },
    {
      source: 'src/components/form-scaffold/utils/renderInputSection.tsx',
      destination: 'components/form-scaffold/utils/renderInputSection.tsx',
    },

    {
      source: 'src/components/ui/card.tsx',
      destination: 'components/ui/card.tsx',
    },

    {
      source: 'src/types/globalFormTypes.ts',
      destination: 'types/globalFormTypes.ts',
    },

    {
      source: 'src/db/generic-db-actions.ts',
      destination: 'db/generic-db-actions.ts',
    },
    {
      source: 'src/db/postgres-js.ts',
      destination: 'db/postgres-js.ts',
    },

    {
      source: 'src/utils/utils.ts',
      destination: 'utils/utils.ts',
    },

    {
      source: 'src/configurations/',
      destination: 'configurations/',
    },
  ];

  for (const mapping of componentMappings) {
    const sourcePath = path.join(projectRoot, mapping.source);
    const destPath = path.join(exportDir, mapping.destination);

    try {
      if (mapping.source.endsWith('/')) {
        // Directory copy
        await fs.mkdir(destPath, { recursive: true });
        const files = await fs.readdir(sourcePath);
        const prodFiles = files.filter((f) => !f.includes('demo'));
        for (const file of prodFiles) {
          const fileContent = await fs.readFile(
            path.join(sourcePath, file),
            'utf8',
          );
          const transformedFileContent = mapping.transform
            ? mapping.transform(fileContent)
            : fileContent;
          await fs.writeFile(
            path.join(destPath, file),
            transformedFileContent,
            'utf8',
          );
        }
        continue;
      }
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
  const reactTableName = reactifyLowercase(config.postgresTableName);
  const tableName = config.postgresTableName;
  const artifactMappings: IExportFileMapping[] = [
    {
      source: `src/types/${tableName}Types.d.ts`,
      destination: `types/${reactTableName}Types.d.ts`,
    },

    {
      source: `src/actions/${tableName}.ts`,
      destination: `actions/${reactTableName}.ts`,
    },

    {
      source: `src/app/${tableName}/page.tsx`,
      destination: `app/${tableName.replace(/_/g, '-')}/page.tsx`,
    },

    {
      source: 'src/scripts/generate-schema.ts',
      destination: 'src/scripts/generate-schema.ts',
    },
  ];

  for (const mapping of artifactMappings) {
    const sourcePath = path.join(projectRoot, mapping.source);
    const destPath = path.join(exportDir, mapping.destination);

    try {
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
}

/**
 * Create package.json and documentation files
 */
async function createPackageFiles(
  exportDir: string,
  configurations: IFormConfigurationModule[],
): Promise<void> {
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

  const readmeContent = `# FormScaffold Generated Package

This package contains generated FormScaffold components and artifacts for integration into Next.js projects.



${configurations.map(({ config }) => `- **${config.title}** (table: \`${config.postgresTableName}\`)`).join('\n')}



1. Copy this package to your Next.js project
2. Install dependencies: \`npm install\`
3. Import the CSS file in your app:
   \`\`\`tsx
   import './form-scaffold.css'
   \`\`\`



\`\`\`tsx
import { ServerForm } from './components/form-scaffold/ServerForm';

<ServerForm 
  config={yourFormConfiguration}
  autoSaveToDatabase={true}
/>
\`\`\`



- \`/components/form-scaffold/\` - Form components
- \`/types/\` - TypeScript type definitions  
- \`/actions/\` - Server actions for database operations
- \`/app/\` - Demo pages

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
 * Standalone execution
 */
async function main(): Promise<void> {
  await generateExportSSR();
}

if (require.main === module) {
  main().catch((error) => {
    console.error('Failed to generate export:', error);
    process.exit(1);
  });
}

export { generateExportSSR as generateExport };
export { generateExportSSR as main };
