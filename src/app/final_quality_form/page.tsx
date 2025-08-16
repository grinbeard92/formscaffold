import { ServerForm } from '../../components/form-scaffold/ServerForm';
import sql from '../../db/postgres-js';
import { finalQualityFormConfiguration } from '@/configurations/finalQualityFormConfiguration';
import { createFinalQualityFormRecord } from '@/actions/finalQualityForm

export default function FinalQualityFormPage() {
  return (
    <div className='container mx-auto max-w-4xl px-2 py-4 md:px-4 md:py-8'>
      <div className='bg-card rounded-lg border shadow-sm'>
          <div className='p-6'>
            <form action={createFinalQualityFormRecord}>
            <ServerForm
              config={finalQualityFormConfiguration}
              autoSaveToDatabase={true}
            />
            </form>
          </div>
        </div>
    </div>
  );
}
