'use client';

import { Card } from '@/components/ui/card';
import { CopyIcon } from '@radix-ui/react-icons';
import { toast } from 'sonner';

interface CodeTabProps {
  generatedConfig: string;
  tableName: string;
}

export function CodeTab({ generatedConfig, tableName }: CodeTabProps) {
  return (
    <Card.Root>
      <div className='p-6'>
        <h3 className='mb-4 text-lg font-semibold'>Generated Configuration</h3>
        <pre className='bg-muted relative max-h-96 overflow-auto rounded p-4 text-xs'>
          <code>
            {generatedConfig && (
              <button>
                <CopyIcon
                  className='active:bg-secondary/30 absolute top-2 right-2 m-5 h-6 w-6 cursor-pointer rounded-lg active:scale-95'
                  onClick={() => {
                    toast.success('Copied to clipboard');
                    navigator.clipboard.writeText(generatedConfig);
                  }}
                />
              </button>
            )}
            {generatedConfig}
          </code>
        </pre>
        <div className='mt-4 flex gap-2'>
          <a
            href={`data:text/plain;charset=utf-8,${encodeURIComponent(generatedConfig)}`}
            download={`${tableName}FormConfiguration.ts`}
            className='bg-primary text-primary-foreground rounded px-3 py-2 text-sm'
          >
            Download File
          </a>
        </div>
      </div>
    </Card.Root>
  );
}
