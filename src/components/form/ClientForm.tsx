'use client';

import React from 'react';
import { useForm, FieldErrors } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { FormSectionTemplate, FormFieldConfig } from './FormSectionTemplate';
import { z } from 'zod';
import {
  ClientFieldDefinition,
  ClientSectionDefinition,
} from '@/types/ClientForm';

// Generate Zod schema from client-safe configuration
function generateClientZodSchema(sections: ClientSectionDefinition[]) {
  const schemaFields: Record<string, z.ZodTypeAny> = {};

  sections.forEach((section) => {
    section.fields.forEach((field) => {
      schemaFields[field.name] = createClientZodFieldSchema(field);
    });
  });

  return z.object(schemaFields);
}

// Helper function to create Zod schema for individual field (client-side version)
function createClientZodFieldSchema(
  field: ClientFieldDefinition,
): z.ZodTypeAny {
  let schema: z.ZodTypeAny;

  switch (field.type) {
    case 'text':
    case 'email':
      schema = z.string();
      if (field.min !== undefined && typeof field.min === 'number') {
        (schema as z.ZodString) = (schema as z.ZodString).min(field.min);
      }
      if (field.max !== undefined && typeof field.max === 'number') {
        (schema as z.ZodString) = (schema as z.ZodString).max(field.max);
      }
      break;

    case 'password':
      schema = z.string();
      if (field.min !== undefined && typeof field.min === 'number') {
        (schema as z.ZodString) = (schema as z.ZodString).min(field.min);
      }
      break;

    case 'number':
      schema = z.coerce.number();
      if (field.min !== undefined && typeof field.min === 'number') {
        (schema as z.ZodNumber) = (schema as z.ZodNumber).min(field.min);
      }
      if (field.max !== undefined && typeof field.max === 'number') {
        (schema as z.ZodNumber) = (schema as z.ZodNumber).max(field.max);
      }
      break;

    case 'textarea':
      schema = z.string();
      if (field.min !== undefined && typeof field.min === 'number') {
        (schema as z.ZodString) = (schema as z.ZodString).min(field.min);
      }
      if (field.max !== undefined && typeof field.max === 'number') {
        (schema as z.ZodString) = (schema as z.ZodString).max(field.max);
      }
      break;

    case 'select':
      if (field.options && field.options.length > 0) {
        if (typeof field.options[0] === 'string') {
          schema = z.enum(field.options as [string, ...string[]]);
        } else {
          const values = (
            field.options as { value: string; label: string }[]
          ).map((opt) => opt.value);
          schema = z.enum(values as [string, ...string[]]);
        }
      } else {
        schema = z.string();
      }
      break;

    case 'checkbox':
      schema = z.boolean();
      break;

    case 'date':
      schema = z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: 'Invalid date format',
      });
      break;

    default:
      schema = z.string();
  }

  // Apply required/optional
  if (!field.required) {
    schema = schema.optional();
  }

  return schema;
}

// Helper function to convert ClientFieldDefinition to FormFieldConfig
function convertFieldDefinition(
  field: ClientFieldDefinition,
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

export interface ClientFormProps {
  title: string;
  description?: string;
  sections: ClientSectionDefinition[];
  submitButtonText?: string;
  resetButtonText?: string;
  showResetButton?: boolean;
  onSubmit?: (data: Record<string, unknown>) => void | Promise<void>;
  defaultValues?: Partial<Record<string, unknown>>;
  className?: string;
  isLoading?: boolean;
  autoSaveToDatabase?: boolean;
}

export function ClientForm({
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
}: ClientFormProps) {
  // Generate schema client-side from the sanitized sections
  const schema = generateClientZodSchema(sections);
  
  // TODO: Get the tRPC mutation for the book router when tRPC is properly configured
  // const createMutation = trpc.book.create.useMutation();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Record<string, unknown>>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema as any),
    defaultValues: defaultValues,
  });

  const handleFormSubmit = async (data: Record<string, unknown>) => {
    try {
      // Auto-save to database if enabled (temporarily disabled until tRPC is properly configured)
      if (autoSaveToDatabase) {
        // TODO: Enable when tRPC is properly configured
        // const result = await createMutation.mutateAsync(data);
        console.log('Data would be saved via tRPC:', data);
        toast.success('Form submitted successfully! (Demo mode - no actual save)');
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
      {(title || description) && (
        <div className='space-y-2 text-center'>
          {title && (
            <h1 className='text-2xl font-bold text-gray-900'>{title}</h1>
          )}
          {description && <p className='text-gray-600'>{description}</p>}
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
            fields={section.fields.map(convertFieldDefinition)}
            errors={convertErrors(errors)}
            gridCols={section.gridCols}
            spacing={section.spacing}
          />
        ))}

        {/* Form Actions */}
        <div className='flex justify-end space-x-4 border-t pt-6'>
          {showResetButton && (
            <Button
              type='button'
              variant='outline'
              onClick={handleReset}
              disabled={isSubmitting || isLoading}
            >
              {resetButtonText}
            </Button>
          )}
          <Button
            type='submit'
            disabled={isSubmitting || isLoading}
            className='min-w-32'
          >
            {isSubmitting || isLoading ? 'Submitting...' : submitButtonText}
          </Button>
        </div>
      </form>
    </div>
  );
}
