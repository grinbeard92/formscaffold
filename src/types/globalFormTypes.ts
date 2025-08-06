import { Control, FieldPath, FieldValues } from 'react-hook-form';
export interface SelectOption {
  value: string;
  label: string;
  data?: Record<string, unknown>;
}

export interface FieldDefinition<T extends FieldValues> {
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
  options?: SelectOption[] | Array<string | { value: string; label: string }>;
  className?: string;
  disabled?: boolean;
  description?: string;
  default: string | number | boolean | Date | File[] | null;

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

export interface FormSectionDefinition<T extends FieldValues = FieldValues> {
  title: string;
  description?: string;
  gridCols?: '1' | '2' | '3' | '4';
  spacing?: 'sm' | 'md' | 'lg';
  fields: FieldDefinition<T>[];
}

export interface FormSectionTemplateProps<T extends FieldValues> {
  title: string;
  description?: string;
  control: Control<T>;
  fields: FieldDefinition<T>[];
  errors: Record<string, { message?: string }>;
  contentClassName?: string;
  gridCols?: '1' | '2' | '3' | '4';
  spacing?: 'sm' | 'md' | 'lg';
}

export interface PostgresConfig {
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

export interface FormConfiguration {
  title: string;
  description?: string;
  postgresTableName: string;
  submitButtonText?: string;
  saveDraftButtonText?: string;
  showDraftButton?: boolean;
  resetButtonText?: string;
  showResetButton?: boolean;
  sections: FormSectionDefinition[];
  styles?: {
    primaryColor?: string;
    secondaryColor?: string;
    borderRadius?: string;
    spacing?: string;
  };
}
