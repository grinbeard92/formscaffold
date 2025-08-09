'use server';

/**
 * Server Actions for Demo
 * Generated automatically from FormConfiguration: Comprehensive Form Demo
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
import { demoFormConfiguration } from '@/configurations/demoFormConfiguration';
import { generateZodSchema } from '@/scripts/generate-schema';
import { DemoFormData, UpdateDemoData, Demo } from '@/types/demoTypes';
import { saveUploadedFiles, filePathsToString } from '@/utils/fileUpload';

// Generate schemas
const demoFormSchema = generateZodSchema(demoFormConfiguration); // For form validation (with File objects)

// Create database schema (files converted to strings)
const demoDatabaseSchema = demoFormSchema.extend({
  profile_picture: z.string().nullable().optional(),
  resume_file: z.string().nullable().optional()
});

const createDemoSchema = demoDatabaseSchema;
const updateDemoSchema = createDemoSchema.partial();

/**
 * Process file uploads and convert File objects to file paths
 */
async function processFileUploads(data: Record<string, unknown>): Promise<Record<string, unknown>> {
  const processedData = { ...data };
  
  // Process profile_picture
  if (data.profile_picture instanceof File || Array.isArray(data.profile_picture)) {
    const filePaths = await saveUploadedFiles(data.profile_picture as File | File[], 'demo');
    processedData.profile_picture = filePathsToString(filePaths);
  }
  // Process resume_file
  if (data.resume_file instanceof File || Array.isArray(data.resume_file)) {
    const filePaths = await saveUploadedFiles(data.resume_file as File | File[], 'demo');
    processedData.resume_file = filePathsToString(filePaths);
  }
  return processedData;
}


/**
 * Create a new demo entry
 */
export async function createDemo(
  data: DemoFormData
): Promise<{ success: boolean; data?: Demo; error?: string }> {
  try {
    // Process file uploads first (convert File objects to file paths)
    const processedData = await processFileUploads(data as Record<string, unknown>);
    
    // Validate the processed data
    const validatedData = createDemoSchema.parse(processedData);
    
    // Insert data using the database function
    const result = await insertFormData(demoFormConfiguration, validatedData);
    
    // Revalidate the page to show updated data
    revalidatePath('/demo');
    revalidatePath('/demo');
    
    return {
      success: true,
      data: result as unknown as Demo, // Cast to Demo type
    };
  } catch (error) {
    console.error('Error creating demo:', error);
    
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: `Validation error: ${error.issues.map(e => e.message).join(', ')}`,
      };
    }
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Get demo entries with pagination and filtering
 */
export async function getDemoList(options: {
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: Record<string, unknown>;
} = {}): Promise<{ success: boolean; data?: Demo[]; total?: number; error?: string }> {
  try {
    const {
      limit = 50,
      offset = 0,
      sortBy = 'created_at',
      sortOrder = 'desc',
      filters = {},
    } = options;

    const result = await getFormData(demoFormConfiguration, {
      limit,
      offset,
      sortBy,
      sortOrder,
      filters,
    });

    return {
      success: true,
      data: result.data as unknown as Demo[], // Cast to Demo[] type
      total: result.total,
    };
  } catch (error) {
    console.error('Error fetching demo list:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Get a single demo entry by ID
 */
export async function getDemoById(
  id: string
): Promise<{ success: boolean; data?: Demo; error?: string }> {
  try {
    const result = await getFormData(demoFormConfiguration, {
      filters: { id },
      limit: 1,
      offset: 0,
    });

    if (!result.data || result.data.length === 0) {
      return {
        success: false,
        error: `No demo found with id '${id}'`,
      };
    }

    return {
      success: true,
      data: result.data[0] as unknown as Demo, // Cast to Demo type
    };
  } catch (error) {
    console.error('Error fetching demo by ID:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Update a demo entry
 */
export async function updateDemo(
  id: string,
  data: UpdateDemoData
): Promise<{ success: boolean; data?: Demo; error?: string }> {
  try {
    // Validate the input data
    const validatedData = updateDemoSchema.parse(data);
    
    // Update data using the database function
    const result = await updateFormData(demoFormConfiguration, id, validatedData);
    
    // Revalidate the page to show updated data
    revalidatePath('/demo');
    revalidatePath('/demo');
    
    return {
      success: true,
      data: result as unknown as Demo, // Cast to Demo type
    };
  } catch (error) {
    console.error('Error updating demo:', error);
    
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: `Validation error: ${error.issues.map((e: { message: string }) => e.message).join(', ')}`,
      };
    }
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Delete a demo entry
 */
export async function deleteDemo(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await deleteFormData(demoFormConfiguration, id);
    
    // Revalidate the page to show updated data
    revalidatePath('/demo');
    revalidatePath('/demo');
    
    return {
      success: true,
    };
  } catch (error) {
    console.error('Error deleting demo:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Server action for form submission with redirect
 */
export async function submitDemoForm(
  formData: FormData
): Promise<void> {
  try {
    // Convert FormData to object, handling files properly
    const data: Record<string, unknown> = {};
    
    // Get field configurations to determine file handling
    const fieldConfigs = new Map<string, { type: string; multiple?: boolean; pgConfig?: any }>();
    demoFormConfiguration.sections.forEach(section => {
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
          const filePaths = await saveUploadedFiles(files, 'demo');
          data[fieldName] = filePathsToString(filePaths);
        } else {
          // Single file upload - save file and store path as string
          if (files.length > 0) {
            const filePath = await saveUploadedFiles(files[0], 'demo');
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
          data[fieldName] = `data:${file.type};base64,${base64}`;
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

    // Create the demo
    const result = await createDemo(data as DemoFormData);
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to create demo');
    }
    
    // Redirect to success page or back to form
    redirect('/demo?success=true');
  } catch (error) {
    console.error('Error in submitDemoForm:', error);
    // In a real app, you might want to handle errors differently
    throw error;
  }
}
