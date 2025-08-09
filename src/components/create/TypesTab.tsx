'use client';

import { Card } from '@/components/ui/card';
import { useState, useEffect } from 'react';
import { generateTypeDefinitions } from './codeGenerators';
import { IFormConfiguration } from '@/types/globalFormTypes';

interface TypesTabProps {
  config: IFormConfiguration;
  tableName: string;
}

export function TypesTab({ config, tableName }: TypesTabProps) {
  const [typesCode, setTypesCode] = useState<string>('Loading...');

  useEffect(() => {
    generateTypeDefinitions(config).then(setTypesCode);
  }, [config]);

  return (
    <Card.Root>
      <div className='p-6'>
        <h3 className='mb-4 text-lg font-semibold'>
          TypeScript Type Definitions
        </h3>
        <p className='text-muted-foreground mb-4 text-sm'>
          Generated TypeScript types based on your form configuration and
          PostgreSQL schema.
        </p>
        <pre className='bg-muted max-h-96 overflow-auto rounded p-4 text-xs'>
          <code>{typesCode}</code>
        </pre>
        <div className='mt-4 flex gap-2'>
          <button
            onClick={() => navigator.clipboard.writeText(typesCode)}
            className='bg-secondary text-secondary-foreground rounded px-3 py-2 text-sm'
          >
            Copy Types
          </button>
          <a
            href={`data:text/plain;charset=utf-8,${encodeURIComponent(typesCode)}`}
            download={`${tableName}Types.d.ts`}
            className='bg-primary text-primary-foreground rounded px-3 py-2 text-sm'
          >
            Download Types
          </a>
        </div>
      </div>
    </Card.Root>
  );
}
