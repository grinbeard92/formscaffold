/**
 * Server Actions Generator
 *
 * Generates Next.js Server Actions based on FormConfiguration
 * Creates CRUD operations for the specified table
 */
import { FormConfiguration } from '@/types/globalFormTypes';
import * as fs from 'fs/promises';
import * as path from 'path';

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

/**
 * Generates the content for the server actions file
 */
function generateServerActionsContent(
  config: FormConfiguration,
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

// Generate the Zod schema from form configuration
const ${tableName}Schema = generateZodSchema(${configVariableName});
const create${capitalizedTableName}Schema = ${tableName}Schema; // Schema already excludes database fields
const update${capitalizedTableName}Schema = create${capitalizedTableName}Schema.partial();


/**
 * Create a new ${tableName} entry
 */
export async function create${capitalizedTableName}(
  data: ${capitalizedTableName}FormData
): Promise<{ success: boolean; data?: ${capitalizedTableName}; error?: string }> {
  try {
    // Validate the input data
    const validatedData = create${capitalizedTableName}Schema.parse(data);
    
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
    // Convert FormData to object
    const data: Record<string, unknown> = {};
    for (const [key, value] of formData.entries()) {
      data[key] = value;
    }

    // Create the ${tableName}
    const result = await create${capitalizedTableName}(data as ${capitalizedTableName}FormData);
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to create ${tableName}');
    }
    
    // Redirect to success page or back to form
    redirect('/demo?success=true');
  } catch (error) {
    console.error('Error in submit${capitalizedTableName}Form:', error);
    // In a real app, you might want to handle errors differently
    throw error;
  }
}
`;
}
