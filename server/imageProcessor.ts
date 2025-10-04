import sharp from 'sharp';
import { randomUUID } from 'crypto';
import path from 'path';
import fs from 'fs/promises';

export interface ProcessedImages {
  original: {
    webp: string;
    avif: string;
    jpg: string;
  };
  thumbnail: {
    webp: string;
    avif: string;
    jpg: string;
  };
}

const IMAGES_DIR = path.join(process.cwd(), 'public', 'uploads', 'members');

// Ensure upload directory exists
async function ensureUploadDir() {
  try {
    await fs.access(IMAGES_DIR);
  } catch {
    await fs.mkdir(IMAGES_DIR, { recursive: true });
  }
}

// Convert base64 data URL to buffer
function base64ToBuffer(dataURL: string): Buffer {
  const base64Data = dataURL.split(',')[1];
  if (!base64Data) {
    throw new Error('Invalid data URL format');
  }
  return Buffer.from(base64Data, 'base64');
}

// Process image from base64 data URL or buffer
export async function processImage(
  input: string | Buffer, 
  memberId: string
): Promise<ProcessedImages> {
  await ensureUploadDir();

  let imageBuffer: Buffer;
  
  if (typeof input === 'string') {
    // Handle base64 data URL
    imageBuffer = base64ToBuffer(input);
  } else {
    // Handle buffer from file upload
    imageBuffer = input;
  }

  const timestamp = Date.now();
  const baseFilename = `${memberId}_${timestamp}`;

  // Process original image (max 1200px width, maintain aspect ratio)
  const originalImage = sharp(imageBuffer)
    .resize(1200, 1200, { 
      fit: 'inside', 
      withoutEnlargement: true 
    })
    .jpeg({ quality: 90 });

  // Process thumbnail (256x256 square, cropped to center)
  const thumbnailImage = sharp(imageBuffer)
    .resize(256, 256, { 
      fit: 'cover', 
      position: 'center' 
    })
    .jpeg({ quality: 85 });

  // Generate all format combinations
  const results: ProcessedImages = {
    original: {
      webp: `/uploads/members/${baseFilename}_original.webp`,
      avif: `/uploads/members/${baseFilename}_original.avif`,
      jpg: `/uploads/members/${baseFilename}_original.jpg`
    },
    thumbnail: {
      webp: `/uploads/members/${baseFilename}_thumb.webp`,
      avif: `/uploads/members/${baseFilename}_thumb.avif`,
      jpg: `/uploads/members/${baseFilename}_thumb.jpg`
    }
  };

  // Save original images
  await Promise.all([
    originalImage.clone().webp({ quality: 85 }).toFile(path.join(IMAGES_DIR, `${baseFilename}_original.webp`)),
    originalImage.clone().avif({ quality: 65 }).toFile(path.join(IMAGES_DIR, `${baseFilename}_original.avif`)),
    originalImage.clone().jpeg({ quality: 90 }).toFile(path.join(IMAGES_DIR, `${baseFilename}_original.jpg`))
  ]);

  // Save thumbnail images
  await Promise.all([
    thumbnailImage.clone().webp({ quality: 85 }).toFile(path.join(IMAGES_DIR, `${baseFilename}_thumb.webp`)),
    thumbnailImage.clone().avif({ quality: 65 }).toFile(path.join(IMAGES_DIR, `${baseFilename}_thumb.avif`)),
    thumbnailImage.clone().jpeg({ quality: 85 }).toFile(path.join(IMAGES_DIR, `${baseFilename}_thumb.jpg`))
  ]);

  return results;
}

// Clean up old images when member is updated
export async function cleanupOldImages(imageUrl: string, thumbnailUrl: string) {
  try {
    if (imageUrl?.startsWith('/uploads/members/')) {
      const imagePath = path.join(process.cwd(), 'public', imageUrl);
      const baseFilename = path.basename(imagePath).replace(/\.(webp|avif|jpg)$/, '');
      
      // Remove all format variants for both original and thumbnail
      const filesToDelete = [
        `${baseFilename}.webp`,
        `${baseFilename}.avif`, 
        `${baseFilename}.jpg`,
        `${baseFilename.replace('_original', '_thumb')}.webp`,
        `${baseFilename.replace('_original', '_thumb')}.avif`,
        `${baseFilename.replace('_original', '_thumb')}.jpg`
      ];
      
      await Promise.all(
        filesToDelete.map(async (filename) => {
          try {
            await fs.unlink(path.join(IMAGES_DIR, filename));
          } catch (error) {
            // Ignore errors if file doesn't exist
            console.warn(`Failed to delete ${filename}:`, error);
          }
        })
      );
    }
  } catch (error) {
    console.warn('Failed to clean up old images:', error);
  }
}

// Helper function to get the best image source for frontend
export function getOptimizedImageSrc(
  webpUrl: string, 
  avifUrl: string, 
  jpgUrl: string
): { sources: Array<{ srcSet: string; type: string }>, fallback: string } {
  return {
    sources: [
      { srcSet: avifUrl, type: 'image/avif' },
      { srcSet: webpUrl, type: 'image/webp' }
    ],
    fallback: jpgUrl
  };
}