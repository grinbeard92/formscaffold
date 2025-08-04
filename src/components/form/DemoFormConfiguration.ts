// Field type definitions for schema generation
export interface FieldDefinition {
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

export interface FormSectionDefinition {
  title: string;
  description?: string;
  gridCols?: '1' | '2' | '3' | '4';
  spacing?: 'sm' | 'md' | 'lg';
  fields: FieldDefinition[];
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
  // PostgreSQL configuration for database generation
  postgresConfig: PostgresConfig;
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
  };
}

/* 
DEFINE YOUR FORM SCHEMA, ZOD VALIDATION PREFERENCES, AND POSTGRESQL TABLE CONFIGURATION HERE
This configuration will be used to generate the form, validation schema, and database table.
No other configuration is needed for the end-to-end tRPC + Next.js + PostgreSQL setup.
This is the single source of truth for both frontend and backend.
*/
export const demoFormConfiguration: FormConfiguration = {
  title: 'Reading List (Basic Form Example)',
  description: 'Simple form configuration for demonstration purposes',
  
  // PostgreSQL Database Configuration
  postgresConfig: {
    host: '127.0.0.1',
    port: 7778,
    database: 'formscaffold_db',
    user: 'formscaffold_user',
    passwordFile: 'postgres_password.txt',
    containerName: 'formscaffold-postgres',
    image: 'postgres:17-alpine3.22',
    backupEnabled: true,
    backupInterval: '6h',
    backupRetentionDays: 7,
    memoryLimit: '1G',
    memoryReservation: '512M',
  },
  
  postgresTableName: 'books',
  submitButtonText: 'Create Book',
  resetButtonText: 'Reset Form',
  showResetButton: true,
  sections: [
    {
      title: 'My Reading List',
      description: 'Track your reading log',
      gridCols: '1',
      spacing: 'md',
      fields: [
        {
          label: 'ISBN',
          name: 'isbn',
          type: 'text',
          required: true,
          placeholder: 'Enter book ISBN',
          zodConfig: {
            minLength: 10,
            maxLength: 13,
            regex: /^(?:\d{9}[\dX]|\d{13})$/,
          },
          pgConfig: {
            type: 'VARCHAR',
            length: 13,
            unique: true,
            index: true,
          },
        },
        {
          label: 'Title',
          name: 'title',
          type: 'text',
          required: true,
          placeholder: 'Enter book title',
          zodConfig: {
            minLength: 1,
            maxLength: 255,
          },
          pgConfig: {
            type: 'VARCHAR',
            length: 255,
            index: true,
          },
        },
        {
          label: 'Author',
          name: 'author',
          type: 'text',
          required: true,
          placeholder: 'Enter author name',
          zodConfig: {
            minLength: 1,
            maxLength: 100,
          },
          pgConfig: {
            type: 'VARCHAR',
            length: 100,
            index: true,
          },
        },
        {
          label: 'Genre',
          name: 'genre',
          type: 'text',
          required: true,
          placeholder: 'Enter book genre',
          zodConfig: {
            minLength: 1,
            maxLength: 50,
          },
          pgConfig: {
            type: 'VARCHAR',
            length: 50,
          },
        },
        {
          label: 'Published Date',
          name: 'publishedDate',
          type: 'date',
          required: true,
          zodConfig: {
            date: true,
          },
          pgConfig: {
            type: 'DATE',
          },
        },
        {
          label: 'Notes',
          name: 'notes',
          type: 'textarea',
          required: false,
          zodConfig: {
            minLength: 0,
            maxLength: 1000,
          },
          pgConfig: {
            type: 'TEXT',
          },
        },
        {
          label: 'Rating',
          name: 'rating',
          type: 'number',
          required: false,
          placeholder: 'Rate the book (1-5)',
          zodConfig: {
            int: true,
            positive: true,
            min: 1,
            max: 5,
          },
          pgConfig: {
            type: 'INTEGER',
            default: 0,
            nullable: true,
            index: true,
          },
        },
        {
          label: 'Progress - Pages Read',
          name: 'progress',
          type: 'number',
          required: false,
          zodConfig: {
            int: true,
            positive: true,
            min: 0,
          },
          pgConfig: {
            type: 'INTEGER',
            default: 0,
            nullable: true,
            index: true,
          },
        },
        {
          label: 'Read',
          name: 'read',
          type: 'checkbox',
          required: false,
          pgConfig: {
            type: 'BOOLEAN',
            default: false,
          },
        },
      ],
    },
  ],
};
