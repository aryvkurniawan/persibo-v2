import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logoPath = path.join(__dirname, '..', 'public', 'logo.png');

if (!fs.existsSync(logoPath)) {
  console.error('❌ logo.png not found in public folder');
  process.exit(1);
}

console.log('📦 Resizing logo.png...');

const sizes = [
  { width: 32, name: 'logo-32.png' },
  { width: 64, name: 'logo-64.png' },
  { width: 128, name: 'logo-128.png' }
];

Promise.all(sizes.map(({ width, name }) => {
  const outputPath = path.join(__dirname, '..', 'public', name);
  return sharp(logoPath)
    .resize(width, null, {
      withoutEnlargement: true,
      fit: 'contain'
    })
    .png({
      quality: 90,
      compressionLevel: 9
    })
    .toFile(outputPath)
    .then(() => {
      console.log(`✅ Created ${name}`);
    })
    .catch((err) => {
      console.error(`❌ Error creating ${name}:`, err.message);
    });
})).then(() => {
  console.log('✨ Logo resizing completed!');
}).catch((err) => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});

