'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeftIcon } from '@radix-ui/react-icons';
import { FormConfiguration } from '@/types/globalFormTypes';
import {
  FormBuilder,
  TabNavigation,
  CodeTab,
  ZodSchemaTab,
  TypesTab,
  ServerActionsTab,
  PostgreSQLTab,
  PreviewTab,
  ExportTab,
  generateFormConfiguration,
  generateZodSchemaCode,
  generatePostgreSQLInit,
  type TabType,
} from '@/components/create';

export default function CreateFormPage() {
  const [config, setConfig] = useState<FormConfiguration>({
    title: 'Sample Form',
    description: 'Create your custom form',
    postgresTableName: 'sample_form',
    submitButtonText: 'Submit',
    resetButtonText: 'Reset',
    showResetButton: true,
    sections: [
      {
        title: 'Basic Information',
        description: 'Enter basic details',
        gridCols: '2',
        spacing: 'md',
        fields: [
          {
            label: 'Name',
            name: 'name',
            type: 'text',
            required: true,
            placeholder: 'Enter your name',
            default: '',
            pgConfig: { type: 'VARCHAR', length: 255 },
          },
          {
            label: 'Email',
            name: 'email',
            type: 'email',
            required: true,
            placeholder: 'your@email.com',
            default: '',
            pgConfig: { type: 'VARCHAR', length: 255 },
          },
        ],
      },
    ],
  });

  const [generatedConfig, setGeneratedConfig] = useState<string>('');
  const [activeTab, setActiveTab] = useState<TabType>('builder');
  const [expandedField, setExpandedField] = useState<string | null>(null);

  const generateCode = () => {
    const configString = generateFormConfiguration(config);
    setGeneratedConfig(configString);
  };

  const handleTestSubmit = (data: Record<string, unknown>) => {
    console.log('Form submitted:', data);
    alert('Form submitted! Check console for data.');
  };

  return (
    <div className='bg-background min-h-screen'>
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
                Form Builder
              </h1>
              <p className='text-muted-foreground'>
                Design forms using existing components
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className='container mx-auto px-4 py-8'>
        <TabNavigation
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onCodeGenerate={generateCode}
        />
        {/* Builder Tab */}
        {activeTab === 'builder' && (
          <FormBuilder
            config={config}
            setConfig={setConfig}
            expandedField={expandedField}
            setExpandedField={setExpandedField}
          />
        )}
        {/* Preview Tab */}
        {activeTab === 'preview' && (
          <PreviewTab config={config} onSubmit={handleTestSubmit} />
        )}
        {/* Code Tab */}
        {activeTab === 'code' && (
          <CodeTab
            generatedConfig={generatedConfig}
            tableName={config.postgresTableName}
          />
        )}
        {/* Zod Schema Tab */}
        {activeTab === 'zod-schema' && (
          <ZodSchemaTab
            generateZodSchemaCode={() => generateZodSchemaCode(config)}
            tableName={config.postgresTableName}
          />
        )}
        {/* TypeScript Types Tab */}
        {activeTab === 'types' && (
          <TypesTab config={config} tableName={config.postgresTableName} />
        )}
        i {/* Server Actions Tab */}
        {activeTab === 'server-actions' && (
          <ServerActionsTab
            config={config}
            tableName={config.postgresTableName}
          />
        )}
        {/* PostgreSQL Init Tab */}
        {activeTab === 'postgres-init' && (
          <PostgreSQLTab
            generatePostgreSQLInit={() => generatePostgreSQLInit(config)}
            tableName={config.postgresTableName}
          />
        )}
        {/* Export Tab */}
        {activeTab === 'export' && (
          <ExportTab formTitle={config.title} config={config} />
        )}
      </div>
    </div>
  );
}
