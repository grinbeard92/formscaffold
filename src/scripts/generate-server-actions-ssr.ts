import { IFormConfiguration } from '@/types/globalFormTypes';
import * as path from 'path';
import * as fs from 'fs/promises';
import { generateServerActionsContent } from './generate-server-actions';

/**
 * Generates server actions file for a form configuration
 */
export async function generateServerActions(
  config: IFormConfiguration,
  projectRoot: string = process.cwd(),
  configMetadata?: { fileName: string; exportName: string },
): Promise<void> {
  const tableName = config.postgresTableName;
  const actionsDir = path.join(projectRoot, 'src', 'actions');
  const actionsFile = path.join(actionsDir, `${tableName}.ts`);

  await fs.mkdir(actionsDir, { recursive: true });

  const actionsContent = generateServerActionsContent(config, configMetadata);

  await fs.writeFile(actionsFile, actionsContent, 'utf8');
}
