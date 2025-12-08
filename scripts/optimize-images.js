import sharp from 'sharp';
import { readdir, stat } from 'fs/promises';
import { join, extname, dirname } from 'path';
import { existsSync, renameSync } from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PUBLIC_DIR = './public';
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];
const MAX_WIDTH = 1920;
const QUALITY = 85;

async function optimizeImage(filePath) {
  try {
    const ext = extname(filePath).toLowerCase();
    const isJpeg = ext === '.jpg' || ext === '.jpeg';
    const isPng = ext === '.png';
    
    // Skip if already optimized or not an image
    if (!IMAGE_EXTENSIONS.includes(ext)) {
      return;
    }
    
    // Skip small files or already optimized
    const stats = await stat(filePath);
    if (stats.size < 50000) { // Skip files smaller than 50KB
      console.log(`⏭️  Skipping small file: ${filePath}`);
      return;
    }
    
    const image = sharp(filePath);
    const metadata = await image.metadata();
    
    // Skip if already small enough
    if (metadata.width && metadata.width <= MAX_WIDTH && stats.size < 200000) {
      console.log(`✅ Already optimized: ${filePath}`);
      return;
    }
    
    // Resize if too large
    let pipeline = image;
    if (metadata.width && metadata.width > MAX_WIDTH) {
      pipeline = pipeline.resize(MAX_WIDTH, null, {
        withoutEnlargement: true,
        fit: 'inside',
      });
    }
    
    // Optimize based on format
    if (isJpeg) {
      await pipeline
        .jpeg({ quality: QUALITY, mozjpeg: true })
        .toFile(filePath + '.tmp');
    } else if (isPng) {
      await pipeline
        .png({ quality: QUALITY, compressionLevel: 9 })
        .toFile(filePath + '.tmp');
    } else {
      // WebP - keep as is or convert
      return;
    }
    
    // Replace original with optimized
    renameSync(filePath + '.tmp', filePath);
    console.log(`✨ Optimized: ${filePath}`);
  } catch (error) {
    console.error(`❌ Error optimizing ${filePath}:`, error.message);
  }
}

async function processDirectory(dir) {
  try {
    const entries = await readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      
      if (entry.isDirectory()) {
        // Skip node_modules and .git
        if (entry.name === 'node_modules' || entry.name === '.git') {
          continue;
        }
        await processDirectory(fullPath);
      } else if (entry.isFile()) {
        const ext = extname(entry.name).toLowerCase();
        if (IMAGE_EXTENSIONS.includes(ext)) {
          await optimizeImage(fullPath);
        }
      }
    }
  } catch (error) {
    console.error(`Error processing directory ${dir}:`, error.message);
  }
}

async function main() {
  console.log('🖼️  Starting image optimization...\n');
  
  if (!existsSync(PUBLIC_DIR)) {
    console.log('❌ Public directory not found!');
    process.exit(1);
  }
  
  await processDirectory(PUBLIC_DIR);
  
  console.log('\n✅ Image optimization complete!');
}

main().catch(console.error);
