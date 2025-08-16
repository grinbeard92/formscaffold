'use server';

/**
 * Server Actions for finalQualityForm
 * Generated automatically from FormConfiguration: Final Quality Inspection Report
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
import { finalQualityFormConfiguration } from '@/configurations/finalQualityFormConfiguration';
import { generateZodSchema } from '@/scripts/generate-schema';
import { finalQualityFormFormData, UpdateFinalQualityFormData, finalQualityForm } from '@/types/finalQualityFormTypes';
import { saveUploadedFiles, filePathsToString } from '@/utils/fileUpload';


const finalQualityFormFormSchema = generateZodSchema(finalQualityFormConfiguration, false);


const finalQualityFormDatabaseSchema = finalQualityFormFormSchema.extend({
  maintenance_pictures: z.string().nullable().optional(),
  supporting_documents: z.string().nullable().optional()
});

const createFinalQualityFormSchema = finalQualityFormDatabaseSchema;
const updateFinalQualityFormSchema = createFinalQualityFormSchema.partial();

/**
 * Process file uploads and convert File objects to file paths
 */
async function processFileUploads(data: Record<string, unknown>): Promise<Record<string, unknown>> {
  const processedData = { ...data };
  

  if (data.maintenance_pictures instanceof File || Array.isArray(data.maintenance_pictures)) {
    const filePaths = await saveUploadedFiles(data.maintenance_pictures as File | File[], 'finalqualityform');
    processedData.maintenance_pictures = filePathsToString(filePaths);
  }

  if (data.supporting_documents instanceof File || Array.isArray(data.supporting_documents)) {
    const filePaths = await saveUploadedFiles(data.supporting_documents as File | File[], 'finalqualityform');
    processedData.supporting_documents = filePathsToString(filePaths);
  }
  return processedData;
}


/**
 * Create a new finalQualityForm entry
 */
export async function createFinalQualityFormRecord(
  data: finalQualityFormFormData
): Promise<{ success: boolean; data?: finalQualityForm; error?: string }> {
  try {

    const processedData = await processFileUploads(data as Record<string, unknown>);
    

    const validatedData = createFinalQualityFormSchema.parse(processedData);
    

    const result = await insertFormData(finalQualityFormConfiguration, validatedData);
    

    revalidatePath('/final_quality_form');
    
    return {
      success: true,
      data: result as unknown as finalQualityForm, // Cast to finalQualityForm type
    };
  } catch (error) {
    console.error('Error creating final_quality_form:', error);
    
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
 * Get final_quality_form entries with pagination and filtering
 */
export async function getFinalQualityFormList(options: {
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: Record<string, unknown>;
} = {}): Promise<{ success: boolean; data?: finalQualityForm[]; total?: number; error?: string }> {
  try {
    const {
      limit = 50,
      offset = 0,
      sortBy = 'created_at',
      sortOrder = 'desc',
      filters = {},
    } = options;

    const result = await getFormData(finalQualityFormConfiguration, {
      limit,
      offset,
      sortBy,
      sortOrder,
      filters,
    });

    return {
      success: true,
      data: result.data as unknown as finalQualityForm[], // Cast to finalQualityForm[] type
      total: result.total,
    };
  } catch (error) {
    console.error('Error fetching final_quality_form list:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Get a single final_quality_form entry by ID
 */
export async function getFinalQualityFormRecordById(
  id: string
): Promise<{ success: boolean; data?: finalQualityForm; error?: string }> {
  try {
    const result = await getFormData(finalQualityFormConfiguration, {
      filters: { id },
      limit: 1,
      offset: 0,
    });

    if (!result.data || result.data.length === 0) {
      return {
        success: false,
        error: `No final_quality_form found with id '${id}'`,
      };
    }

    return {
      success: true,
      data: result.data[0] as unknown as finalQualityForm, // Cast to finalQualityForm type
    };
  } catch (error) {
    console.error('Error fetching final_quality_form by ID:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Update a final_quality_form entry
 */
export async function updateFinalQualityFormRecord(
  id: string,
  data: UpdateFinalQualityFormData
): Promise<{ success: boolean; data?: finalQualityForm; error?: string }> {
  try {

    const validatedData = updateFinalQualityFormSchema.parse(data);
    

    const result = await updateFormData(finalQualityFormConfiguration, id, validatedData);
    

    revalidatePath('/final_quality_form');
    
    return {
      success: true,
      data: result as unknown as finalQualityForm, // Cast to finalQualityForm type
    };
  } catch (error) {
    console.error('Error updating final_quality_form:', error);
    
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
 * Delete a final_quality_form entry
 */
export async function deleteFinalQualityForm(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await deleteFormData(finalQualityFormConfiguration, id);
    

    revalidatePath('/final_quality_form');
    
    return {
      success: true,
    };
  } catch (error) {
    console.error('Error deleting final_quality_form:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Server action for form submission with redirect
 */
export async function submitFinalQualityForm(
  formData: FormData
): Promise<void> {
  try {

    const data: Record<string, unknown> = {};
    

    const fieldConfigs = new Map<string, { type: string; multiple?: boolean; pgConfig?: any }>();
    finalQualityFormConfiguration.sections.forEach(section => {
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

          const filePaths = await saveUploadedFiles(files, 'final_quality_form');
          data[fieldName] = filePathsToString(filePaths);
        } else {

          if (files.length > 0) {
            const filePath = await saveUploadedFiles(files[0], 'final_quality_form');
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


    const result = await createFinalQualityForm(data as finalQualityFormFormData);
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to create final_quality_form');
    }
    

    redirect('/final_quality_form?success=true');
  } catch (error) {
    console.error('Error in submitFinalQualityFormForm:', error);

    throw error;
  }
}
