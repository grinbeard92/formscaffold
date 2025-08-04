import { z } from 'zod';
import {
  FormConfiguration,
  FieldDefinition,
} from '@/components/form/DemoFormConfiguration';

// Utility function to generate Zod schema from form configuration
export function generateZodSchema(config: FormConfiguration) {
  const schemaFields: Record<string, z.ZodTypeAny> = {};

  // Add standard fields
  schemaFields.id = z.string().uuid();
  schemaFields.createdAt = z.date();
  schemaFields.updatedAt = z.date();

  // Generate fields from form configuration
  config.sections.forEach((section) => {
    section.fields.forEach((field) => {
      schemaFields[field.name] = createZodFieldSchema(field);
    });
  });

  return z.object(schemaFields);
}

// Helper function to create Zod schema for individual field
function createZodFieldSchema(field: FieldDefinition): z.ZodTypeAny {
  let schema: z.ZodTypeAny;

  switch (field.type) {
    case 'text':
    case 'email':
    case 'password':
    case 'textarea':
      schema = z.string();
      if (field.zodConfig?.minLength) {
        schema = (schema as z.ZodString).min(field.zodConfig.minLength);
      }
      if (field.zodConfig?.maxLength) {
        schema = (schema as z.ZodString).max(field.zodConfig.maxLength);
      }
      if (field.zodConfig?.email || field.type === 'email') {
        schema = (schema as z.ZodString).email();
      }
      if (field.zodConfig?.regex) {
        schema = (schema as z.ZodString).regex(field.zodConfig.regex);
      }
      break;

    case 'number':
      schema = z.number();
      if (field.zodConfig?.int) {
        schema = (schema as z.ZodNumber).int();
      }
      if (field.zodConfig?.positive) {
        schema = (schema as z.ZodNumber).positive();
      }
      if (field.min !== undefined) {
        schema = (schema as z.ZodNumber).min(Number(field.min));
      }
      if (field.max !== undefined) {
        schema = (schema as z.ZodNumber).max(Number(field.max));
      }
      break;

    case 'date':
      schema = z.date();
      break;

    case 'checkbox':
      schema = z.boolean();
      break;

    case 'select':
      if (field.options && field.options.length > 0) {
        const values = field.options.map((option) =>
          typeof option === 'string' ? option : option.value,
        );
        schema = z.enum(values as [string, ...string[]]);
      } else {
        schema = z.string();
      }
      break;

    default:
      schema = z.string();
  }

  // Apply custom refinements
  if (field.zodConfig?.refine) {
    schema = schema.refine(field.zodConfig.refine.check, {
      message: field.zodConfig.refine.message,
    });
  }

  // Make field optional if not required
  if (!field.required) {
    schema = schema.optional();
  }

  if (field.zodConfig?.date) {
    schema = schema.refine((value) => value instanceof Date, {
      message: 'Invalid date',
    });
  }

  return schema;
}

// Utility function to generate PostgreSQL table creation SQL
export function generatePostgresSchema(config: FormConfiguration): string {
  const tableName = config.postgresTableName;
  const columns: string[] = [];

  // Add standard columns
  columns.push('id UUID PRIMARY KEY DEFAULT gen_random_uuid()');
  columns.push('created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()');
  columns.push('updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()');

  // Generate columns from form configuration
  config.sections.forEach((section) => {
    section.fields.forEach((field) => {
      const columnDef = createPostgresColumnDefinition(field);
      columns.push(columnDef);
    });
  });

  const createTableSQL = `
CREATE TABLE IF NOT EXISTS ${tableName} (
  ${columns.join(',\n  ')}
);

-- Create indexes
${generateIndexes(config)}

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language plpgsql;

DROP TRIGGER IF EXISTS update_${tableName}_updated_at ON ${tableName};
CREATE TRIGGER update_${tableName}_updated_at
    BEFORE UPDATE ON ${tableName}
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
  `.trim();

  return createTableSQL;
}

// Helper function to create PostgreSQL column definition
function createPostgresColumnDefinition(field: FieldDefinition): string {
  const pgConfig = field.pgConfig;
  let columnType: string;

  // Determine column type
  switch (field.type) {
    case 'text':
    case 'email':
    case 'password':
      columnType =
        pgConfig?.type === 'TEXT'
          ? 'TEXT'
          : `VARCHAR(${pgConfig?.length || 255})`;
      break;
    case 'textarea':
      columnType = 'TEXT';
      break;
    case 'number':
      columnType =
        pgConfig?.type === 'BIGINT'
          ? 'BIGINT'
          : pgConfig?.type === 'DECIMAL'
            ? 'DECIMAL'
            : 'INTEGER';
      break;
    case 'date':
      columnType =
        pgConfig?.type === 'TIMESTAMP' ? 'TIMESTAMP WITH TIME ZONE' : 'DATE';
      break;
    case 'checkbox':
      columnType = 'BOOLEAN';
      break;
    case 'select':
      columnType = `VARCHAR(${pgConfig?.length || 100})`;
      break;
    default:
      columnType = `VARCHAR(${pgConfig?.length || 255})`;
  }

  // Build column definition
  let columnDef = `${field.name} ${columnType}`;

  // Add constraints
  if (!field.required && pgConfig?.nullable !== false) {
    // Column is nullable
  } else {
    columnDef += ' NOT NULL';
  }

  if (pgConfig?.unique) {
    columnDef += ' UNIQUE';
  }

  if (pgConfig?.default !== undefined) {
    const defaultValue =
      typeof pgConfig.default === 'string'
        ? `'${pgConfig.default}'`
        : pgConfig.default;
    columnDef += ` DEFAULT ${defaultValue}`;
  }

  return columnDef;
}

// Helper function to generate index creation SQL
function generateIndexes(config: FormConfiguration): string {
  const indexes: string[] = [];
  const tableName = config.postgresTableName;

  config.sections.forEach((section) => {
    section.fields.forEach((field) => {
      if (field.pgConfig?.index) {
        indexes.push(
          `CREATE INDEX IF NOT EXISTS idx_${tableName}_${field.name} ON ${tableName} (${field.name});`,
        );
      }
    });
  });

  return indexes.join('\n');
}

// Export the generated schema based on the form configuration
export function createFormSchemas(config: FormConfiguration) {
  const zodSchema = generateZodSchema(config);
  const postgresSchema = generatePostgresSchema(config);

  return {
    zodSchema,
    postgresSchema,
    tableName: config.postgresTableName,
  };
}

// Type exports
export type FormConfigurationType = FormConfiguration;
export type GeneratedFormType = z.infer<ReturnType<typeof generateZodSchema>>;

// For backward compatibility - you can remove these if not needed
export const genericDataSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(255),
  text: z.string().min(1),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type GenericDataType = z.infer<typeof genericDataSchema>;
