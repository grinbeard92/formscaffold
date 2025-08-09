import { NextResponse } from 'next/server';
import { discoverFormConfigurations } from '@/scripts/get-form-configurations';

/**
 * API Route for FormScaffold Export Preview
 *
 * GET /api/export/preview - Get preview of what would be exported
 */
export async function GET() {
  try {
    console.log('📋 Getting export preview...');

    const projectRoot = process.cwd();
    const configurations = await discoverFormConfigurations(projectRoot);

    const forms = configurations.map(({ config }) => ({
      name: config.title,
      tableName: config.postgresTableName,
    }));

    const components = [
      'ClientForm.tsx',
      'ServerForm.tsx',
      'FormSectionTemplate.tsx',
      'formSectionUtils.ts',
      'renderInputSection.tsx',
      'card.tsx',
      'globalFormTypes.ts',
      'generic-db-actions.ts',
      'postgres-js.ts',
      'utils.ts',
    ];

    // Calculate total files that would be generated
    const filesPerForm = 5; // types, actions, pages, zod schema, sql schema
    const totalFiles = components.length + forms.length * filesPerForm + 2; // +2 for package.json and README

    return NextResponse.json({
      success: true,
      forms,
      components,
      totalFiles,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('❌ Export preview error:', error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}
