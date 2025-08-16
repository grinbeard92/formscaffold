import { ServerForm } from '../../components/form-scaffold/ServerForm';
import sql from '../../db/postgres-js';
import { systemIntakeFormConfiguration } from '@/configurations/systemIntakeFormConfiguration';
import { createSystemIntakeFormRecord } from '@/actions/systemIntakeForm

export default function SystemIntakeFormPage() {
  return (
    <div className='container mx-auto max-w-4xl px-2 py-4 md:px-4 md:py-8'>
      <div className='bg-card rounded-lg border shadow-sm'>
          <div className='p-6'>
            <form action={createSystemIntakeFormRecord}>
            <ServerForm
              config={systemIntakeFormConfiguration}
              autoSaveToDatabase={true}
            />
            </form>
          </div>
        </div>
    </div>
  );
}
