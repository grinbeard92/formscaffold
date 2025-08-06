'use client';

import { Card } from '@/components/ui/card';
import { ClientForm } from '@/components/form/ClientForm';
import { generateZodSchema } from '@/scripts/generate-schema';
import { FormConfiguration } from '@/types/globalFormTypes';

interface PreviewTabProps {
  config: FormConfiguration;
  onSubmit: (data: Record<string, unknown>) => void;
}

export function PreviewTab({ config, onSubmit }: PreviewTabProps) {
  return (
    <Card.Root>
      <div className='p-6'>
        <h3 className='mb-4 text-lg font-semibold'>Form Preview</h3>
        <ClientForm
          schema={generateZodSchema(config)}
          title={config.title}
          description={config.description}
          sections={config.sections}
          submitButtonText={config.submitButtonText}
          resetButtonText={config.resetButtonText}
          showResetButton={config.showResetButton}
          onSubmit={onSubmit}
          autoSaveToDatabase={false}
        />
      </div>
    </Card.Root>
  );
}
