'use client';

import { Card } from '@/components/ui/card';
import { PlusIcon, TrashIcon, GearIcon } from '@radix-ui/react-icons';
import {
  IFormConfiguration,
  IFieldDefinition,
  IFormSectionDefinition,
} from '@/types/globalFormTypes';
import { FieldValues } from 'react-hook-form';
import { FieldEditor } from './FieldEditor';
import {
  createNewField,
  createNewSection,
  GRID_COLUMN_OPTIONS,
  SPACING_OPTIONS,
  isValidTableName,
} from '@/utils/form-builder-utils';

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
    <div className='grid gap-8 lg:grid-cols-2'>
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
                  className='mb-2 w-full rounded border p-2 font-medium'
                  placeholder='Section Title'
                />

                <div className='mb-4 flex items-center justify-between'>
                  <span className='text-sm font-medium'>
                    Fields ({section.fields.length})
                  </span>
                  <button
                    onClick={() => addField(sectionIndex)}
                    className='bg-secondary text-secondary-foreground rounded px-2 py-1 text-xs'
                  >
                    <PlusIcon className='mr-1 inline h-3 w-3' />
                    Add Field
                  </button>
                </div>

                {section.fields.map((field, fieldIndex) => (
                  <div
                    key={fieldIndex}
                    className='bg-muted/50 mb-2 rounded border p-3'
                  >
                    <div className='mb-2 flex items-center justify-between'>
                      <input
                        type='text'
                        value={field.label}
                        onChange={(e) =>
                          updateField(sectionIndex, fieldIndex, {
                            label: e.target.value,
                          })
                        }
                        className='border-none bg-transparent text-sm font-medium outline-none'
                        placeholder='Field Label'
                      />
                      <button
                        onClick={() => removeField(sectionIndex, fieldIndex)}
                        className='text-destructive hover:text-destructive/80'
                      >
                        <TrashIcon className='h-3 w-3' />
                      </button>
                    </div>

                    <div className='grid grid-cols-2 gap-2 text-xs'>
                      <input
                        type='text'
                        value={field.name}
                        onChange={(e) =>
                          updateField(sectionIndex, fieldIndex, {
                            name: e.target.value,
                          })
                        }
                        className='rounded border p-1'
                        placeholder='field_name'
                      />
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
                                : newType === 'checkbox' || newType === 'toggle'
                                  ? false
                                  : newType === 'number'
                                    ? 0
                                    : '',
                          });
                        }}
                        className='rounded border p-1'
                      >
                        <option value='text'>Text</option>
                        <option value='email'>Email</option>
                        <option value='number'>Number</option>
                        <option value='textarea'>Textarea</option>
                        <option value='select'>Select</option>
                        <option value='checkbox'>Checkbox</option>
                        <option value='file'>File</option>
                        <option value='date'>Date</option>
                        <option value='url'>URL</option>
                        <option value='tel'>Phone</option>
                      </select>
                      <label className='flex items-center gap-1'>
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
                        <span>Required</span>
                      </label>
                      {field.type !== 'file' && (
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
                          className='rounded border p-1'
                          placeholder='Default form value'
                        />
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
                          <h5 className='mb-2 text-xs font-medium'>
                            Zod Validation
                          </h5>
                          <div className='grid grid-cols-2 gap-2 text-xs'>
                            {(field.type === 'text' ||
                              field.type === 'textarea' ||
                              field.type === 'email' ||
                              field.type === 'url') && (
                              <>
                                <input
                                  type='number'
                                  placeholder='Min length'
                                  value={field.zodConfig?.minLength || ''}
                                  onChange={(e) =>
                                    updateField(sectionIndex, fieldIndex, {
                                      zodConfig: {
                                        ...field.zodConfig,
                                        minLength:
                                          parseInt(e.target.value) || undefined,
                                      },
                                    })
                                  }
                                  className='rounded border p-1'
                                />
                                <input
                                  type='number'
                                  placeholder='Max length'
                                  value={field.zodConfig?.maxLength || ''}
                                  onChange={(e) =>
                                    updateField(sectionIndex, fieldIndex, {
                                      zodConfig: {
                                        ...field.zodConfig,
                                        maxLength:
                                          parseInt(e.target.value) || undefined,
                                      },
                                    })
                                  }
                                  className='rounded border p-1'
                                />
                              </>
                            )}
                            {field.type === 'number' && (
                              <>
                                <input
                                  type='number'
                                  placeholder='Min value'
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
                                  className='rounded border p-1'
                                />
                                <input
                                  type='number'
                                  placeholder='Max value'
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
                                  className='rounded border p-1'
                                />
                                <label className='col-span-2 flex items-center gap-1'>
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
                                  <span>Integer only</span>
                                </label>
                                <label className='col-span-2 flex items-center gap-1'>
                                  <input
                                    type='checkbox'
                                    checked={field.zodConfig?.positive || false}
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
                                  <span>Positive numbers only</span>
                                </label>
                              </>
                            )}
                            {field.type === 'email' && (
                              <label className='col-span-2 flex items-center gap-1'>
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
                                <span>Email validation</span>
                              </label>
                            )}
                            {field.type === 'url' && (
                              <label className='col-span-2 flex items-center gap-1'>
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
                                <span>URL validation</span>
                              </label>
                            )}
                          </div>
                        </div>

                        {/* PostgreSQL Configuration */}
                        <div>
                          <h5 className='mb-2 text-xs font-medium'>
                            PostgreSQL Schema
                          </h5>
                          <div className='grid grid-cols-2 gap-2 text-xs'>
                            <label className='flex items-center gap-1'>
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
                              <span>Nullable</span>
                            </label>
                            <label className='flex items-center gap-1'>
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
                              <span>Unique</span>
                            </label>
                            <label className='flex items-center gap-1'>
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
                              <span>Index</span>
                            </label>
                            <select
                              value={field.pgConfig?.type || 'VARCHAR'}
                              onChange={(e) =>
                                updateField(sectionIndex, fieldIndex, {
                                  pgConfig: {
                                    ...field.pgConfig,
                                    type: e.target.value as
                                      | 'VARCHAR'
                                      | 'TEXT'
                                      | 'INTEGER'
                                      | 'BIGINT'
                                      | 'DECIMAL'
                                      | 'BOOLEAN'
                                      | 'DATE'
                                      | 'TIMESTAMP'
                                      | 'UUID'
                                      | 'JSON'
                                      | 'JSONB',
                                  },
                                })
                              }
                              className='rounded border p-1'
                            >
                              <option value='VARCHAR'>VARCHAR</option>
                              <option value='TEXT'>TEXT</option>
                              <option value='INTEGER'>INTEGER</option>
                              <option value='BIGINT'>BIGINT</option>
                              <option value='DECIMAL'>DECIMAL</option>
                              <option value='BOOLEAN'>BOOLEAN</option>
                              <option value='DATE'>DATE</option>
                              <option value='TIMESTAMP'>TIMESTAMP</option>
                              <option value='UUID'>UUID</option>
                              <option value='JSON'>JSON</option>
                              <option value='JSONB'>JSONB</option>
                            </select>
                            {(field.type === 'text' ||
                              field.type === 'textarea') && (
                              <input
                                type='number'
                                placeholder='Length (VARCHAR)'
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
                                className='rounded border p-1'
                              />
                            )}
                            {field.type === 'number' && (
                              <>
                                <input
                                  type='number'
                                  placeholder='Precision'
                                  value={field.pgConfig?.precision || ''}
                                  onChange={(e) =>
                                    updateField(sectionIndex, fieldIndex, {
                                      pgConfig: {
                                        ...field.pgConfig,
                                        precision:
                                          parseInt(e.target.value) || undefined,
                                      },
                                    })
                                  }
                                  className='rounded border p-1'
                                />
                                <input
                                  type='number'
                                  placeholder='Scale'
                                  value={field.pgConfig?.scale || ''}
                                  onChange={(e) =>
                                    updateField(sectionIndex, fieldIndex, {
                                      pgConfig: {
                                        ...field.pgConfig,
                                        scale:
                                          parseInt(e.target.value) || undefined,
                                      },
                                    })
                                  }
                                  className='rounded border p-1'
                                />
                              </>
                            )}
                            <input
                              type='text'
                              placeholder='Default postgres value'
                              value={field.pgConfig?.default?.toString() || ''}
                              onChange={(e) =>
                                updateField(sectionIndex, fieldIndex, {
                                  pgConfig: {
                                    ...field.pgConfig,
                                    default: e.target.value || undefined,
                                  },
                                })
                              }
                              className='col-span-2 rounded border p-1'
                            />
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
            <h3 className='mb-4 text-lg font-semibold'>Quick Preview</h3>
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
