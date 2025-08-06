import { FormConfiguration } from '@/types/globalFormTypes';
import {
  generateZodSchemaCode as generateZodCode,
  generatePostgresSchema,
} from '@/scripts/generate-schema';
import { generateTypes } from '@/scripts/generate-types';

export function generateFormConfiguration(config: FormConfiguration): string {
  const configString = `import { FormConfiguration } from '@/types/globalFormTypes';

export const ${config.postgresTableName}FormConfiguration: FormConfiguration = ${JSON.stringify(config, null, 2)};`;
  return configString;
}

// Use the master Zod schema generator from scripts
export function generateZodSchemaCode(config: FormConfiguration): string {
  return generateZodCode(config);
}

// Use the master PostgreSQL schema generator from scripts
export function generatePostgreSQLInit(config: FormConfiguration): string {
  return generatePostgresSchema(config);
}

// Generate TypeScript types using the master generator
export async function generateTypeDefinitions(
  config: FormConfiguration,
): Promise<string> {
  return await generateTypes(config);
}
