import { ServerForm } from '@/components/form/ServerForm';
import { maintenanceFormConfiguration } from '@/configurations/maintenanceFormConfiguration';

export default function MaintenancePage() {
  return (
    <div className='container mx-auto max-w-4xl px-4 py-8'>
      <div className='space-y-6'>
        {/* Page Header */}
        <div className='space-y-2 text-center'>
          <h1 className='text-foreground text-3xl font-bold'>
            Annual Maintenance Checklist
          </h1>
          <p className='text-muted-foreground'>
            Generated form component for{' '}
            <code className='bg-muted text-muted-foreground rounded px-1 py-0.5 font-mono'>maintenance</code> table
                        
          </p>
          <code className='bg-muted text-muted-foreground rounded px-1 py-0.5 font-mono'>
              Use the ServerForm component anywhere in your app.
              Ensure that the types, components and configurations are imported into your project correctly.
            </code>
        </div>

        {/* Form Section */}
        <div className='bg-card rounded-lg border shadow-sm'>
            <ServerForm
              config={maintenanceFormConfiguration}
              autoSaveToDatabase={true}
            />
        </div>

        {/* Footer */}
        <div className='space-y-1 text-center text-sm text-muted-foreground'>
          <p>
            This page was auto-generated from{' '}
            <code className='rounded bg-muted px-1 py-0.5 font-mono'>
              maintenanceFormConfiguration.ts
            </code>
          </p>
          <p>
            Form configuration filename: <strong className='text-card-foreground'>maintenanceFormConfiguration</strong>
          </p>
        </div>
      </div>
    </div>
  );
}

export const metadata = {
  title: 'Annual Maintenance Checklist - FormScaffold Generated Component',
  description: 'Auto-generated form component for maintenance table',
};
