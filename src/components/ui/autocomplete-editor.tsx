'use client';

import React, { useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { editor } from 'monaco-editor';

interface AutocompleteEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: string | number;
  language?: string;
  theme?: 'vs-dark' | 'light';
  className?: string;
}

export function AutocompleteEditor({
  value,
  onChange,
  placeholder = 'Enter your configuration...',
  height = 400,
  language = 'json',
  theme = 'vs-dark',
  className,
}: AutocompleteEditorProps) {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  function handleEditorDidMount(
    editor: editor.IStandaloneCodeEditor,
    monaco: typeof import('monaco-editor'),
  ) {
    editorRef.current = editor;

    if (language === 'json') {
      const formConfigurationSchema = {
        type: 'object',
        properties: {
          title: {
            type: 'string',
            description: 'The title of the form',
          },
          description: {
            type: 'string',
            description: 'Optional description of the form',
          },
          postgresTableName: {
            type: 'string',
            description: 'Name of the PostgreSQL table to store form data',
          },
          submitButtonText: {
            type: 'string',
            description: 'Text for the submit button',
            default: 'Submit',
          },
          saveDraftButtonText: {
            type: 'string',
            description: 'Text for the save draft button',
            default: 'Save Draft',
          },
          showDraftButton: {
            type: 'boolean',
            description: 'Whether to show the save draft button',
            default: false,
          },
          resetButtonText: {
            type: 'string',
            description: 'Text for the reset button',
            default: 'Reset',
          },
          showResetButton: {
            type: 'boolean',
            description: 'Whether to show the reset button',
            default: true,
          },
          sections: {
            type: 'array',
            description: 'Array of form sections',
            items: {
              type: 'object',
              properties: {
                title: {
                  type: 'string',
                  description: 'Title of the section',
                },
                description: {
                  type: 'string',
                  description: 'Optional description of the section',
                },
                gridCols: {
                  type: 'string',
                  enum: ['1', '2', '3', '4'],
                  description: 'Number of grid columns for the section',
                  default: '1',
                },
                spacing: {
                  type: 'string',
                  enum: ['sm', 'md', 'lg'],
                  description: 'Spacing between fields',
                  default: 'md',
                },
                fields: {
                  type: 'array',
                  description: 'Array of field definitions',
                  items: {
                    type: 'object',
                    properties: {
                      label: {
                        type: 'string',
                        description: 'Label for the field',
                      },
                      name: {
                        type: 'string',
                        description:
                          'Name attribute for the field (used as key in form data)',
                      },
                      type: {
                        type: 'string',
                        enum: [
                          'text',
                          'email',
                          'password',
                          'number',
                          'date',
                          'textarea',
                          'select',
                          'checkbox',
                          'file',
                          'radio',
                          'toggle',
                          'hidden',
                          'color',
                          'range',
                          'time',
                          'datetime-local',
                          'month',
                          'week',
                          'url',
                          'tel',
                          'search',
                          'signature',
                        ],
                        description: 'Type of input field',
                      },
                      required: {
                        type: 'boolean',
                        description: 'Whether the field is required',
                        default: false,
                      },
                      placeholder: {
                        type: 'string',
                        description: 'Placeholder text for the field',
                      },
                      step: {
                        type: 'string',
                        description: 'Step value for number/range inputs',
                      },
                      min: {
                        oneOf: [{ type: 'string' }, { type: 'number' }],
                        description:
                          'Minimum value for number/range/date inputs',
                      },
                      max: {
                        oneOf: [{ type: 'string' }, { type: 'number' }],
                        description:
                          'Maximum value for number/range/date inputs',
                      },
                      rows: {
                        type: 'number',
                        description: 'Number of rows for textarea',
                      },
                      options: {
                        type: 'array',
                        description: 'Options for select/radio fields',
                        items: {
                          oneOf: [
                            { type: 'string' },
                            {
                              type: 'object',
                              properties: {
                                value: { type: 'string' },
                                label: { type: 'string' },
                                data: { type: 'object' },
                              },
                              required: ['value', 'label'],
                            },
                          ],
                        },
                      },
                      className: {
                        type: 'string',
                        description: 'Additional CSS classes for the field',
                      },
                      disabled: {
                        type: 'boolean',
                        description: 'Whether the field is disabled',
                        default: false,
                      },
                      description: {
                        type: 'string',
                        description: 'Help text for the field',
                      },
                      default: {
                        description: 'Default value for the field',
                      },
                      customErrorMessage: {
                        type: 'string',
                        description: 'Custom error message for validation',
                      },
                      accept: {
                        type: 'string',
                        enum: [
                          'image/*',
                          'video/*',
                          'audio/*',
                          'text/*',
                          'application/*',
                          '.pdf',
                          '.doc,.docx',
                          '.xls,.xlsx',
                          '.ppt,.pptx',
                          '.txt',
                          '.csv',
                          '.json',
                          '.xml',
                          '.zip,.rar,.7z',
                          '.jpg,.jpeg,.png,.gif,.webp',
                          '.mp4,.avi,.mov,.wmv',
                          '.mp3,.wav,.ogg,.m4a',
                        ],
                        description: 'Accepted file types for file inputs',
                      },
                      multiple: {
                        type: 'boolean',
                        description: 'Whether to allow multiple file selection',
                        default: false,
                      },
                      pgConfig: {
                        type: 'object',
                        description: 'PostgreSQL configuration for the field',
                        properties: {
                          type: {
                            type: 'string',
                            enum: [
                              'VARCHAR',
                              'TEXT',
                              'INTEGER',
                              'BIGINT',
                              'DECIMAL',
                              'NUMERIC',
                              'REAL',
                              'DOUBLE PRECISION',
                              'DATE',
                              'TIME',
                              'TIMESTAMP',
                              'TIMESTAMP WITH TIME ZONE',
                              'BOOLEAN',
                              'UUID',
                              'BYTEA',
                              'JSON',
                              'JSONB',
                              'ARRAY',
                              'INET',
                              'CIDR',
                              'MACADDR',
                              'XML',
                            ],
                            description: 'PostgreSQL data type',
                          },
                          length: {
                            type: 'number',
                            description: 'Length for VARCHAR type',
                          },
                          precision: {
                            type: 'number',
                            description: 'Precision for DECIMAL/NUMERIC',
                          },
                          scale: {
                            type: 'number',
                            description: 'Scale for DECIMAL/NUMERIC',
                          },
                          nullable: {
                            type: 'boolean',
                            description: 'Whether the column can be null',
                            default: true,
                          },
                          unique: {
                            type: 'boolean',
                            description: 'Whether the column should be unique',
                            default: false,
                          },
                          index: {
                            type: 'boolean',
                            description: 'Whether to create an index',
                            default: false,
                          },
                          default: {
                            description: 'Default value for the column',
                          },
                          arrayType: {
                            type: 'string',
                            description: 'Element type for ARRAY columns',
                          },
                        },
                      },
                    },
                    required: ['label', 'name', 'type', 'default'],
                  },
                },
              },
              required: ['title', 'fields'],
            },
          },
        },
        required: ['title', 'postgresTableName', 'sections'],
      };

      monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
        validate: true,
        schemas: [
          {
            uri: 'http://formscaffold.io/form-configuration.json',
            fileMatch: ['*'],
            schema: formConfigurationSchema,
          },
        ],
      });
    }

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Space, () => {
      editor.trigger('keyboard', 'editor.action.triggerSuggest', {});
    });

    editor.updateOptions({
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      automaticLayout: true,
      tabSize: 2,
      insertSpaces: true,
      wordWrap: 'on',
      lineNumbers: 'on',
      folding: true,
      foldingStrategy: 'indentation',
      bracketPairColorization: { enabled: true },
      suggest: {
        showWords: false,
        showKeywords: false,
      },
    });

    if (!value || value.trim() === '') {
      const placeholderContentWidget = {
        getId: () => 'placeholder-widget',
        getDomNode: () => {
          const node = document.createElement('div');
          node.textContent = placeholder;
          node.style.color = '#6b7280';
          node.style.fontStyle = 'italic';
          node.style.pointerEvents = 'none';
          node.style.userSelect = 'none';
          return node;
        },
        getPosition: () => ({
          position: { lineNumber: 1, column: 1 },
          preference: [monaco.editor.ContentWidgetPositionPreference.EXACT],
        }),
      };

      editor.addContentWidget(placeholderContentWidget);

      const disposable = editor.onDidChangeModelContent(() => {
        if (editor.getValue().trim() !== '') {
          editor.removeContentWidget(placeholderContentWidget);
          disposable.dispose();
        }
      });
    }
  }

  function handleEditorChange(value: string | undefined) {
    onChange(value || '');
  }

  return (
    <div className={className}>
      <Editor
        height={height}
        defaultLanguage={language}
        theme={theme}
        value={value}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        options={{
          automaticLayout: true,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          wordWrap: 'on',
          lineNumbers: 'on',
          folding: true,
          tabSize: 2,
          insertSpaces: true,
        }}
      />
    </div>
  );
}
