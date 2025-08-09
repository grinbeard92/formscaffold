'use server';

/**
 * Server Actions for Maintenance
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
import { MaintenanceFormData, UpdateMaintenanceData, Maintenance } from '@/types/maintenanceTypes';
import { saveUploadedFiles, filePathsToString } from '@/utils/fileUpload';

// Generate schemas
const maintenanceFormSchema = generateZodSchema(maintenanceFormConfiguration); // For form validation (with File objects)

// Create database schema (files converted to strings)
const maintenanceDatabaseSchema = maintenanceFormSchema.extend({
  maintenance_pictures: z.string().nullable().optional(),
  supporting_documents: z.string().nullable().optional()
});

const createMaintenanceSchema = maintenanceDatabaseSchema;
const updateMaintenanceSchema = createMaintenanceSchema.partial();

/**
 * Process file uploads and convert File objects to file paths
 */
async function processFileUploads(data: Record<string, unknown>): Promise<Record<string, unknown>> {
  const processedData = { ...data };
  
  // Process maintenance_pictures
  if (data.maintenance_pictures instanceof File || Array.isArray(data.maintenance_pictures)) {
    const filePaths = await saveUploadedFiles(data.maintenance_pictures as File | File[], 'maintenance');
    processedData.maintenance_pictures = filePathsToString(filePaths);
  }
  // Process supporting_documents
  if (data.supporting_documents instanceof File || Array.isArray(data.supporting_documents)) {
    const filePaths = await saveUploadedFiles(data.supporting_documents as File | File[], 'maintenance');
    processedData.supporting_documents = filePathsToString(filePaths);
  }
  return processedData;
}


/**
 * Create a new maintenance entry
 */
export async function createMaintenance(
  data: MaintenanceFormData
): Promise<{ success: boolean; data?: Maintenance; error?: string }> {
  try {
    // Process file uploads first (convert File objects to file paths)
    const processedData = await processFileUploads(data as Record<string, unknown>);
    
    // Validate the processed data
    const validatedData = createMaintenanceSchema.parse(processedData);
    
    // Insert data using the database function
    const result = await insertFormData(maintenanceFormConfiguration, validatedData);
    
    // Revalidate the page to show updated data
    revalidatePath('/maintenance');
    revalidatePath('/demo');
    
    return {
      success: true,
      data: result as unknown as Maintenance, // Cast to Maintenance type
    };
  } catch (error) {
    console.error('Error creating maintenance:', error);
    
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
 * Get maintenance entries with pagination and filtering
 */
export async function getMaintenanceList(options: {
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: Record<string, unknown>;
} = {}): Promise<{ success: boolean; data?: Maintenance[]; total?: number; error?: string }> {
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
      data: result.data as unknown as Maintenance[], // Cast to Maintenance[] type
      total: result.total,
    };
  } catch (error) {
    console.error('Error fetching maintenance list:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Get a single maintenance entry by ID
 */
export async function getMaintenanceById(
  id: string
): Promise<{ success: boolean; data?: Maintenance; error?: string }> {
  try {
    const result = await getFormData(maintenanceFormConfiguration, {
      filters: { id },
      limit: 1,
      offset: 0,
    });

    if (!result.data || result.data.length === 0) {
      return {
        success: false,
        error: `No maintenance found with id '${id}'`,
      };
    }

    return {
      success: true,
      data: result.data[0] as unknown as Maintenance, // Cast to Maintenance type
    };
  } catch (error) {
    console.error('Error fetching maintenance by ID:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Update a maintenance entry
 */
export async function updateMaintenance(
  id: string,
  data: UpdateMaintenanceData
): Promise<{ success: boolean; data?: Maintenance; error?: string }> {
  try {
    // Validate the input data
    const validatedData = updateMaintenanceSchema.parse(data);
    
    // Update data using the database function
    const result = await updateFormData(maintenanceFormConfiguration, id, validatedData);
    
    // Revalidate the page to show updated data
    revalidatePath('/maintenance');
    revalidatePath('/demo');
    
    return {
      success: true,
      data: result as unknown as Maintenance, // Cast to Maintenance type
    };
  } catch (error) {
    console.error('Error updating maintenance:', error);
    
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
 * Delete a maintenance entry
 */
export async function deleteMaintenance(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await deleteFormData(maintenanceFormConfiguration, id);
    
    // Revalidate the page to show updated data
    revalidatePath('/maintenance');
    revalidatePath('/demo');
    
    return {
      success: true,
    };
  } catch (error) {
    console.error('Error deleting maintenance:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Server action for form submission with redirect
 */
export async function submitMaintenanceForm(
  formData: FormData
): Promise<void> {
  try {
    // Convert FormData to object, handling files properly
    const data: Record<string, unknown> = {};
    
    // Get field configurations to determine file handling
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
          const filePaths = await saveUploadedFiles(files, 'maintenance');
          data[fieldName] = filePathsToString(filePaths);
        } else {
          // Single file upload - save file and store path as string
          if (files.length > 0) {
            const filePath = await saveUploadedFiles(files[0], 'maintenance');
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

    // Create the maintenance
    const result = await createMaintenance(data as MaintenanceFormData);
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to create maintenance');
    }
    
    // Redirect to success page or back to form
    redirect('/maintenance?success=true');
  } catch (error) {
    console.error('Error in submitMaintenanceForm:', error);
    // In a real app, you might want to handle errors differently
    throw error;
  }
}
