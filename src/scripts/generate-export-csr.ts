/**
 * Export Generator - Client Side Rendering (CSR)
 *
 * Client-side implementation of the FormScaffold export functionality.
 * This version makes API calls to the server for file operations since
 * Node.js fs APIs are not available in the browser.
 *
 * This is safe to import and use in client-side React components.
 */

import { IFormConfiguration } from '../types/globalFormTypes';

export interface IExportStatus {
  step: string;
  message: string;
  isComplete: boolean;
  isError: boolean;
  progress?: number;
}

export type ExportStatusCallback = (status: IExportStatus) => void;

/**
 * Client-side export generation function
 * Makes API calls to the server to perform the actual file operations
 */
export async function generateExportCSR(
  onStatusUpdate?: ExportStatusCallback,
): Promise<void> {
  const updateStatus = (status: Partial<IExportStatus>) => {
    onStatusUpdate?.({
      step: status.step || '',
      message: status.message || '',
      isComplete: status.isComplete || false,
      isError: status.isError || false,
      progress: status.progress,
    });
  };

  try {
    updateStatus({
      step: 'initialization',
      message: 'Initializing export process...',
      progress: 0,
    });

    const response = await fetch('/api/export', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        timestamp: Date.now(),
      }),
    });

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ error: 'Unknown error' }));
      throw new Error(
        errorData.error || `HTTP ${response.status}: ${response.statusText}`,
      );
    }

    if (
      response.body &&
      response.headers.get('content-type')?.includes('text/plain')
    ) {
      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.trim()) {
            try {
              const statusUpdate = JSON.parse(line);
              updateStatus(statusUpdate);
            } catch {
              updateStatus({
                step: 'processing',
                message: line.trim(),
              });
            }
          }
        }
      }
    } else {
      const result = await response.json();

      updateStatus({
        step: 'artifacts',
        message: 'Generating all FormScaffold artifacts...',
        progress: 25,
      });

      updateStatus({
        step: 'components',
        message: 'Copying runtime components...',
        progress: 50,
      });

      updateStatus({
        step: 'schemas',
        message: 'Creating schemas and documentation...',
        progress: 75,
      });

      updateStatus({
        step: 'complete',
        message: `✅ Export completed successfully! Location: ${result.exportPath || '/export'}`,
        isComplete: true,
        progress: 100,
      });
    }
  } catch (error) {
    console.error('Export error:', error);
    updateStatus({
      step: 'error',
      message: `❌ Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      isError: true,
    });
    throw error;
  }
}

/**
 * Generate export preview - shows what would be exported without actually doing it
 * This is useful for the UI to show users what will be included
 */
export async function generateExportPreview(): Promise<{
  forms: Array<{ name: string; tableName: string }>;
  components: string[];
  totalFiles: number;
}> {
  try {
    const response = await fetch('/api/export/preview', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get export preview: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Export preview error:', error);
    return {
      forms: [],
      components: [],
      totalFiles: 0,
    };
  }
}

/**
 * Download the generated export as a ZIP file
 */
export async function downloadExportZip(): Promise<void> {
  try {
    const response = await fetch('/api/export/download', {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`Failed to download export: ${response.statusText}`);
    }

    const blob = await response.blob();

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `formscaffold-export-${new Date().toISOString().split('T')[0]}.zip`;
    document.body.appendChild(a);
    a.click();

    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
    console.error('Download error:', error);
    throw error;
  }
}

/**
 * Generate export for a specific form configuration (client-side safe)
 * This creates a preview/simulation of what would be exported
 */
export function generateFormExportPreview(config: IFormConfiguration): {
  packageName: string;
  files: Array<{
    path: string;
    description: string;
    type: 'component' | 'type' | 'schema' | 'action' | 'page' | 'config';
  }>;
} {
  const tableName = config.postgresTableName;
  const packageName = config.title.toLowerCase().replace(/\s+/g, '-');

  const files = [
    {
      path: `components/form-scaffold/${tableName}Form.tsx`,
      description: 'Generated form component',
      type: 'component' as const,
    },
    {
      path: `components/form-scaffold/utils/formSectionUtils.ts`,
      description: 'Form utility functions',
      type: 'component' as const,
    },

    {
      path: `types/${tableName}Types.d.ts`,
      description: 'TypeScript type definitions',
      type: 'type' as const,
    },

    {
      path: `schemas/${tableName}-zod.ts`,
      description: 'Zod validation schema',
      type: 'schema' as const,
    },
    {
      path: `schemas/${tableName}-postgres.sql`,
      description: 'PostgreSQL database schema',
      type: 'schema' as const,
    },

    {
      path: `actions/${tableName}.ts`,
      description: 'Server actions for CRUD operations',
      type: 'action' as const,
    },

    {
      path: `pages/${tableName}/page.tsx`,
      description: 'Demo page implementation',
      type: 'page' as const,
    },

    {
      path: `configurations/${tableName}FormConfiguration.ts`,
      description: 'Form configuration file',
      type: 'config' as const,
    },
  ];

  return {
    packageName,
    files,
  };
}

/**
 * Validate export prerequisites (client-side checks)
 */
export function validateExportPrerequisites(config: IFormConfiguration): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!config.title?.trim()) {
    errors.push('Form title is required');
  }

  if (!config.postgresTableName?.trim()) {
    errors.push('PostgreSQL table name is required');
  }

  if (!config.sections?.length) {
    errors.push('At least one form section is required');
  }

  const hasFields = config.sections?.some(
    (section) => section.fields?.length > 0,
  );
  if (!hasFields) {
    errors.push('At least one field is required in the form');
  }

  if (
    config.postgresTableName &&
    !/^[a-z][a-z0-9_]*$/i.test(config.postgresTableName)
  ) {
    errors.push(
      'Table name must start with a letter and contain only letters, numbers, and underscores',
    );
  }

  const fieldNames = new Set<string>();
  const duplicateFields: string[] = [];

  config.sections?.forEach((section) => {
    section.fields?.forEach((field) => {
      if (fieldNames.has(field.name)) {
        duplicateFields.push(field.name);
      } else {
        fieldNames.add(field.name);
      }
    });
  });

  if (duplicateFields.length > 0) {
    errors.push(`Duplicate field names found: ${duplicateFields.join(', ')}`);
  }

  if (config.sections && config.sections.length > 10) {
    warnings.push('Large number of sections might affect performance');
  }

  const totalFields =
    config.sections?.reduce(
      (acc, section) => acc + (section.fields?.length || 0),
      0,
    ) || 0;
  if (totalFields > 50) {
    warnings.push('Large number of fields might affect form performance');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}
