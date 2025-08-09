import {
  IFieldDefinition,
  IFormSectionDefinition,
} from '@/types/globalFormTypes';
import { FieldValues } from 'react-hook-form';
import { EPostgresTypes as pgT } from '@/types/globalFormTypes';
import { EFormFieldTypes as fieldT } from '@/types/globalFormTypes';

// Extract field types from the type definition - this will automatically include any new types
type FieldType = IFieldDefinition<FieldValues>['type'];

// Extract PostgreSQL types from the type definition
type PostgresType = NonNullable<
  IFieldDefinition<FieldValues>['pgConfig']
>['type'];

// Field type configurations with metadata
export interface FieldTypeConfig {
  value: FieldType;
  label: string;
  description: string;
  defaultValue: string | number | boolean | null | File[];
  hasOptions?: boolean;
  fileAccept?: string;
  supportsMin?: boolean;
  supportsMax?: boolean;
  supportsStep?: boolean;
  supportsRows?: boolean;
  supportsPlaceholder?: boolean;
  supportsMultiple?: boolean;
  defaultPgType?: PostgresType;
}

// This object will automatically stay in sync with the type definitions
export const FIELD_TYPE_CONFIGS: FieldTypeConfig[] = [
  {
    value: fieldT.TEXT,
    label: 'Text',
    description: 'Single-line text input',
    defaultValue: '',
    supportsPlaceholder: true,
    defaultPgType: pgT.VARCHAR,
  },
  {
    value: fieldT.EMAIL,
    label: 'Email',
    description: 'Email address input with validation',
    defaultValue: '',
    supportsPlaceholder: true,
    defaultPgType: pgT.VARCHAR,
  },
  {
    value: fieldT.PASSWORD,
    label: 'Password',
    description: 'Password input field',
    defaultValue: '',
    supportsPlaceholder: true,
    defaultPgType: pgT.VARCHAR,
  },
  {
    value: fieldT.NUMBER,
    label: 'Number',
    description: 'Numeric input',
    defaultValue: 0,
    supportsMin: true,
    supportsMax: true,
    supportsStep: true,
    supportsPlaceholder: true,
    defaultPgType: pgT.INTEGER,
  },
  {
    value: fieldT.RANGE,
    label: 'Range Slider',
    description: 'Slider for numeric range selection',
    defaultValue: 0,
    supportsMin: true,
    supportsMax: true,
    supportsStep: true,
    defaultPgType: pgT.INTEGER,
  },
  {
    value: fieldT.DATE,
    label: 'Date',
    description: 'Date picker',
    defaultValue: '',
    defaultPgType: pgT.DATE,
  },
  {
    value: fieldT.TIME,
    label: 'Time',
    description: 'Time picker',
    defaultValue: '',
    defaultPgType: pgT.TIME,
  },
  {
    value: fieldT.DATETIME_LOCAL,
    label: 'Date & Time',
    description: 'Date and time picker',
    defaultValue: '',
    defaultPgType: pgT.TIMESTAMP,
  },
  {
    value: fieldT.MONTH,
    label: 'Month',
    description: 'Month and year picker',
    defaultValue: '',
    defaultPgType: pgT.VARCHAR,
  },
  {
    value: 'week',
    label: 'Week',
    description: 'Week picker',
    defaultValue: '',
    defaultPgType: 'VARCHAR',
  },
  {
    value: 'url',
    label: 'URL',
    description: 'URL input with validation',
    defaultValue: '',
    supportsPlaceholder: true,
    defaultPgType: 'VARCHAR',
  },
  {
    value: 'tel',
    label: 'Phone',
    description: 'Telephone number input',
    defaultValue: '',
    supportsPlaceholder: true,
    defaultPgType: 'VARCHAR',
  },
  {
    value: 'search',
    label: 'Search',
    description: 'Search input field',
    defaultValue: '',
    supportsPlaceholder: true,
    defaultPgType: 'VARCHAR',
  },
  {
    value: 'textarea',
    label: 'Textarea',
    description: 'Multi-line text input',
    defaultValue: '',
    supportsRows: true,
    supportsPlaceholder: true,
    defaultPgType: 'TEXT',
  },
  {
    value: 'select',
    label: 'Select Dropdown',
    description: 'Dropdown selection',
    defaultValue: '',
    hasOptions: true,
    defaultPgType: 'VARCHAR',
  },
  {
    value: 'radio',
    label: 'Radio Buttons',
    description: 'Single selection from radio buttons',
    defaultValue: '',
    hasOptions: true,
    defaultPgType: 'VARCHAR',
  },
  {
    value: 'checkbox',
    label: 'Checkbox',
    description: 'Boolean checkbox',
    defaultValue: false,
    defaultPgType: 'BOOLEAN',
  },
  {
    value: 'toggle',
    label: 'Toggle Switch',
    description: 'Boolean toggle switch',
    defaultValue: false,
    defaultPgType: 'BOOLEAN',
  },
  {
    value: 'file',
    label: 'File Upload',
    description: 'File upload input',
    defaultValue: [],
    supportsMultiple: true,
    defaultPgType: 'TEXT',
  },
  {
    value: 'color',
    label: 'Color Picker',
    description: 'Color selection input',
    defaultValue: '#000000',
    defaultPgType: 'VARCHAR',
  },
  {
    value: 'hidden',
    label: 'Hidden Field',
    description: 'Hidden input field',
    defaultValue: '',
    defaultPgType: 'VARCHAR',
  },
  {
    value: 'signature',
    label: 'Digital Signature',
    description: 'Digital signature pad',
    defaultValue: '',
    defaultPgType: 'TEXT',
  },
];

// PostgreSQL type configurations
export interface PostgresTypeConfig {
  value: PostgresType;
  label: string;
  description: string;
  hasLength?: boolean;
  hasPrecision?: boolean;
  hasScale?: boolean;
  defaultLength?: number;
}

export const POSTGRES_TYPE_CONFIGS: PostgresTypeConfig[] = [
  {
    value: 'VARCHAR',
    label: 'VARCHAR',
    description: 'Variable-length character string',
    hasLength: true,
    defaultLength: 255,
  },
  {
    value: 'TEXT',
    label: 'TEXT',
    description: 'Unlimited length text',
  },
  {
    value: 'INTEGER',
    label: 'INTEGER',
    description: '32-bit integer',
  },
  {
    value: 'BIGINT',
    label: 'BIGINT',
    description: '64-bit integer',
  },
  {
    value: 'DECIMAL',
    label: 'DECIMAL',
    description: 'Exact numeric with precision and scale',
    hasPrecision: true,
    hasScale: true,
  },
  {
    value: 'NUMERIC',
    label: 'NUMERIC',
    description: 'Exact numeric with precision and scale',
    hasPrecision: true,
    hasScale: true,
  },
  {
    value: 'REAL',
    label: 'REAL',
    description: '32-bit floating point',
  },
  {
    value: 'DOUBLE PRECISION',
    label: 'DOUBLE PRECISION',
    description: '64-bit floating point',
  },
  {
    value: 'DATE',
    label: 'DATE',
    description: 'Date (year, month, day)',
  },
  {
    value: 'TIME',
    label: 'TIME',
    description: 'Time of day',
  },
  {
    value: 'TIMESTAMP',
    label: 'TIMESTAMP',
    description: 'Date and time',
  },
  {
    value: 'TIMESTAMP WITH TIME ZONE',
    label: 'TIMESTAMP WITH TIME ZONE',
    description: 'Date and time with timezone',
  },
  {
    value: 'BOOLEAN',
    label: 'BOOLEAN',
    description: 'True/false value',
  },
  {
    value: 'UUID',
    label: 'UUID',
    description: 'Universally unique identifier',
  },
  {
    value: 'BYTEA',
    label: 'BYTEA',
    description: 'Binary data',
  },
  {
    value: 'JSON',
    label: 'JSON',
    description: 'JSON data',
  },
  {
    value: 'JSONB',
    label: 'JSONB',
    description: 'Binary JSON data',
  },
  {
    value: 'ARRAY',
    label: 'ARRAY',
    description: 'Array of values',
  },
  {
    value: 'INET',
    label: 'INET',
    description: 'IPv4 or IPv6 network address',
  },
  {
    value: 'CIDR',
    label: 'CIDR',
    description: 'IPv4 or IPv6 network specification',
  },
  {
    value: 'MACADDR',
    label: 'MACADDR',
    description: 'MAC address',
  },
  {
    value: 'XML',
    label: 'XML',
    description: 'XML data',
  },
];

// Grid column options
export const GRID_COLUMN_OPTIONS: Array<{
  value: '1' | '2' | '3' | '4';
  label: string;
}> = [
  { value: '1', label: '1 Column' },
  { value: '2', label: '2 Columns' },
  { value: '3', label: '3 Columns' },
  { value: '4', label: '4 Columns' },
];

// Spacing options
export const SPACING_OPTIONS: Array<{
  value: 'sm' | 'md' | 'lg';
  label: string;
}> = [
  { value: 'sm', label: 'Small' },
  { value: 'md', label: 'Medium' },
  { value: 'lg', label: 'Large' },
];

// File accept types from the type definition
export const FILE_ACCEPT_OPTIONS = [
  { value: 'image/*', label: 'All Images' },
  { value: 'video/*', label: 'All Videos' },
  { value: 'audio/*', label: 'All Audio' },
  { value: 'text/*', label: 'All Text Files' },
  { value: 'application/*', label: 'All Applications' },
  { value: '.pdf', label: 'PDF Files' },
  { value: '.doc,.docx', label: 'Word Documents' },
  { value: '.xls,.xlsx', label: 'Excel Files' },
  { value: '.ppt,.pptx', label: 'PowerPoint Files' },
  { value: '.txt', label: 'Text Files' },
  { value: '.csv', label: 'CSV Files' },
  { value: '.json', label: 'JSON Files' },
  { value: '.xml', label: 'XML Files' },
  { value: '.zip,.rar,.7z', label: 'Archive Files' },
  { value: '.jpg,.jpeg,.png,.gif,.webp', label: 'Common Images' },
  { value: '.mp4,.avi,.mov,.wmv', label: 'Common Videos' },
  { value: '.mp3,.wav,.ogg,.m4a', label: 'Common Audio' },
];

// Utility functions
export function getFieldTypeConfig(
  type: FieldType,
): FieldTypeConfig | undefined {
  return FIELD_TYPE_CONFIGS.find((config) => config.value === type);
}

export function getPostgresTypeConfig(
  type: PostgresType,
): PostgresTypeConfig | undefined {
  return POSTGRES_TYPE_CONFIGS.find((config) => config.value === type);
}

export function getDefaultFieldConfig(
  type: FieldType,
): Partial<IFieldDefinition<FieldValues>> {
  const config = getFieldTypeConfig(type);
  if (!config) return {};

  return {
    type,
    default: config.defaultValue,
    pgConfig: config.defaultPgType ? { type: config.defaultPgType } : undefined,
  };
}

export function createNewField(name?: string): IFieldDefinition<FieldValues> {
  return {
    label: 'New Field',
    name: name || `field_${Date.now()}`,
    type: 'text',
    required: false,
    default: '',
    pgConfig: { type: 'VARCHAR', length: 255 },
  };
}

export function createNewSection(): IFormSectionDefinition {
  return {
    title: 'New Section',
    description: '',
    gridCols: '2',
    spacing: 'md',
    fields: [],
  };
}

// Validation functions
export function isValidFieldName(name: string): boolean {
  // PostgreSQL column names: start with letter/underscore, contain only letters/numbers/underscores
  return /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name);
}

export function isValidTableName(name: string): boolean {
  // Same rules as field names
  return isValidFieldName(name);
}

export function getFieldTypeLabel(type: FieldType): string {
  const config = getFieldTypeConfig(type);
  return config?.label || type;
}

export function getPostgresTypeLabel(type: PostgresType): string {
  const config = getPostgresTypeConfig(type);
  return config?.label || type || 'Unknown';
}
