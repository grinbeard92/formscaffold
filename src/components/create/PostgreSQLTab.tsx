'use client';

import { Card } from '@/components/ui/card';

interface PostgreSQLTabProps {
  generatePostgreSQLInit: () => string;
  tableName: string;
}

export function PostgreSQLTab({
  generatePostgreSQLInit,
  tableName,
}: PostgreSQLTabProps) {
  const sqlCode = generatePostgreSQLInit();

  return (
    <Card.Root>
      <div className='p-6'>
        <h3 className='mb-4 text-lg font-semibold'>
          PostgreSQL Table Creation
        </h3>
        <p className='text-muted-foreground mb-4 text-sm'>
          SQL script to create the table in your PostgreSQL database with proper
          constraints and indexes.
        </p>
        <pre className='bg-muted max-h-96 overflow-auto rounded p-4 text-xs'>
          <code>{sqlCode}</code>
        </pre>
        <div className='mt-4 flex gap-2'>
          <button
            onClick={() => navigator.clipboard.writeText(sqlCode)}
            className='bg-secondary text-secondary-foreground rounded px-3 py-2 text-sm'
          >
            Copy SQL
          </button>
          <a
            href={`data:text/plain;charset=utf-8,${encodeURIComponent(sqlCode)}`}
            download={`${tableName}_init.sql`}
            className='bg-primary text-primary-foreground rounded px-3 py-2 text-sm'
          >
            Download SQL
          </a>
        </div>
      </div>
    </Card.Root>
  );
}
