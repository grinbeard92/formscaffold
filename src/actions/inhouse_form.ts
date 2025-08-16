'use server';

/**
 * Server Actions for inhouseForm
 * Generated automatically from FormConfiguration: In-House Service Report
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
import { inhouseFormConfiguration } from '@/configurations/inhouseFormConfiguration';
import { generateZodSchema } from '@/scripts/generate-schema';
import { inhouseFormFormData, UpdateInhouseFormData, inhouseForm } from '@/types/inhouseFormTypes';
import { saveUploadedFiles, filePathsToString } from '@/utils/fileUpload';


const inhouseFormFormSchema = generateZodSchema(inhouseFormConfiguration, false);


const inhouseFormDatabaseSchema = inhouseFormFormSchema.extend({
  service_photos: z.string().nullable().optional(),
  test_documentation: z.string().nullable().optional()
});

const createInhouseFormSchema = inhouseFormDatabaseSchema;
const updateInhouseFormSchema = createInhouseFormSchema.partial();

/**
 * Process file uploads and convert File objects to file paths
 */
async function processFileUploads(data: Record<string, unknown>): Promise<Record<string, unknown>> {
  const processedData = { ...data };
  

  if (data.service_photos instanceof File || Array.isArray(data.service_photos)) {
    const filePaths = await saveUploadedFiles(data.service_photos as File | File[], 'inhouseform');
    processedData.service_photos = filePathsToString(filePaths);
  }

  if (data.test_documentation instanceof File || Array.isArray(data.test_documentation)) {
    const filePaths = await saveUploadedFiles(data.test_documentation as File | File[], 'inhouseform');
    processedData.test_documentation = filePathsToString(filePaths);
  }
  return processedData;
}


/**
 * Create a new inhouseForm entry
 */
export async function createInhouseFormRecord(
  data: inhouseFormFormData
): Promise<{ success: boolean; data?: inhouseForm; error?: string }> {
  try {

    const processedData = await processFileUploads(data as Record<string, unknown>);
    

    const validatedData = createInhouseFormSchema.parse(processedData);
    

    const result = await insertFormData(inhouseFormConfiguration, validatedData);
    

    revalidatePath('/inhouse_form');
    
    return {
      success: true,
      data: result as unknown as inhouseForm, // Cast to inhouseForm type
    };
  } catch (error) {
    console.error('Error creating inhouse_form:', error);
    
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
 * Get inhouse_form entries with pagination and filtering
 */
export async function getInhouseFormList(options: {
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: Record<string, unknown>;
} = {}): Promise<{ success: boolean; data?: inhouseForm[]; total?: number; error?: string }> {
  try {
    const {
      limit = 50,
      offset = 0,
      sortBy = 'created_at',
      sortOrder = 'desc',
      filters = {},
    } = options;

    const result = await getFormData(inhouseFormConfiguration, {
      limit,
      offset,
      sortBy,
      sortOrder,
      filters,
    });

    return {
      success: true,
      data: result.data as unknown as inhouseForm[], // Cast to inhouseForm[] type
      total: result.total,
    };
  } catch (error) {
    console.error('Error fetching inhouse_form list:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Get a single inhouse_form entry by ID
 */
export async function getInhouseFormRecordById(
  id: string
): Promise<{ success: boolean; data?: inhouseForm; error?: string }> {
  try {
    const result = await getFormData(inhouseFormConfiguration, {
      filters: { id },
      limit: 1,
      offset: 0,
    });

    if (!result.data || result.data.length === 0) {
      return {
        success: false,
        error: `No inhouse_form found with id '${id}'`,
      };
    }

    return {
      success: true,
      data: result.data[0] as unknown as inhouseForm, // Cast to inhouseForm type
    };
  } catch (error) {
    console.error('Error fetching inhouse_form by ID:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Update a inhouse_form entry
 */
export async function updateInhouseFormRecord(
  id: string,
  data: UpdateInhouseFormData
): Promise<{ success: boolean; data?: inhouseForm; error?: string }> {
  try {

    const validatedData = updateInhouseFormSchema.parse(data);
    

    const result = await updateFormData(inhouseFormConfiguration, id, validatedData);
    

    revalidatePath('/inhouse_form');
    
    return {
      success: true,
      data: result as unknown as inhouseForm, // Cast to inhouseForm type
    };
  } catch (error) {
    console.error('Error updating inhouse_form:', error);
    
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
 * Delete a inhouse_form entry
 */
export async function deleteInhouseForm(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await deleteFormData(inhouseFormConfiguration, id);
    

    revalidatePath('/inhouse_form');
    
    return {
      success: true,
    };
  } catch (error) {
    console.error('Error deleting inhouse_form:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Server action for form submission with redirect
 */
export async function submitInhouseForm(
  formData: FormData
): Promise<void> {
  try {

    const data: Record<string, unknown> = {};
    

    const fieldConfigs = new Map<string, { type: string; multiple?: boolean; pgConfig?: any }>();
    inhouseFormConfiguration.sections.forEach(section => {
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

          const filePaths = await saveUploadedFiles(files, 'inhouse_form');
          data[fieldName] = filePathsToString(filePaths);
        } else {

          if (files.length > 0) {
            const filePath = await saveUploadedFiles(files[0], 'inhouse_form');
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


    const result = await createInhouseForm(data as inhouseFormFormData);
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to create inhouse_form');
    }
    

    redirect('/inhouse_form?success=true');
  } catch (error) {
    console.error('Error in submitInhouseFormForm:', error);

    throw error;
  }
}
