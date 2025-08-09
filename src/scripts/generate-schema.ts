import { email, z } from 'zod';
import { IFormConfiguration, IFieldDefinition } from '@/types/globalFormTypes';
import { FieldValues } from 'react-hook-form';

// Utility function to generate Zod schema from form configuration
export function generateZodSchema(config: IFormConfiguration) {
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
export function generateCompleteZodSchema(config: IFormConfiguration) {
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
  field: IFieldDefinition<FieldValues>,
): z.ZodTypeAny {
  let schema: z.ZodTypeAny;

  switch (field.type) {
    case 'text':
      if (field.required) {
        schema = z.string().min(1, 'A value is required.');
      } else {
        schema = z.string().optional();
      }
    case 'search':
    case 'hidden':
      schema = z.string();
      break;

    case 'email':
      const emailValidation = z.email('Invalid email format');
      if (field.required) {
        schema = emailValidation;
      } else {
        schema = emailValidation.optional();
      }
      break;

    case 'url':
      schema = z.url('Invalid URL format');
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
      if (field.required) {
        schema = z.string().trim().min(1, 'A value is required.');
      } else {
        schema = z.string().optional();
      }
      break;

    case 'number':
    case 'range':
      schema = z.coerce.number();
      if (field.zodConfig?.int) {
        schema = z.number().int();
      }
      if (field.zodConfig?.positive) {
        schema = z.number().positive();
      }
      if (field.min !== undefined) {
        schema = z.number().min(Number(field.min));
      }
      if (field.max !== undefined && field.max !== null) {
        schema = z.number().max(Number(field.max));
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
      // File inputs can have File objects or be empty
      if (field.multiple) {
        // Multiple files - expect array of Files (empty array is valid)
        schema = z.array(z.file('Expected a file upload')).default([]);
      } else {
        // Single file - can be File or null/undefined
        schema = z.file('Expected a file upload').nullable().optional();
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

    case 'signature':
      // Signature fields store base64 encoded image data as strings
      schema = z.string().min(1, 'Signature is required');
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
      schema = z.string().min(field.zodConfig.minLength);
    }
    if (field.zodConfig?.maxLength) {
      schema = z.string().max(field.zodConfig.maxLength);
    }
    if (field.zodConfig?.regex) {
      schema = z.string().regex(field.zodConfig.regex);
    }
  }

  // Handlespecial JSON field type with custom validation
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

  return schema;
}

// Utility function to generate PostgreSQL table creation SQL
export function generatePostgresSchema(config: IFormConfiguration): string {
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
  field: IFieldDefinition<FieldValues>,
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
function generateIndexes(config: IFormConfiguration): string {
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
export function createFormSchemas(config: IFormConfiguration) {
  const zodSchema = generateZodSchema(config);
  const postgresSchema = generatePostgresSchema(config);

  return {
    zodSchema,
    postgresSchema,
    tableName: config.postgresTableName,
  };
}

// Generate Zod schema as TypeScript code string
export function generateZodSchemaCode(config: IFormConfiguration): string {
  let schemaCode = `import { z } from 'zod';\n\n`;
  schemaCode += `export const ${config.postgresTableName}Schema = z.object({\n`;

  config.sections.forEach((section) => {
    section.fields.forEach((field) => {
      let fieldSchemaCode = '';

      switch (field.type) {
        case 'text':
        case 'search':
        case 'hidden':
          fieldSchemaCode = 'z.string()';
          break;

        case 'email':
          fieldSchemaCode = field.zodConfig?.email
            ? "z.email('Invalid email format')"
            : 'z.string()';
          break;

        case 'url':
          fieldSchemaCode = field.zodConfig?.url
            ? "z.url('Invalid URL format')"
            : 'z.string()';
          break;

        case 'tel':
          fieldSchemaCode =
            "z.string().regex(/^[+]?[\\d\\s\\-\\(\\)]+$/, 'Invalid phone number format')";
          break;

        case 'password':
          fieldSchemaCode = 'z.string()';
          break;

        case 'textarea':
          fieldSchemaCode = 'z.string()';
          break;

        case 'number':
        case 'range':
          fieldSchemaCode = 'z.coerce.number()';
          if (field.zodConfig?.int) fieldSchemaCode += '.int()';
          if (field.zodConfig?.positive) fieldSchemaCode += '.positive()';
          if (field.zodConfig?.min !== undefined)
            fieldSchemaCode += `.min(${field.zodConfig.min})`;
          if (field.zodConfig?.max !== undefined)
            fieldSchemaCode += `.max(${field.zodConfig.max})`;
          if (field.min !== undefined) fieldSchemaCode += `.min(${field.min})`;
          if (field.max !== undefined) fieldSchemaCode += `.max(${field.max})`;
          break;

        case 'date':
          fieldSchemaCode =
            "z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date format' })";
          break;

        case 'time':
          fieldSchemaCode =
            "z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)')";
          break;

        case 'datetime-local':
          fieldSchemaCode =
            "z.string().refine((val) => { const date = new Date(val); return !isNaN(date.getTime()) && val.match(/^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}$/); }, { message: 'Invalid datetime format (YYYY-MM-DDTHH:MM)' })";
          break;

        case 'month':
          fieldSchemaCode =
            "z.string().regex(/^\\d{4}-\\d{2}$/, 'Invalid month format (YYYY-MM)')";
          break;

        case 'week':
          fieldSchemaCode =
            "z.string().regex(/^\\d{4}-W\\d{2}$/, 'Invalid week format (YYYY-WNN)')";
          break;

        case 'color':
          fieldSchemaCode =
            "z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid color format (must be hex: #RRGGBB)')";
          break;

        case 'checkbox':
        case 'toggle':
          fieldSchemaCode = 'z.boolean()';
          break;

        case 'file':
          if (field.multiple) {
            fieldSchemaCode = 'z.array(z.instanceof(File)).default([])';
          } else {
            fieldSchemaCode = 'z.instanceof(File).nullable().optional()';
          }
          break;

        case 'radio':
        case 'select':
          if (field.options && field.options.length > 0) {
            const values = field.options.map((option) =>
              typeof option === 'string' ? `"${option}"` : `"${option.value}"`,
            );
            fieldSchemaCode = `z.enum([${values.join(', ')}])`;
          } else {
            fieldSchemaCode = 'z.string()';
          }
          break;

        case 'signature':
          fieldSchemaCode = "z.string().min(1, 'Signature is required')";
          break;

        default:
          fieldSchemaCode = 'z.string()';
      }

      // Apply string-specific configurations
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
          fieldSchemaCode += `.min(${field.zodConfig.minLength})`;
        }
        if (field.zodConfig?.maxLength) {
          fieldSchemaCode += `.max(${field.zodConfig.maxLength})`;
        }
        if (field.zodConfig?.regex) {
          fieldSchemaCode += `.regex(${field.zodConfig.regex})`;
        }
      }

      // Handle special JSON field types
      if (field.pgConfig?.type === 'JSON' || field.pgConfig?.type === 'JSONB') {
        fieldSchemaCode =
          "z.string().refine((val) => { try { JSON.parse(val); return true; } catch { return false; } }, { message: 'Invalid JSON format' })";
      }

      // Apply custom refinements
      if (field.zodConfig?.refine) {
        fieldSchemaCode += `.refine(${field.zodConfig.refine.check}, { message: '${field.zodConfig.refine.message}' })`;
      }

      // Make field optional if not required
      if (!field.required) {
        fieldSchemaCode += '.optional()';
      }

      schemaCode += `  ${field.name}: ${fieldSchemaCode},\n`;
    });
  });

  schemaCode += '});\n\n';
  schemaCode += `export type T${config.postgresTableName.charAt(0).toUpperCase() + config.postgresTableName.slice(1)}Data = z.infer<typeof ${config.postgresTableName}Schema>;`;

  return schemaCode;
}

// Type exports
export type TFormConfigurationType = IFormConfiguration;
export type TGeneratedFormType = z.infer<ReturnType<typeof generateZodSchema>>;

// For backward compatibility - you can remove these if not needed
export const genericDataSchema = z.object({
  id: z.uuid(),
  title: z.string().min(1).max(255),
  text: z.string().min(1),
  created_at: z.date(),
  updated_at: z.date(),
});

export type TGenericDataType = z.infer<typeof genericDataSchema>;
