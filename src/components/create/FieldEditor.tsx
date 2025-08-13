'use client';

import React from 'react';
import { IFieldDefinition } from '@/types/globalFormTypes';
import { FieldValues } from 'react-hook-form';
import {
  FIELD_TYPE_CONFIGS,
  POSTGRES_TYPE_CONFIGS,
  FILE_ACCEPT_OPTIONS,
  getFieldTypeConfig,
  getDefaultFieldConfig,
  isValidFieldName,
} from '@/utils/form-builder-utils';
import {
  TrashIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@radix-ui/react-icons';

interface FieldEditorProps {
  field: IFieldDefinition<FieldValues>;
  fieldIndex: number;
  sectionIndex: number;
  expanded: boolean;
  onUpdate: (updates: Partial<IFieldDefinition<FieldValues>>) => void;
  onRemove: () => void;
  onToggleExpanded: () => void;
}

export function FieldEditor({
  field,
  fieldIndex,
  sectionIndex,
  expanded,
  onUpdate,
  onRemove,
  onToggleExpanded,
}: FieldEditorProps) {
  const fieldTypeConfig = getFieldTypeConfig(field.type);
  const isFieldNameValid = isValidFieldName(field.name);

  const handleFieldTypeChange = (newType: string) => {
    const typeConfig = getFieldTypeConfig(newType as any);
    if (typeConfig) {
      const defaultConfig = getDefaultFieldConfig(newType as any);
      onUpdate({
        type: newType as IFieldDefinition<FieldValues>['type'],
        default: defaultConfig.default,
        pgConfig: defaultConfig.pgConfig,

        options: typeConfig.hasOptions ? field.options || [] : undefined,
        accept: field.type === 'file' ? field.accept : undefined,
        multiple: field.type === 'file' ? field.multiple : undefined,
        rows: field.type === 'textarea' ? field.rows : undefined,
        min: typeConfig.supportsMin ? field.min : undefined,
        max: typeConfig.supportsMax ? field.max : undefined,
        step: typeConfig.supportsStep ? field.step : undefined,
        placeholder: typeConfig.supportsPlaceholder
          ? field.placeholder
          : undefined,
      });
    }
  };

  const handleDefaultValueChange = (value: string) => {
    let parsedValue: string | number | boolean | null | File[] = value;

    if (field.type === 'number' || field.type === 'range') {
      parsedValue = parseFloat(value) || 0;
    } else if (field.type === 'checkbox' || field.type === 'toggle') {
      parsedValue = value === 'true';
    } else if (field.type === 'file') {
      parsedValue = [];
    }

    onUpdate({ default: parsedValue });
  };

  const updateOption = (
    optionIndex: number,
    newValue: string,
    newLabel?: string,
  ) => {
    if (!field.options) return;

    const updatedOptions = [...field.options];
    if (typeof updatedOptions[optionIndex] === 'string') {
      updatedOptions[optionIndex] = newValue;
    } else {
      updatedOptions[optionIndex] = {
        ...(updatedOptions[optionIndex] as any),
        value: newValue,
        label: newLabel || newValue,
      };
    }
    onUpdate({ options: updatedOptions });
  };

  const addOption = () => {
    const newOptions = [...(field.options || [])];
    newOptions.push({
      value: `option_${newOptions.length + 1}`,
      label: `Option ${newOptions.length + 1}`,
    });
    onUpdate({ options: newOptions });
  };

  const removeOption = (optionIndex: number) => {
    if (!field.options) return;
    const updatedOptions = field.options.filter((_, i) => i !== optionIndex);
    onUpdate({ options: updatedOptions });
  };

  return (
    <div className='bg-muted/50 mb-3 rounded-lg border p-4'>
      {/* Field Header */}
      <div className='mb-3 flex items-center justify-between'>
        <div className='flex-1'>
          <input
            type='text'
            value={field.label}
            onChange={(e) => onUpdate({ label: e.target.value })}
            className='w-full border-none bg-transparent text-sm font-semibold outline-none'
            placeholder='Field Label'
          />
          <div className='text-muted-foreground mt-1 text-xs'>
            Type: {fieldTypeConfig?.label || field.type}
          </div>
        </div>
        <div className='flex items-center gap-2'>
          <button
            onClick={onToggleExpanded}
            className='text-muted-foreground hover:text-foreground p-1'
            title={expanded ? 'Collapse' : 'Expand'}
          >
            {expanded ? (
              <ChevronUpIcon className='h-4 w-4' />
            ) : (
              <ChevronDownIcon className='h-4 w-4' />
            )}
          </button>
          <button
            onClick={onRemove}
            className='text-destructive hover:text-destructive/80 p-1'
            title='Remove field'
          >
            <TrashIcon className='h-4 w-4' />
          </button>
        </div>
      </div>

      {/* Basic Properties */}
      <div className='mb-3 grid grid-cols-2 gap-3'>
        <div>
          <label className='text-muted-foreground text-xs font-medium'>
            Field Name
          </label>
          <input
            type='text'
            value={field.name}
            onChange={(e) => onUpdate({ name: e.target.value })}
            className={`w-full rounded border px-2 py-1 text-xs ${
              !isFieldNameValid ? 'border-destructive' : ''
            }`}
            placeholder='field_name'
          />
          {!isFieldNameValid && (
            <div className='text-destructive mt-1 text-xs'>
              Invalid field name. Use letters, numbers, and underscores only.
            </div>
          )}
        </div>

        <div>
          <label className='text-muted-foreground text-xs font-medium'>
            Field Type
          </label>
          <select
            value={field.type}
            onChange={(e) => handleFieldTypeChange(e.target.value)}
            className='w-full rounded border px-2 py-1 text-xs'
          >
            {FIELD_TYPE_CONFIGS.map((config) => (
              <option key={config.value} value={config.value}>
                {config.label}
              </option>
            ))}
          </select>
        </div>

        <div className='flex items-center gap-2'>
          <label className='flex items-center gap-1 text-xs'>
            <input
              type='checkbox'
              checked={field.required || false}
              onChange={(e) => onUpdate({ required: e.target.checked })}
              className='h-3 w-3'
            />
            <span>Required</span>
          </label>
        </div>

        {field.type !== 'file' && field.type !== 'hidden' && (
          <div>
            <label className='text-muted-foreground text-xs font-medium'>
              Default Value
            </label>
            <input
              type={
                field.type === 'number' || field.type === 'range'
                  ? 'number'
                  : 'text'
              }
              value={String(field.default || '')}
              onChange={(e) => handleDefaultValueChange(e.target.value)}
              className='w-full rounded border px-2 py-1 text-xs'
              placeholder='Default value'
            />
          </div>
        )}
      </div>

      {/* Expanded Configuration */}
      {expanded && (
        <div className='border-border/50 space-y-4 border-t pt-3'>
          {/* Type-specific properties */}
          {fieldTypeConfig?.supportsPlaceholder && (
            <div>
              <label className='text-muted-foreground text-xs font-medium'>
                Placeholder
              </label>
              <input
                type='text'
                value={field.placeholder || ''}
                onChange={(e) => onUpdate({ placeholder: e.target.value })}
                className='w-full rounded border px-2 py-1 text-xs'
                placeholder='Placeholder text'
              />
            </div>
          )}

          {fieldTypeConfig?.supportsRows && (
            <div>
              <label className='text-muted-foreground text-xs font-medium'>
                Rows
              </label>
              <input
                type='number'
                min='1'
                max='20'
                value={field.rows || 3}
                onChange={(e) =>
                  onUpdate({ rows: parseInt(e.target.value) || 3 })
                }
                className='w-full rounded border px-2 py-1 text-xs'
              />
            </div>
          )}

          {(fieldTypeConfig?.supportsMin || fieldTypeConfig?.supportsMax) && (
            <div className='grid grid-cols-2 gap-3'>
              {fieldTypeConfig?.supportsMin && (
                <div>
                  <label className='text-muted-foreground text-xs font-medium'>
                    Min Value
                  </label>
                  <input
                    type='number'
                    value={field.min || ''}
                    onChange={(e) =>
                      onUpdate({
                        min: e.target.value
                          ? parseFloat(e.target.value)
                          : undefined,
                      })
                    }
                    className='w-full rounded border px-2 py-1 text-xs'
                  />
                </div>
              )}
              {fieldTypeConfig?.supportsMax && (
                <div>
                  <label className='text-muted-foreground text-xs font-medium'>
                    Max Value
                  </label>
                  <input
                    type='number'
                    value={field.max || ''}
                    onChange={(e) =>
                      onUpdate({
                        max: e.target.value
                          ? parseFloat(e.target.value)
                          : undefined,
                      })
                    }
                    className='w-full rounded border px-2 py-1 text-xs'
                  />
                </div>
              )}
            </div>
          )}

          {fieldTypeConfig?.supportsStep && (
            <div>
              <label className='text-muted-foreground text-xs font-medium'>
                Step
              </label>
              <input
                type='number'
                value={field.step || ''}
                onChange={(e) => onUpdate({ step: e.target.value })}
                className='w-full rounded border px-2 py-1 text-xs'
                placeholder='0.1'
              />
            </div>
          )}

          {/* File-specific properties */}
          {field.type === 'file' && (
            <>
              <div>
                <label className='text-muted-foreground text-xs font-medium'>
                  Accept Types
                </label>
                <select
                  value={field.accept || ''}
                  onChange={(e) => onUpdate({ accept: e.target.value as any })}
                  className='w-full rounded border px-2 py-1 text-xs'
                >
                  <option value=''>Any file type</option>
                  {FILE_ACCEPT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className='flex items-center gap-1'>
                <input
                  type='checkbox'
                  checked={field.multiple || false}
                  onChange={(e) => onUpdate({ multiple: e.target.checked })}
                  className='h-3 w-3'
                />
                <label className='text-xs'>Allow multiple files</label>
              </div>
            </>
          )}

          {/* Options for select/radio fields */}
          {fieldTypeConfig?.hasOptions && (
            <div>
              <div className='mb-2 flex items-center justify-between'>
                <label className='text-muted-foreground text-xs font-medium'>
                  Options
                </label>
                <button
                  onClick={addOption}
                  className='text-primary hover:text-primary/80 text-xs'
                >
                  + Add Option
                </button>
              </div>
              <div className='space-y-2'>
                {(field.options || []).map((option, optionIndex) => (
                  <div key={optionIndex} className='flex gap-2'>
                    <input
                      type='text'
                      value={typeof option === 'string' ? option : option.value}
                      onChange={(e) =>
                        updateOption(optionIndex, e.target.value)
                      }
                      className='flex-1 rounded border px-2 py-1 text-xs'
                      placeholder='Value'
                    />
                    {typeof option !== 'string' && (
                      <input
                        type='text'
                        value={option.label}
                        onChange={(e) =>
                          updateOption(
                            optionIndex,
                            option.value,
                            e.target.value,
                          )
                        }
                        className='flex-1 rounded border px-2 py-1 text-xs'
                        placeholder='Label'
                      />
                    )}
                    <button
                      onClick={() => removeOption(optionIndex)}
                      className='text-destructive hover:text-destructive/80 px-2'
                      title='Remove option'
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          <div>
            <label className='text-muted-foreground text-xs font-medium'>
              Help Text
            </label>
            <input
              type='text'
              value={field.description || ''}
              onChange={(e) => onUpdate({ description: e.target.value })}
              className='w-full rounded border px-2 py-1 text-xs'
              placeholder='Optional help text for users'
            />
          </div>

          {/* PostgreSQL Configuration */}
          <div className='space-y-3'>
            <div className='text-muted-foreground border-border/50 border-b pb-1 text-xs font-medium'>
              PostgreSQL Configuration
            </div>

            <div className='grid grid-cols-2 gap-3'>
              <div>
                <label className='text-muted-foreground text-xs font-medium'>
                  Data Type
                </label>
                <select
                  value={field.pgConfig?.type || ''}
                  onChange={(e) =>
                    onUpdate({
                      pgConfig: {
                        ...field.pgConfig,
                        type: e.target.value as any,
                      },
                    })
                  }
                  className='w-full rounded border px-2 py-1 text-xs'
                >
                  {POSTGRES_TYPE_CONFIGS.map((config) => (
                    <option key={config.value} value={config.value}>
                      {config.label}
                    </option>
                  ))}
                </select>
              </div>

              {field.pgConfig?.type === 'VARCHAR' && (
                <div>
                  <label className='text-muted-foreground text-xs font-medium'>
                    Length
                  </label>
                  <input
                    type='number'
                    min='1'
                    value={field.pgConfig?.length || 255}
                    onChange={(e) =>
                      onUpdate({
                        pgConfig: {
                          ...field.pgConfig,
                          length: parseInt(e.target.value) || 255,
                        },
                      })
                    }
                    className='w-full rounded border px-2 py-1 text-xs'
                  />
                </div>
              )}
            </div>

            <div className='flex flex-wrap gap-3 text-xs'>
              <label className='flex items-center gap-1'>
                <input
                  type='checkbox'
                  checked={field.pgConfig?.nullable !== false}
                  onChange={(e) =>
                    onUpdate({
                      pgConfig: {
                        ...field.pgConfig,
                        nullable: e.target.checked,
                      },
                    })
                  }
                  className='h-3 w-3'
                />
                <span>Nullable</span>
              </label>
              <label className='flex items-center gap-1'>
                <input
                  type='checkbox'
                  checked={field.pgConfig?.unique || false}
                  onChange={(e) =>
                    onUpdate({
                      pgConfig: {
                        ...field.pgConfig,
                        unique: e.target.checked,
                      },
                    })
                  }
                  className='h-3 w-3'
                />
                <span>Unique</span>
              </label>
              <label className='flex items-center gap-1'>
                <input
                  type='checkbox'
                  checked={field.pgConfig?.index || false}
                  onChange={(e) =>
                    onUpdate({
                      pgConfig: {
                        ...field.pgConfig,
                        index: e.target.checked,
                      },
                    })
                  }
                  className='h-3 w-3'
                />
                <span>Index</span>
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
