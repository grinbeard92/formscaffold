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
import type { FormConfiguration } from '../types/globalFormTypes';

/**
 * Generates a demo page for a form configuration
 */
export async function generateDemoPage(
  config: FormConfiguration,
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
  config: FormConfiguration,
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
import sql from '@/db/postgres-js';

// Database info component that shows table contents
async function DatabaseInfo() {
  let tableData: Record<string, unknown>[] = [];
  let error: string | null = null;
  
  try {
    // Get all records from the table
    const result = await sql\`SELECT * FROM \${sql('${tableName}')} ORDER BY created_at DESC LIMIT 10\`;
    tableData = result as Record<string, unknown>[];
  } catch (err) {
    error = err instanceof Error ? err.message : 'Unknown error occurred';
    console.error('Error fetching ${tableName} data:', err);
  }

  return (
    <div className='mt-8 space-y-4'>
      <h2 className='text-secondary-foreground text-xl font-semibold'>
        Database Contents
      </h2>
      <div className='bg-secondary overflow-x-auto rounded-lg p-4 font-mono text-sm text-green-400'>
        <div className='text-muted-foreground mb-2'>
          SELECT * FROM ${tableName} ORDER BY created_at DESC LIMIT 10;
        </div>
        {error ? (
          <div className='text-danger'>Error: {error}</div>
        ) : tableData.length === 0 ? (
          <div className='text-warning'>No records found in ${tableName} table</div>
        ) : (
          <pre className="whitespace-pre-wrap">
            {JSON.stringify(tableData, null, 2)}
          </pre>
        )}
      </div>
      <div className='text-sm text-gray-600'>
        Showing latest 10 records from the{' '}
        <code className='bg-primary rounded px-1'>${tableName}</code> table
      </div>
    </div>
  );
}

// Main page component
export default function ${capitalizedTableName}Page() {
  return (
    <div className='container mx-auto max-w-4xl px-4 py-8'>
      <div className='space-y-6'>
        {/* Page Header */}
        <div className='space-y-2 text-center'>
          <h1 className='text-primary-foreground text-3xl font-bold'>
            ${config.title}
          </h1>
          <p className='text-gray-600'>
            Generated form demo for{' '}
            <code className='bg-primary rounded px-1'>${tableName}</code> table
          </p>
        </div>

        {/* Form Section */}
        <div className='bg-primary rounded-lg border shadow-sm'>
          <div className='p-6'>
            <h2 className='mb-4 text-xl font-semibold text-gray-900'>
              Add New ${capitalizedTableName}
            </h2>
            <ServerForm
              config={${configVariableName}}
              autoSaveToDatabase={true}
            />
          </div>
        </div>

        {/* Database Info Section */}
        <div className='bg-primary rounded-lg border shadow-sm'>
          <DatabaseInfo />
        </div>

        {/* Footer */}
        <div className='space-y-1 text-center text-sm text-gray-500'>
          <p>
            This page was auto-generated from{' '}
            <code className='rounded bg-gray-100 px-1'>
              ${configMetadata?.fileName || `${tableName}FormConfiguration.ts`}
            </code>
          </p>
          <p>
            Form configuration filename: <strong>${configMetadata?.exportName || configVariableName}</strong>
          </p>
        </div>
      </div>
    </div>
  );
}

export const metadata = {
  title: '${config.title} - FormScaffold Demo',
  description: 'Auto-generated form demo page for ${tableName} table',
};
`;
}

/**
 * Standalone execution for testing
 */
async function main() {
  console.log('🚀 Demo Pages Generator');
  console.log('This script is typically called by generate-all.ts');
  console.log(
    'For standalone usage, you would need to provide configuration...',
  );
}

// Only run main if this file is executed directly
if (require.main === module) {
  main().catch(console.error);
}
