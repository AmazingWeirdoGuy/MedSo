import sharp from 'sharp';

export interface ProcessedImages {
  original: string;
  thumbnail: string;
}

// Convert base64 data URL to buffer
function base64ToBuffer(dataURL: string): Buffer {
  const base64Data = dataURL.split(',')[1];
  if (!base64Data) {
    throw new Error('Invalid data URL format');
  }
  return Buffer.from(base64Data, 'base64');
}

// Convert buffer to base64 data URL
function bufferToBase64DataURL(buffer: Buffer, mimeType: string = 'image/jpeg'): string {
  const base64 = buffer.toString('base64');
  return `data:${mimeType};base64,${base64}`;
}

// Process image from base64 data URL or buffer and return base64 data URLs
export async function processImage(
  input: string | Buffer, 
  memberId: string
): Promise<ProcessedImages> {
  let imageBuffer: Buffer;
  
  if (typeof input === 'string') {
    // Handle base64 data URL
    imageBuffer = base64ToBuffer(input);
  } else {
    // Handle buffer from file upload
    imageBuffer = input;
  }

  // Process original image (max 1200px width, maintain aspect ratio)
  const originalBuffer = await sharp(imageBuffer)
    .resize(1200, 1200, { 
      fit: 'inside', 
      withoutEnlargement: true 
    })
    .jpeg({ quality: 90 })
    .toBuffer();

  // Process thumbnail (256x256 square, cropped to center)
  const thumbnailBuffer = await sharp(imageBuffer)
    .resize(256, 256, { 
      fit: 'cover', 
      position: 'center' 
    })
    .jpeg({ quality: 85 })
    .toBuffer();

  // Return base64 data URLs for database storage
  return {
    original: bufferToBase64DataURL(originalBuffer, 'image/jpeg'),
    thumbnail: bufferToBase64DataURL(thumbnailBuffer, 'image/jpeg')
  };
}

// No cleanup needed for base64 images - they're stored in database
export async function cleanupOldImages(imageUrl: string, thumbnailUrl: string) {
  // Base64 images are stored in the database, no file cleanup needed
  return;
}