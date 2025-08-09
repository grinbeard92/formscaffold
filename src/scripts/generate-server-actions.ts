/**
 * Server Actions Generator
 *
 * Generates Next.js Server Actions based on FormConfiguration
 * Creates CRUD operations for the specified table
 */
import { IFormConfiguration } from '@/types/globalFormTypes';

/**
 * Generate file field overrides for database schema
 */
function generateFileFieldOverrides(config: IFormConfiguration): string {
  const fileFields: string[] = [];

  config.sections.forEach((section) => {
    section.fields.forEach((field) => {
      if (field.type === 'file') {
        fileFields.push(`  ${field.name}: z.string().nullable().optional()`);
      }
    });
  });

  return fileFields.length > 0 ? '\n' + fileFields.join(',\n') + '\n' : '';
}

/**
 * Generate file processing logic for specific form fields
 */
function generateFileProcessingLogic(
  config: IFormConfiguration,
  tableName: string,
): string {
  const fileFields: string[] = [];

  config.sections.forEach((section) => {
    section.fields.forEach((field) => {
      if (field.type === 'file') {
        fileFields.push(`
  // Process ${field.name}
  if (data.${field.name} instanceof File || Array.isArray(data.${field.name})) {
    const filePaths = await saveUploadedFiles(data.${field.name} as File | File[], '${tableName}');
    processedData.${field.name} = filePathsToString(filePaths);
  }`);
      }
    });
  });

  return fileFields.join('');
}

/**
 * Generates the content for the server actions file
 */
export function generateServerActionsContent(
  config: IFormConfiguration,
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

  return `'use server';

/**
 * Server Actions for ${capitalizedTableName}
 * Generated automatically from FormConfiguration: ${config.title}
 */

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import {
  insertFormData,
  getFormData,
  updateFormData,
  deleteFormData,
} from '@/db/generic-db-actions';
import { ${configVariableName} } from '${configImportPath}';
import { generateZodSchema } from '@/scripts/generate-schema';
import { ${capitalizedTableName}FormData, Update${capitalizedTableName}Data, ${capitalizedTableName} } from '@/types/${tableName}Types';
import { saveUploadedFiles, filePathsToString } from '@/utils/fileUpload';

// Generate schemas
const ${tableName}FormSchema = generateZodSchema(${configVariableName}); // For form validation (with File objects)

// Create database schema (files converted to strings)
const ${tableName}DatabaseSchema = ${tableName}FormSchema.extend({${generateFileFieldOverrides(config)}});

const create${capitalizedTableName}Schema = ${tableName}DatabaseSchema;
const update${capitalizedTableName}Schema = create${capitalizedTableName}Schema.partial();

/**
 * Process file uploads and convert File objects to file paths
 */
async function processFileUploads(data: Record<string, unknown>): Promise<Record<string, unknown>> {
  const processedData = { ...data };
  ${generateFileProcessingLogic(config, tableName)}
  return processedData;
}


/**
 * Create a new ${tableName} entry
 */
export async function create${capitalizedTableName}(
  data: ${capitalizedTableName}FormData
): Promise<{ success: boolean; data?: ${capitalizedTableName}; error?: string }> {
  try {
    // Process file uploads first (convert File objects to file paths)
    const processedData = await processFileUploads(data as Record<string, unknown>);
    
    // Validate the processed data
    const validatedData = create${capitalizedTableName}Schema.parse(processedData);
    
    // Insert data using the database function
    const result = await insertFormData(${configVariableName}, validatedData);
    
    // Revalidate the page to show updated data
    revalidatePath('/${tableName}');
    revalidatePath('/demo');
    
    return {
      success: true,
      data: result as unknown as ${capitalizedTableName}, // Cast to ${capitalizedTableName} type
    };
  } catch (error) {
    console.error('Error creating ${tableName}:', error);
    
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: \`Validation error: \${error.issues.map(e => e.message).join(', ')}\`,
      };
    }
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Get ${tableName} entries with pagination and filtering
 */
export async function get${capitalizedTableName}List(options: {
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: Record<string, unknown>;
} = {}): Promise<{ success: boolean; data?: ${capitalizedTableName}[]; total?: number; error?: string }> {
  try {
    const {
      limit = 50,
      offset = 0,
      sortBy = 'created_at',
      sortOrder = 'desc',
      filters = {},
    } = options;

    const result = await getFormData(${configVariableName}, {
      limit,
      offset,
      sortBy,
      sortOrder,
      filters,
    });

    return {
      success: true,
      data: result.data as unknown as ${capitalizedTableName}[], // Cast to ${capitalizedTableName}[] type
      total: result.total,
    };
  } catch (error) {
    console.error('Error fetching ${tableName} list:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Get a single ${tableName} entry by ID
 */
export async function get${capitalizedTableName}ById(
  id: string
): Promise<{ success: boolean; data?: ${capitalizedTableName}; error?: string }> {
  try {
    const result = await getFormData(${configVariableName}, {
      filters: { id },
      limit: 1,
      offset: 0,
    });

    if (!result.data || result.data.length === 0) {
      return {
        success: false,
        error: \`No ${tableName} found with id '\${id}'\`,
      };
    }

    return {
      success: true,
      data: result.data[0] as unknown as ${capitalizedTableName}, // Cast to ${capitalizedTableName} type
    };
  } catch (error) {
    console.error('Error fetching ${tableName} by ID:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Update a ${tableName} entry
 */
export async function update${capitalizedTableName}(
  id: string,
  data: Update${capitalizedTableName}Data
): Promise<{ success: boolean; data?: ${capitalizedTableName}; error?: string }> {
  try {
    // Validate the input data
    const validatedData = update${capitalizedTableName}Schema.parse(data);
    
    // Update data using the database function
    const result = await updateFormData(${configVariableName}, id, validatedData);
    
    // Revalidate the page to show updated data
    revalidatePath('/${tableName}');
    revalidatePath('/demo');
    
    return {
      success: true,
      data: result as unknown as ${capitalizedTableName}, // Cast to ${capitalizedTableName} type
    };
  } catch (error) {
    console.error('Error updating ${tableName}:', error);
    
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: \`Validation error: \${error.issues.map((e: { message: string }) => e.message).join(', ')}\`,
      };
    }
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Delete a ${tableName} entry
 */
export async function delete${capitalizedTableName}(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await deleteFormData(${configVariableName}, id);
    
    // Revalidate the page to show updated data
    revalidatePath('/${tableName}');
    revalidatePath('/demo');
    
    return {
      success: true,
    };
  } catch (error) {
    console.error('Error deleting ${tableName}:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Server action for form submission with redirect
 */
export async function submit${capitalizedTableName}Form(
  formData: FormData
): Promise<void> {
  try {
    // Convert FormData to object, handling files properly
    const data: Record<string, unknown> = {};
    
    // Get field configurations to determine file handling
    const fieldConfigs = new Map<string, { type: string; multiple?: boolean; pgConfig?: any }>();
    ${configVariableName}.sections.forEach(section => {
      section.fields.forEach(field => {
        fieldConfigs.set(field.name, { 
          type: field.type, 
          multiple: field.multiple,
          pgConfig: field.pgConfig 
        });
      });
    });
    
    // Group all form entries by key to handle multiple files
    const formEntries: Record<string, (string | File)[]> = {};
    
    for (const [key, value] of formData.entries()) {
      if (!formEntries[key]) {
        formEntries[key] = [];
      }
      formEntries[key].push(value as string | File);
    }
    
    // Process each field appropriately
    for (const [fieldName, values] of Object.entries(formEntries)) {
      if (values.length === 0) {
        continue;
      }
      
      const fieldConfig = fieldConfigs.get(fieldName);
      const hasFiles = values.some(value => value instanceof File);
      
      if (hasFiles && fieldConfig?.type === 'file') {
        // Handle file uploads using proper file processing
        const files = values.filter(value => value instanceof File) as File[];
        
        if (fieldConfig.multiple) {
          // Multiple file upload - save files and store paths as comma-separated string
          const filePaths = await saveUploadedFiles(files, '${tableName}');
          data[fieldName] = filePathsToString(filePaths);
        } else {
          // Single file upload - save file and store path as string
          if (files.length > 0) {
            const filePath = await saveUploadedFiles(files[0], '${tableName}');
            data[fieldName] = filePath;
          }
        }
      } else if (hasFiles && fieldConfig?.type === 'signature') {
        // Handle signature fields - always single, convert to base64
        const files = values.filter(value => value instanceof File) as File[];
        if (files.length > 0) {
          const file = files[0];
          const buffer = await file.arrayBuffer();
          const base64 = Buffer.from(buffer).toString('base64');
          data[fieldName] = \`data:\${file.type};base64,\${base64}\`;
        }
      } else {
        // Handle regular form data
        if (values.length === 1) {
          data[fieldName] = values[0];
        } else {
          // Multiple values for same field name (e.g., checkboxes)
          data[fieldName] = values;
        }
      }
    }

    // Create the ${tableName}
    const result = await create${capitalizedTableName}(data as ${capitalizedTableName}FormData);
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to create ${tableName}');
    }
    
    // Redirect to success page or back to form
    redirect('/${tableName}?success=true');
  } catch (error) {
    console.error('Error in submit${capitalizedTableName}Form:', error);
    // In a real app, you might want to handle errors differently
    throw error;
  }
}
`;
}

/**
 * Generate server actions code as a string (for UI display)
 */
export function generateServerActionsCode(
  config: IFormConfiguration,
  configMetadata?: { fileName: string; exportName: string },
): string {
  return generateServerActionsContent(config, configMetadata);
}
