import { IFormConfiguration } from '@/types/globalFormTypes';
import {
  generateZodSchemaCode as generateZodCode,
  generatePostgresSchema,
} from '@/scripts/generate-schema';
import { generateTypes } from '@/scripts/generate-types';

export function generateFormConfiguration(config: IFormConfiguration): string {
  const configString = `import { FormConfiguration } from '@/types/globalFormTypes';

export const ${config.postgresTableName}FormConfiguration: FormConfiguration = ${JSON.stringify(config, null, 2)};`;
  return configString;
}

export function generateZodSchemaCode(config: IFormConfiguration): string {
  return generateZodCode(config);
}

export function generatePostgreSQLInit(config: IFormConfiguration): string {
  return generatePostgresSchema(config);
}

export async function generateTypeDefinitions(
  config: IFormConfiguration,
): Promise<string> {
  return await generateTypes(config);
}
