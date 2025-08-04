import React from 'react';
import { ClientForm } from './ClientForm';
import {
  FormConfiguration,
  FieldDefinition,
  FormSectionDefinition,
} from './DemoFormConfiguration';
import {
  ClientFormConfiguration,
  ClientSectionDefinition,
  ClientFieldDefinition,
} from '@/types/ClientForm';

/**
 * SSR Form Wrapper Component
 *
 * This component runs on the server and:
 * 1. Takes the full FormConfiguration (with server-side configs)
 * 2. Generates the Zod schema server-side
 * 3. Strips out server-side configurations (DB, Zod configs)
 * 4. Passes only client-safe data to the ClientForm component
 *
 * This ensures sensitive server configurations never reach the client
 */

// Transform server field definition to client-safe version
function transformFieldToClient(field: FieldDefinition): ClientFieldDefinition {
  return {
    label: field.label,
    name: field.name,
    type: field.type,
    required: field.required,
    placeholder: field.placeholder,
    step: field.step,
    min: field.min,
    max: field.max,
    rows: field.rows,
    options: field.options,
    className: field.className,
    disabled: field.disabled,
    description: field.description,
    // Note: zodConfig and pgConfig are intentionally omitted
  };
}

// Transform server section definition to client-safe version
function transformSectionToClient(
  section: FormSectionDefinition,
): ClientSectionDefinition {
  return {
    title: section.title,
    description: section.description,
    gridCols: section.gridCols,
    spacing: section.spacing,
    fields: section.fields.map(transformFieldToClient),
  };
}

// Transform server configuration to client-safe version
function transformConfigurationToClient(
  config: FormConfiguration,
): ClientFormConfiguration {
  return {
    title: config.title,
    description: config.description,
    submitButtonText: config.submitButtonText,
    resetButtonText: config.resetButtonText,
    showResetButton: config.showResetButton,
    sections: config.sections.map(transformSectionToClient),
    styles: config.styles,
    // Note: postgresTableName is intentionally omitted
  };
}

export interface ServerFormProps {
  config: FormConfiguration;
  onSubmit?: (data: Record<string, unknown>) => void | Promise<void>;
  defaultValues?: Partial<Record<string, unknown>>;
  className?: string;
  isLoading?: boolean;
  autoSaveToDatabase?: boolean;
}

/**
 * ServerForm Component - SSR Wrapper
 *
 * This component processes the FormConfiguration server-side and renders
 * the ClientForm with only client-safe data.
 */
export function ServerForm({
  config,
  onSubmit,
  defaultValues,
  className,
  isLoading,
  autoSaveToDatabase = true,
}: ServerFormProps) {
  // Transform configuration to client-safe version
  const clientConfig = transformConfigurationToClient(config);

  return (
    <ClientForm
      title={clientConfig.title}
      description={clientConfig.description}
      sections={clientConfig.sections}
      submitButtonText={clientConfig.submitButtonText}
      resetButtonText={clientConfig.resetButtonText}
      showResetButton={clientConfig.showResetButton}
      onSubmit={onSubmit}
      defaultValues={defaultValues}
      className={className}
      isLoading={isLoading}
      autoSaveToDatabase={autoSaveToDatabase}
    />
  );
}

/**
 * Usage Example:
 *
 * // In your page component (SSR):
 * import { ServerForm } from '@/components/form/ServerForm';
 * import { formConfiguration } from '@/components/form/FormConfiguration';
 *
 * export default function MyPage() {
 *   return (
 *     <ServerForm
 *       config={formConfiguration}
 *       autoSaveToDatabase={true}
 *     />
 *   );
 * }
 *
 * Benefits:
 * - Server-side configuration processing
 * - Client never sees DB schemas, Zod configs, etc.
 * - Type-safe transformation
 * - SSR-friendly
 */

export default ServerForm;
