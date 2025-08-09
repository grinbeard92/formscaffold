import {
  EAcceptFileTypes,
  EFormFieldTypes,
  EPostgresTypes,
} from '@/types/globalFormTypes';

export const POSTGRES_TYPES_ARRAY = Array.from(Object.entries(EPostgresTypes));
export const FIELD_TYPES_ARRAY = Object.entries(EFormFieldTypes);
export const FILE_ACCEPT_TYPES_ARRAY = Array.from(
  Object.values(EAcceptFileTypes),
);
