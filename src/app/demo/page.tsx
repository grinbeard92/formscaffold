import { ServerForm } from '../../components/form-scaffold/pre-integration/ServerForm';
import sql from '../../db/postgres-js';
import { demoFormConfiguration } from '@/configurations/demoFormConfiguration';

export default function DemoPage() {
  return (
    <div className='container mx-auto max-w-4xl px-4 py-8'>
      {/* Form Section */}
      <div className='bg-card rounded-lg border shadow-sm'>
        <div className='p-6'>
          <ServerForm
            config={demoFormConfiguration}
            autoSaveToDatabase={true}
          />
        </div>
      </div>
    </div>
  );
}

export const metadata = {
  title: 'Comprehensive Form Demo',
  description: 'Production demo form',
};
