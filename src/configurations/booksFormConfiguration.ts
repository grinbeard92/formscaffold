import { FormConfiguration } from '@/types/globalFormTypes';

/* 
DEFINE YOUR FORM SCHEMA, ZOD VALIDATION PREFERENCES, AND POSTGRESQL TABLE CONFIGURATION HERE
This configuration will be used to generate the form, validation schema, and database table.
No other configuration is needed for the end-to-end tRPC + Next.js + PostgreSQL setup.
This is the single source of truth for both frontend and backend.
*/
export const demoFormConfiguration: FormConfiguration = {
  title: 'Reading List (Basic Form Example)',
  description: 'Simple form configuration for demonstration purposes',
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
            maxLength: 20,
          },
          pgConfig: {
            type: 'VARCHAR',
            length: 20,
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
          label: 'Date Read',
          name: 'date_read',
          type: 'date',
          required: false,
          zodConfig: {
            date: true,
          },
          pgConfig: {
            type: 'DATE',
          },
        },

        {
          label: 'Published Date',
          name: 'date_published',
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
