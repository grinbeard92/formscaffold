import { ServerForm } from '@/components/form/ServerForm';
import { demoFormConfiguration } from '@/configurations/demoFormConfiguration';
import sql from '@/db/postgres-js';

// Database info component that shows table contents
async function DatabaseInfo() {
  let tableData: Record<string, unknown>[] = [];
  let columnStats: Record<string, unknown>[] = [];
  let error: string | null = null;
  
  try {
    // First get all column names dynamically
    const columnsResult = await sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'demo' 
      AND table_schema = 'public'
      ORDER BY ordinal_position
    `;
    
    const columns = columnsResult.map(row => row.column_name as string);
    
    // Build dynamic column size selectors
    const columnSizeSelectors = columns.map(col => 
      `pg_column_size(${col}) as ${col}_size`
    ).join(', ');
    
    // Execute dynamic query with all columns and their sizes
    const dynamicQuery = `
      SELECT *, ${columnSizeSelectors}
      FROM demo 
      ORDER BY created_at DESC 
      LIMIT 50
    `;
    
    const result = await sql.unsafe(dynamicQuery);
    tableData = result as Record<string, unknown>[];

    // Get column statistics including memory usage
    const columnStatsQuery = sql`
      SELECT 
        column_name,
        data_type,
        character_maximum_length,
        is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'demo' 
      AND table_schema = 'public'
      ORDER BY ordinal_position
    `;

    const basicColumnStats = (await columnStatsQuery) as Record<
      string,
      unknown
    >[];

    columnStats = basicColumnStats.map((col) => ({
      ...col,
    }));
  } catch (err) {
    error = err instanceof Error ? err.message : 'Unknown error occurred';
    console.error('Error fetching demo data:', err);
  }

  return (
    <div className='mt-8 space-y-4'>
      <h2 className='text-foreground text-xl font-semibold'>
        Database Contents & Statistics
      </h2>
      
      {/* Column Statistics */}
      <div className='bg-card rounded-lg p-4 border'>
        <h3 className='text-card-foreground text-lg font-medium mb-3'>Column Information</h3>
        <div className='overflow-x-auto'>
          <table className='min-w-full text-sm'>
            <thead>
              <tr className='border-b border-border'>
                <th className='text-left py-2 px-3 text-muted-foreground font-medium'>Column</th>
                <th className='text-left py-2 px-3 text-muted-foreground font-medium'>Type</th>
                <th className='text-left py-2 px-3 text-muted-foreground font-medium'>Max Length</th>
                <th className='text-left py-2 px-3 text-muted-foreground font-medium'>Required? (Not Nullable)</th>
                <th className='text-left py-2 px-3 text-muted-foreground font-medium'>Disk Usage</th>
              </tr>
            </thead>
            <tbody>
              {columnStats.map((col, idx) => (
                <tr key={idx} className='border-b border-border hover:bg-muted/50'>
                  <td className='py-2 px-3 font-mono text-primary'>{String(col.column_name)}</td>
                  <td className='py-2 px-3 text-card-foreground'>{String(col.data_type)}</td>
                  <td className='py-2 px-3 text-card-foreground'>{String(col.character_maximum_length) || 'N/A'}</td>
                  <td className='py-2 px-3 text-muted-foreground'>{String(col.is_nullable)}</td>
                  <td className='py-2 px-3 text-muted-foreground'>
                    {col.disk_usage
                      ? `${(col.disk_usage as number) / 1000} kb`
                      : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Table Data */}
      <div className='bg-card rounded-lg p-4 border'>
        <div className='flex justify-between items-center mb-3'>
          <h3 className='text-card-foreground text-lg font-medium'>Recent Records</h3>
          <span className='text-sm text-muted-foreground'>
            {tableData.length} records (limit 50)
          </span>
        </div>
        
        <div className='text-muted-foreground mb-2 font-mono text-xs'>
          SELECT * FROM demo ORDER BY created_at DESC LIMIT 50;
        </div>
        
        {error ? (
          <div className='text-destructive bg-destructive/10 p-3 rounded border border-destructive/20'>Error: {error}</div>
        ) : tableData.length === 0 ? (
          <div className='text-warning bg-warning/10 p-3 rounded border border-warning/20'>No records found in demo table</div>
        ) : (
          <div className='border border-border rounded-lg overflow-hidden'>
            <div className='overflow-auto max-h-96 max-w-full'>
              <table className='min-w-full text-sm'>
                <thead className='bg-muted/50 sticky top-0'>
                  <tr>
                    {Object.keys(tableData[0] || {})
                      .filter((key) => !key.endsWith('_size'))
                      .map((key) => (
                        <th key={key} className='text-left py-2 px-3 border-b border-border font-medium text-muted-foreground'>
                          {key}
                        </th>
                      ))}
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((row, idx) => (
                    <tr key={idx} className='border-b border-border hover:bg-muted/30'>
                      {Object.entries(row).map(([key, value], cellIdx) => {
                        // Skip rendering size columns as separate cells
                        if (key.endsWith('_size')) return null;
                        
                        // Get the corresponding size value
                        const sizeKey = `${key}_size`;
                        const sizeValue = row[sizeKey] as number | undefined;
                        
                        return (
                          <td key={cellIdx} className='py-2 px-3 max-w-xs'>
                            <div className='overflow-hidden text-ellipsis'>
                              {value === null ? (
                                <span className='text-muted-foreground italic'>null</span>
                              ) : typeof value === 'string' && value.length > 100 ? (
                                <div>
                                  <div className='truncate text-card-foreground' title={value}>
                                    {value.substring(0, 100)}...
                                  </div>
                                  <div className='text-xs text-muted-foreground mt-1'>
                                    Length: {value.length} chars
                                    {sizeValue && (
                                      <> | Size: {sizeValue} bytes</>
                                    )}
                                  </div>
                                </div>
                              ) : typeof value === 'object' ? (
                                <div>
                                  <pre className='text-xs bg-muted p-1 rounded overflow-auto max-h-20 text-card-foreground'>
                                    {JSON.stringify(value, null, 2)}
                                  </pre>
                                  {sizeValue && (
                                    <div className='text-xs text-muted-foreground mt-1'>
                                      Size: {sizeValue} bytes
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div>
                                  <span className='text-card-foreground'>{String(value)}</span>
                                  {sizeValue && (
                                    <div className='text-xs text-muted-foreground mt-1'>
                                      Size: {sizeValue} bytes
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </td>
                        );
                      }).filter(Boolean)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      
      <div className='text-sm text-muted-foreground'>
        Showing latest 50 records from the{' '}
        <code className='bg-muted text-muted-foreground rounded px-1 py-0.5 font-mono'>demo</code> table
      </div>
    </div>
  );
}

// Main page component
export default function DemoPage() {
  return (
    <div className='container mx-auto max-w-4xl px-4 py-8'>
      <div className='space-y-6'>
        {/* Page Header */}
        <div className='space-y-2 text-center'>
          <h1 className='text-foreground text-3xl font-bold'>
            Comprehensive Form Demo
          </h1>
          <p className='text-muted-foreground'>
            Generated form demo for{' '}
            <code className='bg-muted text-muted-foreground rounded px-1 py-0.5 font-mono'>demo</code> table
          </p>
        </div>

        {/* Form Section */}
        <div className='bg-card rounded-lg border shadow-sm'>
          <div className='p-6'>
            <h2 className='mb-4 text-xl font-semibold text-card-foreground'>
              Add New Demo
            </h2>
            <ServerForm
              config={demoFormConfiguration}
              autoSaveToDatabase={true}
            />
          </div>
        </div>

        {/* Database Info Section */}
        <div className='bg-card rounded-lg border shadow-sm'>
          <div className='p-6'>
            <h2 className='mb-4 text-xl font-semibold text-card-foreground'>
              Database Statistics & Recent Records
            </h2>
            <DatabaseInfo />
          </div>
        </div>

        {/* Footer */}
        <div className='space-y-1 text-center text-sm text-muted-foreground'>
          <p>
            This page was auto-generated from{' '}
            <code className='rounded bg-muted px-1 py-0.5 font-mono'>
              demoFormConfiguration.ts
            </code>
          </p>
          <p>
            Form configuration filename: <strong className='text-card-foreground'>demoFormConfiguration</strong>
          </p>
        </div>
      </div>
    </div>
  );
}

export const metadata = {
  title: 'Comprehensive Form Demo - FormScaffold Demo',
  description: 'Auto-generated form demo page for demo table',
};
