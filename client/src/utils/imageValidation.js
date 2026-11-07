/**
 * Image Upload Validation Utilities
 * Validates format, file size, and handles image preview generation safely.
 */

export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5 Megabytes
export const SUPPORTED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp'
];

export const SUPPORTED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];

/**
 * Validate image file format and size
 * @param {File} file File object from input
 * @returns {{ valid: boolean, error?: string }}
 */
export function validateImageFile(file) {
  if (!file) {
    return { valid: false, error: 'No file selected. Please select an image to upload.' };
  }

  // Type check
  const fileType = (file.type || '').toLowerCase();
  const fileName = (file.name || '').toLowerCase();
  const hasValidExt = SUPPORTED_EXTENSIONS.some(ext => fileName.endsWith(ext));

  if (!SUPPORTED_MIME_TYPES.includes(fileType) && !hasValidExt) {
    return {
      valid: false,
      error: 'Unsupported image format. Please upload a JPG, JPEG, PNG, or WEBP image.'
    };
  }

  // Size check
  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `File is too large (${sizeInMB} MB). Maximum allowed upload size is 5 MB.`
    };
  }

  return { valid: true };
}

/**
 * Format bytes to readable string (e.g. 1.2 MB, 450 KB)
 */
export function formatFileSize(bytes) {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

