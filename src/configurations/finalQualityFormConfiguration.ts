import {
  EPostgresTypes as pgT,
  EFormFieldTypes as fieldT,
  IFormConfiguration,
} from '@/types/globalFormTypes';

export const finalQualityFormConfiguration: IFormConfiguration = {
  title: 'Final Quality Inspection Report',
  description:
    'Final inspection report before equipment ships from our facility',
  postgresTableName: 'final_quality_form',
  submitButtonText: 'Approve for Shipment',
  saveDraftButtonText: 'Save Draft',
  showDraftButton: true,
  resetButtonText: 'Reset Form',
  showResetButton: true,
  sections: [
    {
      title: 'Equipment Identification',
      gridCols: '2',
      spacing: 'md',
      fields: [
        {
          label: 'Quality Inspector Name',
          name: 'inspector_name',
          type: fieldT.TEXT,
          required: true,
          placeholder: 'Enter quality inspector name',
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
          label: 'System Serial Number',
          name: 'serial_number',
          type: fieldT.SELECT,
          required: true,
          customErrorMessage: 'Please select a valid serial number',
          default: '',
          options: [
            { value: 'not-configured', label: 'TODO Add Serial Number data' },
          ],
          pgConfig: {
            type: pgT.VARCHAR,
            length: 255,
          },
        },
        {
          label: 'Support Case Number',
          name: 'support_case',
          type: fieldT.SELECT,
          required: true,
          default: '',
          options: [
            { value: 'not-configured', label: 'TODO Add Support Case data' },
          ],
          pgConfig: {
            type: pgT.VARCHAR,
            length: 255,
          },
        },
        {
          label: 'Customer',
          name: 'customer',
          type: fieldT.SELECT,
          required: true,
          default: '',
          options: [
            { value: 'not-configured', label: 'TODO Add Customer data' },
          ],
          pgConfig: {
            type: pgT.VARCHAR,
            length: 255,
          },
        },
        {
          label: 'Maintenance Date',
          name: 'maintenance_date',
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
          label: 'Next Maintenance Due',
          name: 'next_maintenance_date',
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
      title: 'Issues and Observations',
      description: 'Document any issues found during maintenance',
      gridCols: '1',
      spacing: 'md',
      fields: [
        {
          label: 'Issues Found',
          name: 'issues_found',
          type: fieldT.TEXTAREA,
          required: false,
          placeholder:
            'Describe any issues, problems, or concerns discovered...',
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
          label: 'Corrective Actions Taken',
          name: 'corrective_actions',
          type: fieldT.TEXTAREA,
          required: false,
          placeholder: 'Describe any corrective actions performed...',
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
          label: 'Recommendations',
          name: 'recommendations',
          type: fieldT.TEXTAREA,
          required: false,
          placeholder:
            'Enter recommendations for future maintenance or repairs...',
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
      title: 'Time and Materials',
      description: 'Placeholder for Parts Field',
      gridCols: '2',
      spacing: 'md',
      fields: [
        {
          label: 'Parts Used',
          name: 'parts_used',
          type: fieldT.TEXTAREA,
          required: false,
          default: '',
          zodConfig: {
            maxLength: 1000,
          },
          pgConfig: {
            type: pgT.JSONB,
          },
        },
        {
          label: 'Job Hours',
          name: 'job_hours',
          type: fieldT.TEXTAREA,
          required: false,
          default: '',
          pgConfig: {
            type: pgT.JSONB,
          },
        },
      ],
    },
    {
      title: 'Documentation and Files',
      description:
        'Upload maintenance pictures and supporting documents (Max 25MB or 5 images)',
      gridCols: '2',
      spacing: 'md',
      fields: [
        {
          label: 'Maintenance Pictures',
          name: 'maintenance_pictures',
          type: fieldT.FILE,
          required: false,
          accept: 'image/*',
          multiple: true,
          default: [],
          description:
            'Upload up to 5 pictures showing equipment condition, work performed, or issues found',
          zodConfig: {
            maxLength: 5, // Max 5 images
          },
          pgConfig: {
            type: pgT.VARCHAR,
            length: 1000, // Store comma-separated file paths
          },
        },
        {
          label: 'Supporting Documents',
          name: 'supporting_documents',
          type: fieldT.FILE,
          required: false,
          accept: '.pdf,.doc,.docx,.txt,.csv',
          multiple: true,
          default: [],
          description:
            'Upload up to 5 supporting documents (manuals, specs, reports... max 25MB total)',
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
