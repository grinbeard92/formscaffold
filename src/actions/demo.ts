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

// Generate the Zod schema from form configuration
const demoSchema = generateZodSchema(demoFormConfiguration);
const createDemoSchema = demoSchema; // Schema already excludes database fields
const updateDemoSchema = createDemoSchema.partial();


/**
 * Create a new demo entry
 */
export async function createDemo(
  data: DemoFormData
): Promise<{ success: boolean; data?: Demo; error?: string }> {
  try {
    // Validate the input data
    const validatedData = createDemoSchema.parse(data);
    
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
    // Convert FormData to object
    const data: Record<string, unknown> = {};
    for (const [key, value] of formData.entries()) {
      data[key] = value;
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
