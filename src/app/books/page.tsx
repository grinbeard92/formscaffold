/**
 * Example usage of the dynamic form system
 * This demonstrates how everything works together:
 * 1. FormConfiguration defines the form structure, validation, and database schema
 * 2. MainForm component renders the form and handles submission
 * 3. tRPC router handles server-side validation and database operations
 * 4. Everything is type-safe and SSR-ready
 */
import React from 'react';
import { MainForm } from '@/components/form/MainForm';
import { demoFormConfiguration } from '@/components/form/DemoFormConfiguration';
import { trpc } from '@/utils/trpc';
import { GeneratedFormType } from '@/lib/generateSchema';

export default function BookFormDemo() {
  // Optional: Query existing books to show in a list
  const { data: books, refetch } = trpc.book.list.useQuery({
    limit: 10,
    offset: 0,
  });

  // Handle successful form submission
  const handleSubmit = async (data: GeneratedFormType) => {
    console.log('Form submitted with data:', data);
    // Optionally refetch the books list to show the new entry
    await refetch();
  };

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='mx-auto max-w-2xl'>
        <h1 className='mb-8 text-center text-3xl font-bold'>
          Dynamic Form Demo
        </h1>

        <div className='mb-8'>
          <MainForm
            config={demoFormConfiguration}
            onSubmit={handleSubmit}
            autoSaveToDatabase={true}
            className='rounded-lg bg-white p-6 shadow-lg'
          />
        </div>

        {/* Optional: Display existing books */}
        {books && books.data && books.data.length > 0 && (
          <div className='mt-12'>
            <h2 className='mb-4 text-2xl font-semibold'>Existing Books</h2>
            <div className='grid gap-4'>
              {books.data.map((book: Record<string, unknown>) => (
                <div
                  key={book.id as string}
                  className='rounded-lg border bg-gray-50 p-4'
                >
                  <h3 className='text-lg font-semibold'>
                    {book.title as string}
                  </h3>
                  <p className='text-gray-600'>by {book.author as string}</p>
                  <p className='text-sm text-gray-500'>
                    Genre: {book.genre as string} | ISBN: {book.isbn as string}
                  </p>
                  <p className='text-xs text-gray-400'>
                    Published:{' '}
                    {new Date(
                      book.publishedDate as string,
                    ).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * How this system works:
 *
 * 1. CONFIGURATION (FormConfiguration.ts):
 *    - Define form fields, validation rules, and database schema
 *    - Single source of truth for frontend and backend
 *
 * 2. SCHEMA GENERATION (genericDataSchema.ts):
 *    - Automatically generates Zod schemas for validation
 *    - Automatically generates PostgreSQL table creation SQL
 *
 * 3. DATABASE LAYER (formDatabase.ts):
 *    - Creates tables if they don't exist
 *    - Provides CRUD operations for form data
 *
 * 4. TRPC ROUTER (dynamicForm.ts + book.ts):
 *    - Creates type-safe API endpoints automatically
 *    - Handles validation using generated Zod schemas
 *    - Provides CRUD operations via tRPC
 *
 * 5. FORM COMPONENT (MainForm.tsx):
 *    - Renders form based on configuration
 *    - Uses tRPC for server communication
 *    - Handles client-side validation and submission
 *
 * BENEFITS:
 * - ✅ Single source of truth (FormConfiguration)
 * - ✅ Type safety throughout the stack
 * - ✅ Automatic validation (client and server)
 * - ✅ Automatic database schema creation
 * - ✅ SSR ready
 * - ✅ Fully customizable styling
 * - ✅ Zero-config CRUD operations
 */
