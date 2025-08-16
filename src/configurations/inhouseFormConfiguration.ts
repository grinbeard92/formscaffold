import {
  EPostgresTypes as pgT,
  EFormFieldTypes as fieldT,
  IFormConfiguration,
} from '@/types/globalFormTypes';

export const inhouseFormConfiguration: IFormConfiguration = {
  title: 'In-House Service Report',
  description: 'Service report for work performed on equipment in our facility',
  postgresTableName: 'inhouse_form',
  submitButtonText: 'Complete Service Report',
  saveDraftButtonText: 'Save Draft',
  showDraftButton: true,
  resetButtonText: 'Reset Form',
  showResetButton: true,
  sections: [
    {
      title: 'Job Information',
      gridCols: '2',
      spacing: 'md',
      fields: [
        {
          label: 'Service Technician',
          name: 'service_technician',
          type: fieldT.TEXT,
          required: true,
          placeholder: 'Enter technician name',
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
          label: 'Work Order Number',
          name: 'work_order_number',
          type: fieldT.TEXT,
          required: true,
          placeholder: 'Enter work order or RMA number',
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
          label: 'Service Type',
          name: 'service_type',
          type: fieldT.SELECT,
          required: true,
          default: '',
          options: [
            { value: 'repair', label: 'Repair' },
            { value: 'maintenance', label: 'Preventive Maintenance' },
            { value: 'calibration', label: 'Calibration' },
            { value: 'upgrade', label: 'Upgrade/Modification' },
            { value: 'testing', label: 'Testing/QC' },
            { value: 'refurbishment', label: 'Refurbishment' },
            { value: 'other', label: 'Other' },
          ],
          pgConfig: {
            type: pgT.VARCHAR,
            length: 50,
            index: true,
          },
        },
        {
          label: 'Service Date',
          name: 'service_date',
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
          label: 'Customer/Source',
          name: 'customer_source',
          type: fieldT.TEXT,
          required: false,
          placeholder: 'Customer name or internal department',
          default: '',
          zodConfig: {
            maxLength: 255,
          },
          pgConfig: {
            type: pgT.VARCHAR,
            length: 255,
          },
        },
        {
          label: 'Priority Level',
          name: 'priority_level',
          type: fieldT.SELECT,
          required: true,
          default: 'normal',
          options: [
            { value: 'low', label: 'Low' },
            { value: 'normal', label: 'Normal' },
            { value: 'high', label: 'High' },
            { value: 'urgent', label: 'Urgent' },
          ],
          pgConfig: {
            type: pgT.VARCHAR,
            length: 20,
          },
        },
      ],
    },
    {
      title: 'Service Work Performed',
      description: 'Document all work performed on the equipment',
      gridCols: '2',
      spacing: 'md',
      fields: [
        {
          label: 'Initial Equipment Condition',
          name: 'initial_condition',
          type: fieldT.SELECT,
          required: true,
          default: '',
          options: [
            { value: 'excellent', label: 'Excellent' },
            { value: 'good', label: 'Good' },
            { value: 'fair', label: 'Fair' },
            { value: 'poor', label: 'Poor' },
            { value: 'non_functional', label: 'Non-Functional' },
          ],
          pgConfig: {
            type: pgT.VARCHAR,
            length: 25,
            index: true,
          },
        },
        {
          label: 'Initial Power Output (W)',
          name: 'initial_power_output',
          type: fieldT.NUMBER,
          required: false,
          placeholder: '0',
          default: 0,
          zodConfig: {
            min: 0,
          },
          pgConfig: {
            type: pgT.DECIMAL,
            precision: 10,
            scale: 2,
          },
        },
        {
          label: 'Diagnostic Tests Performed',
          name: 'diagnostic_tests',
          type: fieldT.CHECKBOX,
          required: false,
          default: false,
          pgConfig: {
            type: pgT.BOOLEAN,
            default: false,
          },
        },
        {
          label: 'Calibration Performed',
          name: 'calibration_performed',
          type: fieldT.CHECKBOX,
          required: false,
          default: false,
          pgConfig: {
            type: pgT.BOOLEAN,
            default: false,
          },
        },
        {
          label: 'Software Update/Installation',
          name: 'software_update',
          type: fieldT.CHECKBOX,
          required: false,
          default: false,
          pgConfig: {
            type: pgT.BOOLEAN,
            default: false,
          },
        },
        {
          label: 'Hardware Replacement/Repair',
          name: 'hardware_repair',
          type: fieldT.CHECKBOX,
          required: false,
          default: false,
          pgConfig: {
            type: pgT.BOOLEAN,
            default: false,
          },
        },
        {
          label: 'Cleaning and Maintenance',
          name: 'cleaning_maintenance',
          type: fieldT.CHECKBOX,
          required: false,
          default: false,
          pgConfig: {
            type: pgT.BOOLEAN,
            default: false,
          },
        },
        {
          label: 'Quality Control Testing',
          name: 'qc_testing',
          type: fieldT.CHECKBOX,
          required: false,
          default: false,
          pgConfig: {
            type: pgT.BOOLEAN,
            default: false,
          },
        },
        {
          label: 'Final Power Output (W)',
          name: 'final_power_output',
          type: fieldT.NUMBER,
          required: false,
          placeholder: '0',
          default: 0,
          zodConfig: {
            min: 0,
          },
          pgConfig: {
            type: pgT.DECIMAL,
            precision: 10,
            scale: 2,
          },
        },
        {
          label: 'Final Equipment Condition',
          name: 'final_condition',
          type: fieldT.SELECT,
          required: true,
          default: '',
          options: [
            { value: 'excellent', label: 'Excellent' },
            { value: 'good', label: 'Good' },
            { value: 'fair', label: 'Fair' },
            { value: 'poor', label: 'Poor' },
            {
              value: 'requires_additional_work',
              label: 'Requires Additional Work',
            },
          ],
          pgConfig: {
            type: pgT.VARCHAR,
            length: 30,
            index: true,
          },
        },
        {
          label: 'Service Hours',
          name: 'service_hours',
          type: fieldT.NUMBER,
          required: true,
          placeholder: '0',
          default: 0,
          zodConfig: {
            min: 0,
          },
          pgConfig: {
            type: pgT.DECIMAL,
            precision: 5,
            scale: 2,
          },
        },
        {
          label: 'Ready for Shipment',
          name: 'ready_for_shipment',
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
      title: 'Service Details and Parts',
      description: 'Document specific service work and parts used',
      gridCols: '1',
      spacing: 'md',
      fields: [
        {
          label: 'Detailed Work Description',
          name: 'work_description',
          type: fieldT.TEXTAREA,
          required: true,
          placeholder:
            'Describe in detail all work performed on the equipment...',
          rows: 5,
          default: '',
          zodConfig: {
            minLength: 10,
            maxLength: 3000,
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
            'List all parts replaced or used (part numbers, quantities, etc.)...',
          rows: 4,
          default: '',
          zodConfig: {
            maxLength: 2000,
          },
          pgConfig: {
            type: pgT.TEXT,
          },
        },
        {
          label: 'Tools and Equipment Used',
          name: 'tools_equipment_used',
          type: fieldT.TEXTAREA,
          required: false,
          placeholder: 'List specialized tools or test equipment used...',
          rows: 3,
          default: '',
          zodConfig: {
            maxLength: 1000,
          },
          pgConfig: {
            type: pgT.TEXT,
          },
        },
        {
          label: 'Test Results and Measurements',
          name: 'test_results',
          type: fieldT.TEXTAREA,
          required: false,
          placeholder:
            'Document test results, measurements, calibration data...',
          rows: 4,
          default: '',
          zodConfig: {
            maxLength: 2000,
          },
          pgConfig: {
            type: pgT.TEXT,
          },
        },
      ],
    },
    {
      title: 'Issues and Resolution',
      description: 'Document any issues encountered and how they were resolved',
      gridCols: '1',
      spacing: 'md',
      fields: [
        {
          label: 'Issues Encountered',
          name: 'issues_encountered',
          type: fieldT.TEXTAREA,
          required: false,
          placeholder:
            'Describe any problems, complications, or unexpected findings...',
          rows: 4,
          default: '',
          zodConfig: {
            maxLength: 2000,
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
          placeholder:
            'Describe how issues were resolved or corrective actions taken...',
          rows: 4,
          default: '',
          zodConfig: {
            maxLength: 2000,
          },
          pgConfig: {
            type: pgT.TEXT,
          },
        },
        {
          label: 'Follow-up Required',
          name: 'followup_required',
          type: fieldT.TEXTAREA,
          required: false,
          placeholder:
            'Note any follow-up work, additional testing, or future recommendations...',
          rows: 3,
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
      title: 'Time and Materials',
      description: 'Placeholder for Parts Field',
      gridCols: '2',
      spacing: 'md',
      fields: [],
    },
    {
      title: 'Service Documentation',
      description: 'Upload photos of work performed and supporting documents',
      gridCols: '2',
      spacing: 'md',
      fields: [
        {
          label: 'Before/After Service Photos',
          name: 'service_photos',
          type: fieldT.FILE,
          required: true,
          accept: 'image/*',
          multiple: true,
          default: [],
          description:
            'Upload photos showing equipment before/after service, work performed, and any issues (required)',
          zodConfig: {
            maxLength: 10, // Max 10 images
          },
          pgConfig: {
            type: pgT.VARCHAR,
            length: 2000, // Store comma-separated file paths
          },
        },
        {
          label: 'Test Results and Documentation',
          name: 'test_documentation',
          type: fieldT.FILE,
          required: false,
          accept: '.pdf,.doc,.docx,.txt,.csv,.xlsx',
          multiple: true,
          default: [],
          description:
            'Upload test results, calibration certificates, and technical documentation',
          zodConfig: {
            maxLength: 5, // Max 5 files
          },
          pgConfig: {
            type: pgT.VARCHAR,
            length: 1000, // Store comma-separated file paths
          },
        },
      ],
    },
    {
      title: 'Signatures',
      description: 'Digital signatures for validation and approval',
      gridCols: '2',
      spacing: 'md',
      fields: [
        {
          label: 'Technician Signature',
          name: 'technician_signature',
          type: fieldT.SIGNATURE,
          required: true,
          default: '',
          description:
            'Digital signature of the technician who performed the maintenance',
          pgConfig: {
            type: pgT.TEXT, // Store base64 encoded signature image
          },
        },
        {
          label: 'Customer Signature',
          name: 'customer_signature',
          type: fieldT.SIGNATURE,
          required: false,
          default: '',
          description:
            'Digital signature of the supervising technician or manager',
          pgConfig: {
            type: pgT.TEXT,
          },
        },
      ],
    },
  ],
};
