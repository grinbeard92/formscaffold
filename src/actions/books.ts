'use server';

/**
 * Server Actions for Books
 * Generated automatically from FormConfiguration: Reading List (Basic Form Example)
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
import { demoFormConfiguration } from '@/configurations/booksFormConfiguration';
import { generateZodSchema } from '@/scripts/generate-schema';
import { BooksFormData, UpdateBooksData, Books } from '@/types/booksTypes';

// Generate the Zod schema from form configuration
const booksSchema = generateZodSchema(demoFormConfiguration);
const createBooksSchema = booksSchema; // Schema already excludes database fields
const updateBooksSchema = createBooksSchema.partial();


/**
 * Create a new books entry
 */
export async function createBooks(
  data: BooksFormData
): Promise<{ success: boolean; data?: Books; error?: string }> {
  try {
    // Validate the input data
    const validatedData = createBooksSchema.parse(data);
    
    // Insert data using the database function
    const result = await insertFormData(demoFormConfiguration, validatedData);
    
    // Revalidate the page to show updated data
    revalidatePath('/books');
    revalidatePath('/demo');
    
    return {
      success: true,
      data: result as unknown as Books, // Cast to Books type
    };
  } catch (error) {
    console.error('Error creating books:', error);
    
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
 * Get books entries with pagination and filtering
 */
export async function getBooksList(options: {
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: Record<string, unknown>;
} = {}): Promise<{ success: boolean; data?: Books[]; total?: number; error?: string }> {
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
      data: result.data as unknown as Books[], // Cast to Books[] type
      total: result.total,
    };
  } catch (error) {
    console.error('Error fetching books list:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Get a single books entry by ID
 */
export async function getBooksById(
  id: string
): Promise<{ success: boolean; data?: Books; error?: string }> {
  try {
    const result = await getFormData(demoFormConfiguration, {
      filters: { id },
      limit: 1,
      offset: 0,
    });

    if (!result.data || result.data.length === 0) {
      return {
        success: false,
        error: `No books found with id '${id}'`,
      };
    }

    return {
      success: true,
      data: result.data[0] as unknown as Books, // Cast to Books type
    };
  } catch (error) {
    console.error('Error fetching books by ID:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Update a books entry
 */
export async function updateBooks(
  id: string,
  data: UpdateBooksData
): Promise<{ success: boolean; data?: Books; error?: string }> {
  try {
    // Validate the input data
    const validatedData = updateBooksSchema.parse(data);
    
    // Update data using the database function
    const result = await updateFormData(demoFormConfiguration, id, validatedData);
    
    // Revalidate the page to show updated data
    revalidatePath('/books');
    revalidatePath('/demo');
    
    return {
      success: true,
      data: result as unknown as Books, // Cast to Books type
    };
  } catch (error) {
    console.error('Error updating books:', error);
    
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
 * Delete a books entry
 */
export async function deleteBooks(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await deleteFormData(demoFormConfiguration, id);
    
    // Revalidate the page to show updated data
    revalidatePath('/books');
    revalidatePath('/demo');
    
    return {
      success: true,
    };
  } catch (error) {
    console.error('Error deleting books:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Server action for form submission with redirect
 */
export async function submitBooksForm(
  formData: FormData
): Promise<void> {
  try {
    // Convert FormData to object
    const data: Record<string, unknown> = {};
    for (const [key, value] of formData.entries()) {
      data[key] = value;
    }

    // Create the books
    const result = await createBooks(data as BooksFormData);
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to create books');
    }
    
    // Redirect to success page or back to form
    redirect('/demo?success=true');
  } catch (error) {
    console.error('Error in submitBooksForm:', error);
    // In a real app, you might want to handle errors differently
    throw error;
  }
}
