import { Control, FieldPath, FieldValues } from 'react-hook-form';

// Select option type for dropdowns and radio buttons
export interface SelectOption {
  value: string;
  label: string;
}

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
    | 'search';

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
  // File input specific properties
  accept?:
    | 'image/*' // All image types
    | 'video/*' // All video types
    | 'audio/*' // All audio types
    | 'text/*' // All text types
    | 'application/*' // All application types
    | '.pdf' // PDF files
    | '.doc,.docx' // Word documents
    | '.xls,.xlsx' // Excel files
    | '.ppt,.pptx' // PowerPoint files
    | '.txt' // Text files
    | '.csv' // CSV files
    | '.json' // JSON files
    | '.xml' // XML files
    | '.zip,.rar,.7z' // Archive files
    | '.jpg,.jpeg,.png,.gif,.webp' // Common image formats
    | '.mp4,.avi,.mov,.wmv' // Common video formats
    | '.mp3,.wav,.ogg,.m4a' // Common audio formats
    | string; // Custom accept string for specific needs
  multiple?: boolean; // Allow multiple file selection
  // Zod schema configuration
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
  // PostgreSQL column configuration
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
    precision?: number; // For NUMERIC/DECIMAL
    scale?: number; // For NUMERIC/DECIMAL
    nullable?: boolean;
    unique?: boolean;
    index?: boolean;
    default?: string | number | boolean | null;
    arrayType?: string; // For ARRAY types, specify the base type
  };
}

export interface FormSectionDefinition<T extends FieldValues = FieldValues> {
  title: string;
  description?: string;
  gridCols?: '1' | '2' | '3' | '4';
  spacing?: 'sm' | 'md' | 'lg';
  fields: FieldDefinition<T>[];
}

// Props interface for FormSectionTemplate component
export interface FormSectionTemplateProps<T extends FieldValues> {
  title: string;
  description?: string;
  control: Control<T>;
  fields: FieldDefinition<T>[];
  errors: Record<string, { message?: string }>;
  contentClassName?: string;
  gridCols?: '1' | '2' | '3' | '4'; // Grid layout
  spacing?: 'sm' | 'md' | 'lg'; // Spacing between fields
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
