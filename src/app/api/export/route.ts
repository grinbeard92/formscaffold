import { NextRequest, NextResponse } from 'next/server';
import { generateExportSSR } from '@/scripts/generate-export-ssr';
import path from 'path';

/**
 * API Route for FormScaffold Export Generation
 *
 * POST /api/export - Generate the export package
 * This endpoint triggers the server-side export generation
 */
export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Starting FormScaffold export via API...');

    // Parse request body (optional parameters)
    const body = await request.json().catch(() => ({}));
    const { timestamp } = body;

    // Log the request
    console.log(
      `Export requested at: ${timestamp ? new Date(timestamp).toISOString() : new Date().toISOString()}`,
    );

    // Run the server-side export generation
    await generateExportSSR();

    // Return success response
    const projectRoot = process.cwd();
    const exportDir = path.join(projectRoot, 'export');

    return NextResponse.json({
      success: true,
      message: 'FormScaffold export generated successfully',
      exportPath: exportDir,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('❌ Export API error:', error);

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

/**
 * GET /api/export - Get export status/info
 * This can be used to check if an export directory exists
 */
export async function GET(request: NextRequest) {
  try {
    const projectRoot = process.cwd();
    const exportDir = path.join(projectRoot, 'export');

    // Check if export directory exists
    const fs = await import('fs/promises');
    let exists = false;
    let files: string[] = [];

    try {
      await fs.access(exportDir);
      exists = true;
      const dirContents = await fs.readdir(exportDir);
      files = dirContents;
    } catch {
      exists = false;
    }

    return NextResponse.json({
      success: true,
      exportExists: exists,
      exportPath: exportDir,
      files: files,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('❌ Export status API error:', error);

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
