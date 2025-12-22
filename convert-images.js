import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

// Get current directory in ES Module environment
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the directory to scan (e.g., 'public')
const directoryToScan = path.join(__dirname, 'public');

// Helper to recursively find files
const getFiles = (dir) => {
  if (!fs.existsSync(dir)) return [];
  const subdirs = fs.readdirSync(dir);
  const files = subdirs.map((subdir) => {
    const res = path.resolve(dir, subdir);
    return (fs.statSync(res).isDirectory()) ? getFiles(res) : res;
  });
  return files.reduce((a, f) => a.concat(f), []);
};

const convertImages = async () => {
  console.log(`Scanning ${directoryToScan} for images...`);
  
  if (!fs.existsSync(directoryToScan)) {
      console.log(`Directory ${directoryToScan} not found. Please ensure you have a 'public' folder.`);
      return;
  }

  const files = getFiles(directoryToScan);
  // Filter for PNG and JPG/JPEG
  const imageFiles = files.filter(file => /\.(png|jpe?g)$/i.test(file));

  if (imageFiles.length === 0) {
    console.log('No PNG or JPG images found to convert.');
    return;
  }

  console.log(`Found ${imageFiles.length} images. Starting conversion...`);

  let convertedCount = 0;

  for (const file of imageFiles) {
    const ext = path.extname(file);
    const newFile = file.replace(new RegExp(`${ext}$`), '.webp');

    // Skip if WebP already exists to avoid redundant work
    if (fs.existsSync(newFile)) {
      continue;
    }

    try {
      await sharp(file)
        .webp({ quality: 80, effort: 6 }) // Quality 80 is a good balance, effort 6 maximizes compression
        .toFile(newFile);
      
      console.log(`✅ Converted: ${path.basename(file)} -> ${path.basename(newFile)}`);
      convertedCount++;
    } catch (err) {
      console.error(`❌ Error converting ${path.basename(file)}:`, err);
    }
  }

  if (convertedCount === 0) {
      console.log('🎉 No new images to convert. All WebP files already exist.');
  } else {
      console.log(`🎉 Done! Converted ${convertedCount} images.`);
  }
};

convertImages();
