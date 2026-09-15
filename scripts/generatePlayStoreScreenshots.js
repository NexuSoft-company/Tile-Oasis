import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { getScreenSvg } from './generateScreens.js';

// Output directories
const DIRS = {
  mobile: 'public/screenshots/mobile',
  tablet7: 'public/screenshots/tablet-7inch',
  tablet10: 'public/screenshots/tablet-10inch',
  laptop: 'public/screenshots/laptop',
};

// Ensure all target directories exist
for (const dir of Object.values(DIRS)) {
  fs.mkdirSync(dir, { recursive: true });
}

// Read public assets to embed in SVGs
const appIconB64 = fs.existsSync('public/app-icon.png')
  ? fs.readFileSync('public/app-icon.png').toString('base64')
  : '';
const featureGraphicB64 = fs.existsSync('public/feature-graphic.png')
  ? fs.readFileSync('public/feature-graphic.png').toString('base64')
  : '';

console.log('Loaded icon and feature graphic for embedding.');

// 8 Marketing Headings & Subtitles
const SCREEN_METADATA = [
  {
    badge: '★ SUNLIT PALM SANCTUARY ★',
    title: 'EXPLORE BEAUTIFUL WORLDS',
    subtitle: 'Unlock 1,000+ Zen Levels &amp; Secret Tropical Havens',
    filename: 'screenshot_1_home.png',
  },
  {
    badge: '★ 3D TRIPLE MATCH ACTION ★',
    title: 'MATCH 3 IDENTICAL TILES',
    subtitle: 'Clear the Board Before the Tray Fills Up!',
    filename: 'screenshot_2_gameplay.png',
  },
  {
    badge: '★ BRAIN PUZZLE CHALLENGE ★',
    title: 'MASTER THE DIAMOND PYRAMID',
    subtitle: 'Strategize Layer by Layer to Reveal Hidden Fruits',
    filename: 'screenshot_3_pyramid.png',
  },
  {
    badge: '★ SANCTUARY VAULT ★',
    title: 'CUSTOMIZE YOUR TILES',
    subtitle: 'Collect Rare Styles, Gemstones &amp; Mystic Boards',
    filename: 'screenshot_4_shop.png',
  },
  {
    badge: '★ 10 LANGUAGES SUPPORTED ★',
    title: 'PLAY IN YOUR OWN LANGUAGE',
    subtitle: 'English, Urdu, Arabic, Persian, Turkish &amp; More',
    filename: 'screenshot_5_support.png',
  },
  {
    badge: '★ RELAXING ZEN ADVENTURE ★',
    title: 'CALMING OFFLINE PUZZLE',
    subtitle: 'No Pressure • Gentle Haptics • Satisfying Clears',
    filename: 'screenshot_6_zen.png',
  },
  {
    badge: '★ POWERFUL TILE BOOSTERS ★',
    title: 'UNLEASH EPIC COMBOS',
    subtitle: 'Use Magnet, Shuffle &amp; Undo to Conquer Hard Levels',
    filename: 'screenshot_7_boosters.png',
  },
  {
    badge: '★ REWARDING PROGRESSION ★',
    title: 'EARN 3 STARS &amp; CHESTS',
    subtitle: 'Claim Daily Blessings, Gold Coins &amp; Rare Gems',
    filename: 'screenshot_8_victory.png',
  },
];

// Helper: Compose Full Play Store Marketing Graphic
function composePlayStoreGraphic(deviceType, screenIndex, totalW, totalH) {
  const meta = SCREEN_METADATA[screenIndex - 1];
  const isLandscape = totalW > totalH;

  // Background atmosphere gradient
  const bg = `
    <defs>
      <linearGradient id="bgGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#04121e"/>
        <stop offset="35%" stop-color="#072235"/>
        <stop offset="70%" stop-color="#0a323f"/>
        <stop offset="100%" stop-color="#061c22"/>
      </linearGradient>
      <linearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#f59e0b"/>
        <stop offset="50%" stop-color="#fbbf24"/>
        <stop offset="100%" stop-color="#d97706"/>
      </linearGradient>
    </defs>
    <rect width="${totalW}" height="${totalH}" fill="url(#bgGrad)"/>
    <!-- Subtle luxury glow -->
    <circle cx="${totalW * 0.5}" cy="${totalH * 0.2}" r="${totalW * 0.4}" fill="#0d9488" opacity="0.12" filter="blur(80px)"/>
  `;

  if (isLandscape) {
    // Landscape Layout (Laptop / Chromebook 1920x1080)
    const mockupW = Math.round(totalW * 0.60);
    const mockupH = Math.round(mockupW * (10 / 16));
    const mockupX = Math.round(totalW * 0.36);
    const mockupY = Math.round((totalH - mockupH) * 0.52);

    const screenContent = getScreenSvg(screenIndex, mockupW - 32, mockupH - 40, appIconB64, featureGraphicB64);

    return `
      <svg width="${totalW}" height="${totalH}" viewBox="0 0 ${totalW} ${totalH}" xmlns="http://www.w3.org/2000/svg">
        ${bg}
        <!-- Left Side Copy -->
        <g transform="translate(${totalW * 0.05}, ${totalH * 0.32})">
          <!-- Gold Pill -->
          <rect width="${totalW * 0.28}" height="42" rx="21" fill="url(#goldGrad)"/>
          <text x="${totalW * 0.14}" y="26" fill="#022c22" font-size="15" font-weight="900" text-anchor="middle" letter-spacing="2" font-family="system-ui, sans-serif">${meta.badge}</text>

          <!-- Main Title -->
          <text x="0" y="95" fill="#ffffff" font-size="44" font-weight="900" font-family="system-ui, sans-serif">${meta.title}</text>
          <!-- Subtitle -->
          <text x="0" y="145" fill="#a7f3d0" font-size="20" font-weight="500" font-family="system-ui, sans-serif">${meta.subtitle}</text>

          <!-- Star review rating -->
          <g transform="translate(0, 180)">
            <text x="0" y="22" fill="#fbbf24" font-size="22" font-family="system-ui, sans-serif">★★★★★</text>
            <text x="95" y="22" fill="#cbd5e1" font-size="16" font-family="system-ui, sans-serif">4.9 • 1,000+ Zen Levels</text>
          </g>
        </g>

        <!-- Right Side Laptop Mockup -->
        <g transform="translate(${mockupX}, ${mockupY})">
          <!-- Screen Outer Lid -->
          <rect x="0" y="0" width="${mockupW}" height="${mockupH}" rx="18" fill="#1e293b" stroke="#475569" stroke-width="4"/>
          <!-- Camera Dot -->
          <circle cx="${mockupW / 2}" cy="10" r="3" fill="#0f172a"/>
          <!-- Inner Screen -->
          <g transform="translate(16, 20)">
            <clipPath id="lapClip_${screenIndex}">
              <rect width="${mockupW - 32}" height="${mockupH - 40}" rx="10"/>
            </clipPath>
            <g clip-path="url(#lapClip_${screenIndex})">
              ${screenContent}
            </g>
          </g>
          <!-- Laptop Base Shelf -->
          <path d="M ${-mockupW * 0.05} ${mockupH} L ${mockupW * 1.05} ${mockupH} L ${mockupW * 1.03} ${mockupH + 20} L ${-mockupW * 0.03} ${mockupH + 20} Z" fill="#334155"/>
          <rect x="${mockupW * 0.42}" y="${mockupH}" width="${mockupW * 0.16}" height="8" rx="4" fill="#64748b"/>
        </g>
      </svg>
    `;
  }

  // Portrait Layout (Mobile 1080x1920, 7" Tablet 1200x1920, 10" Tablet 1600x2560)
  const isHero = screenIndex === 1;
  const mockupScale = isHero ? 0.84 : 0.80;
  const mockupW = Math.round(totalW * mockupScale);
  const mockupH = Math.round(mockupW * (16 / 9));
  const mockupX = Math.round((totalW - mockupW) / 2);
  const mockupY = Math.round(totalH * (isHero ? 0.24 : 0.26));

  const bezelRadius = Math.round(mockupW * 0.10);
  const screenW = mockupW - 24;
  const screenH = mockupH - 24;

  const screenContent = getScreenSvg(screenIndex, screenW, screenH, appIconB64, featureGraphicB64);

  return `
    <svg width="${totalW}" height="${totalH}" viewBox="0 0 ${totalW} ${totalH}" xmlns="http://www.w3.org/2000/svg">
      ${bg}

      <!-- Top Marketing Header -->
      <g transform="translate(${totalW * 0.5}, ${totalH * 0.07})">
        <!-- Gold Badge -->
        <rect x="${-totalW * 0.35}" y="0" width="${totalW * 0.70}" height="${totalH * 0.026}" rx="${totalH * 0.013}" fill="url(#goldGrad)"/>
        <text x="0" y="${totalH * 0.018}" fill="#022c22" font-size="${totalW * 0.027}" font-weight="900" text-anchor="middle" letter-spacing="2.5" font-family="system-ui, sans-serif">${meta.badge}</text>

        <!-- Bold Title -->
        <text x="0" y="${totalH * 0.075}" fill="#ffffff" font-size="${totalW * 0.058}" font-weight="900" text-anchor="middle" font-family="system-ui, sans-serif">${meta.title}</text>

        <!-- Subtitle -->
        <text x="0" y="${totalH * 0.11}" fill="#a7f3d0" font-size="${totalW * 0.033}" font-weight="500" text-anchor="middle" font-family="system-ui, sans-serif">${meta.subtitle}</text>
      </g>

      ${isHero ? `
        <!-- Golden Halo Aura for Hero Screen -->
        <ellipse cx="${totalW * 0.5}" cy="${mockupY + mockupH * 0.4}" rx="${mockupW * 0.6}" ry="${mockupH * 0.4}" fill="#f59e0b" opacity="0.14" filter="blur(60px)"/>
      ` : ''}

      <!-- Device Mockup -->
      <g transform="translate(${mockupX}, ${mockupY})">
        <!-- Phone Outer Frame -->
        <rect x="0" y="0" width="${mockupW}" height="${mockupH}" rx="${bezelRadius}" fill="#0f172a" stroke="#334155" stroke-width="${isHero ? '6' : '4'}"/>
        
        <!-- Screen Clip -->
        <g transform="translate(12, 12)">
          <clipPath id="phoneClip_${deviceType}_${screenIndex}">
            <rect width="${screenW}" height="${screenH}" rx="${bezelRadius - 10}"/>
          </clipPath>
          <g clip-path="url(#phoneClip_${deviceType}_${screenIndex})">
            ${screenContent}
          </g>
        </g>

        <!-- Dynamic Island / Top Camera Pill -->
        <rect x="${(mockupW - mockupW * 0.28) / 2}" y="18" width="${mockupW * 0.28}" height="${mockupH * 0.018}" rx="${mockupH * 0.009}" fill="#000000"/>
        <circle cx="${mockupW / 2 + mockupW * 0.09}" cy="23" r="3" fill="#1e293b"/>
      </g>
    </svg>
  `;
}

// ---------------- GENERATION RUNNER ----------------
async function generateAllScreenshots() {
  console.log('🚀 Starting Professional Play Store Screenshot Generation (8 screenshots per device)...');

  const configs = [
    { dirKey: 'mobile', label: 'Mobile Phone', w: 1080, h: 1920 },
    { dirKey: 'tablet7', label: '7" Tablet', w: 1200, h: 1920 },
    { dirKey: 'tablet10', label: '10" Tablet', w: 1600, h: 2560 },
    { dirKey: 'laptop', label: 'Laptop / Chromebook', w: 1920, h: 1080 },
  ];

  let totalCount = 0;

  for (const cfg of configs) {
    const targetDir = DIRS[cfg.dirKey];
    console.log(`\n📱 Generating 8 screenshots for ${cfg.label} (${cfg.w}x${cfg.h}) into ${targetDir}...`);

    for (let i = 1; i <= 8; i++) {
      const meta = SCREEN_METADATA[i - 1];
      const svg = composePlayStoreGraphic(cfg.dirKey, i, cfg.w, cfg.h);
      const destPath = path.join(targetDir, meta.filename);

      await sharp(Buffer.from(svg))
        .png({ compressionLevel: 8 })
        .toFile(destPath);

      const stats = fs.statSync(destPath);
      console.log(`  ✓ Saved: ${destPath} (${Math.round(stats.size / 1024)} KB)`);
      totalCount++;
    }
  }

  console.log(`\n🎉 SUCCESS! Generated ${totalCount} high-resolution Play Store screenshots (8 for each device category).`);
}

generateAllScreenshots().catch(err => {
  console.error('Error generating screenshots:', err);
  process.exit(1);
});
