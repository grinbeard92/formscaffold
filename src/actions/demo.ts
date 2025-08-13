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


const demoFormSchema = generateZodSchema(demoFormConfiguration); // For form validation (with File objects)


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
  

  if (data.profile_picture instanceof File || Array.isArray(data.profile_picture)) {
    const filePaths = await saveUploadedFiles(data.profile_picture as File | File[], 'demo');
    processedData.profile_picture = filePathsToString(filePaths);
  }

  if (data.resume_file instanceof File || Array.isArray(data.resume_file)) {
    const filePaths = await saveUploadedFiles(data.resume_file as File | File[], 'demo');
    processedData.resume_file = filePathsToString(filePaths);
  }
  return processedData;
}


/**
 * Create a new demo entry
 */
export async function createDemoRecord(
  data: DemoFormData
): Promise<{ success: boolean; data?: Demo; error?: string }> {
  try {

    const processedData = await processFileUploads(data as Record<string, unknown>);
    

    const validatedData = createDemoSchema.parse(processedData);
    

    const result = await insertFormData(demoFormConfiguration, validatedData);
    

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
export async function getDemoRecordById(
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
export async function updateDemoRecord(
  id: string,
  data: UpdateDemoData
): Promise<{ success: boolean; data?: Demo; error?: string }> {
  try {

    const validatedData = updateDemoSchema.parse(data);
    

    const result = await updateFormData(demoFormConfiguration, id, validatedData);
    

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

    const data: Record<string, unknown> = {};
    

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

          const filePaths = await saveUploadedFiles(files, 'demo');
          data[fieldName] = filePathsToString(filePaths);
        } else {

          if (files.length > 0) {
            const filePath = await saveUploadedFiles(files[0], 'demo');
            data[fieldName] = filePath;
          }
        }
      } else if (hasFiles && fieldConfig?.type === 'signature') {

        const files = values.filter(value => value instanceof File) as File[];
        if (files.length > 0) {
          const file = files[0];
          const buffer = await file.arrayBuffer();
          const base64 = Buffer.from(buffer).toString('base64');
          data[fieldName] = `data:${file.type};base64,${base64}`;
        }
      } else {

        if (values.length === 1) {
          data[fieldName] = values[0];
        } else {

          data[fieldName] = values;
        }
      }
    }


    const result = await createDemo(data as DemoFormData);
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to create demo');
    }
    

    redirect('/demo?success=true');
  } catch (error) {
    console.error('Error in submitDemoForm:', error);

    throw error;
  }
}
