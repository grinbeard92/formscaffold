'use client';

import { Card } from '@/components/ui/card';
import { ClientForm } from '@/components/form-scaffold/ClientForm';
import { generateZodSchema } from '@/scripts/generate-schema';
import { IFormConfiguration } from '@/types/globalFormTypes';
import { ArrowLeftIcon } from '@radix-ui/react-icons';
import { useEffect, useState } from 'react';

interface PreviewTabProps {
  config: IFormConfiguration;
}

export function PreviewTab({ config }: PreviewTabProps) {
  const [activeFormData, setActiveFormData] =
    useState<Record<string, unknown>>();
  const [parsedConfig, setParsedConfig] = useState<IFormConfiguration | null>(
    null,
  );
  const [validationErrors, setValidationErrors] = useState<string | null>(null);
  useEffect(() => {
    parseConfiguration();
  }, []);

  const parseConfiguration = () => {
    try {
      if (!config.title || !config.sections) {
        throw new Error(
          'Configuration must have title and sections properties',
        );
      }

      setParsedConfig(config);
    } catch (error) {
      setParsedConfig(null);
    }
  };

  const handleTestSubmit = (data: Record<string, unknown>) => {
    setActiveFormData(data);
  };

  return (
    <div className='space-y-6'>
      <div className='flex items-center gap-4'>
        <div>
          <h2 className='text-xl font-semibold'>{parsedConfig?.title}</h2>
          {parsedConfig?.description && (
            <p className='text-muted-foreground text-sm'>
              {parsedConfig.description}
            </p>
          )}
        </div>
      </div>

      <div className='grid gap-8 lg:grid-cols-3'>
        {/* Form */}
        <div className='lg:col-span-2'>
          <Card.Root>
            <Card.Header>
              <Card.Title>Form Preview</Card.Title>
            </Card.Header>
            <Card.Content>
              <div>
                <p className='text-muted-foreground mb-4 text-sm'>
                  Interactive preview of your form (no database required)
                </p>
              </div>
              {parsedConfig && (
                <ClientForm
                  schema={generateZodSchema(parsedConfig)}
                  title={parsedConfig.title}
                  description={parsedConfig.description}
                  sections={parsedConfig.sections}
                  submitButtonText={parsedConfig.submitButtonText}
                  resetButtonText={parsedConfig.resetButtonText}
                  showResetButton={parsedConfig.showResetButton}
                  onSubmit={handleTestSubmit}
                  autoSaveToDatabase={false}
                />
              )}
            </Card.Content>
          </Card.Root>
        </div>

        {/* Configuration Details */}
        <div className='space-y-4'>
          <Card.Root>
            <Card.Header>
              <Card.Title>Configuration Details</Card.Title>
            </Card.Header>
            <Card.Content className='space-y-3 text-sm'>
              <div>
                <span className='font-medium'>Table Name:</span>
                <br />
                <code className='bg-muted rounded px-1 py-0.5'>
                  {parsedConfig?.postgresTableName}
                </code>
              </div>
              <div>
                <span className='font-medium'>Sections:</span>
                <br />
                {parsedConfig?.sections?.length || 0}
              </div>
              <div>
                <span className='font-medium'>Total Fields:</span>
                <br />
                {parsedConfig?.sections?.reduce(
                  (total, section) => total + section.fields.length,
                  0,
                ) || 0}
              </div>
              <div>
                <span className='font-medium'>Required Fields:</span>
                <br />
                {parsedConfig?.sections?.reduce(
                  (total, section) =>
                    total +
                    section.fields.filter((field) => field.required).length,
                  0,
                ) || 0}
              </div>
            </Card.Content>
          </Card.Root>

          <Card.Root>
            <Card.Header>
              <Card.Title>Field Types</Card.Title>
            </Card.Header>
            <Card.Content>
              <div className='space-y-2 text-xs'>
                {parsedConfig?.sections
                  ?.flatMap((section) => section.fields)
                  .reduce(
                    (acc, field) => {
                      acc[field.type] = (acc[field.type] || 0) + 1;
                      return acc;
                    },
                    {} as Record<string, number>,
                  )
                  ? Object.entries(
                      parsedConfig.sections
                        .flatMap((section) => section.fields)
                        .reduce(
                          (acc, field) => {
                            acc[field.type] = (acc[field.type] || 0) + 1;
                            return acc;
                          },
                          {} as Record<string, number>,
                        ),
                    ).map(([type, count]) => (
                      <div key={type} className='flex justify-between'>
                        <span className='capitalize'>{type}:</span>
                        <span>{count}</span>
                      </div>
                    ))
                  : 'No fields'}
              </div>
            </Card.Content>
          </Card.Root>

          {validationErrors && (
            <>
              <pre className='bg-muted text-destructive mt-4 rounded-md border p-4'>
                {validationErrors}
              </pre>
            </>
          )}

          {activeFormData && (
            <>
              <pre className='bg-muted mt-4 rounded-md border p-4'>
                <h1>Submitted Data:</h1>
                <code className='bg-secondary-foreground/10 overflow-clip border-1'>
                  {JSON.stringify(activeFormData, null, 2)}
                </code>
              </pre>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
