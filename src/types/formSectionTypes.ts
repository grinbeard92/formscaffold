import { Control, FieldPath, FieldValues } from 'react-hook-form';

// Types for field configuration
export interface SelectOption {
  value: string;
  label: string;
}

export interface FormFieldConfig<T extends FieldValues> {
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
  placeholder?: string;
  required?: boolean;
  step?: string; // For number inputs
  min?: string | number; // For number/date inputs
  max?: string | number; // For number/date inputs
  rows?: number; // For textarea
  options?: SelectOption[] | Array<string | { value: string; label: string }>;
  className?: string; // Custom field styling
  disabled?: boolean;
  description?: string; // Helper text below field
}

export interface FormSectionTemplateProps<T extends FieldValues> {
  title: string;
  description?: string;
  control: Control<T>;
  fields: FormFieldConfig<T>[];
  errors: Record<string, { message?: string }>;
  contentClassName?: string;
  gridCols?: '1' | '2' | '3' | '4'; // Grid layout
  spacing?: 'sm' | 'md' | 'lg'; // Spacing between fields
}
