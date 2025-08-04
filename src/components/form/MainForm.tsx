'use client';

import React from 'react';
import { useForm, FieldErrors } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { FormSectionTemplate, FormFieldConfig } from './FormSectionTemplate';
import {
  FormConfigurationType,
  generateZodSchema,
  GeneratedFormType,
} from '@/lib/generateSchema';
import { trpc } from '@/utils/trpc';
import { FieldDefinition } from './DemoFormConfiguration';

// Helper function to convert FieldDefinition to FormFieldConfig
function convertFieldDefinition(
  field: FieldDefinition,
): FormFieldConfig<Record<string, unknown>> {
  return {
    label: field.label,
    name: field.name as keyof Record<string, unknown>,
    type: field.type,
    placeholder: field.placeholder,
    required: field.required,
    step: field.step,
    min: field.min,
    max: field.max,
    rows: field.rows,
    options: field.options as
      | string[]
      | { value: string; label: string }[]
      | undefined,
    className: field.className,
    disabled: field.disabled,
    description: field.description,
  };
}

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

export interface MainFormProps {
  config: FormConfigurationType;
  onSubmit?: (data: GeneratedFormType) => void | Promise<void>;
  defaultValues?: Partial<GeneratedFormType>;
  className?: string;
  isLoading?: boolean;
  autoSaveToDatabase?: boolean; // New prop to automatically save to database
}

export function MainForm({
  config,
  onSubmit,
  defaultValues,
  className = '',
  isLoading = false,
  autoSaveToDatabase = true,
}: MainFormProps) {
  // Generate Zod schema from configuration
  const schema = React.useMemo(() => generateZodSchema(config), [config]);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<GeneratedFormType>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues,
  });

  // Get the tRPC mutation for the book router (using the form configuration)
  const createMutation = trpc.book.create.useMutation();

  const handleFormSubmit = async (data: GeneratedFormType) => {
    try {
      // Auto-save to database if enabled
      if (autoSaveToDatabase) {
        const result = await createMutation.mutateAsync(data);
        console.log('Data saved via tRPC:', result);
      }

      // Call custom onSubmit handler if provided
      if (onSubmit) {
        await onSubmit(data);
      }

      toast.success('Form submitted successfully!');
    } catch (error) {
      toast.error('Failed to submit form. Please try again.');
      console.error('Form submission error:', error);
    }
  };

  const handleReset = () => {
    reset(defaultValues);
    toast.info('Form has been reset');
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Form Header */}
      {(config.title || config.description) && (
        <div className='space-y-2 text-center'>
          {config.title && (
            <h1 className='text-2xl font-bold text-gray-900'>{config.title}</h1>
          )}
          {config.description && (
            <p className='text-gray-600'>{config.description}</p>
          )}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(handleFormSubmit)} className='space-y-6'>
        {/* Form Sections */}
        {config.sections.map((section, index) => (
          <FormSectionTemplate
            key={`section-${index}`}
            title={section.title}
            description={section.description}
            control={control}
            fields={section.fields.map(convertFieldDefinition)}
            errors={convertErrors(errors)}
            gridCols={section.gridCols}
            spacing={section.spacing}
          />
        ))}

        {/* Form Actions */}
        <div className='flex justify-end space-x-4 border-t pt-6'>
          {config.showResetButton && (
            <Button
              type='button'
              variant='outline'
              onClick={handleReset}
              disabled={isSubmitting || isLoading}
            >
              {config.resetButtonText || 'Reset'}
            </Button>
          )}
          <Button
            type='submit'
            disabled={isSubmitting || isLoading}
            className='min-w-32'
          >
            {isSubmitting || isLoading
              ? 'Submitting...'
              : config.submitButtonText || 'Submit'}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default MainForm;
