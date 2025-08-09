'use client';

import * as Select from '@radix-ui/react-select';
import * as Checkbox from '@radix-ui/react-checkbox';
import { ChevronDownIcon, CheckIcon } from '@radix-ui/react-icons';
import { ControllerRenderProps, FieldPath, FieldValues } from 'react-hook-form';

import React from 'react';
import { cn } from '@/utils/utils';
import { ISelectOption } from '@/types/globalFormTypes';
import { IFieldDefinition } from '@/types/globalFormTypes';
import SignaturePanel from '@/components/SignaturePanel';

export const renderInput = <T extends FieldValues>(
  field: IFieldDefinition<T>,
  {
    field: controllerField,
  }: {
    field: ControllerRenderProps<T, FieldPath<T>>;
  },
) => {
  const baseInputProps = {
    placeholder: field.placeholder,
    disabled: field.disabled,
    className: field.className,
  };

  // Ensure controlled inputs always have a defined value
  const controlledFieldProps = {
    ...controllerField,
    value: controllerField.value ?? '',
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
        field.options?.map((option: string | ISelectOption) =>
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
                {normalizedOptions.map((option: ISelectOption) => (
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
            checked={controllerField.value ?? false}
            onCheckedChange={controllerField.onChange}
            disabled={field.disabled}
            className='border-primary ring-offset-background focus-visible:ring-ring data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground flex h-6 w-6 items-center justify-center rounded-sm border focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50'
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
          min={field.min || field.zodConfig?.min}
          max={field.max || field.zodConfig?.max}
          value={controllerField.value ?? ''} // Default to empty string for number inputs
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value;
            controllerField.onChange(value === '' ? undefined : Number(value));
          }}
          className={cn(
            'border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
            field.className,
          )}
        />
      );

    case 'date':
    case 'time':
    case 'datetime-local':
    case 'month':
    case 'week':
      return (
        <input
          {...controlledFieldProps}
          {...baseInputProps}
          type={field.type}
          min={field.min}
          max={field.max}
          className={cn(
            'border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
            field.className,
          )}
        />
      );

    case 'range':
      return (
        <div className='flex items-center space-x-4'>
          <input
            {...controlledFieldProps}
            {...baseInputProps}
            type='range'
            min={field.min || field.zodConfig?.min}
            max={field.max || field.zodConfig?.max}
            defaultValue={(field.default as number) ?? 0}
            step={field.step}
            className={cn(
              'h-2 flex-1 cursor-pointer appearance-none rounded-lg bg-gray-200',
              field.className,
            )}
          />
          <span className='min-w-[3rem] text-sm text-gray-600'>
            {controllerField.value ?? field.min ?? 0}
          </span>
        </div>
      );

    case 'color':
      return (
        <div className='flex items-center space-x-2'>
          <input
            {...controlledFieldProps}
            {...baseInputProps}
            type='color'
            className={cn(
              'border-input bg-background h-10 w-16 cursor-pointer rounded-md border disabled:cursor-not-allowed disabled:opacity-50',
              field.className,
            )}
          />
          <span className='text-sm text-gray-600'>
            {controllerField.value || '#000000'}
          </span>
        </div>
      );

    case 'file':
      return (
        <div className='space-y-2'>
          <input
            {...baseInputProps}
            type='file'
            accept={field.accept}
            multiple={field.multiple}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const files = e.target.files;
              if (files && files.length > 0) {
                if (field.multiple) {
                  const fileArray = Array.from(files);
                  controllerField.onChange(fileArray);
                } else {
                  const singleFile = files[0];
                  controllerField.onChange(singleFile);
                }
              } else {
                controllerField.onChange(field.multiple ? [] : undefined);
              }
            }}
            className={cn(
              'border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
              field.className,
            )}
          />

          {/* Display thumbnails for uploaded files */}
          {controllerField.value && (
            <div className='mt-2 flex flex-wrap gap-2'>
              {field.multiple ? (
                // Multiple files: value should be an array
                Array.isArray(controllerField.value) &&
                controllerField.value.length > 0 ? (
                  controllerField.value.map((file: File, index: number) => (
                    <div key={index} className='relative'>
                      {file.type && file.type.startsWith('image/') ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                          className='h-20 w-20 rounded border object-cover'
                        />
                      ) : (
                        <div className='flex h-20 w-20 items-center justify-center rounded border bg-gray-100 p-1 text-center text-xs'>
                          {file.name}
                        </div>
                      )}
                      <div className='mt-1 max-w-20 truncate text-xs text-gray-600'>
                        {file.name}
                      </div>
                    </div>
                  ))
                ) : null
              ) : // Single file: value should be a File object
              controllerField.value &&
                typeof controllerField.value === 'object' &&
                'name' in controllerField.value &&
                'type' in controllerField.value ? (
                <div className='relative'>
                  {(controllerField.value as File).type &&
                  (controllerField.value as File).type.startsWith('image/') ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={URL.createObjectURL(controllerField.value as File)}
                      alt={(controllerField.value as File).name}
                      className='h-20 w-20 rounded border object-cover'
                    />
                  ) : (
                    <div className='flex h-20 w-20 items-center justify-center rounded border bg-gray-100 p-1 text-center text-xs'>
                      {(controllerField.value as File).name}
                    </div>
                  )}
                  <div className='mt-1 max-w-20 truncate text-xs text-gray-600'>
                    {(controllerField.value as File).name}
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </div>
      );

    case 'signature':
      return (
        <div className='space-y-2'>
          <div className='text-sm text-gray-500'>
            <SignaturePanel
              onSignatureChange={controllerField.onChange}
              onReset={() => controllerField.onChange('')}
            />
          </div>
        </div>
      );

    case 'radio':
      const radioOptions =
        field.options?.map((option: string | ISelectOption) =>
          typeof option === 'string'
            ? { value: option, label: option }
            : { value: option.value, label: option.label },
        ) || [];

      return (
        <div className='space-y-2'>
          {radioOptions.map((option: ISelectOption) => (
            <div key={option.value} className='flex items-center space-x-2'>
              <input
                type='radio'
                id={`${String(field.name)}-${option.value}`}
                name={String(field.name)}
                value={option.value}
                checked={controllerField.value === option.value}
                onChange={() => controllerField.onChange(option.value)}
                disabled={field.disabled}
                className='text-primary focus:ring-primary h-4 w-4 border-gray-300'
              />
              <label
                htmlFor={`${String(field.name)}-${option.value}`}
                className='text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
              >
                {option.label}
              </label>
            </div>
          ))}
        </div>
      );

    case 'toggle':
      return (
        <div className='flex items-center space-x-2'>
          <button
            type='button'
            role='switch'
            aria-checked={controllerField.value ?? false}
            onClick={() => controllerField.onChange(!controllerField.value)}
            disabled={field.disabled}
            className={cn(
              'focus:ring-primary relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none',
              controllerField.value ? 'bg-primary' : 'bg-gray-200',
              field.disabled && 'cursor-not-allowed opacity-50',
            )}
          >
            <span
              className={cn(
                'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                controllerField.value ? 'translate-x-6' : 'translate-x-1',
              )}
            />
          </button>
          <label className='text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
            {field.label}
          </label>
        </div>
      );

    case 'hidden':
      return <input {...controlledFieldProps} type='hidden' />;

    case 'email':
    case 'url':
    case 'tel':
    case 'search':
    case 'password':
    case 'text':
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
