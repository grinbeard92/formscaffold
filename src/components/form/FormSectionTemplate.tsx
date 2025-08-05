'use client';

import { Control, Controller, FieldValues } from 'react-hook-form';

import React from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/utils/utils';
import { FormSectionTemplateProps } from '@/types/globalFormTypes';
import { FieldDefinition } from '@/types/globalFormTypes';
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
}: FormSectionTemplateProps<T>) => {
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
  field: FieldDefinition<T>,
  control: Control<T>,
  error?: { message?: string },
) => {
  const requirements = getFieldRequirements(field);

  return (
    <div
      key={String(field.name)}
      className={field.type === 'hidden' ? 'hidden' : 'space-y-2'}
    >
      {field.type !== 'checkbox' &&
        field.type !== 'toggle' &&
        field.type !== 'hidden' && (
          <label className='text-foreground block text-sm font-medium'>
            {field.label}
            {field.required && <span className='text-destructive ml-1'>*</span>}
          </label>
        )}

      <Controller
        name={field.name}
        control={control}
        render={(controllerProps) => renderInput(field, controllerProps)}
      />

      {field.description && field.type !== 'hidden' && (
        <p className='text-muted-foreground text-xs'>{field.description}</p>
      )}

      {field.type !== 'hidden' && (
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

      {error && field.type !== 'hidden' && (
        <p className='text-destructive text-sm'>{error.message}</p>
      )}
    </div>
  );
};

export default FormSectionTemplate;
