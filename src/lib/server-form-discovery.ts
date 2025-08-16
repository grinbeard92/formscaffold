/**
 * Server-Side Form Configuration Discovery
 *
 * This module provides server-friendly functions to discover and load
 * form configurations for server-side rendering in Next.js.
 */

import * as path from 'path';
import * as fs from 'fs/promises';

export interface FormPreviewData {
  title: string;
  description: string;
  tableName: string;
  fileName: string;
  exportName: string;
  sectionCount: number;
  fieldCount: number;
  hasFileUploads: boolean;
  hasSignatures: boolean;
  formPath: string; // URL path to view the form
}

/**
 * Discovers form configurations and returns essential data for server-side rendering
 */
export async function getFormPreviewsForServer(): Promise<FormPreviewData[]> {
  const configurationsDir = path.join(process.cwd(), 'src', 'configurations');

  try {
    const files = await fs.readdir(configurationsDir);
    const tsFiles = files.filter(
      (file) =>
        (file.endsWith('.ts') || file.endsWith('.tsx')) &&
        !file.includes('postgres') && // Exclude postgres config
        !file.includes('demo'), // Exclude demo in production
    );

    const formPreviews: FormPreviewData[] = [];

    for (const file of tsFiles) {
      try {
        const filePath = path.join(configurationsDir, file);
        const content = await fs.readFile(filePath, 'utf-8');

        // Extract configuration data using regex patterns
        const preview = extractFormPreviewFromContent(content, file);
        if (preview) {
          formPreviews.push(preview);
        }
      } catch (error) {
        console.warn(`Warning: Could not process ${file}:`, error);
      }
    }

    return formPreviews;
  } catch (error) {
    console.error('Error reading configurations directory:', error);
    return [];
  }
}

/**
 * Maps table names to their corresponding route paths
 */
function getFormRouteFromTableName(tableName: string): string {
  // Map known table names to their actual route directories
  const routeMap: Record<string, string> = {
    system_intake_form: '/system_intake_form',
    inhouse_form: '/inhouse_form',
    general_form: '/general_form',
    final_quality_form: '/final_quality_form',
    maintenance_form: '/maintenance_form',
    demo_form: '/demo',
  };

  // Return mapped route or convert table name to route format
  return routeMap[tableName] || `/${tableName.replace(/_/g, '-')}`;
}

/**
 * Extracts form preview data from TypeScript file content using regex parsing
 */
function extractFormPreviewFromContent(
  content: string,
  fileName: string,
): FormPreviewData | null {
  try {
    // Extract title
    const titleMatch = content.match(/title:\s*['"`]([^'"`]+)['"`]/);
    const title = titleMatch ? titleMatch[1] : 'Untitled Form';

    // Extract description
    const descriptionMatch = content.match(
      /description:\s*['"`]([^'"`]+)['"`]/,
    );
    const description = descriptionMatch
      ? descriptionMatch[1]
      : 'No description available';

    // Extract table name
    const tableNameMatch = content.match(
      /postgresTableName:\s*['"`]([^'"`]+)['"`]/,
    );
    const tableName = tableNameMatch
      ? tableNameMatch[1]
      : fileName.replace(/\.ts$/, '');

    // Extract export name (configuration variable name)
    const exportMatch = content.match(
      /export\s+const\s+(\w*[Cc]onfiguration\w*)/,
    );
    const exportName = exportMatch ? exportMatch[1] : 'configuration';

    // Count sections
    const sectionMatches = content.match(/{\s*title:/g);
    const sectionCount = sectionMatches ? sectionMatches.length : 0;

    // Count fields (approximate)
    const fieldMatches = content.match(/name:\s*['"`][^'"`]+['"`]/g);
    const fieldCount = fieldMatches ? fieldMatches.length : 0;

    // Check for file uploads
    const hasFileUploads =
      content.includes('fieldT.FILE') || content.includes('type: fieldT.FILE');

    // Check for signatures
    const hasSignatures =
      content.includes('fieldT.SIGNATURE') ||
      content.includes('type: fieldT.SIGNATURE');

    // Generate form path based on table name mapping to existing routes
    const formPath = getFormRouteFromTableName(tableName);

    return {
      title,
      description,
      tableName,
      fileName,
      exportName,
      sectionCount,
      fieldCount,
      hasFileUploads,
      hasSignatures,
      formPath,
    };
  } catch (error) {
    console.warn(`Could not parse ${fileName}:`, error);
    return null;
  }
}

/**
 * Gets a specific form preview by table name
 */
export async function getFormPreviewByTableName(
  tableName: string,
): Promise<FormPreviewData | null> {
  const previews = await getFormPreviewsForServer();
  return previews.find((preview) => preview.tableName === tableName) || null;
}

/**
 * Gets form preview data for forms that are ready for production
 */
export async function getProductionFormPreviews(): Promise<FormPreviewData[]> {
  const allPreviews = await getFormPreviewsForServer();

  // Filter out forms that might not be ready for production
  return allPreviews.filter(
    (preview) =>
      preview.sectionCount > 0 &&
      preview.fieldCount > 0 &&
      !preview.fileName.includes('demo') &&
      !preview.fileName.includes('test'),
  );
}

/**
 * Simple health check to validate form configurations
 */
export async function validateFormConfigurations(): Promise<{
  valid: FormPreviewData[];
  invalid: { fileName: string; reason: string }[];
}> {
  const allPreviews = await getFormPreviewsForServer();

  const valid: FormPreviewData[] = [];
  const invalid: { fileName: string; reason: string }[] = [];

  for (const preview of allPreviews) {
    if (preview.sectionCount === 0) {
      invalid.push({ fileName: preview.fileName, reason: 'No sections found' });
    } else if (preview.fieldCount === 0) {
      invalid.push({ fileName: preview.fileName, reason: 'No fields found' });
    } else if (!preview.tableName) {
      invalid.push({
        fileName: preview.fileName,
        reason: 'No table name specified',
      });
    } else {
      valid.push(preview);
    }
  }

  return { valid, invalid };
}
