'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { IFormConfiguration } from '@/types/globalFormTypes';
import { ClipboardCopyIcon, CopyIcon } from '@radix-ui/react-icons';
import { toast } from 'sonner';

interface ServerActionsTabProps {
  config: IFormConfiguration;
  tableName: string;
}

export function ServerActionsTab({ config, tableName }: ServerActionsTabProps) {
  const [generatedCode, setGeneratedCode] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  const generateServerActions = async () => {
    setIsGenerating(true);
    try {
      // Import the master script function
      const { generateServerActionsCode } = await import(
        '@/scripts/generate-server-actions'
      );
      const code = generateServerActionsCode(config);
      setGeneratedCode(code);
    } catch (error) {
      console.error('Error generating server actions:', error);
      setGeneratedCode('// Error generating server actions');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card.Root>
      <div className='p-6'>
        <div className='mb-4 flex items-center justify-between'>
          <h3 className='text-lg font-semibold'>
            Server Actions for {tableName}
          </h3>
          <button
            onClick={generateServerActions}
            disabled={isGenerating}
            className='bg-primary text-primary-foreground hover:bg-primary/90 rounded px-3 py-1 text-sm disabled:opacity-50'
          >
            {isGenerating ? 'Generating...' : 'Generate Actions'}
          </button>
        </div>

        <p className='text-muted-foreground mb-4 text-sm'>
          Server actions for database operations with this form configuration.
          These functions handle CRUD operations and validation.
        </p>

        <div className='relative'>
          <pre className='overflow-auto rounded-lg border bg-gray-50 p-4 text-sm'>
            <code className='javascript'>
              {generatedCode && (
                <button>
                  <CopyIcon
                    className='active:bg-secondary/30 absolute top-2 right-2 m-5 h-6 w-6 cursor-pointer rounded-lg active:scale-95'
                    onClick={() => {
                      toast.success('Copied to clipboard');
                      navigator.clipboard.writeText(generatedCode);
                    }}
                  />
                </button>
              )}
              {generatedCode ||
                '// Click "Generate Actions" to see the server actions code'}
            </code>
          </pre>
        </div>

        <div className='mt-4 space-y-2'>
          <h4 className='text-sm font-medium'>Includes:</h4>
          <ul className='text-muted-foreground list-inside list-disc space-y-1 text-sm'>
            <li>Create {tableName} record with validation</li>
            <li>Read {tableName} records with pagination</li>
            <li>Update {tableName} record</li>
            <li>Delete {tableName} record</li>
            <li>Search and filter functionality</li>
            <li>File upload handling (if applicable)</li>
            <li>Error handling and type safety</li>
          </ul>
        </div>
      </div>
    </Card.Root>
  );
}
