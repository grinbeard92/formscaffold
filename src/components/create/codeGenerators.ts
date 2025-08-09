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

// Use the master Zod schema generator from scripts
export function generateZodSchemaCode(config: IFormConfiguration): string {
  return generateZodCode(config);
}

// Use the master PostgreSQL schema generator from scripts
export function generatePostgreSQLInit(config: IFormConfiguration): string {
  return generatePostgresSchema(config);
}

// Generate TypeScript types using the master generator
export async function generateTypeDefinitions(
  config: IFormConfiguration,
): Promise<string> {
  return await generateTypes(config);
}
