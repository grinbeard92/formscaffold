'use client';

import React from 'react';
import { useForm, FieldErrors } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Button } from '@radix-ui/themes';
import { FormSectionTemplate } from './FormSectionTemplate';
import z from 'zod';
import { FormSectionDefinition } from '../../types/globalFormTypes';

// Helper function to convert errors
function convertErrors(
  errors: FieldErrors<Record<string, unknown>>,
): Record<string, { message?: string }> {
  const converted: Record<string, { message?: string }> = {};
  Object.keys(errors).forEach((key) => {
    const error = errors[key];
    if (error) {
      converted[key] = { message: error.message };
    }
  });
  return converted;
}

export interface ClientFormProps {
  schema: z.ZodTypeAny;
  title: string;
  description?: string;
  sections: FormSectionDefinition[];
  submitButtonText?: string;
  resetButtonText?: string;
  showResetButton?: boolean;
  onSubmit?: (data: Record<string, unknown>) => void | Promise<void>;
  defaultValues?: Partial<Record<string, unknown>>;
  className?: string;
  isLoading?: boolean;
  autoSaveToDatabase?: boolean;
  serverAction?: (
    data: Record<string, unknown>,
  ) => Promise<{ success: boolean; data?: unknown; error?: string }>;
}

export function ClientForm({
  schema,
  title,
  description,
  sections,
  submitButtonText = 'Submit',
  resetButtonText = 'Reset',
  showResetButton = true,
  onSubmit,
  defaultValues,
  className = '',
  isLoading = false,
  autoSaveToDatabase = true,
  serverAction,
}: ClientFormProps) {
  // Generate schema client-side from the sanitized sections

  const {
    control,
    handleSubmit,
    reset,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<Record<string, unknown>>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema as any),
    defaultValues: defaultValues,
    mode: 'onChange', // Validate on every change
    reValidateMode: 'onChange', // Re-validate on every change
    shouldFocusError: true, // Focus on first error field
  });

  // Trigger validation on mount to show initial validation state
  React.useEffect(() => {
    trigger(); // This will validate all fields immediately
  }, [trigger]);

  const handleReset = () => {
    reset(defaultValues);
    toast.info('Form has been reset');
  };

  // Create submission handler that works with React Hook Form data
  const handleFormSubmit = async (data: Record<string, unknown>) => {
    try {
      // Auto-save to database if enabled
      if (autoSaveToDatabase && serverAction) {
        const result = await serverAction(data);

        if (!result.success) {
          throw new Error(result.error || 'Failed to submit form');
        }

        toast.success('Form submitted successfully!');
      } else if (autoSaveToDatabase && !serverAction) {
        console.warn(
          'autoSaveToDatabase is enabled but no serverAction provided',
        );
        toast.warning('Server action not available');
      }

      // Call custom onSubmit handler if provided
      if (onSubmit) {
        await onSubmit(data);
      }

      if (!autoSaveToDatabase) {
        toast.success('Form submitted successfully!');
      }
    } catch (error) {
      toast.error('Failed to submit form. Please try again.');
      console.error('Form submission error:', error);
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Form Header */}
      {(title || description) && (
        <div className='space-y-2 text-center'>
          {title && (
            <h1 className='text-foreground text-2xl font-bold'>{title}</h1>
          )}
          {description && (
            <p className='text-muted-foreground'>{description}</p>
          )}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(handleFormSubmit)} className='space-y-6'>
        {/* Form Sections */}
        {sections.map((section, index) => (
          <FormSectionTemplate
            key={`section-${index}`}
            title={section.title}
            description={section.description}
            control={control}
            fields={section.fields}
            errors={convertErrors(errors)}
            gridCols={section.gridCols}
            spacing={section.spacing}
          />
        ))}

        {/* Form Actions */}
        <div className='border-border flex justify-end space-x-4 border-t pt-6'>
          {showResetButton && (
            <button
              type='button'
              className='bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded px-4 py-2 outline disabled:cursor-not-allowed disabled:opacity-50'
              onClick={handleReset}
              disabled={isSubmitting || isLoading}
            >
              {resetButtonText}
            </button>
          )}
          <button
            type='submit'
            disabled={isSubmitting || isLoading}
            className='bg-primary text-primary-foreground hover:bg-primary/90 min-w-32 rounded px-4 py-2 outline disabled:cursor-not-allowed disabled:opacity-50'
          >
            {isSubmitting || isLoading ? 'Submitting...' : submitButtonText}
          </button>
        </div>
      </form>
    </div>
  );
}
