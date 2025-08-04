'use client';

import React from 'react';
import {
  Control,
  Controller,
  FieldPath,
  FieldValues,
  ControllerRenderProps,
} from 'react-hook-form';
import { Card } from '@/components/ui/card';
import * as Select from '@radix-ui/react-select';
import * as Checkbox from '@radix-ui/react-checkbox';
import { ChevronDownIcon, CheckIcon } from '@radix-ui/react-icons';
import { cn } from '@/lib/utils';

// Types for field configuration
export interface SelectOption {
  value: string;
  label: string;
}

export interface FormFieldConfig<T extends FieldValues> {
  label: string;
  name: FieldPath<T>;
  type:
    | 'text'
    | 'email'
    | 'password'
    | 'number'
    | 'date'
    | 'textarea'
    | 'select'
    | 'checkbox';
  placeholder?: string;
  required?: boolean;
  step?: string; // For number inputs
  min?: string | number; // For number/date inputs
  max?: string | number; // For number/date inputs
  rows?: number; // For textarea
  options?: SelectOption[] | string[]; // For select inputs - now accepts simple strings too
  className?: string; // Custom field styling
  disabled?: boolean;
  description?: string; // Helper text below field
}

export interface FormSectionTemplateProps<T extends FieldValues> {
  title: string;
  description?: string;
  control: Control<T>;
  fields: FormFieldConfig<T>[];
  errors: Record<string, { message?: string }>;
  contentClassName?: string;
  gridCols?: '1' | '2' | '3' | '4'; // Grid layout
  spacing?: 'sm' | 'md' | 'lg'; // Spacing between fields
}

// Render individual form field
const renderFormField = <T extends FieldValues>(
  field: FormFieldConfig<T>,
  control: Control<T>,
  error?: { message?: string },
) => {
  const baseInputProps = {
    placeholder: field.placeholder,
    disabled: field.disabled,
    className: field.className,
  };

  const renderInput = ({
    field: controllerField,
  }: {
    field: ControllerRenderProps<T, FieldPath<T>>;
  }) => {
    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            {...controllerField}
            {...baseInputProps}
            rows={field.rows || 3}
            className={cn(
              'border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
              field.className,
            )}
          />
        );

      case 'select':
        // Normalize options to SelectOption format
        const normalizedOptions =
          field.options?.map((option) =>
            typeof option === 'string'
              ? { value: option, label: option }
              : option,
          ) || [];

        return (
          <Select.Root
            onValueChange={controllerField.onChange}
            value={controllerField.value}
          >
            <Select.Trigger className='border-input bg-background ring-offset-background placeholder:text-muted-foreground focus:ring-ring flex h-10 w-full items-center justify-between rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50'>
              <Select.Value
                placeholder={field.placeholder || 'Select an option'}
              />
              <Select.Icon className='h-4 w-4 opacity-50'>
                <ChevronDownIcon />
              </Select.Icon>
            </Select.Trigger>
            <Select.Portal>
              <Select.Content className='bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border shadow-md'>
                <Select.Viewport className='p-1'>
                  {normalizedOptions.map((option) => (
                    <Select.Item
                      key={option.value}
                      value={option.value}
                      className='focus:bg-accent focus:text-accent-foreground relative flex w-full cursor-default items-center rounded-sm py-1.5 pr-2 pl-8 text-sm outline-none select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
                    >
                      <span className='absolute left-2 flex h-3.5 w-3.5 items-center justify-center'>
                        <Select.ItemIndicator>
                          <CheckIcon className='h-4 w-4' />
                        </Select.ItemIndicator>
                      </span>
                      <Select.ItemText>{option.label}</Select.ItemText>
                    </Select.Item>
                  ))}
                </Select.Viewport>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
        );

      case 'checkbox':
        return (
          <div className='flex items-center space-x-2'>
            <Checkbox.Root
              id={String(field.name)}
              checked={controllerField.value}
              onCheckedChange={controllerField.onChange}
              disabled={field.disabled}
              className='border-primary ring-offset-background focus-visible:ring-ring data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground flex h-4 w-4 items-center justify-center rounded-sm border focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50'
            >
              <Checkbox.Indicator className='flex items-center justify-center text-current'>
                <CheckIcon className='h-4 w-4' />
              </Checkbox.Indicator>
            </Checkbox.Root>
            <label
              htmlFor={String(field.name)}
              className='text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
            >
              {field.label}
            </label>
          </div>
        );

      case 'number':
        return (
          <input
            {...controllerField}
            {...baseInputProps}
            type='number'
            step={field.step}
            min={field.min}
            max={field.max}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              controllerField.onChange(Number(e.target.value) || 0)
            }
            className={cn(
              'border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
              field.className,
            )}
          />
        );

      case 'date':
        return (
          <input
            {...controllerField}
            {...baseInputProps}
            type='date'
            min={field.min}
            max={field.max}
            className={cn(
              'border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
              field.className,
            )}
          />
        );

      default:
        return (
          <input
            {...controllerField}
            {...baseInputProps}
            type={field.type}
            className={cn(
              'border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
              field.className,
            )}
          />
        );
    }
  };

  return (
    <div key={String(field.name)} className='space-y-2'>
      {field.type !== 'checkbox' && (
        <label className='block text-sm font-medium text-gray-700'>
          {field.label}
          {field.required && <span className='ml-1 text-red-500'>*</span>}
        </label>
      )}

      <Controller name={field.name} control={control} render={renderInput} />

      {field.description && (
        <p className='text-xs text-gray-500'>{field.description}</p>
      )}

      {error && <p className='text-sm text-red-600'>{error.message}</p>}
    </div>
  );
};

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
        {description && <p className='text-sm text-gray-600'>{description}</p>}
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

// Helper functions (optional - you can pass plain objects directly to the fields prop)
// These functions provide TypeScript intellisense and validation, but are not required

// Helper function to create field configurations with type safety
export const createField = <T extends FieldValues>(
  config: FormFieldConfig<T>,
): FormFieldConfig<T> => config;

// Helper function to create select options from simple strings
export const createSelectOptions = (
  items: string[] | { value: string; label: string }[],
): SelectOption[] => {
  return items.map((item) =>
    typeof item === 'string' ? { value: item, label: item } : item,
  );
};

export default FormSectionTemplate;
