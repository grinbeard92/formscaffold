'use server';

import { ClientForm } from './ClientForm';
import { IFormConfiguration } from '@/types/globalFormTypes';

function sanitizeConfigurationForClient(config: IFormConfiguration) {
  return {
    title: config.title,
    description: config.description,
    submitButtonText: config.submitButtonText,
    resetButtonText: config.resetButtonText,
    showResetButton: config.showResetButton,
    sections: config.sections,
    cssLightVars: config.cssLightVars,
    cssDarkVars: config.cssDarkVars,
  };
}

export interface ServerFormProps {
  config: IFormConfiguration;
  onSubmit?: (data: Record<string, unknown>) => void | Promise<void>;
  defaultValues?: Partial<Record<string, unknown>>;
  className?: string;
  isLoading?: boolean;
  autoSaveToDatabase?: boolean;
  children?: React.ReactNode;
}

export function ServerForm({
  config,
  onSubmit,
  defaultValues,
  className,
  isLoading,
  autoSaveToDatabase = true,
  children,
}: ServerFormProps) {
  const clientConfig = sanitizeConfigurationForClient(config);

  return (
    <>
      <ClientForm
        clientConfig={clientConfig}
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
      {children}
    </>
  );
}

export default ServerForm;
