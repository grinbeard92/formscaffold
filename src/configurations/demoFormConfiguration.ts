import { FormConfiguration } from '@/types/globalFormTypes';

/* 
DEFINE YOUR FORM SCHEMA, ZOD VALIDATION PREFERENCES, AND POSTGRESQL TABLE CONFIGURATION HERE
This configuration will be used to generate the form, validation schema, and database table.
No other configuration is needed for the end-to-end tRPC + Next.js + PostgreSQL setup.
This is the single source of truth for both frontend and backend.
*/
export const demoFormConfiguration: FormConfiguration = {
  title: 'Comprehensive Form Demo',
  description:
    'Demonstration of all supported field types and PostgreSQL configurations',
  postgresTableName: 'demo',
  submitButtonText: 'Submit Demo Form',
  resetButtonText: 'Reset All Fields',
  showResetButton: true,
  sections: [
    {
      title: 'Text Input Fields',
      description: 'Various text input types with different validations',
      gridCols: '2',
      spacing: 'md',
      fields: [
        {
          label: 'Full Name',
          name: 'full_name',
          type: 'text',
          required: true,
          placeholder: 'Enter your full name',
          zodConfig: {
            minLength: 2,
            maxLength: 100,
          },
          pgConfig: {
            type: 'VARCHAR',
            length: 100,
            index: true,
          },
        },
        {
          label: 'Email Address',
          name: 'email',
          type: 'email',
          required: true,
          placeholder: 'your.email@example.com',
          zodConfig: {
            email: true,
          },
          pgConfig: {
            type: 'VARCHAR',
            length: 255,
            unique: true,
            index: true,
          },
        },
        {
          label: 'Website URL',
          name: 'website',
          type: 'url',
          required: false,
          placeholder: 'https://yourwebsite.com',
          zodConfig: {
            minLength: 5,
            maxLength: 500,
          },
          pgConfig: {
            type: 'VARCHAR',
            length: 500,
          },
        },
        {
          label: 'Phone Number',
          name: 'phone',
          type: 'tel',
          required: false,
          placeholder: '+1-555-123-4567',
          pgConfig: {
            type: 'VARCHAR',
            length: 20,
          },
        },
        {
          label: 'Search Keywords',
          name: 'keywords',
          type: 'search',
          required: false,
          placeholder: 'Enter search terms...',
          pgConfig: {
            type: 'TEXT',
          },
        },
        {
          label: 'Secret Code',
          name: 'secret_code',
          type: 'password',
          required: false,
          placeholder: 'Enter password',
          zodConfig: {
            minLength: 8,
            maxLength: 50,
          },
          pgConfig: {
            type: 'VARCHAR',
            length: 255, // Encrypted storage
          },
        },
      ],
    },
    {
      title: 'Numeric & Range Inputs',
      description: 'Number fields, ranges, and numeric validations',
      gridCols: '2',
      spacing: 'md',
      fields: [
        {
          label: 'Age',
          name: 'age',
          type: 'number',
          required: true,
          placeholder: 'Enter your age',
          zodConfig: {
            int: true,
            positive: true,
            min: 13,
            max: 120,
          },
          pgConfig: {
            type: 'INTEGER',
            index: true,
          },
        },
        {
          label: 'Salary Range',
          name: 'salary',
          type: 'number',
          required: false,
          placeholder: '50000.00',
          zodConfig: {
            positive: true,
            min: 0,
            max: 1000000,
          },
          pgConfig: {
            type: 'DECIMAL',
            precision: 10,
            scale: 2,
          },
        },
        {
          label: 'Experience Level (1-10)',
          name: 'experience_level',
          type: 'range',
          required: false,
          zodConfig: {
            int: true,
            min: 1,
            max: 10,
          },
          pgConfig: {
            type: 'INTEGER',
            default: 5,
          },
        },
        {
          label: 'Satisfaction Rating',
          name: 'satisfaction',
          type: 'range',
          required: false,
          zodConfig: {
            int: true,
            min: 0,
            max: 100,
          },
          pgConfig: {
            type: 'INTEGER',
            default: 50,
          },
        },
      ],
    },
    {
      title: 'Date & Time Fields',
      description: 'Various date and time input types',
      gridCols: '2',
      spacing: 'md',
      fields: [
        {
          label: 'Birth Date',
          name: 'birth_date',
          type: 'date',
          required: false,
          zodConfig: {
            date: true,
          },
          pgConfig: {
            type: 'DATE',
            index: true,
          },
        },
        {
          label: 'Appointment Time',
          name: 'appointment_time',
          type: 'time',
          required: false,
          pgConfig: {
            type: 'TIME',
          },
        },
        {
          label: 'Event Date & Time',
          name: 'event_datetime',
          type: 'datetime-local',
          required: false,
          pgConfig: {
            type: 'TIMESTAMP',
          },
        },
        {
          label: 'Target Month',
          name: 'target_month',
          type: 'month',
          required: false,
          pgConfig: {
            type: 'VARCHAR',
            length: 7, // YYYY-MM format
          },
        },
        {
          label: 'Target Week',
          name: 'target_week',
          type: 'week',
          required: false,
          pgConfig: {
            type: 'VARCHAR',
            length: 8, // YYYY-W## format
          },
        },
      ],
    },
    {
      title: 'Selection & Choice Fields',
      description: 'Dropdowns, radio buttons, and checkboxes',
      gridCols: '2',
      spacing: 'md',
      fields: [
        {
          label: 'Preferred Language',
          name: 'language',
          type: 'select',
          required: true,
          options: [
            { label: 'English', value: 'en' },
            { label: 'Spanish', value: 'es' },
            { label: 'French', value: 'fr' },
            { label: 'German', value: 'de' },
            { label: 'Japanese', value: 'ja' },
          ],
          pgConfig: {
            type: 'VARCHAR',
            length: 5,
            index: true,
          },
        },
        {
          label: 'Skill Level',
          name: 'skill_level',
          type: 'radio',
          required: true,
          options: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
          pgConfig: {
            type: 'VARCHAR',
            length: 20,
            index: true,
          },
        },
        {
          label: 'Newsletter Subscription',
          name: 'newsletter_subscription',
          type: 'checkbox',
          required: false,
          pgConfig: {
            type: 'BOOLEAN',
            default: false,
          },
        },
        {
          label: 'Enable Notifications',
          name: 'notifications_enabled',
          type: 'toggle',
          required: false,
          pgConfig: {
            type: 'BOOLEAN',
            default: true,
          },
        },
      ],
    },
    {
      title: 'Visual & Media Fields',
      description: 'Color pickers, file uploads, and rich content',
      gridCols: '2',
      spacing: 'md',
      fields: [
        {
          label: 'Favorite Color',
          name: 'favorite_color',
          type: 'color',
          required: false,
          pgConfig: {
            type: 'VARCHAR',
            length: 7, // Hex color format
          },
        },
        {
          label: 'Profile Picture',
          name: 'profile_picture',
          type: 'file',
          required: false,
          pgConfig: {
            type: 'BYTEA', // Binary data storage
          },
        },
        {
          label: 'Resume/CV',
          name: 'resume_file',
          type: 'file',
          required: false,
          pgConfig: {
            type: 'VARCHAR',
            length: 500, // File path/URL storage
          },
        },
        {
          label: 'Biography',
          name: 'biography',
          type: 'textarea',
          required: false,
          placeholder: 'Tell us about yourself...',
          zodConfig: {
            minLength: 0,
            maxLength: 2000,
          },
          pgConfig: {
            type: 'TEXT',
          },
        },
      ],
    },
    {
      title: 'Advanced & Technical Fields',
      description: 'JSON data, arrays, and specialized types',
      gridCols: '1',
      spacing: 'md',
      fields: [
        {
          label: 'Configuration JSON',
          name: 'config_json',
          type: 'text', // Will be treated as JSON
          required: false,
          placeholder: '{"theme": "dark", "language": "en"}',
          pgConfig: {
            type: 'JSON',
          },
        },
        {
          label: 'Skills Array',
          name: 'skills',
          type: 'text', // Will be treated as array
          required: false,
          placeholder: 'JavaScript,TypeScript,React,Node.js',
          pgConfig: {
            type: 'ARRAY',
          },
        },
        {
          label: 'User ID',
          name: 'user_id',
          type: 'hidden',
          required: false,
          pgConfig: {
            type: 'UUID',
            default: 'gen_random_uuid()',
          },
        },
        {
          label: 'Metadata',
          name: 'metadata',
          type: 'textarea',
          required: false,
          placeholder: 'Additional JSON metadata...',
          zodConfig: {
            minLength: 0,
            maxLength: 5000,
          },
          pgConfig: {
            type: 'JSONB', // Optimized JSON storage
          },
        },
      ],
    },
  ],
};
