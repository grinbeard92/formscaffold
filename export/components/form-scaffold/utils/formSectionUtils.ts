import { FieldValues } from 'react-hook-form';
import { IFieldDefinition, ISelectOption } from '@/types/globalFormTypes';

export const createField = <T extends FieldValues>(
  config: IFieldDefinition<T>,
): IFieldDefinition<T> => config;

export const createSelectOptions = (
  items: string[] | { value: string; label: string }[],
): ISelectOption[] => {
  return items.map((item) =>
    typeof item === 'string' ? { value: item, label: item } : item,
  );
};

export const getFieldRequirements = <T extends FieldValues>(
  field: IFieldDefinition<T>,
): string[] => {
  const requirements: string[] = [];

  if (field.required) {
    requirements.push('Required');
  }

  if (field.zodConfig?.minLength) {
    requirements.push(`Min ${field.zodConfig.minLength} characters`);
  }

  if (field.zodConfig?.maxLength) {
    requirements.push(
      `Max ${field.zodConfig.maxLength} ${field.type == 'file' ? 'attachments' : 'characters'}`,
    );
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
