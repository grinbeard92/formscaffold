'use server';

/**
 * Server Actions for maintenanceForm
 * Generated automatically from FormConfiguration: Annual Maintenance Checklist
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
import { maintenanceFormConfiguration } from '@/configurations/maintenanceFormConfiguration';
import { generateZodSchema } from '@/scripts/generate-schema';
import { maintenanceFormFormData, UpdatemaintenanceFormData, maintenanceForm } from '@/types/maintenanceFormTypes';
import { saveUploadedFiles, filePathsToString } from '@/utils/fileUpload';


const maintenanceFormFormSchema = generateZodSchema(maintenanceFormConfiguration); // For form validation (with File objects)


const maintenanceFormDatabaseSchema = maintenanceFormFormSchema.extend({
  maintenance_pictures: z.string().nullable().optional(),
  supporting_documents: z.string().nullable().optional()
});

const createmaintenanceFormSchema = maintenanceFormDatabaseSchema;
const updatemaintenanceFormSchema = createmaintenanceFormSchema.partial();

/**
 * Process file uploads and convert File objects to file paths
 */
async function processFileUploads(data: Record<string, unknown>): Promise<Record<string, unknown>> {
  const processedData = { ...data };
  

  if (data.maintenance_pictures instanceof File || Array.isArray(data.maintenance_pictures)) {
    const filePaths = await saveUploadedFiles(data.maintenance_pictures as File | File[], 'maintenanceform');
    processedData.maintenance_pictures = filePathsToString(filePaths);
  }

  if (data.supporting_documents instanceof File || Array.isArray(data.supporting_documents)) {
    const filePaths = await saveUploadedFiles(data.supporting_documents as File | File[], 'maintenanceform');
    processedData.supporting_documents = filePathsToString(filePaths);
  }
  return processedData;
}


/**
 * Create a new maintenanceForm entry
 */
export async function createmaintenanceFormRecord(
  data: maintenanceFormFormData
): Promise<{ success: boolean; data?: maintenanceForm; error?: string }> {
  try {

    const processedData = await processFileUploads(data as Record<string, unknown>);
    

    const validatedData = createmaintenanceFormSchema.parse(processedData);
    

    const result = await insertFormData(maintenanceFormConfiguration, validatedData);
    

    revalidatePath('/maintenanceForm');
    
    return {
      success: true,
      data: result as unknown as maintenanceForm, // Cast to maintenanceForm type
    };
  } catch (error) {
    console.error('Error creating maintenance_form:', error);
    
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
 * Get maintenance_form entries with pagination and filtering
 */
export async function getmaintenanceFormList(options: {
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: Record<string, unknown>;
} = {}): Promise<{ success: boolean; data?: maintenanceForm[]; total?: number; error?: string }> {
  try {
    const {
      limit = 50,
      offset = 0,
      sortBy = 'created_at',
      sortOrder = 'desc',
      filters = {},
    } = options;

    const result = await getFormData(maintenanceFormConfiguration, {
      limit,
      offset,
      sortBy,
      sortOrder,
      filters,
    });

    return {
      success: true,
      data: result.data as unknown as maintenanceForm[], // Cast to maintenanceForm[] type
      total: result.total,
    };
  } catch (error) {
    console.error('Error fetching maintenance_form list:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Get a single maintenance_form entry by ID
 */
export async function getmaintenanceFormRecordById(
  id: string
): Promise<{ success: boolean; data?: maintenanceForm; error?: string }> {
  try {
    const result = await getFormData(maintenanceFormConfiguration, {
      filters: { id },
      limit: 1,
      offset: 0,
    });

    if (!result.data || result.data.length === 0) {
      return {
        success: false,
        error: `No maintenance_form found with id '${id}'`,
      };
    }

    return {
      success: true,
      data: result.data[0] as unknown as maintenanceForm, // Cast to maintenanceForm type
    };
  } catch (error) {
    console.error('Error fetching maintenance_form by ID:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Update a maintenance_form entry
 */
export async function updatemaintenanceFormRecord(
  id: string,
  data: UpdatemaintenanceFormData
): Promise<{ success: boolean; data?: maintenanceForm; error?: string }> {
  try {

    const validatedData = updatemaintenanceFormSchema.parse(data);
    

    const result = await updateFormData(maintenanceFormConfiguration, id, validatedData);
    

    revalidatePath('/maintenance_form');
    
    return {
      success: true,
      data: result as unknown as maintenanceForm, // Cast to maintenanceForm type
    };
  } catch (error) {
    console.error('Error updating maintenance_form:', error);
    
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
 * Delete a maintenance_form entry
 */
export async function deletemaintenanceForm(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await deleteFormData(maintenanceFormConfiguration, id);
    

    revalidatePath('/maintenance_form');
    
    return {
      success: true,
    };
  } catch (error) {
    console.error('Error deleting maintenance_form:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Server action for form submission with redirect
 */
export async function submitmaintenanceFormForm(
  formData: FormData
): Promise<void> {
  try {

    const data: Record<string, unknown> = {};
    

    const fieldConfigs = new Map<string, { type: string; multiple?: boolean; pgConfig?: any }>();
    maintenanceFormConfiguration.sections.forEach(section => {
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

          const filePaths = await saveUploadedFiles(files, 'maintenance_form');
          data[fieldName] = filePathsToString(filePaths);
        } else {

          if (files.length > 0) {
            const filePath = await saveUploadedFiles(files[0], 'maintenance_form');
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


    const result = await createmaintenanceForm(data as maintenanceFormFormData);
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to create maintenance_form');
    }
    

    redirect('/maintenance_form?success=true');
  } catch (error) {
    console.error('Error in submitmaintenanceFormForm:', error);

    throw error;
  }
}
