import { NextResponse } from 'next/server';
import {
  getFormPreviewsForServer,
  validateFormConfigurations,
} from '@/lib/server-form-discovery';

export async function GET() {
  try {
    const formPreviews = await getFormPreviewsForServer();
    const validation = await validateFormConfigurations();

    return NextResponse.json({
      success: true,
      forms: formPreviews,
      validation: validation,
      count: formPreviews.length,
    });
  } catch (error) {
    console.error('Error in forms API:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        forms: [],
        count: 0,
      },
      { status: 500 },
    );
  }
}
