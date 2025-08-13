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
import { reactifyLowercase, reactifyName } from '@/utils/utils';

/**
 * Generates a demo page for a form configuration
 */
export async function generateProdPage(
  config: IFormConfiguration,
  projectRoot: string = process.cwd(),
  configMetadata?: { fileName: string; exportName: string },
): Promise<void> {
  const tableName = config.postgresTableName;

  const pageDir = path.join(projectRoot, 'src', 'app', tableName);
  await fs.mkdir(pageDir, { recursive: true });

  const pageContent = generatePageContent(config, configMetadata);

  const pagePath = path.join(pageDir, 'page.tsx');
  await fs.writeFile(pagePath, pageContent, 'utf8');
}

/**
 * Generates the page.tsx content for a form configuration
 */
function generatePageContent(
  config: IFormConfiguration,
  configMetadata?: { fileName: string; exportName: string },
): string {
  const tableName = config.postgresTableName;
  const reactTableName = reactifyLowercase(tableName);
  let configImportPath: string;
  let configVariableName: string;

  if (configMetadata) {
    const configFileName = configMetadata.fileName.replace(/\.tsx?$/, '');
    configImportPath = `@/configurations/${configFileName}`;
    configVariableName = configMetadata.exportName;
  } else {
    configImportPath = `@/configurations/${reactTableName}Configuration`;
    configVariableName = `${reactTableName}Configuration`;
  }

  return `import { ServerForm } from '../../components/form-scaffold/ServerForm';
import sql from '../../db/postgres-js';
import { ${configVariableName} } from '${configImportPath}';

export default function ${reactTableName}Page() {
  return (
    <div className='container mx-auto max-w-4xl px-4 py-8'>

        {/* Form Section */}
        <div className='bg-card rounded-lg border shadow-sm'>
          <div className='p-6'>
            <ServerForm
              config={${configVariableName}}
              autoSaveToDatabase={true}
            />
          </div>
        </div>
    </div>
  );
}

export const metadata = {
  title: '${config.title}',
  description: 'Production ${reactTableName} form',
};
`;
}

/**
 * Standalone execution for testing
 */
async function main() {
  console.log(
    'For standalone usage, you would need to provide configuration...',
  );
}

if (require.main === module) {
  main().catch(console.error);
}
