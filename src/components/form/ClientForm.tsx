'use client';

import React from 'react';
import { useForm, FieldErrors } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
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
  setFormError?: (error: string | null) => void;
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
  setFormError: externalSetFormError,
}: ClientFormProps) {
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
    setFormError(null); // Clear any existing errors
    toast.info('Form has been reset');
  };

  const [formError, setFormError] = React.useState<string | null>(null);

  // Helper function to extract error message
  const getErrorMessage = (error: unknown): string => {
    if (typeof error === 'string') {
      return error;
    }
    if (error instanceof Error) {
      return error.message;
    }
    if (error && typeof error === 'object' && 'message' in error) {
      return String(error.message);
    }
    return 'An unexpected error occurred';
  };

  // Create submission handler that works with React Hook Form data
  const handleFormSubmit = async (data: Record<string, unknown>) => {
    try {
      // Clear any previous errors
      setFormError(null);
      if (externalSetFormError) {
        externalSetFormError(null);
      }

      // Auto-save to database if enabled
      if (autoSaveToDatabase && serverAction) {
        const result = await serverAction(data);

        if (!result.success) {
          throw new Error(result.error || 'Failed to submit form');
        }

        toast.success('Form submitted successfully!');
        reset(defaultValues);
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
      const errorMessage = getErrorMessage(error);
      setFormError(errorMessage);
      if (externalSetFormError) {
        externalSetFormError(errorMessage);
      }
      toast.error(errorMessage);
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

        {/* Form Error Display */}
        {formError && (
          <div className='bg-destructive/10 border-destructive/20 text-destructive rounded-lg border p-4'>
            <div className='flex items-start gap-3'>
              <div className='text-destructive mt-0.5'>
                <svg
                  className='h-5 w-5'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path
                    fillRule='evenodd'
                    d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                    clipRule='evenodd'
                  />
                </svg>
              </div>
              <div className='flex-1'>
                <h4 className='text-destructive text-sm font-medium'>
                  Form Submission Error
                </h4>
                <p className='text-destructive/80 mt-1 text-sm'>{formError}</p>
              </div>
              <button
                type='button'
                onClick={() => setFormError(null)}
                className='text-destructive/60 hover:text-destructive text-sm'
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Form Actions */}
        <div className='border-border flex justify-end space-x-4 border-t pt-6'>
          {showResetButton && (
            <button
              type='button'
              className='bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded px-4 py-2 outline active:scale-98 disabled:cursor-not-allowed disabled:opacity-50'
              onClick={handleReset}
              disabled={isSubmitting || isLoading}
            >
              {resetButtonText}
            </button>
          )}
          <button
            type='submit'
            onClick={() => {
              if (Object.keys(errors).length > 0) {
                toast.error(
                  'Please fix form validation errors before submitting',
                );
              }
            }}
            disabled={isSubmitting || isLoading}
            className='bg-primary text-primary-foreground hover:bg-primary-foreground/80 hover:text-secondary min-w-32 rounded px-4 py-2 outline active:scale-98 disabled:cursor-not-allowed disabled:opacity-50'
          >
            {isSubmitting || isLoading ? 'Submitting...' : submitButtonText}
          </button>
        </div>
      </form>
    </div>
  );
}
