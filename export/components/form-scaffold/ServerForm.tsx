'use client';

import React, { useEffect, useState } from 'react';
import { ClientForm } from './ClientForm';
import { IFormConfiguration } from '@/types/globalFormTypes';
import { generateZodSchema } from '@/scripts/generate-schema';

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
  const [serverAction, setServerAction] = useState<
    | ((
        data: Record<string, unknown>,
      ) => Promise<{ success: boolean; data?: unknown; error?: string }>)
    | null
  >(null);
  const [actionLoading, setActionLoading] = useState(true);

  useEffect(() => {
    async function loadServerAction() {
      if (!autoSaveToDatabase) {
        setActionLoading(false);
        return;
      }

      try {
        const actionsModule = await import(
          `@/actions/${config.postgresTableName}`
        );
        const capitalizedTableName =
          config.postgresTableName.charAt(0).toUpperCase() +
          config.postgresTableName.slice(1);
        const createActionName = `create${capitalizedTableName}`;

        if (actionsModule[createActionName]) {
          setServerAction(() => actionsModule[createActionName]);
        } else {
          console.warn(
            `No create action found for table: ${config.postgresTableName}`,
          );
        }
      } catch (error) {
        console.warn(
          `Could not load server actions for table: ${config.postgresTableName}`,
          error,
        );
      } finally {
        setActionLoading(false);
      }
    }

    loadServerAction();
  }, [config.postgresTableName, autoSaveToDatabase]);

  const clientConfig = sanitizeConfigurationForClient(config);
  const schema = generateZodSchema(config);

  return (
    <>
      <ClientForm
        schema={schema}
        title={clientConfig.title}
        description={clientConfig.description}
        sections={clientConfig.sections}
        submitButtonText={clientConfig.submitButtonText}
        resetButtonText={clientConfig.resetButtonText}
        showResetButton={clientConfig.showResetButton}
        onSubmit={onSubmit}
        defaultValues={defaultValues}
        className={className}
        isLoading={isLoading || actionLoading}
        autoSaveToDatabase={autoSaveToDatabase}
        serverAction={serverAction || undefined}
      />
      {children}
    </>
  );
}

export default ServerForm;
