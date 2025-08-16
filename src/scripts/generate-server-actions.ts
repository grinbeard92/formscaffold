/**
 * Server Actions Generator
 *
 * Generates Next.js Server Actions based on FormConfiguration
 * Creates CRUD operations for the specified table
 */
import { IFormConfiguration } from '@/types/globalFormTypes';
import { reactifyLowercase, reactifyName } from '@/utils/utils';

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
  const reactTableName = reactifyName(tableName);
  const reactLowercaseTableName = reactifyLowercase(tableName);
  const fileFields: string[] = [];

  config.sections.forEach((section) => {
    section.fields.forEach((field) => {
      if (field.type === 'file') {
        fileFields.push(`

  if (data.${field.name} instanceof File || Array.isArray(data.${field.name})) {
    const filePaths = await saveUploadedFiles(data.${field.name} as File | File[], '${reactLowercaseTableName}');
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
  const reactTableName = reactifyLowercase(tableName);
  const capsReactTableName = reactifyName(tableName);

  let configImportPath: string;
  let configVariableName: string;

  if (configMetadata) {
    const configFileName = configMetadata.fileName.replace(/\.tsx?$/, '');
    configImportPath = `@/configurations/${configFileName}`;
    configVariableName = configMetadata.exportName;
  } else {
    configImportPath = `@/configurations/${reactTableName}FormConfiguration`;
    configVariableName = `${reactTableName}FormConfiguration`;
  }

  return `'use server';

/**
 * Server Actions for ${reactTableName}
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
import { ${reactTableName}FormData, Update${capsReactTableName}Data, ${reactTableName} } from '@/types/${reactTableName}Types';
import { saveUploadedFiles, filePathsToString } from '@/utils/fileUpload';


const ${reactTableName}FormSchema = generateZodSchema(${configVariableName}, false);


const ${reactTableName}DatabaseSchema = ${reactTableName}FormSchema.extend({${generateFileFieldOverrides(config)}});

const create${capsReactTableName}Schema = ${reactTableName}DatabaseSchema;
const update${capsReactTableName}Schema = create${capsReactTableName}Schema.partial();

/**
 * Process file uploads and convert File objects to file paths
 */
async function processFileUploads(data: Record<string, unknown>): Promise<Record<string, unknown>> {
  const processedData = { ...data };
  ${generateFileProcessingLogic(config, reactTableName)}
  return processedData;
}


/**
 * Create a new ${reactTableName} entry
 */
export async function create${capsReactTableName}Record(
  data: ${reactTableName}FormData
): Promise<{ success: boolean; data?: ${reactTableName}; error?: string }> {
  try {

    const processedData = await processFileUploads(data as Record<string, unknown>);
    

    const validatedData = create${capsReactTableName}Schema.parse(processedData);
    

    const result = await insertFormData(${configVariableName}, validatedData);
    

    revalidatePath('/${tableName}');
    
    return {
      success: true,
      data: result as unknown as ${reactTableName}, // Cast to ${reactTableName} type
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
export async function get${capsReactTableName}List(options: {
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: Record<string, unknown>;
} = {}): Promise<{ success: boolean; data?: ${reactTableName}[]; total?: number; error?: string }> {
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
      data: result.data as unknown as ${reactTableName}[], // Cast to ${reactTableName}[] type
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
export async function get${capsReactTableName}RecordById(
  id: string
): Promise<{ success: boolean; data?: ${reactTableName}; error?: string }> {
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
      data: result.data[0] as unknown as ${reactTableName}, // Cast to ${reactTableName} type
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
export async function update${capsReactTableName}Record(
  id: string,
  data: Update${capsReactTableName}Data
): Promise<{ success: boolean; data?: ${reactTableName}; error?: string }> {
  try {

    const validatedData = update${capsReactTableName}Schema.parse(data);
    

    const result = await updateFormData(${configVariableName}, id, validatedData);
    

    revalidatePath('/${tableName}');
    
    return {
      success: true,
      data: result as unknown as ${reactTableName}, // Cast to ${reactTableName} type
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
export async function delete${capsReactTableName}(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await deleteFormData(${configVariableName}, id);
    

    revalidatePath('/${tableName}');
    
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
export async function submit${capsReactTableName}(
  formData: FormData
): Promise<void> {
  try {

    const data: Record<string, unknown> = {};
    

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
    

    const formEntries: Record<string, (string | File)[]> = {};
    
    for (const [key, value] of formData.entries()) {
      if (!formEntries[key]) {
        formEntries[key] = [];
      }
      formEntries[key].push(value as string | File);
    }
    

    for (const [fieldName, values] of Object.entries(formEntries)) {
      if (values.length === 0) {
        continue;
      }
      
      const fieldConfig = fieldConfigs.get(fieldName);
      const hasFiles = values.some(value => value instanceof File);
      
      if (hasFiles && fieldConfig?.type === 'file') {

        const files = values.filter(value => value instanceof File) as File[];
        
        if (fieldConfig.multiple) {

          const filePaths = await saveUploadedFiles(files, '${tableName}');
          data[fieldName] = filePathsToString(filePaths);
        } else {

          if (files.length > 0) {
            const filePath = await saveUploadedFiles(files[0], '${tableName}');
            data[fieldName] = filePath;
          }
        }
      } else if (hasFiles && fieldConfig?.type === 'signature') {

        const files = values.filter(value => value instanceof File) as File[];
        if (files.length > 0) {
          const file = files[0];
          const buffer = await file.arrayBuffer();
          const base64 = Buffer.from(buffer).toString('base64');
          data[fieldName] = \`data:\${file.type};base64,\${base64}\`;
        }
      } else {

        if (values.length === 1) {
          data[fieldName] = values[0];
        } else {

          data[fieldName] = values;
        }
      }
    }


    const result = await create${capsReactTableName}(data as ${reactTableName}FormData);
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to create ${tableName}');
    }
    

    redirect('/${tableName}?success=true');
  } catch (error) {
    console.error('Error in submit${capsReactTableName}Form:', error);

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
