import { ControllerRenderProps, FieldPath, FieldValues } from 'react-hook-form';
import { FormFieldConfig, SelectOption } from '../../../types/formSectionTypes';
import { FieldDefinition } from '@/types/globalFormTypes';

// Helper function to create field configurations with type safety
export const createField = <T extends FieldValues>(
  config: FormFieldConfig<T>,
): FormFieldConfig<T> => config;

// Helper function to create select options from simple strings
export const createSelectOptions = (
  items: string[] | { value: string; label: string }[],
): SelectOption[] => {
  return items.map((item) =>
    typeof item === 'string' ? { value: item, label: item } : item,
  );
};

// Helper function to generate field requirements text
export const getFieldRequirements = <T extends FieldValues>(
  field: FieldDefinition<T>,
): string[] => {
  const requirements: string[] = [];

  if (field.required) {
    requirements.push('Required');
  }

  if (field.zodConfig?.minLength) {
    requirements.push(`Min ${field.zodConfig.minLength} characters`);
  }

  if (field.zodConfig?.maxLength) {
    requirements.push(`Max ${field.zodConfig.maxLength} characters`);
  }

  if (field.zodConfig?.min !== undefined) {
    requirements.push(`Min value: ${field.zodConfig.min}`);
  }

  if (field.zodConfig?.max !== undefined) {
    requirements.push(`Max value: ${field.zodConfig.max}`);
  }

  if (field.type === 'email') {
    requirements.push('Valid email format');
  }

  return requirements;
};
