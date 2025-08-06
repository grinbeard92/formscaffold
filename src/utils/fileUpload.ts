import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

/**
 * Save uploaded files to the server filesystem
 * @param files - File objects or array of File objects
 * @param folder - Upload folder (e.g., 'maintenance', 'demo')
 * @returns String or array of relative file paths
 */

export async function saveUploadedFiles(
  files: File | File[] | null | undefined,
  folder: string,
): Promise<string | string[] | null> {
  if (!files) return null;

  const uploadDir = join(process.cwd(), 'public', 'uploads', folder);

  // Ensure upload directory exists
  try {
    await mkdir(uploadDir, { recursive: true });
  } catch (error) {
    console.error('Failed to create upload directory:', error);
    throw new Error('Failed to create upload directory');
  }

  if (Array.isArray(files)) {
    // Handle multiple files
    const filePaths: string[] = [];

    for (const file of files) {
      if (file && file.size > 0) {
        const filePath = await saveFile(file, uploadDir, folder);
        if (filePath) filePaths.push(filePath);
      }
    }

    return filePaths.length > 0 ? filePaths : null;
  } else {
    // Handle single file
    if (files.size === 0) return null;
    return await saveFile(files, uploadDir, folder);
  }
}

/**
 * Compress file buffer using gzip for non-image files
 * @param buffer - File buffer to compress
 * @param mimeType - MIME type of the file
 * @returns Compressed buffer or original buffer if compression not beneficial
 */
async function compressFileBuffer(
  buffer: Buffer,
  mimeType: string,
): Promise<Buffer> {
  // Skip compression for already compressed formats
  const skipCompression = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/gif',
    'video/',
    'audio/',
    'application/zip',
    'application/gzip',
    'application/x-rar-compressed',
  ];

  if (skipCompression.some((type) => mimeType.startsWith(type))) {
    return buffer;
  }

  try {
    const { gzip } = await import('zlib');
    const { promisify } = await import('util');
    const gzipAsync = promisify(gzip);

    const compressed = await gzipAsync(buffer);

    // Only use compression if it actually reduces file size significantly
    if (compressed.length < buffer.length * 0.9) {
      return compressed;
    }

    return buffer;
  } catch (error) {
    console.error('Gzip compression failed:', error);
    return buffer;
  }
}

/**
 * Save a single file to disk
 */
async function saveFile(
  file: File,
  uploadDir: string,
  folder: string,
): Promise<string | null> {
  try {
    // Generate unique filename
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const fileExt = file.name.split('.').pop() || '';
    const filename = `${timestamp}-${randomSuffix}.${fileExt}`;

    // Save file to disk
    let buffer = Buffer.from(await file.arrayBuffer());
    if (file.type.startsWith('image/')) {
      // Compress image using sharp
      const sharp = (await import('sharp')).default;
      const image = sharp(buffer);

      // You can adjust compression options as needed
      let compressedBuffer: Buffer;
      if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
        compressedBuffer = await image.jpeg({ quality: 70 }).toBuffer();
      } else if (file.type === 'image/png') {
        compressedBuffer = await image.png({ compressionLevel: 8 }).toBuffer();
      } else if (file.type === 'image/webp') {
        compressedBuffer = await image.webp({ quality: 70 }).toBuffer();
      } else {
        compressedBuffer = buffer; // fallback for unsupported types
      }
      // Overwrite buffer with compressedBuffer
      buffer = Buffer.from(compressedBuffer);
    } else {
      compressFileBuffer(buffer, file.type).then((compressedBuffer) => {
        // Only overwrite if compression was successful
        if (compressedBuffer.length < buffer.length) {
          buffer = Buffer.from(compressedBuffer);
        }
      });
    }
    const filePath = join(uploadDir, filename);
    await writeFile(filePath, buffer);

    // Return relative path from public directory
    return `/uploads/${folder}/${filename}`;
  } catch (error) {
    console.error('Failed to save file:', error);
    return null;
  }
}

/**
 * Convert file paths array to comma-separated string for database storage
 */
export function filePathsToString(
  paths: string[] | string | null,
): string | null {
  if (!paths) return null;
  if (typeof paths === 'string') return paths;
  return paths.length > 0 ? paths.join(',') : null;
}

/**
 * Convert comma-separated string to file paths array
 */
export function stringToFilePaths(str: string | null): string[] {
  if (!str || str.trim() === '') return [];
  return str
    .split(',')
    .map((path) => path.trim())
    .filter((path) => path.length > 0);
}
