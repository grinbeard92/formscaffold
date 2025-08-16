'use server';

/**
 * Server Actions for systemIntakeForm
 * Generated automatically from FormConfiguration: System Intake Form
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
import { systemIntakeFormConfiguration } from '@/configurations/systemIntakeFormConfiguration';
import { generateZodSchema } from '@/scripts/generate-schema';
import { systemIntakeFormFormData, UpdateSystemIntakeFormData, systemIntakeForm } from '@/types/systemIntakeFormTypes';
import { saveUploadedFiles, filePathsToString } from '@/utils/fileUpload';


const systemIntakeFormFormSchema = generateZodSchema(systemIntakeFormConfiguration, false);


const systemIntakeFormDatabaseSchema = systemIntakeFormFormSchema.extend({
  equipment_photos: z.string().nullable().optional(),
  supporting_documents: z.string().nullable().optional()
});

const createSystemIntakeFormSchema = systemIntakeFormDatabaseSchema;
const updateSystemIntakeFormSchema = createSystemIntakeFormSchema.partial();

/**
 * Process file uploads and convert File objects to file paths
 */
async function processFileUploads(data: Record<string, unknown>): Promise<Record<string, unknown>> {
  const processedData = { ...data };
  

  if (data.equipment_photos instanceof File || Array.isArray(data.equipment_photos)) {
    const filePaths = await saveUploadedFiles(data.equipment_photos as File | File[], 'systemintakeform');
    processedData.equipment_photos = filePathsToString(filePaths);
  }

  if (data.supporting_documents instanceof File || Array.isArray(data.supporting_documents)) {
    const filePaths = await saveUploadedFiles(data.supporting_documents as File | File[], 'systemintakeform');
    processedData.supporting_documents = filePathsToString(filePaths);
  }
  return processedData;
}


/**
 * Create a new systemIntakeForm entry
 */
export async function createSystemIntakeFormRecord(
  data: systemIntakeFormFormData
): Promise<{ success: boolean; data?: systemIntakeForm; error?: string }> {
  try {

    const processedData = await processFileUploads(data as Record<string, unknown>);
    

    const validatedData = createSystemIntakeFormSchema.parse(processedData);
    

    const result = await insertFormData(systemIntakeFormConfiguration, validatedData);
    

    revalidatePath('/system_intake_form');
    
    return {
      success: true,
      data: result as unknown as systemIntakeForm, // Cast to systemIntakeForm type
    };
  } catch (error) {
    console.error('Error creating system_intake_form:', error);
    
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
 * Get system_intake_form entries with pagination and filtering
 */
export async function getSystemIntakeFormList(options: {
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: Record<string, unknown>;
} = {}): Promise<{ success: boolean; data?: systemIntakeForm[]; total?: number; error?: string }> {
  try {
    const {
      limit = 50,
      offset = 0,
      sortBy = 'created_at',
      sortOrder = 'desc',
      filters = {},
    } = options;

    const result = await getFormData(systemIntakeFormConfiguration, {
      limit,
      offset,
      sortBy,
      sortOrder,
      filters,
    });

    return {
      success: true,
      data: result.data as unknown as systemIntakeForm[], // Cast to systemIntakeForm[] type
      total: result.total,
    };
  } catch (error) {
    console.error('Error fetching system_intake_form list:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Get a single system_intake_form entry by ID
 */
export async function getSystemIntakeFormRecordById(
  id: string
): Promise<{ success: boolean; data?: systemIntakeForm; error?: string }> {
  try {
    const result = await getFormData(systemIntakeFormConfiguration, {
      filters: { id },
      limit: 1,
      offset: 0,
    });

    if (!result.data || result.data.length === 0) {
      return {
        success: false,
        error: `No system_intake_form found with id '${id}'`,
      };
    }

    return {
      success: true,
      data: result.data[0] as unknown as systemIntakeForm, // Cast to systemIntakeForm type
    };
  } catch (error) {
    console.error('Error fetching system_intake_form by ID:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Update a system_intake_form entry
 */
export async function updateSystemIntakeFormRecord(
  id: string,
  data: UpdateSystemIntakeFormData
): Promise<{ success: boolean; data?: systemIntakeForm; error?: string }> {
  try {

    const validatedData = updateSystemIntakeFormSchema.parse(data);
    

    const result = await updateFormData(systemIntakeFormConfiguration, id, validatedData);
    

    revalidatePath('/system_intake_form');
    
    return {
      success: true,
      data: result as unknown as systemIntakeForm, // Cast to systemIntakeForm type
    };
  } catch (error) {
    console.error('Error updating system_intake_form:', error);
    
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
 * Delete a system_intake_form entry
 */
export async function deleteSystemIntakeForm(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await deleteFormData(systemIntakeFormConfiguration, id);
    

    revalidatePath('/system_intake_form');
    
    return {
      success: true,
    };
  } catch (error) {
    console.error('Error deleting system_intake_form:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Server action for form submission with redirect
 */
export async function submitSystemIntakeForm(
  formData: FormData
): Promise<void> {
  try {

    const data: Record<string, unknown> = {};
    

    const fieldConfigs = new Map<string, { type: string; multiple?: boolean; pgConfig?: any }>();
    systemIntakeFormConfiguration.sections.forEach(section => {
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

          const filePaths = await saveUploadedFiles(files, 'system_intake_form');
          data[fieldName] = filePathsToString(filePaths);
        } else {

          if (files.length > 0) {
            const filePath = await saveUploadedFiles(files[0], 'system_intake_form');
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


    const result = await createSystemIntakeForm(data as systemIntakeFormFormData);
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to create system_intake_form');
    }
    

    redirect('/system_intake_form?success=true');
  } catch (error) {
    console.error('Error in submitSystemIntakeFormForm:', error);

    throw error;
  }
}
