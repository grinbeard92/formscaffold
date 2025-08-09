'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { ArrowLeftIcon, PlayIcon, CodeIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import { IFormConfiguration } from '@/types/globalFormTypes';
import { ClientForm } from '@/components/form/ClientForm';
import z from 'zod';

// Helper function to generate Zod schema from form configuration
function generateSchema(config: IFormConfiguration) {
  const schemaObject: Record<string, z.ZodTypeAny> = {};

  config.sections.forEach((section) => {
    section.fields.forEach((field) => {
      let fieldSchema: z.ZodTypeAny;

      switch (field.type) {
        case 'email':
          fieldSchema = z.string().email('Invalid email address');
          break;
        case 'number':
        case 'range':
          fieldSchema = z.number();
          break;
        case 'checkbox':
        case 'toggle':
          fieldSchema = z.boolean();
          break;
        case 'file':
          fieldSchema = z.array(z.instanceof(File));
          break;
        case 'date':
        case 'datetime-local':
        case 'time':
        case 'month':
        case 'week':
          fieldSchema = z.date();
          break;
        default:
          fieldSchema = z.string();
      }

      if (!field.required) {
        fieldSchema = fieldSchema.optional();
      }

      schemaObject[field.name] = fieldSchema;
    });
  });

  return z.object(schemaObject);
}

export default function TestFormPage() {
  const [configInput, setConfigInput] = useState<string>('');
  const [parsedConfig, setParsedConfig] = useState<IFormConfiguration | null>(
    null,
  );
  const [parseError, setParseError] = useState<string>('');
  const [showPreview, setShowPreview] = useState<boolean>(false);

  const parseConfiguration = () => {
    try {
      setParseError('');

      // Clean up the input - remove import statements and export declarations
      let cleanedInput = configInput.trim();

      // Remove import statements
      cleanedInput = cleanedInput.replace(/import.*?;/g, '');

      // Remove export statements and variable declarations
      cleanedInput = cleanedInput.replace(
        /export\s+const\s+\w+FormConfiguration:\s*FormConfiguration\s*=\s*/,
        '',
      );

      // Remove trailing semicolons
      cleanedInput = cleanedInput.replace(/;$/, '');

      // Try to parse the JSON
      const config = JSON.parse(cleanedInput.trim());

      // Validate that it has the required properties
      if (!config.title || !config.sections) {
        throw new Error(
          'Configuration must have title and sections properties',
        );
      }

      setParsedConfig(config);
      setShowPreview(true);
    } catch (error) {
      setParseError(
        `Error parsing configuration: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      setParsedConfig(null);
      setShowPreview(false);
    }
  };

  const loadSampleConfiguration = () => {
    const sampleConfig = `{
  "title": "Sample Test Form",
  "description": "This is a sample form for testing purposes",
  "postgresTableName": "sample_test",
  "submitButtonText": "Submit Test",
  "resetButtonText": "Reset",
  "showResetButton": true,
  "sections": [
    {
      "title": "Personal Information",
      "description": "Basic information about yourself",
      "gridCols": "2",
      "spacing": "md",
      "fields": [
        {
          "label": "First Name",
          "name": "first_name",
          "type": "text",
          "required": true,
          "placeholder": "Enter your first name",
          "default": "",
          "pgConfig": {
            "type": "VARCHAR",
            "length": 100
          }
        },
        {
          "label": "Last Name",
          "name": "last_name",
          "type": "text",
          "required": true,
          "placeholder": "Enter your last name",
          "default": "",
          "pgConfig": {
            "type": "VARCHAR",
            "length": 100
          }
        },
        {
          "label": "Email",
          "name": "email",
          "type": "email",
          "required": true,
          "placeholder": "your.email@example.com",
          "default": "",
          "pgConfig": {
            "type": "VARCHAR",
            "length": 255
          }
        },
        {
          "label": "Age",
          "name": "age",
          "type": "number",
          "required": false,
          "placeholder": "Enter your age",
          "default": 0,
          "pgConfig": {
            "type": "INTEGER"
          }
        }
      ]
    },
    {
      "title": "Preferences",
      "description": "Your preferences and settings",
      "gridCols": "1",
      "spacing": "md",
      "fields": [
        {
          "label": "Favorite Color",
          "name": "favorite_color",
          "type": "select",
          "required": false,
          "options": [
            { "value": "red", "label": "Red" },
            { "value": "blue", "label": "Blue" },
            { "value": "green", "label": "Green" },
            { "value": "yellow", "label": "Yellow" }
          ],
          "default": "",
          "pgConfig": {
            "type": "VARCHAR",
            "length": 50
          }
        },
        {
          "label": "Newsletter Subscription",
          "name": "newsletter",
          "type": "checkbox",
          "required": false,
          "description": "Subscribe to our newsletter for updates",
          "default": false,
          "pgConfig": {
            "type": "BOOLEAN"
          }
        },
        {
          "label": "Comments",
          "name": "comments",
          "type": "textarea",
          "required": false,
          "placeholder": "Any additional comments...",
          "default": "",
          "pgConfig": {
            "type": "TEXT"
          }
        }
      ]
    }
  ]
}`;

    setConfigInput(sampleConfig);
  };

  const handleTestSubmit = (data: Record<string, unknown>) => {
    console.log('Form submitted with data:', data);
    alert('Form submitted successfully! Check the console for data.');
  };

  return (
    <div className='bg-background min-h-screen'>
      {/* Header */}
      <header className='border-border bg-card border-b'>
        <div className='container mx-auto px-4 py-6'>
          <div className='flex items-center gap-4'>
            <Link
              href='/'
              className='text-muted-foreground hover:text-foreground'
            >
              <ArrowLeftIcon className='h-5 w-5' />
            </Link>
            <div>
              <h1 className='text-foreground text-2xl font-bold'>
                Test Form Configuration
              </h1>
              <p className='text-muted-foreground'>
                Test your form configurations without a database
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className='container mx-auto px-4 py-8'>
        {!showPreview ? (
          /* Configuration Input */
          <div className='mx-auto max-w-4xl space-y-6'>
            <Card.Root>
              <Card.Header>
                <Card.Title>Form Configuration</Card.Title>
              </Card.Header>
              <Card.Content className='space-y-4'>
                <div>
                  <p className='text-muted-foreground mb-4 text-sm'>
                    Paste your form configuration JSON or TypeScript export here
                  </p>
                </div>
                <div className='flex gap-2'>
                  <button
                    onClick={loadSampleConfiguration}
                    className='bg-secondary text-secondary-foreground hover:bg-secondary/80 inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm'
                  >
                    <CodeIcon className='h-4 w-4' />
                    Load Sample Config
                  </button>
                </div>

                <textarea
                  value={configInput}
                  onChange={(e) => setConfigInput(e.target.value)}
                  className='border-input bg-background w-full rounded-md border px-3 py-2 font-mono text-sm'
                  placeholder='Paste your form configuration here...'
                  rows={20}
                />

                {parseError && (
                  <div className='bg-destructive/10 text-destructive rounded-md p-3 text-sm'>
                    {parseError}
                  </div>
                )}

                <button
                  onClick={parseConfiguration}
                  disabled={!configInput.trim()}
                  className='bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50'
                >
                  <PlayIcon className='h-4 w-4' />
                  Test Configuration
                </button>
              </Card.Content>
            </Card.Root>
          </div>
        ) : (
          /* Form Preview */
          <div className='space-y-6'>
            <div className='flex items-center gap-4'>
              <button
                onClick={() => setShowPreview(false)}
                className='bg-secondary text-secondary-foreground hover:bg-secondary/80 inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm'
              >
                <ArrowLeftIcon className='h-4 w-4' />
                Back to Config
              </button>
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
                        schema={generateSchema(parsedConfig)}
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
                          section.fields.filter((field) => field.required)
                            .length,
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
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
