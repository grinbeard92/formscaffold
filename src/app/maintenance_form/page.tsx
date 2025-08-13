import { ServerForm } from '../../components/form-scaffold/ServerForm';
import sql from '../../db/postgres-js';
import { maintenanceFormConfiguration } from '@/configurations/maintenanceFormConfiguration';

export default function maintenanceFormPage() {
  return (
    <div className='container mx-auto max-w-4xl px-4 py-8'>

        {/* Form Section */}
        <div className='bg-card rounded-lg border shadow-sm'>
          <div className='p-6'>
            <ServerForm
              config={maintenanceFormConfiguration}
              autoSaveToDatabase={true}
            />
          </div>
        </div>
    </div>
  );
}

export const metadata = {
  title: 'Annual Maintenance Checklist',
  description: 'Production maintenanceForm form',
};
