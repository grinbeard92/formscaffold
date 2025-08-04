import { z } from 'zod';

/**
 * Client-side type definitions for form components
 * These types are safe to expose to the client and don't contain server-side configurations
 */

// Client-side field definition (sanitized from server-side configs)
export interface ClientFieldDefinition {
  label: string;
  name: string;
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
  options?: Array<string | { value: string; label: string }>;
  className?: string;
  disabled?: boolean;
  description?: string;
}

// Client-side section definition
export interface ClientSectionDefinition {
  title: string;
  description?: string;
  gridCols?: '1' | '2' | '3' | '4';
  spacing?: 'sm' | 'md' | 'lg';
  fields: ClientFieldDefinition[];
}

// Client-side form configuration (no server configs like DB schema, Zod config, etc.)
export interface ClientFormConfiguration {
  title: string;
  description?: string;
  submitButtonText?: string;
  resetButtonText?: string;
  showResetButton?: boolean;
  sections: ClientSectionDefinition[];
  styles?: {
    primaryColor?: string;
    secondaryColor?: string;
    borderRadius?: string;
    spacing?: string;
  };
}

// Props for the ClientForm component
export interface ClientFormProps {
  title: string;
  description?: string;
  sections: ClientSectionDefinition[];
  schema: z.ZodSchema;
  submitButtonText?: string;
  resetButtonText?: string;
  showResetButton?: boolean;
  onSubmit?: (data: Record<string, unknown>) => void | Promise<void>;
  defaultValues?: Partial<Record<string, unknown>>;
  className?: string;
  isLoading?: boolean;
  autoSaveToDatabase?: boolean;
  routerName?: string; // Which tRPC router to use for submission
}

// Server-to-Client data transformation types
export interface FormDataForClient {
  configuration: ClientFormConfiguration;
  schema: z.ZodSchema;
  initialData?: Record<string, unknown>;
}

// Utility type to extract client-safe data from server configuration
export type ServerToClientTransform<T> = Omit<
  T,
  'zodConfig' | 'pgConfig' | 'postgresTableName'
>;

export default ClientFormProps;
