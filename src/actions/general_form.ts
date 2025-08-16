'use server';

/**
 * Server Actions for generalForm
 * Generated automatically from FormConfiguration: General Field Service Report
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
import { generalFormConfiguration } from '@/configurations/generalFormConfiguration';
import { generateZodSchema } from '@/scripts/generate-schema';
import { generalFormFormData, UpdateGeneralFormData, generalForm } from '@/types/generalFormTypes';
import { saveUploadedFiles, filePathsToString } from '@/utils/fileUpload';


const generalFormFormSchema = generateZodSchema(generalFormConfiguration, false);


const generalFormDatabaseSchema = generalFormFormSchema.extend({
  before_service_photos: z.string().nullable().optional(),
  after_service_photos: z.string().nullable().optional(),
  customer_documents: z.string().nullable().optional()
});

const createGeneralFormSchema = generalFormDatabaseSchema;
const updateGeneralFormSchema = createGeneralFormSchema.partial();

/**
 * Process file uploads and convert File objects to file paths
 */
async function processFileUploads(data: Record<string, unknown>): Promise<Record<string, unknown>> {
  const processedData = { ...data };
  

  if (data.before_service_photos instanceof File || Array.isArray(data.before_service_photos)) {
    const filePaths = await saveUploadedFiles(data.before_service_photos as File | File[], 'generalform');
    processedData.before_service_photos = filePathsToString(filePaths);
  }

  if (data.after_service_photos instanceof File || Array.isArray(data.after_service_photos)) {
    const filePaths = await saveUploadedFiles(data.after_service_photos as File | File[], 'generalform');
    processedData.after_service_photos = filePathsToString(filePaths);
  }

  if (data.customer_documents instanceof File || Array.isArray(data.customer_documents)) {
    const filePaths = await saveUploadedFiles(data.customer_documents as File | File[], 'generalform');
    processedData.customer_documents = filePathsToString(filePaths);
  }
  return processedData;
}


/**
 * Create a new generalForm entry
 */
export async function createGeneralFormRecord(
  data: generalFormFormData
): Promise<{ success: boolean; data?: generalForm; error?: string }> {
  try {

    const processedData = await processFileUploads(data as Record<string, unknown>);
    

    const validatedData = createGeneralFormSchema.parse(processedData);
    

    const result = await insertFormData(generalFormConfiguration, validatedData);
    

    revalidatePath('/general_form');
    
    return {
      success: true,
      data: result as unknown as generalForm, // Cast to generalForm type
    };
  } catch (error) {
    console.error('Error creating general_form:', error);
    
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
 * Get general_form entries with pagination and filtering
 */
export async function getGeneralFormList(options: {
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: Record<string, unknown>;
} = {}): Promise<{ success: boolean; data?: generalForm[]; total?: number; error?: string }> {
  try {
    const {
      limit = 50,
      offset = 0,
      sortBy = 'created_at',
      sortOrder = 'desc',
      filters = {},
    } = options;

    const result = await getFormData(generalFormConfiguration, {
      limit,
      offset,
      sortBy,
      sortOrder,
      filters,
    });

    return {
      success: true,
      data: result.data as unknown as generalForm[], // Cast to generalForm[] type
      total: result.total,
    };
  } catch (error) {
    console.error('Error fetching general_form list:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Get a single general_form entry by ID
 */
export async function getGeneralFormRecordById(
  id: string
): Promise<{ success: boolean; data?: generalForm; error?: string }> {
  try {
    const result = await getFormData(generalFormConfiguration, {
      filters: { id },
      limit: 1,
      offset: 0,
    });

    if (!result.data || result.data.length === 0) {
      return {
        success: false,
        error: `No general_form found with id '${id}'`,
      };
    }

    return {
      success: true,
      data: result.data[0] as unknown as generalForm, // Cast to generalForm type
    };
  } catch (error) {
    console.error('Error fetching general_form by ID:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Update a general_form entry
 */
export async function updateGeneralFormRecord(
  id: string,
  data: UpdateGeneralFormData
): Promise<{ success: boolean; data?: generalForm; error?: string }> {
  try {

    const validatedData = updateGeneralFormSchema.parse(data);
    

    const result = await updateFormData(generalFormConfiguration, id, validatedData);
    

    revalidatePath('/general_form');
    
    return {
      success: true,
      data: result as unknown as generalForm, // Cast to generalForm type
    };
  } catch (error) {
    console.error('Error updating general_form:', error);
    
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
 * Delete a general_form entry
 */
export async function deleteGeneralForm(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await deleteFormData(generalFormConfiguration, id);
    

    revalidatePath('/general_form');
    
    return {
      success: true,
    };
  } catch (error) {
    console.error('Error deleting general_form:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Server action for form submission with redirect
 */
export async function submitGeneralForm(
  formData: FormData
): Promise<void> {
  try {

    const data: Record<string, unknown> = {};
    

    const fieldConfigs = new Map<string, { type: string; multiple?: boolean; pgConfig?: any }>();
    generalFormConfiguration.sections.forEach(section => {
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

          const filePaths = await saveUploadedFiles(files, 'general_form');
          data[fieldName] = filePathsToString(filePaths);
        } else {

          if (files.length > 0) {
            const filePath = await saveUploadedFiles(files[0], 'general_form');
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


    const result = await createGeneralForm(data as generalFormFormData);
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to create general_form');
    }
    

    redirect('/general_form?success=true');
  } catch (error) {
    console.error('Error in submitGeneralFormForm:', error);

    throw error;
  }
}
