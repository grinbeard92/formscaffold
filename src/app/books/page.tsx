import { ServerForm } from '@/components/form/ServerForm';
import { demoFormConfiguration } from '@/configurations/booksFormConfiguration';
import sql from '@/db/postgres-js';

// Database info component that shows table contents
async function DatabaseInfo() {
  let tableData: Record<string, unknown>[] = [];
  let error: string | null = null;
  
  try {
    // Get all records from the table
    const result = await sql`SELECT * FROM ${sql('books')} ORDER BY created_at DESC LIMIT 10`;
    tableData = result as Record<string, unknown>[];
  } catch (err) {
    error = err instanceof Error ? err.message : 'Unknown error occurred';
    console.error('Error fetching books data:', err);
  }

  return (
    <div className='mt-8 space-y-4'>
      <h2 className='text-secondary-foreground text-xl font-semibold'>
        Database Contents
      </h2>
      <div className='bg-secondary overflow-x-auto rounded-lg p-4 font-mono text-sm text-green-400'>
        <div className='text-muted-foreground mb-2'>
          SELECT * FROM books ORDER BY created_at DESC LIMIT 10;
        </div>
        {error ? (
          <div className='text-danger'>Error: {error}</div>
        ) : tableData.length === 0 ? (
          <div className='text-warning'>No records found in books table</div>
        ) : (
          <pre className="whitespace-pre-wrap">
            {JSON.stringify(tableData, null, 2)}
          </pre>
        )}
      </div>
      <div className='text-sm text-gray-600'>
        Showing latest 10 records from the{' '}
        <code className='bg-primary rounded px-1'>books</code> table
      </div>
    </div>
  );
}

// Main page component
export default function BooksPage() {
  return (
    <div className='container mx-auto max-w-4xl px-4 py-8'>
      <div className='space-y-6'>
        {/* Page Header */}
        <div className='space-y-2 text-center'>
          <h1 className='text-primary-foreground text-3xl font-bold'>
            Reading List (Basic Form Example)
          </h1>
          <p className='text-gray-600'>
            Generated form demo for{' '}
            <code className='bg-primary rounded px-1'>books</code> table
          </p>
        </div>

        {/* Form Section */}
        <div className='bg-primary rounded-lg border shadow-sm'>
          <div className='p-6'>
            <h2 className='mb-4 text-xl font-semibold text-gray-900'>
              Add New Books
            </h2>
            <ServerForm
              config={demoFormConfiguration}
              autoSaveToDatabase={true}
            />
          </div>
        </div>

        {/* Database Info Section */}
        <div className='bg-primary rounded-lg border shadow-sm'>
          <DatabaseInfo />
        </div>

        {/* Footer */}
        <div className='space-y-1 text-center text-sm text-gray-500'>
          <p>
            This page was auto-generated from{' '}
            <code className='rounded bg-gray-100 px-1'>
              booksFormConfiguration.ts
            </code>
          </p>
          <p>
            Form configuration filename: <strong>demoFormConfiguration</strong>
          </p>
        </div>
      </div>
    </div>
  );
}

export const metadata = {
  title: 'Reading List (Basic Form Example) - FormScaffold Demo',
  description: 'Auto-generated form demo page for books table',
};
