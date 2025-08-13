import { Control, FieldPath, FieldValues } from 'react-hook-form';
export interface ISelectOption {
  value: string;
  label: string;
  data?: Record<string, unknown>;
}

export enum EPostgresTypes {
  VARCHAR = 'VARCHAR',
  TEXT = 'TEXT',
  INTEGER = 'INTEGER',
  BIGINT = 'BIGINT',
  DECIMAL = 'DECIMAL',
  NUMERIC = 'NUMERIC',
  REAL = 'REAL',
  DOUBLE_PRECISION = 'DOUBLE PRECISION',
  DATE = 'DATE',
  TIME = 'TIME',
  TIMESTAMP = 'TIMESTAMP',
  TIMESTAMP_WITH_TIME_ZONE = 'TIMESTAMP WITH TIME ZONE',
  BOOLEAN = 'BOOLEAN',
  UUID = 'UUID',
  BYTEA = 'BYTEA',
  JSON = 'JSON',
  JSONB = 'JSONB',
  ARRAY = 'ARRAY',
  INET = 'INET',
  CIDR = 'CIDR',
  MACADDR = 'MACADDR',
  XML = 'XML',
}

export enum EAcceptFileTypes {
  IMAGE = 'image/*',
  VIDEO = 'video/*',
  AUDIO = 'audio/*',
  TEXT = 'text/*',
  APPLICATION = 'application/*',
  PDF = '.pdf',
  DOC = '.doc,.docx',
  XLS = '.xls,.xlsx',
  PPT = '.ppt,.pptx',
  TXT = '.txt',
  CSV = '.csv',
  JSON = '.json',
  XML = '.xml',
  ZIP = '.zip,.rar,.7z',
  JPG = '.jpg,.jpeg,.png,.gif,.webp',
  MP4 = '.mp4,.avi,.mov,.wmv',
  MP3 = '.mp3,.wav,.ogg,.m4a',
  OTHER = 'string',
}

export enum EFormFieldTypes {
  TEXT = 'text',
  EMAIL = 'email',
  PASSWORD = 'password',
  NUMBER = 'number',
  DATE = 'date',
  TEXTAREA = 'textarea',
  SELECT = 'select',
  CHECKBOX = 'checkbox',
  FILE = 'file',
  RADIO = 'radio',
  TOGGLE = 'toggle',
  HIDDEN = 'hidden',
  COLOR = 'color',
  RANGE = 'range',
  TIME = 'time',
  DATETIME_LOCAL = 'datetime-local',
  MONTH = 'month',
  WEEK = 'week',
  URL = 'url',
  TEL = 'tel',
  SEARCH = 'search',
  SIGNATURE = 'signature',
}

export interface IFieldDefinition<T extends FieldValues> {
  label: string;
  name: FieldPath<T>;
  type: EFormFieldTypes;
  required?: boolean;
  placeholder?: string;
  step?: string;
  min?: string | number;
  max?: string | number;
  rows?: number;

  options?: ISelectOption[] | Array<string | { value: string; label: string }>;
  className?: string;
  disabled?: boolean;
  description?: string;
  default: string | number | boolean | Date | File[] | null;

  customErrorMessage?: string;

  accept?: EAcceptFileTypes | string;

  multiple?: boolean;
  zodConfig?: {
    url?: boolean;
    minLength?: number;
    maxLength?: number;
    email?: boolean;
    uuid?: boolean;
    int?: boolean;
    positive?: boolean;
    regex?: RegExp;
    date?: boolean;
    min?: number;
    max?: number;
    refine?: {
      check: (value: unknown) => boolean;
      message: string;
    };
  };
  pgConfig?: {
    type?: EPostgresTypes;
    length?: number;
    precision?: number;
    scale?: number;
    nullable?: boolean;
    unique?: boolean;
    index?: boolean;
    default?: string | number | boolean | null;
    arrayType?: string;
  };
}

export interface IFormSectionDefinition<T extends FieldValues = FieldValues> {
  title: string;
  description?: string;
  gridCols?: '1' | '2' | '3' | '4';
  spacing?: 'sm' | 'md' | 'lg';
  fields: IFieldDefinition<T>[];
}

export interface IFormSectionTemplateProps<T extends FieldValues> {
  title: string;
  description?: string;
  control: Control<T>;
  fields: IFieldDefinition<T>[];
  errors: Record<string, { message?: string }>;
  contentClassName?: string;
  gridCols?: '1' | '2' | '3' | '4';
  spacing?: 'sm' | 'md' | 'lg';
}

export interface IPostgresConfig {
  host?: string;
  port?: number;
  database: string;
  user: string;
  passwordFile?: string;
  containerName?: string;
  image?: string;
  backupEnabled?: boolean;
  backupInterval?: string;
  backupRetentionDays?: number;
  memoryLimit?: string;
  memoryReservation?: string;
}

export interface IFormConfiguration {
  title: string;
  description?: string;
  postgresTableName: string;
  submitButtonText?: string;
  saveDraftButtonText?: string;
  showDraftButton?: boolean;
  resetButtonText?: string;
  showResetButton?: boolean;
  sections: IFormSectionDefinition[];
  cssLightVars?: {
    primary: string;
    primaryForeground: string;
    secondary: string;
    secondaryForeground: string;
    borderRadius: string;
    spacing: string;
    buttonHeight: string;
    buttonBgColor: string;
    buttonTextColor: string;
    inputHeight: string;
    inputPadding: string;
  };
  cssDarkVars?: {
    primary: string;
    primaryForeground: string;
    secondary: string;
    secondaryForeground: string;
    borderRadius: string;
    spacing: string;
    buttonHeight: string;
    buttonBgColor: string;
    buttonTextColor: string;
    inputHeight: string;
    inputPadding: string;
  };
}
