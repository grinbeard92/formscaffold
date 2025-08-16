import {
  EPostgresTypes as pgT,
  EFormFieldTypes as fieldT,
  IFormConfiguration,
} from '@/types/globalFormTypes';

export const systemIntakeFormConfiguration: IFormConfiguration = {
  title: 'System Intake Form',
  description:
    'Equipment intake form for receiving and documenting equipment condition and performance',
  postgresTableName: 'system_intake_form',
  submitButtonText: 'Complete Intake',
  saveDraftButtonText: 'Save Draft',
  showDraftButton: true,
  resetButtonText: 'Reset Form',
  showResetButton: true,
  sections: [
    {
      title: 'Equipment Information',
      gridCols: '2',
      spacing: 'md',
      fields: [
        {
          label: 'Receiving Technician',
          name: 'receiving_technician',
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
            unique: true,
            index: true,
          },
        },
        {
          label: 'Source/Origin',
          name: 'equipment_source',
          type: fieldT.SELECT,
          required: true,
          default: '',
          options: [
            { value: 'customer_return', label: 'Customer Return' },
            { value: 'field_service', label: 'Field Service Return' },
            { value: 'rental_return', label: 'Rental Return' },
            { value: 'demo_return', label: 'Demo Return' },
            { value: 'manufacturing', label: 'Manufacturing' },
            { value: 'other', label: 'Other' },
          ],
          pgConfig: {
            type: pgT.VARCHAR,
            length: 50,
            index: true,
          },
        },
        {
          label: 'Customer/Source Contact',
          name: 'source_contact',
          type: fieldT.TEXT,
          required: true,
          placeholder: 'Customer or contact name',
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
          label: 'Intake Date',
          name: 'intake_date',
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
          label: 'RMA/Case Number',
          name: 'rma_case_number',
          type: fieldT.TEXT,
          required: false,
          placeholder: 'Enter RMA or case number if applicable',
          default: '',
          zodConfig: {
            maxLength: 100,
          },
          pgConfig: {
            type: pgT.VARCHAR,
            length: 100,
          },
        },
        {
          label: 'Shipping/Transport Method',
          name: 'transport_method',
          type: fieldT.SELECT,
          required: true,
          default: '',
          options: [
            { value: 'ups', label: 'UPS' },
            { value: 'fedex', label: 'FedEx' },
            { value: 'freight', label: 'Freight' },
            { value: 'customer_delivery', label: 'Customer Delivery' },
            { value: 'field_tech', label: 'Field Technician' },
            { value: 'other', label: 'Other' },
          ],
          pgConfig: {
            type: pgT.VARCHAR,
            length: 50,
          },
        },
      ],
    },
    {
      title: 'Equipment Condition Assessment',
      description:
        'Document the physical and operational condition of the equipment',
      gridCols: '2',
      spacing: 'md',
      fields: [
        {
          label: 'Overall Physical Condition',
          name: 'physical_condition',
          type: fieldT.SELECT,
          required: true,
          default: '',
          options: [
            { value: 'excellent', label: 'Excellent - Like New' },
            { value: 'good', label: 'Good - Minor Wear' },
            { value: 'fair', label: 'Fair - Moderate Wear' },
            { value: 'poor', label: 'Poor - Significant Damage' },
            { value: 'damaged', label: 'Damaged - Requires Repair' },
          ],
          pgConfig: {
            type: pgT.VARCHAR,
            length: 25,
            index: true,
          },
        },
        {
          label: 'Power On Test Result',
          name: 'power_on_test',
          type: fieldT.SELECT,
          required: true,
          default: '',
          options: [
            { value: 'pass', label: 'Pass - Powers On Normally' },
            { value: 'fail', label: 'Fail - Does Not Power On' },
            { value: 'partial', label: 'Partial - Powers On with Issues' },
            { value: 'not_tested', label: 'Not Tested' },
          ],
          pgConfig: {
            type: pgT.VARCHAR,
            length: 25,
            index: true,
          },
        },
        {
          label: 'Laser Performance (if testable)',
          name: 'laser_performance',
          type: fieldT.SELECT,
          required: false,
          default: '',
          options: [
            { value: 'excellent', label: 'Excellent' },
            { value: 'good', label: 'Good' },
            { value: 'fair', label: 'Fair' },
            { value: 'poor', label: 'Poor' },
            { value: 'not_functional', label: 'Not Functional' },
            { value: 'not_tested', label: 'Not Tested' },
          ],
          pgConfig: {
            type: pgT.VARCHAR,
            length: 25,
          },
        },
        {
          label: 'Measured Power Output (W)',
          name: 'power_output',
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
          label: 'Accessories Included',
          name: 'accessories_included',
          type: fieldT.CHECKBOX,
          required: false,
          default: false,
          pgConfig: {
            type: pgT.BOOLEAN,
            default: false,
          },
        },
        {
          label: 'Manuals/Documentation Included',
          name: 'documentation_included',
          type: fieldT.CHECKBOX,
          required: false,
          default: false,
          pgConfig: {
            type: pgT.BOOLEAN,
            default: false,
          },
        },
        {
          label: 'Software/Media Included',
          name: 'software_included',
          type: fieldT.CHECKBOX,
          required: false,
          default: false,
          pgConfig: {
            type: pgT.BOOLEAN,
            default: false,
          },
        },
        {
          label: 'Packaging Condition',
          name: 'packaging_condition',
          type: fieldT.SELECT,
          required: true,
          default: '',
          options: [
            { value: 'excellent', label: 'Excellent - Original Packaging' },
            { value: 'good', label: 'Good - Adequate Protection' },
            { value: 'fair', label: 'Fair - Some Damage to Packaging' },
            { value: 'poor', label: 'Poor - Inadequate Protection' },
            { value: 'damaged', label: 'Damaged - Packaging Compromised' },
          ],
          pgConfig: {
            type: pgT.VARCHAR,
            length: 25,
          },
        },
      ],
    },
    {
      title: 'Issues and Observations',
      description:
        'Document any issues, damage, or concerns noted during intake',
      gridCols: '1',
      spacing: 'md',
      fields: [
        {
          label: 'Reported Issues/Reason for Return',
          name: 'reported_issues',
          type: fieldT.TEXTAREA,
          required: false,
          placeholder:
            'Describe any issues reported by customer or noted on RMA...',
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
          label: 'Visual Inspection Notes',
          name: 'visual_inspection_notes',
          type: fieldT.TEXTAREA,
          required: false,
          placeholder: 'Document any visible damage, wear, or concerns...',
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
          label: 'Immediate Action Required',
          name: 'immediate_action_required',
          type: fieldT.TEXTAREA,
          required: false,
          placeholder:
            'Note any immediate actions needed (safety, storage, repair priority)...',
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
      title: 'Documentation and Photos',
      description: 'Upload intake photos and supporting documents',
      gridCols: '2',
      spacing: 'md',
      fields: [
        {
          label: 'Equipment Photos',
          name: 'equipment_photos',
          type: fieldT.FILE,
          required: true,
          accept: 'image/*',
          multiple: true,
          default: [],
          description:
            'Upload photos showing overall condition, serial number, and any damage (required)',
          zodConfig: {
            maxLength: 10, // Max 10 images
          },
          pgConfig: {
            type: pgT.VARCHAR,
            length: 2000, // Store comma-separated file paths
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
            'Upload RMA documents, shipping paperwork, customer correspondence',
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
      title: 'Signatures and Approval',
      description: 'Digital signatures for intake validation',
      gridCols: '2',
      spacing: 'md',
      fields: [
        {
          label: 'Receiving Technician Signature',
          name: 'technician_signature',
          type: fieldT.SIGNATURE,
          required: true,
          default: '',
          description:
            'Digital signature of the technician who performed the intake inspection',
          pgConfig: {
            type: pgT.TEXT, // Store base64 encoded signature image
          },
        },
        {
          label: 'Supervisor Signature',
          name: 'supervisor_signature',
          type: fieldT.SIGNATURE,
          required: false,
          default: '',
          description:
            'Digital signature of supervising technician or manager (if required)',
          pgConfig: {
            type: pgT.TEXT,
          },
        },
      ],
    },
  ],
};
