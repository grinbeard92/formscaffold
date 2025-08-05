'use client';

import * as Select from '@radix-ui/react-select';
import * as Checkbox from '@radix-ui/react-checkbox';
import { ChevronDownIcon, CheckIcon } from '@radix-ui/react-icons';
import {
  ControllerRenderProps,
  FieldPath,
  FieldValues,
} from 'react-hook-form';

import React from 'react';
import { cn } from '@/utils/utils';
import { SelectOption } from '@/types/formSectionTypes';
import { FieldDefinition } from '@/types/globalFormTypes';

export const renderInput = <T extends FieldValues>(
  field: FieldDefinition<T>,
  {
    field: controllerField,
  }: {
    field: ControllerRenderProps<T, FieldPath<T>>;
  }
) => {
  const baseInputProps = {
    placeholder: field.placeholder,
    disabled: field.disabled,
    className: field.className,
  };

  // Ensure controlled inputs always have a defined value
  const controlledFieldProps = {
    ...controllerField,
    value: controllerField.value ?? '', // Default to empty string instead of undefined
  };

  switch (field.type) {
    case 'textarea':
      return (
        <textarea
          {...controlledFieldProps}
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
        field.options?.map((option: string | SelectOption) =>
          typeof option === 'string'
            ? { value: option, label: option }
            : { value: option.value, label: option.label },
        ) || [];

      return (
        <Select.Root
          onValueChange={controllerField.onChange}
          value={controllerField.value ?? ''} // Default to empty string instead of undefined
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
                {normalizedOptions.map((option: SelectOption) => (
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
            checked={controllerField.value ?? false} // Default to false instead of undefined
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
          {...baseInputProps}
          type='number'
          step={field.step}
          min={field.min}
          max={field.max}
          value={controllerField.value ?? ''} // Default to empty string for number inputs
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value;
            controllerField.onChange(
              value === '' ? undefined : Number(value),
            );
          }}
          className={cn(
            'border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
            field.className,
          )}
        />
      );

    case 'date':
      return (
        <input
          {...controlledFieldProps}
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
          {...controlledFieldProps}
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
