'use client';

import { Card } from '@/components/ui/card';
import { PlusIcon, TrashIcon, GearIcon } from '@radix-ui/react-icons';
import {
  IFormConfiguration,
  IFieldDefinition,
  IFormSectionDefinition,
  EAcceptFileTypes,
  EPostgresTypes,
} from '@/types/globalFormTypes';
import { FieldValues } from 'react-hook-form';
import {
  createNewField,
  createNewSection,
  isValidTableName,
} from '@/utils/form-builder-utils';
import {
  FIELD_TYPES_ARRAY,
  FILE_ACCEPT_TYPES_ARRAY,
  POSTGRES_TYPES_ARRAY,
} from '@/utils/field-type-options';

interface FormBuilderProps {
  config: IFormConfiguration;
  setConfig: React.Dispatch<React.SetStateAction<IFormConfiguration>>;
  expandedField: string | null;
  setExpandedField: React.Dispatch<React.SetStateAction<string | null>>;
}

export function FormBuilder({
  config,
  setConfig,
  expandedField,
  setExpandedField,
}: FormBuilderProps) {
  const isTableNameValid = isValidTableName(config.postgresTableName);

  const addSection = () => {
    const newSection = createNewSection();
    setConfig((prev) => ({
      ...prev,
      sections: [...prev.sections, newSection],
    }));
  };

  const addField = (sectionIndex: number) => {
    const newField = createNewField();
    setConfig((prev) => ({
      ...prev,
      sections: prev.sections.map((section, i) =>
        i === sectionIndex
          ? { ...section, fields: [...section.fields, newField] }
          : section,
      ),
    }));
  };

  const updateSection = (
    sectionIndex: number,
    updates: Partial<IFormSectionDefinition>,
  ) => {
    setConfig((prev) => ({
      ...prev,
      sections: prev.sections.map((section, i) =>
        i === sectionIndex ? { ...section, ...updates } : section,
      ),
    }));
  };

  const removeSection = (sectionIndex: number) => {
    setConfig((prev) => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== sectionIndex),
    }));
  };

  const updateField = (
    sectionIndex: number,
    fieldIndex: number,
    updates: Partial<IFieldDefinition<FieldValues>>,
  ) => {
    setConfig((prev) => ({
      ...prev,
      sections: prev.sections.map((section, i) =>
        i === sectionIndex
          ? {
              ...section,
              fields: section.fields.map((field, j) =>
                j === fieldIndex ? { ...field, ...updates } : field,
              ),
            }
          : section,
      ),
    }));
  };

  const removeField = (sectionIndex: number, fieldIndex: number) => {
    setConfig((prev) => ({
      ...prev,
      sections: prev.sections.map((section, i) =>
        i === sectionIndex
          ? {
              ...section,
              fields: section.fields.filter((_, j) => j !== fieldIndex),
            }
          : section,
      ),
    }));
  };

  return (
    <div className='grid grid-cols-1 gap-8 lg:grid-cols-2'>
      <div className='space-y-6'>
        {/* Basic Settings */}
        <Card.Root>
          <div className='p-6'>
            <h3 className='mb-4 text-lg font-semibold'>Form Settings</h3>
            <div className='space-y-4'>
              <div>
                <label className='text-muted-foreground text-sm font-medium'>
                  Form Title
                </label>
                <input
                  type='text'
                  value={config.title}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  className='mt-1 w-full rounded border p-2'
                  placeholder='Form Title'
                />
              </div>

              <div>
                <label className='text-muted-foreground text-sm font-medium'>
                  Description
                </label>
                <textarea
                  value={config.description || ''}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className='mt-1 w-full rounded border p-2'
                  placeholder='Form Description'
                  rows={2}
                />
              </div>

              <div>
                <label className='text-muted-foreground text-sm font-medium'>
                  Database Table Name
                </label>
                <input
                  type='text'
                  value={config.postgresTableName}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      postgresTableName: e.target.value,
                    }))
                  }
                  className={`mt-1 w-full rounded border p-2 ${
                    !isTableNameValid ? 'border-destructive' : ''
                  }`}
                  placeholder='table_name'
                />
                {!isTableNameValid && (
                  <div className='text-destructive mt-1 text-xs'>
                    Invalid table name. Use letters, numbers, and underscores
                    only.
                  </div>
                )}
              </div>

              <div className='grid grid-cols-2 gap-3'>
                <div>
                  <label className='text-muted-foreground text-sm font-medium'>
                    Submit Button Text
                  </label>
                  <input
                    type='text'
                    value={config.submitButtonText || ''}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        submitButtonText: e.target.value,
                      }))
                    }
                    className='mt-1 w-full rounded border p-2'
                    placeholder='Submit'
                  />
                </div>

                <div>
                  <label className='text-muted-foreground text-sm font-medium'>
                    Reset Button Text
                  </label>
                  <input
                    type='text'
                    value={config.resetButtonText || ''}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        resetButtonText: e.target.value,
                      }))
                    }
                    className='mt-1 w-full rounded border p-2'
                    placeholder='Reset'
                  />
                </div>
              </div>

              <div className='flex items-center gap-4'>
                <label className='flex items-center gap-2 text-sm'>
                  <input
                    type='checkbox'
                    checked={config.showResetButton !== false}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        showResetButton: e.target.checked,
                      }))
                    }
                    className='h-4 w-4'
                  />
                  <span>Show Reset Button</span>
                </label>

                <label className='flex items-center gap-2 text-sm'>
                  <input
                    type='checkbox'
                    checked={config.showDraftButton || false}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        showDraftButton: e.target.checked,
                      }))
                    }
                    className='h-4 w-4'
                  />
                  <span>Show Draft Button</span>
                </label>
              </div>
            </div>
          </div>
        </Card.Root>

        {/* Sections */}
        <div className='space-y-4'>
          <div className='flex items-center justify-between'>
            <h3 className='text-lg font-semibold'>Sections</h3>
            <button
              onClick={addSection}
              className='bg-primary text-primary-foreground rounded px-3 py-1 text-sm'
            >
              <PlusIcon className='mr-1 inline h-4 w-4' />
              Add Section
            </button>
          </div>

          {config.sections.map((section, sectionIndex) => (
            <Card.Root key={sectionIndex}>
              <div className='p-4'>
                <div className='mb-3 flex items-start justify-between gap-3'>
                  <div className='flex-1'>
                    <label className='text-accent mb-1 block text-sm font-medium'>
                      Section Title
                    </label>
                    <input
                      type='text'
                      value={section.title}
                      onChange={(e) =>
                        setConfig((prev) => ({
                          ...prev,
                          sections: prev.sections.map((s, i) =>
                            i === sectionIndex
                              ? { ...s, title: e.target.value }
                              : s,
                          ),
                        }))
                      }
                      className='w-full rounded border p-2 font-medium'
                      placeholder='Section Title'
                    />
                  </div>
                  {config.sections.length > 1 && (
                    <button
                      onClick={() => removeSection(sectionIndex)}
                      className='text-destructive hover:text-destructive/80 mt-6'
                      title='Remove Section'
                    >
                      <TrashIcon className='h-4 w-4' />
                    </button>
                  )}
                </div>

                <div className='mb-4 flex items-center justify-between'>
                  <div>
                    <label className='text-accent block text-sm font-medium'>
                      Fields ({section.fields.length})
                    </label>
                    <span className='text-muted-foreground text-xs'>
                      Add and configure form fields for this section
                    </span>
                  </div>
                  <button
                    onClick={() => addField(sectionIndex)}
                    className='bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded px-3 py-1 text-xs transition-colors'
                  >
                    <PlusIcon className='mr-1 inline h-3 w-3' />
                    Add Field
                  </button>
                </div>

                {section.fields.map((field, fieldIndex) => (
                  <div
                    key={fieldIndex}
                    className='bg-muted/50 mx-5 my-7 rounded border p-3'
                  >
                    <div className='mb-3 flex items-start justify-between gap-3'>
                      <div className='flex-1'>
                        <label className='text-accent mb-1 block text-xs font-medium'>
                          Field Label
                        </label>
                        <input
                          type='text'
                          value={field.label}
                          onChange={(e) =>
                            updateField(sectionIndex, fieldIndex, {
                              label: e.target.value,
                            })
                          }
                          className='w-full rounded border p-1 text-sm'
                          placeholder='Field Label'
                        />
                      </div>
                      <button
                        onClick={() => removeField(sectionIndex, fieldIndex)}
                        className='text-destructive hover:text-destructive/80 mt-5'
                        title='Remove Field'
                      >
                        <TrashIcon className='h-4 w-4' />
                      </button>
                    </div>

                    <div className='grid grid-cols-1 gap-3 text-xs md:grid-cols-2'>
                      <div>
                        <label className='text-accent mb-1 block text-xs font-medium'>
                          Field Name
                        </label>
                        <input
                          type='text'
                          value={field.name}
                          onChange={(e) =>
                            updateField(sectionIndex, fieldIndex, {
                              name: e.target.value,
                            })
                          }
                          className='w-full rounded border p-1'
                          placeholder='field_name'
                        />
                      </div>

                      <div>
                        <label className='text-accent mb-1 block text-xs font-medium'>
                          Field Type
                        </label>
                        <select
                          value={field.type}
                          onChange={(e) => {
                            const newType = e.target
                              .value as IFieldDefinition<FieldValues>['type'];
                            updateField(sectionIndex, fieldIndex, {
                              type: newType,
                              default:
                                newType === 'file'
                                  ? []
                                  : newType === 'checkbox' ||
                                      newType === 'toggle'
                                    ? false
                                    : newType === 'number'
                                      ? 0
                                      : '',
                            });
                          }}
                          className='w-full rounded border p-1'
                        >
                          {FIELD_TYPES_ARRAY.map((obj, i) => (
                            <option key={i} value={obj[1]}>
                              {obj[1]}
                            </option>
                          ))}
                        </select>
                      </div>

                      {field.type == 'file' && (
                        <div className='md:col-span-2'>
                          <label className='text-accent mb-1 block text-xs font-medium'>
                            Accepted File Types
                          </label>
                          <select
                            value={field.accept}
                            onChange={(e) => {
                              const newAccept = e.target
                                .value as IFieldDefinition<FieldValues>['accept'];
                              updateField(sectionIndex, fieldIndex, {
                                accept: newAccept,
                              });
                            }}
                            className='w-full rounded border p-1'
                          >
                            {FILE_ACCEPT_TYPES_ARRAY.map((obj, i) => (
                              <option key={i} value={obj}>
                                {obj}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      <div className='flex items-center'>
                        <label className='flex items-center gap-2 text-sm'>
                          <input
                            type='checkbox'
                            checked={field.required}
                            onChange={(e) =>
                              updateField(sectionIndex, fieldIndex, {
                                required: e.target.checked,
                              })
                            }
                            className='h-3 w-3'
                          />
                          <span className='text-accent font-medium'>
                            Required Field
                          </span>
                        </label>
                      </div>

                      {field.type !== 'file' && (
                        <div>
                          <label className='text-accent mb-1 block text-xs font-medium'>
                            Default Value
                          </label>
                          <input
                            type='text'
                            value={String(field.default || '')}
                            onChange={(e) => {
                              let value: string | number | boolean =
                                e.target.value;
                              if (field.type === 'number')
                                value = parseFloat(e.target.value) || 0;
                              if (
                                field.type === 'checkbox' ||
                                field.type === 'toggle'
                              )
                                value = e.target.value === 'true';
                              updateField(sectionIndex, fieldIndex, {
                                default: value,
                              });
                            }}
                            className='w-full rounded border p-1'
                            placeholder='Default form value'
                          />
                        </div>
                      )}
                    </div>

                    {/* Advanced Configuration Toggle */}
                    <button
                      onClick={() =>
                        setExpandedField(
                          expandedField === `${sectionIndex}-${fieldIndex}`
                            ? null
                            : `${sectionIndex}-${fieldIndex}`,
                        )
                      }
                      className='mt-2 text-xs'
                    >
                      {expandedField === `${sectionIndex}-${fieldIndex}`
                        ? '▼'
                        : '▶'}{' '}
                      Advanced Configuration
                    </button>

                    {/* Expandable Advanced Configuration */}
                    {expandedField === `${sectionIndex}-${fieldIndex}` && (
                      <div className='mt-3 space-y-3 border-t pt-3'>
                        {/* Zod Configuration */}
                        <div>
                          <h5 className='text-accent mb-2 text-xs font-medium'>
                            Zod Validation
                          </h5>
                          <div className='grid grid-cols-1 gap-3 text-xs md:grid-cols-2'>
                            {(field.type === 'text' ||
                              field.type === 'textarea' ||
                              field.type === 'email' ||
                              field.type === 'url') && (
                              <>
                                <div>
                                  <label className='text-accent mb-1 block text-xs font-medium'>
                                    Min Length
                                  </label>
                                  <input
                                    type='number'
                                    placeholder='Minimum characters'
                                    value={field.zodConfig?.minLength || ''}
                                    onChange={(e) =>
                                      updateField(sectionIndex, fieldIndex, {
                                        zodConfig: {
                                          ...field.zodConfig,
                                          minLength:
                                            parseInt(e.target.value) ||
                                            undefined,
                                        },
                                      })
                                    }
                                    className='w-full rounded border p-1'
                                  />
                                </div>
                                <div>
                                  <label className='text-accent mb-1 block text-xs font-medium'>
                                    Max Length
                                  </label>
                                  <input
                                    type='number'
                                    placeholder='Maximum characters'
                                    value={field.zodConfig?.maxLength || ''}
                                    onChange={(e) =>
                                      updateField(sectionIndex, fieldIndex, {
                                        zodConfig: {
                                          ...field.zodConfig,
                                          maxLength:
                                            parseInt(e.target.value) ||
                                            undefined,
                                        },
                                      })
                                    }
                                    className='w-full rounded border p-1'
                                  />
                                </div>
                              </>
                            )}
                            {field.type === 'number' && (
                              <>
                                <div>
                                  <label className='text-accent mb-1 block text-xs font-medium'>
                                    Min Value
                                  </label>
                                  <input
                                    type='number'
                                    placeholder='Minimum value'
                                    value={field.zodConfig?.min || ''}
                                    onChange={(e) =>
                                      updateField(sectionIndex, fieldIndex, {
                                        zodConfig: {
                                          ...field.zodConfig,
                                          min:
                                            parseFloat(e.target.value) ||
                                            undefined,
                                        },
                                      })
                                    }
                                    className='w-full rounded border p-1'
                                  />
                                </div>
                                <div>
                                  <label className='text-accent mb-1 block text-xs font-medium'>
                                    Max Value
                                  </label>
                                  <input
                                    type='number'
                                    placeholder='Maximum value'
                                    value={field.zodConfig?.max || ''}
                                    onChange={(e) =>
                                      updateField(sectionIndex, fieldIndex, {
                                        zodConfig: {
                                          ...field.zodConfig,
                                          max:
                                            parseFloat(e.target.value) ||
                                            undefined,
                                        },
                                      })
                                    }
                                    className='w-full rounded border p-1'
                                  />
                                </div>
                                <div className='flex items-center md:col-span-2'>
                                  <label className='flex items-center gap-2 text-sm'>
                                    <input
                                      type='checkbox'
                                      checked={field.zodConfig?.int || false}
                                      onChange={(e) =>
                                        updateField(sectionIndex, fieldIndex, {
                                          zodConfig: {
                                            ...field.zodConfig,
                                            int: e.target.checked,
                                          },
                                        })
                                      }
                                      className='h-3 w-3'
                                    />
                                    <span className='text-accent font-medium'>
                                      Integer only
                                    </span>
                                  </label>
                                </div>
                                <div className='flex items-center md:col-span-2'>
                                  <label className='flex items-center gap-2 text-sm'>
                                    <input
                                      type='checkbox'
                                      checked={
                                        field.zodConfig?.positive || false
                                      }
                                      onChange={(e) =>
                                        updateField(sectionIndex, fieldIndex, {
                                          zodConfig: {
                                            ...field.zodConfig,
                                            positive: e.target.checked,
                                          },
                                        })
                                      }
                                      className='h-3 w-3'
                                    />
                                    <span className='text-accent font-medium'>
                                      Positive numbers only
                                    </span>
                                  </label>
                                </div>
                              </>
                            )}
                            {field.type === 'email' && (
                              <div className='flex items-center md:col-span-2'>
                                <label className='flex items-center gap-2 text-sm'>
                                  <input
                                    type='checkbox'
                                    checked={field.zodConfig?.email || false}
                                    onChange={(e) =>
                                      updateField(sectionIndex, fieldIndex, {
                                        zodConfig: {
                                          ...field.zodConfig,
                                          email: e.target.checked,
                                        },
                                      })
                                    }
                                    className='h-3 w-3'
                                  />
                                  <span className='text-accent font-medium'>
                                    Email validation
                                  </span>
                                </label>
                              </div>
                            )}
                            {field.type === 'url' && (
                              <div className='flex items-center md:col-span-2'>
                                <label className='flex items-center gap-2 text-sm'>
                                  <input
                                    type='checkbox'
                                    checked={field.zodConfig?.url || false}
                                    onChange={(e) =>
                                      updateField(sectionIndex, fieldIndex, {
                                        zodConfig: {
                                          ...field.zodConfig,
                                          url: e.target.checked,
                                        },
                                      })
                                    }
                                    className='h-3 w-3'
                                  />
                                  <span className='text-accent font-medium'>
                                    URL validation
                                  </span>
                                </label>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* PostgreSQL Configuration */}
                        <div>
                          <h5 className='text-accent mb-2 text-xs font-medium'>
                            PostgreSQL Schema
                          </h5>
                          <div className='grid grid-cols-1 gap-3 text-xs md:grid-cols-2'>
                            <div className='flex items-center'>
                              <label className='flex items-center gap-2 text-sm'>
                                <input
                                  type='checkbox'
                                  checked={field.pgConfig?.nullable !== false}
                                  onChange={(e) =>
                                    updateField(sectionIndex, fieldIndex, {
                                      pgConfig: {
                                        ...field.pgConfig,
                                        nullable: e.target.checked,
                                      },
                                    })
                                  }
                                  className='h-3 w-3'
                                />
                                <span className='text-accent font-medium'>
                                  Nullable
                                </span>
                              </label>
                            </div>
                            <div className='flex items-center'>
                              <label className='flex items-center gap-2 text-sm'>
                                <input
                                  type='checkbox'
                                  checked={field.pgConfig?.unique || false}
                                  onChange={(e) =>
                                    updateField(sectionIndex, fieldIndex, {
                                      pgConfig: {
                                        ...field.pgConfig,
                                        unique: e.target.checked,
                                      },
                                    })
                                  }
                                  className='h-3 w-3'
                                />
                                <span className='text-accent font-medium'>
                                  Unique
                                </span>
                              </label>
                            </div>
                            <div className='flex items-center'>
                              <label className='flex items-center gap-2 text-sm'>
                                <input
                                  type='checkbox'
                                  checked={field.pgConfig?.index || false}
                                  onChange={(e) =>
                                    updateField(sectionIndex, fieldIndex, {
                                      pgConfig: {
                                        ...field.pgConfig,
                                        index: e.target.checked,
                                      },
                                    })
                                  }
                                  className='h-3 w-3'
                                />
                                <span className='text-accent font-medium'>
                                  Index
                                </span>
                              </label>
                            </div>
                            <div>
                              <label className='text-accent mb-1 block text-xs font-medium'>
                                PostgreSQL Type
                              </label>
                              <select
                                value={field.pgConfig?.type || 'VARCHAR'}
                                onChange={(e) =>
                                  updateField(sectionIndex, fieldIndex, {
                                    pgConfig: {
                                      ...field.pgConfig,
                                      type: e.target.value as EPostgresTypes,
                                    },
                                  })
                                }
                                className='w-full rounded border p-1'
                              >
                                {POSTGRES_TYPES_ARRAY.map((obj, i) => (
                                  <option key={i} value={obj[1]}>
                                    {obj[1]}
                                  </option>
                                ))}
                              </select>
                            </div>
                            {(field.type === 'text' ||
                              field.type === 'textarea') && (
                              <div>
                                <label className='text-accent mb-1 block text-xs font-medium'>
                                  Length (VARCHAR)
                                </label>
                                <input
                                  type='number'
                                  placeholder='Character limit'
                                  value={field.pgConfig?.length || ''}
                                  onChange={(e) =>
                                    updateField(sectionIndex, fieldIndex, {
                                      pgConfig: {
                                        ...field.pgConfig,
                                        length:
                                          parseInt(e.target.value) || undefined,
                                      },
                                    })
                                  }
                                  className='w-full rounded border p-1'
                                />
                              </div>
                            )}
                            {field.type === 'number' && (
                              <>
                                <div>
                                  <label className='text-accent mb-1 block text-xs font-medium'>
                                    Precision
                                  </label>
                                  <input
                                    type='number'
                                    placeholder='Total digits'
                                    value={field.pgConfig?.precision || ''}
                                    onChange={(e) =>
                                      updateField(sectionIndex, fieldIndex, {
                                        pgConfig: {
                                          ...field.pgConfig,
                                          precision:
                                            parseInt(e.target.value) ||
                                            undefined,
                                        },
                                      })
                                    }
                                    className='w-full rounded border p-1'
                                  />
                                </div>
                                <div>
                                  <label className='text-accent mb-1 block text-xs font-medium'>
                                    Scale
                                  </label>
                                  <input
                                    type='number'
                                    placeholder='Decimal places'
                                    value={field.pgConfig?.scale || ''}
                                    onChange={(e) =>
                                      updateField(sectionIndex, fieldIndex, {
                                        pgConfig: {
                                          ...field.pgConfig,
                                          scale:
                                            parseInt(e.target.value) ||
                                            undefined,
                                        },
                                      })
                                    }
                                    className='w-full rounded border p-1'
                                  />
                                </div>
                              </>
                            )}
                            <div className='md:col-span-2'>
                              <label className='text-accent mb-1 block text-xs font-medium'>
                                Default PostgreSQL Value
                              </label>
                              <input
                                type='text'
                                placeholder='Default database value'
                                value={
                                  field.pgConfig?.default?.toString() || ''
                                }
                                onChange={(e) =>
                                  updateField(sectionIndex, fieldIndex, {
                                    pgConfig: {
                                      ...field.pgConfig,
                                      default: e.target.value || undefined,
                                    },
                                  })
                                }
                                className='w-full rounded border p-1'
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card.Root>
          ))}
        </div>
      </div>

      {/* Quick Preview */}
      <div>
        <Card.Root>
          <div className='p-6'>
            <h3 className='mb-4 text-lg font-semibold'>Form Tree</h3>
            <div className='space-y-4'>
              <div>
                <h4 className='font-medium'>{config.title}</h4>
                <p className='text-muted-foreground text-sm'>
                  {config.description}
                </p>
              </div>
              {config.sections.map((section, i) => (
                <div key={i} className='border-primary border-l-2 pl-3'>
                  <h5 className='text-sm font-medium'>{section.title}</h5>
                  <div className='text-muted-foreground text-xs'>
                    {section.fields.length} fields:{' '}
                    {section.fields.map((f) => f.label).join(', ')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card.Root>
      </div>
    </div>
  );
}
