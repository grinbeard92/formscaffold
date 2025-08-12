'use client';

import { Control, Controller, FieldValues } from 'react-hook-form';

import React from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/utils/utils';
import {
  IFormSectionTemplateProps,
  IFieldDefinition,
} from '@/types/globalFormTypes';
import { getFieldRequirements } from './utils/formSectionUtils';
import { renderInput } from './utils/renderInputSection';

// Main FormSectionTemplate component
export const FormSectionTemplate = <T extends FieldValues>({
  title,
  description,
  control,
  fields,
  errors,
  contentClassName,
  gridCols = '1',
  spacing = 'md',
}: IFormSectionTemplateProps<T>) => {
  const gridColsClass = {
    '1': 'grid-cols-1',
    '2': 'grid-cols-1 md:grid-cols-2',
    '3': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    '4': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  const spacingClass = {
    sm: 'gap-3',
    md: 'gap-4',
    lg: 'gap-6',
  };

  return (
    <Card.Root>
      <Card.Header>
        <Card.Title>{title}</Card.Title>
        {description && (
          <p className='text-muted-foreground text-sm'>{description}</p>
        )}
      </Card.Header>
      <Card.Content className={cn('space-y-4', contentClassName)}>
        <div
          className={cn('grid', gridColsClass[gridCols], spacingClass[spacing])}
        >
          {fields.map((fieldConfig) => {
            const fieldError = errors[String(fieldConfig.name)];
            return renderFormField(fieldConfig, control, fieldError);
          })}
        </div>
      </Card.Content>
    </Card.Root>
  );
};

// Render individual form field
const renderFormField = <T extends FieldValues>(
  formField: IFieldDefinition<T>,
  control: Control<T>,
  error?: { message?: string },
) => {
  const requirements = getFieldRequirements(formField);

  return (
    <div
      key={String(formField.name)}
      className={formField.type === 'hidden' ? 'hidden' : 'space-y-2'}
    >
      {formField.type !== 'checkbox' &&
        formField.type !== 'toggle' &&
        formField.type !== 'hidden' && (
          <label className='text-foreground block text-sm font-medium'>
            {formField.label}
            {formField.required && (
              <span className='text-destructive ml-1'>*</span>
            )}
          </label>
        )}

      <Controller
        name={formField.name}
        control={control}
        defaultValue={formField.default as T[keyof T]} // Use the required default value from field configuration
        render={({ field, fieldState, formState }) =>
          renderInput(formField, field, fieldState, formState)
        }
      />

      {formField.description && formField.type !== 'hidden' && (
        <p className='text-muted-foreground text-xs'>{formField.description}</p>
      )}
      {error && formField.customErrorMessage ? (
        <p
          className='text-sm text-red-500'
          style={{ textShadow: '0 5px 10px rgba(255, 0, 0, 0.5)' }}
        >
          {formField.customErrorMessage}
        </p>
      ) : (
        error && (
          <p
            className='text-sm text-red-500'
            style={{ textShadow: '0 5px 10px rgba(255, 0, 0, 0.5)' }}
          >
            {error.message}
          </p>
        )
      )}

      {formField.type !== 'hidden' && (
        <div className='flex justify-end'>
          <sub className='text-muted-foreground text-xs italic'>
            {requirements.map((req, idx) => (
              <span key={req}>
                {req}
                {idx < requirements.length - 1 && (
                  <span className='mx-1'>·</span>
                )}
              </span>
            ))}
          </sub>
        </div>
      )}
    </div>
  );
};

export default FormSectionTemplate;
