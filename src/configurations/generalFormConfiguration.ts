import {
  EPostgresTypes as pgT,
  EFormFieldTypes as fieldT,
  IFormConfiguration,
} from '@/types/globalFormTypes';

export const generalFormConfiguration: IFormConfiguration = {
  title: 'General Field Service Report',
  description:
    'Field service report for on-site equipment maintenance and repair',
  postgresTableName: 'general_form',
  submitButtonText: 'Submit Field Report',
  saveDraftButtonText: 'Save Draft',
  showDraftButton: true,
  resetButtonText: 'Reset Form',
  showResetButton: true,
  sections: [
    {
      title: 'Field Service Call Information',
      gridCols: '2',
      spacing: 'md',
      fields: [
        {
          label: 'Field Technician Name',
          name: 'field_technician_name',
          type: fieldT.TEXT,
          required: true,
          placeholder: 'Enter field technician name',
          default: '',
          zodConfig: {
            minLength: 2,
            maxLength: 100,
          },
          pgConfig: {
            type: pgT.VARCHAR,
            length: 255,
          },
        },
        {
          label: 'Equipment Type/Model',
          name: 'equipment_type',
          type: fieldT.TEXT,
          required: true,
          placeholder: 'ie. CL1000 Mobile, AL1, CL150 cleanCELL etc.',
          default: '',
          zodConfig: {
            minLength: 2,
            maxLength: 100,
          },
          pgConfig: {
            type: pgT.VARCHAR,
            length: 255,
            index: true,
          },
        },
        {
          label: 'Serial Number',
          name: 'serial_number',
          type: fieldT.TEXT,
          required: true,
          placeholder: 'Enter equipment serial number',
          default: '',
          zodConfig: {
            minLength: 1,
            maxLength: 100,
          },
          pgConfig: {
            type: pgT.VARCHAR,
            length: 255,
            index: true,
          },
        },
        {
          label: 'Case Number',
          name: 'support_case_number',
          type: fieldT.TEXT,
          required: true,
          placeholder: 'Select support case number',
          default: '',
          zodConfig: {
            minLength: 1,
            maxLength: 100,
          },
          pgConfig: {
            type: pgT.VARCHAR,
            length: 100,
            index: true,
          },
        },
        {
          label: 'Customer Name',
          name: 'customer_name',
          type: fieldT.TEXT,
          required: true,
          placeholder: 'Enter customer name',
          default: '',
          zodConfig: {
            minLength: 2,
            maxLength: 255,
          },
          pgConfig: {
            type: pgT.VARCHAR,
            length: 255,
            index: true,
          },
        },
        {
          label: 'Service Date',
          name: 'service_date',
          type: fieldT.DATE,
          required: true,
          placeholder: '',
          default: '',
          pgConfig: {
            type: pgT.TIMESTAMP,
          },
        },
        {
          label: 'Site Location',
          name: 'site_location',
          type: fieldT.TEXT,
          required: true,
          placeholder: 'Enter customer site address/location',
          default: '',
          zodConfig: {
            minLength: 2,
            maxLength: 500,
          },
          pgConfig: {
            type: pgT.TEXT,
          },
        },
      ],
    },
    {
      title: 'Travel and Logistics',
      gridCols: '2',
      spacing: 'md',
      fields: [
        {
          label: 'Travel Time (hours)',
          name: 'travel_time',
          type: fieldT.NUMBER,
          required: true,
          placeholder: 'Enter travel time in hours',
          default: '',
          zodConfig: {
            min: 0,
            max: 24,
          },
          pgConfig: {
            type: pgT.DECIMAL,
            precision: 4,
            scale: 2,
          },
        },
        {
          label: 'Mileage (optional)',
          name: 'mileage',
          type: fieldT.NUMBER,
          required: false,
          placeholder: 'Enter total mileage',
          default: '',
          zodConfig: {
            min: 0,
          },
          pgConfig: {
            type: pgT.NUMERIC,
            precision: 10,
            scale: 3,
          },
        },
        {
          label: 'Departure Time',
          name: 'departure_time',
          type: fieldT.TIME,
          required: true,
          placeholder: 'Enter departure time',
          default: '',
          zodConfig: {
            minLength: 1,
            maxLength: 20,
          },
          pgConfig: {
            type: pgT.TIMESTAMP_WITH_TIME_ZONE,
            length: 50,
          },
        },
        {
          label: 'Arrival Time',
          name: 'arrival_time',
          type: fieldT.TIME,
          required: true,
          placeholder: 'Enter arrival time',
          default: '',
          zodConfig: {
            minLength: 1,
            maxLength: 20,
          },
          pgConfig: {
            type: pgT.TIMESTAMP_WITH_TIME_ZONE,
            length: 50,
          },
        },
        {
          label: 'Customer Contact Person',
          name: 'customer_contact',
          type: fieldT.TEXT,
          required: true,
          placeholder: 'Enter customer contact name',
          default: '',
          zodConfig: {
            minLength: 2,
            maxLength: 100,
          },
          pgConfig: {
            type: pgT.VARCHAR,
            length: 255,
          },
        },
        {
          label: 'Contact Phone Number',
          name: 'contact_phone',
          type: fieldT.TEXT,
          required: false,
          placeholder: 'Enter contact phone number',
          default: '',
          zodConfig: {
            minLength: 10,
            maxLength: 20,
          },
          pgConfig: {
            type: pgT.VARCHAR,
            length: 50,
          },
        },
        {
          label: 'Address',
          name: 'address',
          type: fieldT.TEXT,
          required: true,
          placeholder: 'Enter address',
          default: '',
          zodConfig: {
            minLength: 5,
            maxLength: 255,
          },
          pgConfig: {
            type: pgT.VARCHAR,
            length: 255,
          },
        },
        {
          label: 'Customer Contact Name',
          name: 'customer_contact_name',
          type: fieldT.TEXT,
          required: true,
          placeholder: 'Enter customer contact name',
          default: '',
          zodConfig: {
            minLength: 2,
            maxLength: 255,
          },
          pgConfig: {
            type: pgT.VARCHAR,
            length: 255,
          },
        },
        {
          label: 'Customer Contact Email',
          name: 'customer_contact_email',
          type: fieldT.EMAIL,
          required: true,
          placeholder: 'Enter customer contact email',
          default: '',
          zodConfig: {
            email: true,
          },
          pgConfig: {
            type: pgT.VARCHAR,
            length: 255,
          },
        },
      ],
    },
    {
      title: 'Maintenance Checklist',
      description: 'Standard maintenance checklist items',
      gridCols: '2',
      spacing: 'md',
      fields: [
        {
          label: 'Test, Verify and Record Current System Performance and Power',
          name: 'confirm_system_performance',
          type: fieldT.CHECKBOX,
          required: false,
          default: false,
          pgConfig: {
            type: pgT.BOOLEAN,
            default: false,
          },
        },
        {
          label: 'Pre-Service Ablation Performance',
          name: 'pre_service_ablation_performance',
          type: fieldT.SELECT,
          required: true,
          default: '',
          options: [
            { value: 'excellent', label: 'Excellent' },
            { value: 'good', label: 'Good' },
            { value: 'fair', label: 'Fair' },
            { value: 'poor', label: 'Poor' },
            { value: 'error', label: 'Existing Error / System Down' },
          ],
          pgConfig: {
            type: pgT.VARCHAR,
            length: 25,
            index: true,
          },
        },
        {
          label: 'Pre-Service Pulsing Power (W)',
          name: 'pre_service_pulsing_power',
          type: fieldT.NUMBER,
          required: true,
          placeholder: '0',
          default: 0,
          zodConfig: {
            min: 0,
          },
          pgConfig: {
            type: pgT.INTEGER,
            index: true,
          },
        },
        {
          label: 'Pre-Service CW Power (W)',
          name: 'pre_service_cw_power',
          type: fieldT.NUMBER,
          required: true,
          placeholder: '0',
          default: 0,
          zodConfig: { min: 0 },
          pgConfig: { type: pgT.INTEGER, index: true },
        },
        {
          label: 'Replace Desiccant Packs',
          name: 'replace_desiccant_packs',
          type: fieldT.CHECKBOX,
          required: false,
          default: false,
          pgConfig: {
            type: pgT.BOOLEAN,
            default: false,
          },
        },
        {
          label:
            'Confirm Humidity Settings Warning/Error (CL150+ 45%/50%, CL1000 50%/60%)',
          name: 'confirm_humidity_settings',
          type: fieldT.CHECKBOX,
          required: false,
          default: false,
          pgConfig: {
            type: pgT.BOOLEAN,
            default: false,
          },
        },
        {
          label:
            'Capture Current Laser Settings and Script Files (cleanTouch, CLQ, CLL, cleanStudio, cleanBAKE)',
          name: 'capture_laser_settings',
          type: fieldT.CHECKBOX,
          required: false,
          default: false,
          pgConfig: {
            type: pgT.BOOLEAN,
            default: false,
          },
        },
        {
          label: 'Copy Last 6 Months of Logfiles to USB for Adapt records',
          name: 'copy_logfiles',
          type: fieldT.CHECKBOX,
          required: false,
          default: false,
          pgConfig: {
            type: pgT.BOOLEAN,
            default: false,
          },
        },
        {
          label: 'Inspect Protection Window and Optic Condition',
          name: 'inspect_protection_window',
          type: fieldT.CHECKBOX,
          required: false,
          default: false,
          pgConfig: {
            type: pgT.BOOLEAN,
            default: false,
          },
        },
        {
          label: 'Clean and Replace Optics as Needed',
          name: 'clean_replace_optics',
          type: fieldT.CHECKBOX,
          required: false,
          default: false,
          pgConfig: {
            type: pgT.BOOLEAN,
            default: false,
          },
        },
        {
          label: 'Perform Annual Coolant System Flush and Service',
          name: 'annual_water_service',
          type: fieldT.CHECKBOX,
          required: false,
          default: false,
          pgConfig: {
            type: pgT.BOOLEAN,
            default: false,
          },
        },
        {
          label:
            'Confirm O-rings installed and all screws installed and torqued properly on Resonator',
          name: 'confirm_o_rings_screws',
          type: fieldT.CHECKBOX,
          required: false,
          default: false,
          pgConfig: {
            type: pgT.BOOLEAN,
            default: false,
          },
        },
        {
          label:
            '(Especially CL1000) Tape Resonator seams with Aluminum tape if they are not already taped',
          name: 'tape_resonator_seams',
          type: fieldT.CHECKBOX,
          required: false,
          default: false,
          pgConfig: {
            type: pgT.BOOLEAN,
            default: false,
          },
        },
        {
          label:
            'Inspect Protection Hose and Verify Coupling Tightness, tape exposed metal sections with vinyl tape, record damage (if present)',
          name: 'inspect_protection_hose',
          type: fieldT.CHECKBOX,
          required: false,
          default: false,
          pgConfig: {
            type: pgT.BOOLEAN,
            default: false,
          },
        },
        {
          label:
            'Update MDS sensor to latest version and verify MDS sensor operation',
          name: 'update_mds_sensor',
          type: fieldT.CHECKBOX,
          required: false,
          default: false,
          pgConfig: {
            type: pgT.BOOLEAN,
            default: false,
          },
        },
        {
          label:
            '(in dirty environments) Unplug and Remove machine PC, HFC, BBT, UPS, etc.; blow out dust with clean compressed air',
          name: 'clean_equipment_dust',
          type: fieldT.CHECKBOX,
          required: false,
          default: false,
          pgConfig: {
            type: pgT.BOOLEAN,
            default: false,
          },
        },
        {
          label: 'Verify compressed air input pressure',
          name: 'verify_air_pressure',
          type: fieldT.CHECKBOX,
          required: false,
          default: false,
          pgConfig: {
            type: pgT.BOOLEAN,
            default: false,
          },
        },
        {
          label:
            'Verify door and emergency interlocks and e-stops, configurations will vary',
          name: 'verify_interlocks_estops',
          type: fieldT.CHECKBOX,
          required: false,
          default: false,
          pgConfig: {
            type: pgT.BOOLEAN,
            default: false,
          },
        },
      ],
    },
    {
      title: 'On-Site Service Work',
      gridCols: '1',
      spacing: 'md',
      fields: [
        {
          label: 'Work Performed',
          name: 'work_performed',
          type: fieldT.TEXTAREA,
          required: true,
          placeholder: 'Describe the work performed on-site',
          default: '',
          zodConfig: {
            minLength: 10,
            maxLength: 2000,
          },
          pgConfig: {
            type: pgT.TEXT,
          },
        },
        {
          label: 'Parts Used',
          name: 'parts_used',
          type: fieldT.TEXTAREA,
          required: false,
          placeholder:
            'List parts used during service (part numbers, quantities, descriptions)',
          default: '',
          zodConfig: {
            maxLength: 1000,
          },
          pgConfig: {
            type: pgT.TEXT,
          },
        },
        {
          label: 'Performance Test Results',
          name: 'performance_test',
          type: fieldT.TEXTAREA,
          required: false,
          placeholder: 'Document any performance tests conducted and results',
          default: '',
          zodConfig: {
            maxLength: 1000,
          },
          pgConfig: {
            type: pgT.TEXT,
          },
        },
      ],
    },
    {
      title: 'Issues and Resolution',
      gridCols: '1',
      spacing: 'md',
      fields: [
        {
          label: 'Issues Found',
          name: 'issues_found',
          type: fieldT.TEXTAREA,
          required: false,
          placeholder: 'Document any issues found during service',
          default: '',
          zodConfig: {
            maxLength: 1000,
          },
          pgConfig: {
            type: pgT.TEXT,
          },
        },
        {
          label: 'Resolution Actions Taken',
          name: 'resolution_actions',
          type: fieldT.TEXTAREA,
          required: false,
          placeholder: 'Describe actions taken to resolve issues',
          default: '',
          zodConfig: {
            maxLength: 1000,
          },
          pgConfig: {
            type: pgT.TEXT,
          },
        },
        {
          label: 'Follow-up Required',
          name: 'followup_required',
          type: fieldT.SELECT,
          required: true,
          default: '',
          options: [
            { value: 'none', label: 'No Follow-up Required' },
            { value: 'scheduled', label: 'Follow-up Scheduled' },
            { value: 'urgent', label: 'Urgent Follow-up Needed' },
          ],
          pgConfig: {
            type: pgT.VARCHAR,
            length: 50,
          },
        },
        {
          label: 'Follow-up Notes',
          name: 'followup_notes',
          type: fieldT.TEXTAREA,
          required: false,
          placeholder: 'Additional notes for follow-up work if needed',
          default: '',
          zodConfig: {
            maxLength: 500,
          },
          pgConfig: {
            type: pgT.TEXT,
          },
        },
      ],
    },
    {
      title: 'Field Service Documentation',
      description:
        'Upload photos and supporting documents from field service (Max 25MB or 5 images)',
      gridCols: '2',
      spacing: 'md',
      fields: [
        {
          label: 'Before Service Photos',
          name: 'before_service_photos',
          type: fieldT.FILE,
          required: true,
          accept: 'image/*',
          multiple: true,
          default: [],
          description:
            'Upload photos showing equipment condition before service work',
          zodConfig: {
            maxLength: 5, // Max 5 images
          },
          pgConfig: {
            type: pgT.VARCHAR,
            length: 1000, // Store comma-separated file paths
          },
        },
        {
          label: 'After Service Photos',
          name: 'after_service_photos',
          type: fieldT.FILE,
          required: true,
          accept: 'image/*',
          multiple: true,
          default: [],
          description:
            'Upload photos showing completed service work and final condition',
          zodConfig: {
            maxLength: 5, // Max 5 images
          },
          pgConfig: {
            type: pgT.VARCHAR,
            length: 1000, // Store comma-separated file paths
          },
        },
        {
          label: 'Customer Provided Documents',
          name: 'customer_documents',
          type: fieldT.FILE,
          required: false,
          accept: '.pdf,.doc,.docx,.txt,.csv',
          multiple: true,
          default: [],
          description:
            'Upload any documents provided by customer (specs, manuals, etc.)',
          zodConfig: {
            maxLength: 3, // Max 3 files
          },
          pgConfig: {
            type: pgT.VARCHAR,
            length: 1000,
          },
        },
      ],
    },
    {
      title: 'Field Service Signatures',
      description:
        'Digital signatures for field service validation and customer approval',
      gridCols: '2',
      spacing: 'md',
      fields: [
        {
          label: 'Field Technician Signature',
          name: 'technician_signature',
          type: fieldT.SIGNATURE,
          required: true,
          default: '',
          description:
            'Digital signature of the field technician who performed the service',
          pgConfig: {
            type: pgT.TEXT, // Store base64 encoded signature image
          },
        },
        {
          label: 'Customer Signature',
          name: 'customer_signature',
          type: fieldT.SIGNATURE,
          required: true,
          default: '',
          description:
            'Digital signature of the customer representative accepting the service',
          pgConfig: {
            type: pgT.TEXT,
          },
        },
        {
          label: 'Service Completion Date',
          name: 'completion_date',
          type: fieldT.DATE,
          required: true,
          default: '',
          zodConfig: {
            date: true,
          },
          pgConfig: {
            type: pgT.DATE,
            index: true,
          },
        },
        {
          label: 'Customer Satisfaction Rating',
          name: 'satisfaction_rating',
          type: fieldT.SELECT,
          required: false,
          default: '',
          options: [
            { value: '5', label: '5 - Excellent' },
            { value: '4', label: '4 - Good' },
            { value: '3', label: '3 - Satisfactory' },
            { value: '2', label: '2 - Fair' },
            { value: '1', label: '1 - Poor' },
          ],
          pgConfig: {
            type: pgT.VARCHAR,
            length: 10,
          },
        },
      ],
    },
  ],
};
