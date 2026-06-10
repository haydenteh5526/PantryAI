/**
 * Generate app icon and splash screen assets for PantryAI.
 * 
 * Run: npm run generate-assets
 * Requires: npm install --save-dev sharp
 * 
 * This creates proper PNG files for:
 * - assets/icon.png (1024x1024)
 * - assets/adaptive-icon.png (1024x1024, with padding)
 * - assets/splash.png (1284x2778)
 * - assets/favicon.png (48x48)
 */

const sharp = require("sharp");
const path = require("path");

const BRAND_GREEN = "#52796F";
const SAGE_GREEN = "#84A98C";
const WHITE = "#FFFFFF";

async function createIcon(size, outputName, padding = 0) {
  const innerSize = size - padding * 2;
  const forkSize = Math.floor(innerSize * 0.4);
  
  // Create a simple restaurant/fork icon on green gradient background
  const svg = `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${SAGE_GREEN}"/>
          <stop offset="100%" style="stop-color:${BRAND_GREEN}"/>
        </linearGradient>
      </defs>
      <rect width="${size}" height="${size}" rx="${Math.floor(size * 0.2)}" fill="url(#bg)"/>
      <g transform="translate(${size / 2}, ${size / 2})">
        <!-- Fork icon -->
        <rect x="${-forkSize * 0.35}" y="${-forkSize * 0.8}" width="${forkSize * 0.08}" height="${forkSize * 0.5}" rx="${forkSize * 0.04}" fill="${WHITE}"/>
        <rect x="${-forkSize * 0.15}" y="${-forkSize * 0.8}" width="${forkSize * 0.08}" height="${forkSize * 0.5}" rx="${forkSize * 0.04}" fill="${WHITE}"/>
        <rect x="${forkSize * 0.05}" y="${-forkSize * 0.8}" width="${forkSize * 0.08}" height="${forkSize * 0.5}" rx="${forkSize * 0.04}" fill="${WHITE}"/>
        <rect x="${-forkSize * 0.15}" y="${-forkSize * 0.35}" width="${forkSize * 0.08}" height="${forkSize * 1.1}" rx="${forkSize * 0.04}" fill="${WHITE}"/>
        <rect x="${-forkSize * 0.4}" y="${-forkSize * 0.35}" width="${forkSize * 0.58}" height="${forkSize * 0.12}" rx="${forkSize * 0.06}" fill="${WHITE}"/>
        <!-- Knife -->
        <rect x="${forkSize * 0.3}" y="${-forkSize * 0.8}" width="${forkSize * 0.1}" height="${forkSize * 1.55}" rx="${forkSize * 0.05}" fill="${WHITE}"/>
        <ellipse cx="${forkSize * 0.35}" cy="${-forkSize * 0.55}" rx="${forkSize * 0.12}" ry="${forkSize * 0.25}" fill="${WHITE}"/>
      </g>
    </svg>
  `;

  await sharp(Buffer.from(svg)).resize(size, size).png().toFile(path.join(__dirname, "..", "assets", outputName));
  console.log(`✓ Generated ${outputName} (${size}x${size})`);
}

async function createSplash() {
  const width = 1284;
  const height = 2778;
  const iconSize = 200;

  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="${BRAND_GREEN}"/>
      <g transform="translate(${width / 2}, ${height / 2 - 60})">
        <!-- Icon circle -->
        <circle cx="0" cy="0" r="${iconSize / 2}" fill="${SAGE_GREEN}" opacity="0.3"/>
        <circle cx="0" cy="0" r="${iconSize / 2.5}" fill="${SAGE_GREEN}" opacity="0.5"/>
        <!-- Fork icon (smaller) -->
        <rect x="-28" y="-50" width="6" height="35" rx="3" fill="${WHITE}"/>
        <rect x="-12" y="-50" width="6" height="35" rx="3" fill="${WHITE}"/>
        <rect x="4" y="-50" width="6" height="35" rx="3" fill="${WHITE}"/>
        <rect x="-12" y="-18" width="6" height="68" rx="3" fill="${WHITE}"/>
        <rect x="-32" y="-18" width="46" height="8" rx="4" fill="${WHITE}"/>
        <!-- Knife -->
        <rect x="22" y="-50" width="8" height="100" rx="4" fill="${WHITE}"/>
        <ellipse cx="26" cy="-32" rx="10" ry="18" fill="${WHITE}"/>
      </g>
      <!-- App name -->
      <text x="${width / 2}" y="${height / 2 + 140}" text-anchor="middle" font-family="Arial, sans-serif" font-size="64" font-weight="bold" fill="${WHITE}">PantryAI</text>
    </svg>
  `;

  await sharp(Buffer.from(svg)).resize(width, height).png().toFile(path.join(__dirname, "..", "assets", "splash.png"));
  console.log(`✓ Generated splash.png (${width}x${height})`);
}

async function main() {
  console.log("Generating PantryAI assets...\n");
  await createIcon(1024, "icon.png");
  await createIcon(1024, "adaptive-icon.png", 100);
  await createIcon(48, "favicon.png", 0);
  await createSplash();
  console.log("\n✅ All assets generated!");
}

main().catch(console.error);
