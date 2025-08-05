import { z } from 'zod';
import { FormConfiguration, FieldDefinition } from '@/types/globalFormTypes';
import { FieldValues } from 'react-hook-form';

// Utility function to generate Zod schema from form configuration
export function generateZodSchema(config: FormConfiguration) {
  const schemaFields: Record<string, z.ZodTypeAny> = {};

  // DO NOT add database-generated fields (id, created_at, updated_at)
  // These are handled by the database automatically

  // Generate fields from form configuration
  config.sections.forEach((section) => {
    section.fields.forEach((field) => {
      schemaFields[field.name] = createZodFieldSchema(field);
    });
  });

  return z.object(schemaFields);
}

// Utility function to generate complete Zod schema including database fields (for type generation)
export function generateCompleteZodSchema(config: FormConfiguration) {
  const schemaFields: Record<string, z.ZodTypeAny> = {};

  // Add database-generated fields for complete type definitions
  schemaFields.id = z.string().uuid();
  schemaFields.created_at = z.date();
  schemaFields.updated_at = z.date();

  // Generate fields from form configuration
  config.sections.forEach((section) => {
    section.fields.forEach((field) => {
      schemaFields[field.name] = createZodFieldSchema(field);
    });
  });

  return z.object(schemaFields);
}

// Helper function to create Zod schema for individual field
function createZodFieldSchema(
  field: FieldDefinition<FieldValues>,
): z.ZodTypeAny {
  let schema: z.ZodTypeAny;

  switch (field.type) {
    case 'text':
    case 'search':
    case 'hidden':
      schema = z.string();
      break;

    case 'email':
      schema = z.string().email('Invalid email format');
      break;

    case 'url':
      schema = z.string().url('Invalid URL format');
      break;

    case 'tel':
      schema = z
        .string()
        .regex(/^[+]?[\d\s\-\(\)]+$/, 'Invalid phone number format');
      break;

    case 'password':
      schema = z.string();
      if (field.zodConfig?.minLength) {
        schema = (schema as z.ZodString).min(field.zodConfig.minLength);
      }
      break;

    case 'textarea':
      schema = z.string();
      break;

    case 'number':
    case 'range':
      schema = z.coerce.number();
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
      schema = z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: 'Invalid date format',
      });
      break;

    case 'time':
      schema = z
        .string()
        .regex(
          /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
          'Invalid time format (HH:MM)',
        );
      break;

    case 'datetime-local':
      schema = z.string().refine(
        (val) => {
          const date = new Date(val);
          return (
            !isNaN(date.getTime()) &&
            val.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/)
          );
        },
        {
          message: 'Invalid datetime format (YYYY-MM-DDTHH:MM)',
        },
      );
      break;

    case 'month':
      schema = z
        .string()
        .regex(/^\d{4}-\d{2}$/, 'Invalid month format (YYYY-MM)');
      break;

    case 'week':
      schema = z
        .string()
        .regex(/^\d{4}-W\d{2}$/, 'Invalid week format (YYYY-WNN)');
      break;

    case 'color':
      schema = z
        .string()
        .regex(
          /^#[0-9A-Fa-f]{6}$/,
          'Invalid color format (must be hex: #RRGGBB)',
        );
      break;

    case 'checkbox':
    case 'toggle':
      schema = z.boolean();
      break;

    case 'file':
      // For file uploads, we typically store the file path or URL as a string
      // Or if using BYTEA, we might store base64 encoded data
      if (typeof window !== 'undefined' && typeof File !== 'undefined') {
        // In browser: validate File object
        schema = z
          .instanceof(File, { message: 'Expected a file upload' })
          .or(
            z
              .any()
              .refine(
                (val) =>
                  val &&
                  typeof val === 'object' &&
                  'name' in val &&
                  'size' in val &&
                  'type' in val,
                { message: 'Expected a file-like object' },
              ),
          );
      } else if (field.pgConfig?.type === 'BYTEA') {
        // Expect a base64-encoded string for BYTEA storage (server-side)
        schema = z
          .string()
          .regex(
            /^[A-Za-z0-9+/]*={0,2}$/,
            'Invalid file data format (must be base64)',
          );
      } else {
        // Standard file path/URL storage (server-side)
        schema = z
          .string()
          .min(1, 'File path required')
          .or(z.string().url('Invalid file URL'));
      }
      break;

    case 'radio':
      if (field.options && field.options.length > 0) {
        const values = field.options.map((option) =>
          typeof option === 'string' ? option : option.value,
        );
        schema = z.enum(values as [string, ...string[]]);
      } else {
        schema = z.string();
      }
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

  // Apply string-specific configurations (for string-based field types)
  if (
    [
      'text',
      'email',
      'url',
      'tel',
      'password',
      'textarea',
      'search',
      'hidden',
    ].includes(field.type)
  ) {
    if (field.zodConfig?.minLength) {
      schema = (schema as z.ZodString).min(field.zodConfig.minLength);
    }
    if (field.zodConfig?.maxLength) {
      schema = (schema as z.ZodString).max(field.zodConfig.maxLength);
    }
    if (field.zodConfig?.regex) {
      schema = (schema as z.ZodString).regex(field.zodConfig.regex);
    }
  }

  // Handle special JSON field type with custom validation
  if (field.pgConfig?.type === 'JSON' || field.pgConfig?.type === 'JSONB') {
    schema = z.string().refine(
      (val) => {
        try {
          JSON.parse(val);
          return true;
        } catch {
          return false;
        }
      },
      {
        message: 'Invalid JSON format',
      },
    );
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
function createPostgresColumnDefinition(
  field: FieldDefinition<FieldValues>,
): string {
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
  id: z.uuid(),
  title: z.string().min(1).max(255),
  text: z.string().min(1),
  created_at: z.date(),
  updated_at: z.date(),
});

export type GenericDataType = z.infer<typeof genericDataSchema>;
