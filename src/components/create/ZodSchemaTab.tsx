'use client';

import { Card } from '@/components/ui/card';

interface ZodSchemaTabProps {
  generateZodSchemaCode: () => string;
  tableName: string;
}

export function ZodSchemaTab({
  generateZodSchemaCode,
  tableName,
}: ZodSchemaTabProps) {
  const zodCode = generateZodSchemaCode();

  return (
    <Card.Root>
      <div className='p-6'>
        <h3 className='mb-4 text-lg font-semibold'>Zod Validation Schema</h3>
        <p className='text-muted-foreground mb-4 text-sm'>
          Generated Zod schema based on your field configurations and validation
          rules.
        </p>
        <pre className='bg-muted max-h-96 overflow-auto rounded p-4 text-xs'>
          <code>{zodCode}</code>
        </pre>
        <div className='mt-4 flex gap-2'>
          <button
            onClick={() => navigator.clipboard.writeText(zodCode)}
            className='bg-secondary text-secondary-foreground rounded px-3 py-2 text-sm'
          >
            Copy Schema
          </button>
          <a
            href={`data:text/plain;charset=utf-8,${encodeURIComponent(zodCode)}`}
            download={`${tableName}Schema.ts`}
            className='bg-primary text-primary-foreground rounded px-3 py-2 text-sm'
          >
            Download Schema
          </a>
        </div>
      </div>
    </Card.Root>
  );
}
