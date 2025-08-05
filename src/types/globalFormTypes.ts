import { FieldPath, FieldValues } from 'react-hook-form';
import { SelectOption } from './formSectionTypes';

// Field type definitions for schema generation
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
    | 'checkbox';
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
  // Zod schema configuration
  zodConfig?: {
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
  // PostgreSQL column configuration
  pgConfig?: {
    type?:
      | 'VARCHAR'
      | 'TEXT'
      | 'INTEGER'
      | 'BIGINT'
      | 'DECIMAL'
      | 'DATE'
      | 'TIMESTAMP'
      | 'BOOLEAN'
      | 'UUID';
    length?: number;
    nullable?: boolean;
    unique?: boolean;
    index?: boolean;
    default?: string | number | boolean;
  };
}

export interface FormSectionDefinition<T extends FieldValues = FieldValues> {
  title: string;
  description?: string;
  gridCols?: '1' | '2' | '3' | '4';
  spacing?: 'sm' | 'md' | 'lg';
  fields: FieldDefinition<T>[];
}

export interface PostgresConfig {
  host?: string;
  port?: number;
  database: string;
  user: string;
  passwordFile?: string; // Path to password file for Docker secrets
  containerName?: string;
  image?: string;
  backupEnabled?: boolean;
  backupInterval?: string; // e.g., '6h', '24h'
  backupRetentionDays?: number;
  memoryLimit?: string; // e.g., '1G', '512M'
  memoryReservation?: string;
}

export interface FormConfiguration {
  title: string;
  description?: string;
  postgresTableName: string;
  submitButtonText?: string;
  resetButtonText?: string;
  showResetButton?: boolean;
  sections: FormSectionDefinition[];
  styles?: {
    primaryColor?: string;
    secondaryColor?: string;
    borderRadius?: string;
    spacing?: string;
    //Add other styles as desired
  };
}
