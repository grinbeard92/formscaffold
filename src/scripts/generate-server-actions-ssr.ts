import { FormConfiguration } from '@/types/globalFormTypes';
import * as path from 'path';
import * as fs from 'fs/promises';
import { generateServerActionsContent } from './generate-server-actions';

/**
 * Generates server actions file for a form configuration
 */
export async function generateServerActions(
  config: FormConfiguration,
  projectRoot: string = process.cwd(),
  configMetadata?: { fileName: string; exportName: string },
): Promise<void> {
  const tableName = config.postgresTableName;
  const actionsDir = path.join(projectRoot, 'src', 'actions');
  const actionsFile = path.join(actionsDir, `${tableName}.ts`);

  // Ensure actions directory exists
  await fs.mkdir(actionsDir, { recursive: true });

  // Generate the server actions content
  const actionsContent = generateServerActionsContent(config, configMetadata);

  // Write the actions file
  await fs.writeFile(actionsFile, actionsContent, 'utf8');

  console.log(`✅ Generated server actions: src/actions/${tableName}.ts`);
}
