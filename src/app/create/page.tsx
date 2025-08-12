'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeftIcon } from '@radix-ui/react-icons';
import {
  EPostgresTypes as pgT,
  EFormFieldTypes as fieldT,
  IFormConfiguration,
} from '@/types/globalFormTypes';
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
import SubHeader from '@/components/SubHeader';

export default function CreateFormPage() {
  const [config, setConfig] = useState<IFormConfiguration>({
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
            type: fieldT.TEXT,
            required: true,
            placeholder: 'Enter your name',
            default: '',
            pgConfig: { type: pgT.VARCHAR, length: 255 },
          },
          {
            label: 'Email',
            name: 'email',
            type: fieldT.EMAIL,
            required: true,
            placeholder: 'your@email.com',
            default: '',
            pgConfig: { type: pgT.VARCHAR, length: 255 },
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
    <div className='bg-background grid min-h-screen grid-rows-[auto_1fr]'>
      <SubHeader title='Form Builder' subtitle='Create and manage your forms' />

      <div className='mb-0 grid grid-cols-[60px_1fr] gap-4 md:grid-cols-[200px_1fr]'>
        <TabNavigation
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onCodeGenerate={generateCode}
        />
        <div className='container mx-auto px-4 py-4'>
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
          {activeTab === 'preview' && <PreviewTab config={config} />}
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
          {/* Server Actions Tab */}
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
    </div>
  );
}
