'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { IFormConfiguration } from '@/types/globalFormTypes';
import {
  generateExportCSR,
  generateExportPreview,
  downloadExportZip,
  validateExportPrerequisites,
  type IExportStatus,
} from '@/scripts/generate-export-csr';

interface ExportTabProps {
  config: IFormConfiguration;
  formTitle: string;
}

export function ExportTab({ config, formTitle }: ExportTabProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState<string>('');
  const [exportPreview, setExportPreview] = useState<{
    forms: Array<{ name: string; tableName: string }>;
    components: string[];
    totalFiles: number;
  } | null>(null);
  const [validationResult, setValidationResult] = useState<{
    isValid: boolean;
    errors: string[];
    warnings: string[];
  } | null>(null);

  // Validate prerequisites when component mounts or config changes
  useEffect(() => {
    const result = validateExportPrerequisites(config);
    setValidationResult(result);
  }, [config]);

  // Load export preview
  useEffect(() => {
    generateExportPreview().then(setExportPreview);
  }, []);

  const handleExportPackage = async () => {
    setIsExporting(true);
    setExportStatus('Starting export process...');

    try {
      await generateExportCSR((status: IExportStatus) => {
        setExportStatus(status.message);
      });
    } catch (error) {
      console.error('Error during export:', error);
      setExportStatus(
        `❌ Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownloadZip = async () => {
    try {
      await downloadExportZip();
    } catch (error) {
      console.error('Download error:', error);
      setExportStatus(
        `❌ Download failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  };

  return (
    <Card.Root>
      <div className='p-6'>
        <h3 className='mb-4 text-lg font-semibold'>
          Export FormScaffold Package
        </h3>
        <p className='text-muted-foreground mb-6 text-sm'>
          Export your form configuration as a complete Next.js package with all
          necessary files.
        </p>

        <div className='mb-6 grid grid-cols-1 gap-4 md:grid-cols-2'>
          <div>
            <label className='mb-2 block text-sm font-medium'>
              Package Name
            </label>
            <input
              type='text'
              value={formTitle.toLowerCase().replace(/\s+/g, '-')}
              className='w-full rounded-md border border-gray-300 px-3 py-2'
              readOnly
            />
          </div>
          <div>
            <label className='mb-2 block text-sm font-medium'>
              Export Format
            </label>
            <select className='w-full rounded-md border border-gray-300 px-3 py-2'>
              <option value='nextjs'>Next.js App Router</option>
              <option value='component'>React Component Only</option>
              <option value='full'>Full Stack Package</option>
            </select>
          </div>
        </div>

        <div className='mb-6 space-y-2'>
          <h4 className='text-sm font-medium'>Package Contents:</h4>
          <ul className='text-muted-foreground list-inside list-disc space-y-1 text-sm'>
            <li>React component with form validation</li>
            <li>TypeScript type definitions</li>
            <li>Zod validation schema</li>
            <li>Server actions (Next.js)</li>
            <li>Database schema (PostgreSQL)</li>
            <li>API routes and middleware</li>
            <li>Documentation and usage examples</li>
          </ul>

          {exportPreview && (
            <div className='mt-4 rounded-md border bg-gray-50 p-3 text-sm'>
              <p>
                <strong>Forms to export:</strong> {exportPreview.forms.length}
              </p>
              <p>
                <strong>Total files:</strong> {exportPreview.totalFiles}
              </p>
            </div>
          )}
        </div>

        {/* Validation Results */}
        {validationResult && !validationResult.isValid && (
          <div className='mb-4 rounded-md border border-red-200 bg-red-50 p-3'>
            <h4 className='mb-2 text-sm font-medium text-red-800'>
              Export Prerequisites Not Met:
            </h4>
            <ul className='list-inside list-disc space-y-1 text-sm text-red-700'>
              {validationResult.errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        {validationResult && validationResult.warnings.length > 0 && (
          <div className='mb-4 rounded-md border border-yellow-200 bg-yellow-50 p-3'>
            <h4 className='mb-2 text-sm font-medium text-yellow-800'>
              Warnings:
            </h4>
            <ul className='list-inside list-disc space-y-1 text-sm text-yellow-700'>
              {validationResult.warnings.map((warning, index) => (
                <li key={index}>{warning}</li>
              ))}
            </ul>
          </div>
        )}

        {exportStatus && (
          <div className='mb-4 rounded-md border bg-gray-50 p-3 text-sm'>
            {exportStatus}
          </div>
        )}

        <div className='flex gap-2'>
          <button
            onClick={handleExportPackage}
            disabled={isExporting || validationResult?.isValid === false}
            className='bg-primary text-primary-foreground hover:bg-primary/90 rounded px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50'
          >
            {isExporting ? '⏳ Exporting...' : '📦 Export Package'}
          </button>
          <button
            onClick={handleDownloadZip}
            disabled={isExporting}
            className='bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50'
          >
            📁 Download as ZIP
          </button>
        </div>
      </div>
    </Card.Root>
  );
}
