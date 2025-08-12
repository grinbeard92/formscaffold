import {
  EPostgresTypes as pgT,
  EFormFieldTypes as fieldT,
  IFormConfiguration,
} from '@/types/globalFormTypes';

/* 
DEFINE YOUR FORM SCHEMA, ZOD VALIDATION PREFERENCES, AND POSTGRESQL TABLE CONFIGURATION HERE
This configuration will be used to generate the form, validation schema, and database table.
No other configuration is needed for the end-to-end tRPC + Next.js + PostgreSQL setup.
This is the single source of truth for both frontend and backend.
*/
export const demoFormConfiguration: IFormConfiguration = {
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
          type: fieldT.TEXT,
          required: true,
          placeholder: 'Enter your full name',
          zodConfig: {
            minLength: 2,
            maxLength: 100,
          },
          pgConfig: {
            type: pgT.VARCHAR,
            length: 100,
            index: true,
          },
          default: null,
        },
        {
          label: 'Email Address',
          name: 'email',
          type: fieldT.EMAIL,
          required: true,
          placeholder: 'your.email@example.com',
          zodConfig: {
            email: true,
          },
          pgConfig: {
            type: pgT.VARCHAR,
            length: 255,
            unique: true,
            index: true,
          },
          default: null,
        },
        {
          label: 'Website URL',
          name: 'website',
          type: fieldT.URL,
          required: false,
          placeholder: 'https://yourwebsite.com',
          zodConfig: {
            minLength: 5,
            maxLength: 500,
          },
          pgConfig: {
            type: pgT.VARCHAR,
            length: 500,
          },
          default: null,
        },
        {
          label: 'Phone Number',
          name: 'phone',
          type: fieldT.TEL,
          required: false,
          placeholder: '+1-555-123-4567',
          pgConfig: {
            type: pgT.VARCHAR,
            length: 20,
          },
          default: null,
        },
        {
          label: 'Search Keywords',
          name: 'keywords',
          type: fieldT.SEARCH,
          required: false,
          placeholder: 'Enter search terms...',
          pgConfig: {
            type: pgT.TEXT,
          },
          default: null,
        },
        {
          label: 'Secret Code',
          name: 'secret_code',
          type: fieldT.PASSWORD,
          required: false,
          placeholder: 'Enter password',
          zodConfig: {
            minLength: 8,
            maxLength: 50,
          },
          pgConfig: {
            type: pgT.VARCHAR,
            length: 255, // Encrypted storage
          },
          default: null,
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
          type: fieldT.NUMBER,
          required: true,
          min: 13,
          max: 120,
          default: 18,
          placeholder: 'Enter your age',
          zodConfig: {
            int: true,
            positive: true,
            min: 13,
            max: 120,
          },
          pgConfig: {
            type: pgT.INTEGER,
            index: true,
          },
        },
        {
          label: 'Salary Range',
          name: 'salary',
          type: fieldT.NUMBER,
          required: false,
          placeholder: '50000.00',
          zodConfig: {
            positive: true,
            min: 0,
            max: 1000000,
          },
          pgConfig: {
            type: pgT.DECIMAL,
            precision: 10,
            scale: 2,
          },
          default: null,
        },
        {
          label: 'Experience Level (1-10)',
          name: 'experience_level',
          type: fieldT.RANGE,
          required: false,
          zodConfig: {
            int: true,
            min: 1,
            max: 10,
          },
          pgConfig: {
            type: pgT.INTEGER,
            default: 5,
          },
          default: null,
        },
        {
          label: 'Satisfaction Rating',
          name: 'satisfaction',
          type: fieldT.RANGE,
          required: false,
          zodConfig: {
            int: true,
            min: 0,
            max: 100,
          },
          pgConfig: {
            type: pgT.INTEGER,
            default: 50,
          },
          default: null,
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
          type: fieldT.DATE,
          customErrorMessage: 'Please enter your birth date',
          required: false,
          zodConfig: {
            date: true,
          },
          pgConfig: {
            type: pgT.DATE,
            index: true,
          },
          default: null,
        },
        {
          label: 'Appointment Time',
          name: 'appointment_time',
          type: fieldT.TIME,
          required: false,
          pgConfig: {
            type: pgT.TIME,
          },
          default: null,
        },
        {
          label: 'Event Date & Time',
          name: 'event_datetime',
          type: fieldT.DATETIME_LOCAL,
          required: false,
          pgConfig: {
            type: pgT.TIMESTAMP,
          },
          default: null,
        },
        {
          label: 'Target Month',
          name: 'target_month',
          type: fieldT.MONTH,
          required: false,
          pgConfig: {
            type: pgT.VARCHAR,
            length: 7, // YYYY-MM format
          },
          default: null,
        },
        {
          label: 'Target Week',
          name: 'target_week',
          type: fieldT.WEEK,
          required: false,
          pgConfig: {
            type: pgT.VARCHAR,
            length: 8, // YYYY-W## format
          },
          default: null,
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
          type: fieldT.SELECT,
          required: true,
          options: [
            { label: 'English', value: 'en' },
            { label: 'Spanish', value: 'es' },
            { label: 'French', value: 'fr' },
            { label: 'German', value: 'de' },
            { label: 'Japanese', value: 'ja' },
          ],
          pgConfig: {
            type: pgT.VARCHAR,
            length: 5,
            index: true,
          },
          default: null,
        },
        {
          label: 'Skill Level',
          name: 'skill_level',
          type: fieldT.RADIO,
          required: true,
          options: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
          pgConfig: {
            type: pgT.VARCHAR,
            length: 20,
            index: true,
          },
          default: null,
        },
        {
          label: 'Newsletter Subscription',
          name: 'newsletter_subscription',
          type: fieldT.CHECKBOX,
          required: false,
          pgConfig: {
            type: pgT.BOOLEAN,
            default: false,
          },
          default: null,
        },
        {
          label: 'Enable Notifications',
          name: 'notifications_enabled',
          type: fieldT.TOGGLE,
          required: false,
          pgConfig: {
            type: pgT.BOOLEAN,
            default: true,
          },
          default: null,
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
          type: fieldT.COLOR,
          required: false,
          pgConfig: {
            type: pgT.VARCHAR,
            length: 7, // Hex color format
          },
          default: null,
        },
        {
          label: 'Profile Picture',
          name: 'profile_picture',
          type: fieldT.FILE,
          required: false,
          pgConfig: {
            type: pgT.BYTEA, // Binary data storage
          },
          default: null,
        },
        {
          label: 'Resume/CV',
          name: 'resume_file',
          type: fieldT.FILE,
          required: false,
          pgConfig: {
            type: pgT.VARCHAR,
            length: 500, // File path/URL storage
          },
          default: null,
        },
        {
          label: 'Biography',
          name: 'biography',
          type: fieldT.TEXTAREA,
          required: false,
          placeholder: 'Tell us about yourself...',
          zodConfig: {
            minLength: 0,
            maxLength: 2000,
          },
          pgConfig: {
            type: pgT.TEXT,
          },
          default: null,
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
          type: fieldT.TEXT, // Will be treated as JSON
          required: false,
          placeholder: '{"theme": "dark", "language": "en"}',
          pgConfig: {
            type: pgT.JSONB,
          },
          default: null,
        },
        {
          label: 'Skills Array',
          name: 'skills',
          type: fieldT.TEXT, // Will be treated as array
          required: false,
          placeholder: 'JavaScript,TypeScript,React,Node.js',
          pgConfig: {
            type: pgT.TEXT,
          },
          default: null,
        },
        {
          label: 'User ID',
          name: 'user_id',
          type: fieldT.HIDDEN,
          required: false,
          pgConfig: {
            type: pgT.UUID,
            default: 'gen_random_uuid()',
          },
          default: null,
        },
        {
          label: 'Metadata',
          name: 'metadata',
          type: fieldT.TEXTAREA,
          required: false,
          placeholder: 'Additional JSON metadata...',
          zodConfig: {
            minLength: 0,
            maxLength: 5000,
          },
          pgConfig: {
            type: pgT.JSONB, // Optimized JSON storage
          },
          default: null,
        },
      ],
    },
  ],
};
