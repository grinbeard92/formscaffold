import { Control, FieldPath, FieldValues } from 'react-hook-form';
export interface ISelectOption {
  value: string;
  label: string;
  data?: Record<string, unknown>;
}

export interface IFieldDefinition<T extends FieldValues> {
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
    | 'checkbox'
    | 'file'
    | 'radio'
    | 'toggle'
    | 'hidden'
    | 'color'
    | 'range'
    | 'time'
    | 'datetime-local'
    | 'month'
    | 'week'
    | 'url'
    | 'tel'
    | 'search'
    | 'signature';

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

  accept?:
    | 'image/*'
    | 'video/*'
    | 'audio/*'
    | 'text/*'
    | 'application/*'
    | '.pdf'
    | '.doc,.docx'
    | '.xls,.xlsx'
    | '.ppt,.pptx'
    | '.txt'
    | '.csv'
    | '.json'
    | '.xml'
    | '.zip,.rar,.7z'
    | '.jpg,.jpeg,.png,.gif,.webp'
    | '.mp4,.avi,.mov,.wmv'
    | '.mp3,.wav,.ogg,.m4a'
    | string;
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
    type?:
      | 'VARCHAR'
      | 'TEXT'
      | 'INTEGER'
      | 'BIGINT'
      | 'DECIMAL'
      | 'NUMERIC'
      | 'REAL'
      | 'DOUBLE PRECISION'
      | 'DATE'
      | 'TIME'
      | 'TIMESTAMP'
      | 'TIMESTAMP WITH TIME ZONE'
      | 'BOOLEAN'
      | 'UUID'
      | 'BYTEA'
      | 'JSON'
      | 'JSONB'
      | 'ARRAY'
      | 'INET'
      | 'CIDR'
      | 'MACADDR'
      | 'XML';
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
