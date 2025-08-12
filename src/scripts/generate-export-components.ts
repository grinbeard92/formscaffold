#!/usr/bin/env tsx

/**
 * Demo Pages Generator
 *
 * This script generates demo pages for each FormConfiguration
 * Creates pages at /app/[tableName]/page.tsx with:
 * - SSR ServerForm component
 * - Database info display showing table contents
 *
 * Usage: Called by generate-all.ts or run standalone
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import type { IFormConfiguration } from '../types/globalFormTypes';

/**
 * Generates a demo page for a form configuration
 */
export async function generateExportComponent(
  config: IFormConfiguration,
  projectRoot: string = process.cwd(),
  configMetadata?: { fileName: string; exportName: string },
): Promise<void> {
  const tableName = config.postgresTableName;

  // Create the app/[tableName] directory
  const pageDir = path.join(projectRoot, 'src', 'app', tableName);
  await fs.mkdir(pageDir, { recursive: true });

  // Generate the page content
  const pageContent = generatePageContent(config, configMetadata);

  // Write the page.tsx file
  const pagePath = path.join(pageDir, 'page.tsx');
  await fs.writeFile(pagePath, pageContent, 'utf8');

  console.log(`✅ Generated demo page: src/app/${tableName}/page.tsx`);
}

/**
 * Generates the page.tsx content for a form configuration
 */
function generatePageContent(
  config: IFormConfiguration,
  configMetadata?: { fileName: string; exportName: string },
): string {
  const tableName = config.postgresTableName;
  const capitalizedTableName =
    tableName.charAt(0).toUpperCase() + tableName.slice(1);

  // Generate configuration import based on actual file metadata
  let configImportPath: string;
  let configVariableName: string;

  if (configMetadata) {
    // Remove .ts extension and use the actual file name
    const configFileName = configMetadata.fileName.replace(/\.tsx?$/, '');
    configImportPath = `@/configurations/${configFileName}`;
    configVariableName = configMetadata.exportName;
  } else {
    // Fallback for backwards compatibility
    configImportPath = `@/configurations/${tableName}FormConfiguration`;
    configVariableName = `${tableName}FormConfiguration`;
  }

  return `import { ServerForm } from '@/components/form/ServerForm';
import { ${configVariableName} } from '${configImportPath}';

export default function ${capitalizedTableName}Page() {
  return (
    <div className='container mx-auto max-w-4xl px-4 py-8'>
      <div className='space-y-6'>
        {/* Page Header */}
        <div className='space-y-2 text-center'>
          <h1 className='text-foreground text-3xl font-bold'>
            ${config.title}
          </h1>
          <p className='text-muted-foreground'>
            Generated form component for{' '}
            <code className='bg-muted text-muted-foreground rounded px-1 py-0.5 font-mono'>${tableName}</code> table
                        
          </p>
          <code className='bg-muted text-muted-foreground rounded px-1 py-0.5 font-mono'>
              Use the ServerForm component anywhere in your app.
              Ensure that the types, components and configurations are imported into your project correctly.
            </code>
        </div>

        {/* Form Section */}
        <div className='bg-card rounded-lg border shadow-sm'>
            <ServerForm
              config={${configVariableName}}
              autoSaveToDatabase={true}
            />
        </div>

        {/* Footer */}
        <div className='space-y-1 text-center text-sm text-muted-foreground'>
          <p>
            This page was auto-generated from{' '}
            <code className='rounded bg-muted px-1 py-0.5 font-mono'>
              ${configMetadata?.fileName || `${tableName}FormConfiguration.ts`}
            </code>
          </p>
          <p>
            Form configuration filename: <strong className='text-card-foreground'>${configMetadata?.exportName || configVariableName}</strong>
          </p>
        </div>
      </div>
    </div>
  );
}

export const metadata = {
  title: '${config.title} - FormScaffold Generated Component',
  description: 'Auto-generated form component for ${tableName} table',
};
`;
}

async function main() {}

// Only run main if this file is executed directly
if (require.main === module) {
  main().catch(console.error);
}
