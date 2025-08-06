'use client';

import { Card } from '@/components/ui/card';

interface CodeTabProps {
  generatedConfig: string;
  tableName: string;
}

export function CodeTab({ generatedConfig, tableName }: CodeTabProps) {
  return (
    <Card.Root>
      <div className='p-6'>
        <h3 className='mb-4 text-lg font-semibold'>Generated Configuration</h3>
        <pre className='bg-muted max-h-96 overflow-auto rounded p-4 text-xs'>
          <code>{generatedConfig}</code>
        </pre>
        <div className='mt-4 flex gap-2'>
          <button
            onClick={() => navigator.clipboard.writeText(generatedConfig)}
            className='bg-secondary text-secondary-foreground rounded px-3 py-2 text-sm'
          >
            Copy to Clipboard
          </button>
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
