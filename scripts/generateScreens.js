import { renderTileCube, renderVectorIcon } from './vectorTiles.js';

export function getScreenSvg(screenIndex, w, h, appIconB64, featureGraphicB64) {
  switch (screenIndex) {
    case 1:
      return renderScreen1Home(w, h, appIconB64, featureGraphicB64);
    case 2:
      return renderScreen2Gameplay(w, h);
    case 3:
      return renderScreen3Pyramid(w, h);
    case 4:
      return renderScreen4Shop(w, h);
    case 5:
      return renderScreen5Support(w, h);
    case 6:
      return renderScreen6Zen(w, h);
    case 7:
      return renderScreen7Boosters(w, h);
    case 8:
      return renderScreen8Victory(w, h);
    default:
      return renderScreen1Home(w, h, appIconB64, featureGraphicB64);
  }
}

// ---------------- SCREEN 1: HOME SANCTUARY ----------------
function renderScreen1Home(w, h, appIconB64, featureGraphicB64) {
  return `
    <rect width="${w}" height="${h}" fill="#0a192f"/>
    <!-- Tropical sky gradient -->
    <defs>
      <linearGradient id="skyGrad1" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#0f2b48"/>
        <stop offset="40%" stop-color="#1e4d6d"/>
        <stop offset="75%" stop-color="#115e59"/>
        <stop offset="100%" stop-color="#042f2e"/>
      </linearGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="url(#skyGrad1)"/>

    ${featureGraphicB64 ? `
      <image href="data:image/png;base64,${featureGraphicB64}" x="0" y="${h * 0.08}" width="${w}" height="${h * 0.36}" preserveAspectRatio="xMidYMid slice" opacity="0.6"/>
    ` : ''}

    <!-- Top Status Bar -->
    <rect x="${w * 0.05}" y="${h * 0.025}" width="${w * 0.9}" height="${h * 0.055}" rx="${h * 0.027}" fill="#0f172a" opacity="0.85"/>
    <g transform="translate(${w * 0.12}, ${h * 0.052})">
      ${renderVectorIcon('star', 22)}
      <text x="18" y="5" fill="#facc15" font-size="${h * 0.02}" font-weight="bold" font-family="sans-serif">Rank 13</text>
    </g>
    <g transform="translate(${w * 0.52}, ${h * 0.052})">
      ${renderVectorIcon('gem', 20)}
      <text x="16" y="5" fill="#38bdf8" font-size="${h * 0.019}" font-weight="bold" font-family="sans-serif">523</text>
    </g>
    <g transform="translate(${w * 0.76}, ${h * 0.052})">
      <circle cx="0" cy="0" r="10" fill="#f59e0b"/>
      <text x="15" y="5" fill="#fde047" font-size="${h * 0.019}" font-weight="bold" font-family="sans-serif">28,623</text>
    </g>

    <!-- App Brand & Sanctuary Info -->
    <g transform="translate(${w * 0.5}, ${h * 0.22})">
      ${appIconB64 ? `
        <image href="data:image/png;base64,${appIconB64}" x="${-w * 0.12}" y="${-h * 0.06}" width="${w * 0.24}" height="${w * 0.24}" rx="22"/>
      ` : ''}
      <text x="0" y="${h * 0.08}" fill="#34d399" font-size="${w * 0.04}" font-weight="900" text-anchor="middle" letter-spacing="3" font-family="sans-serif">TILE OASIS</text>
      <text x="0" y="${h * 0.11}" fill="#f8fafc" font-size="${w * 0.055}" font-weight="900" text-anchor="middle" font-family="sans-serif">Sunlit Palm Sanctuary</text>
      <text x="0" y="${h * 0.135}" fill="#94a3b8" font-size="${w * 0.032}" text-anchor="middle" font-family="sans-serif">Level 42 • Emerald Hills (96% Solved)</text>
    </g>

    <!-- Event Banner -->
    <rect x="${w * 0.06}" y="${h * 0.46}" width="${w * 0.88}" height="${h * 0.11}" rx="${w * 0.04}" fill="#0f766e" stroke="#14b8a6" stroke-width="2"/>
    <g transform="translate(${w * 0.14}, ${h * 0.515})">
      ${renderVectorIcon('hibiscus', 34)}
      <text x="32" y="0" fill="#fef08a" font-size="${w * 0.038}" font-weight="bold" font-family="sans-serif">Oasis Bloom Festival</text>
      <text x="32" y="20" fill="#ccfbf1" font-size="${w * 0.028}" font-family="sans-serif">Collect 30 Hibiscus tiles for +1,500 Coins!</text>
    </g>

    <!-- Daily Streak & Quest Grid -->
    <g transform="translate(${w * 0.06}, ${h * 0.60})">
      <rect width="${w * 0.42}" height="${h * 0.09}" rx="${w * 0.03}" fill="#1e293b" stroke="#334155" stroke-width="1.5"/>
      <text x="${w * 0.04}" y="${h * 0.035}" fill="#94a3b8" font-size="${w * 0.028}" font-family="sans-serif">Daily Blessing</text>
      <text x="${w * 0.04}" y="${h * 0.065}" fill="#facc15" font-size="${w * 0.035}" font-weight="bold" font-family="sans-serif">Day 7 Claimed ✓</text>

      <rect x="${w * 0.46}" y="0" width="${w * 0.42}" height="${h * 0.09}" rx="${w * 0.03}" fill="#1e293b" stroke="#334155" stroke-width="1.5"/>
      <text x="${w * 0.50}" y="${h * 0.035}" fill="#94a3b8" font-size="${w * 0.028}" font-family="sans-serif">Active League</text>
      <text x="${w * 0.50}" y="${h * 0.065}" fill="#38bdf8" font-size="${w * 0.035}" font-weight="bold" font-family="sans-serif">Top 5% Master</text>
    </g>

    <!-- Play Level Button -->
    <g transform="translate(${w * 0.1}, ${h * 0.73})">
      <rect width="${w * 0.8}" height="${h * 0.10}" rx="${h * 0.05}" fill="#059669" stroke="#34d399" stroke-width="3"/>
      <text x="${w * 0.4}" y="${h * 0.05}" fill="#ffffff" font-size="${w * 0.058}" font-weight="900" text-anchor="middle" font-family="sans-serif">CONTINUE LEVEL 42</text>
      <text x="${w * 0.4}" y="${h * 0.078}" fill="#a7f3d0" font-size="${w * 0.03}" text-anchor="middle" font-family="sans-serif">Reward: 250 Coins + 5 Gems</text>
    </g>

    <!-- Bottom Navigation Bar -->
    <rect x="0" y="${h * 0.88}" width="${w}" height="${h * 0.12}" fill="#0b1329" stroke="#1e293b" stroke-width="1"/>
    <g transform="translate(${w * 0.2}, ${h * 0.94})">
      <circle cx="0" cy="0" r="16" fill="#047857"/>
      ${renderVectorIcon('palm', 22)}
      <text x="0" y="24" fill="#34d399" font-size="${w * 0.028}" font-weight="bold" text-anchor="middle" font-family="sans-serif">Sanctuary</text>
    </g>
    <g transform="translate(${w * 0.5}, ${h * 0.94})">
      <circle cx="0" cy="0" r="16" fill="#1e293b"/>
      ${renderVectorIcon('apple', 22)}
      <text x="0" y="24" fill="#94a3b8" font-size="${w * 0.028}" text-anchor="middle" font-family="sans-serif">Play</text>
    </g>
    <g transform="translate(${w * 0.8}, ${h * 0.94})">
      <circle cx="0" cy="0" r="16" fill="#1e293b"/>
      ${renderVectorIcon('gem', 20)}
      <text x="0" y="24" fill="#94a3b8" font-size="${w * 0.028}" text-anchor="middle" font-family="sans-serif">Vault</text>
    </g>
  `;
}

// ---------------- SCREEN 2: 3D TRIPLE MATCH GAMEPLAY ----------------
function renderScreen2Gameplay(w, h) {
  const tw = Math.round(w * 0.17);
  const th = Math.round(tw * 1.15);

  return `
    <rect width="${w}" height="${h}" fill="#0d1b2a"/>
    <!-- Ambient play gradient -->
    <defs>
      <radialGradient id="gameAura" cx="50%" cy="45%" r="60%">
        <stop offset="0%" stop-color="#164e63"/>
        <stop offset="70%" stop-color="#0e2439"/>
        <stop offset="100%" stop-color="#06121e"/>
      </radialGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="url(#gameAura)"/>

    <!-- Header bar -->
    <g transform="translate(${w * 0.06}, ${h * 0.035})">
      <rect width="${w * 0.88}" height="${h * 0.065}" rx="${h * 0.032}" fill="#1e293b" opacity="0.9"/>
      <text x="${w * 0.08}" y="${h * 0.04}" fill="#f8fafc" font-size="${w * 0.042}" font-weight="900" font-family="sans-serif">LEVEL 12</text>
      <text x="${w * 0.08}" y="${h * 0.055}" fill="#34d399" font-size="${w * 0.025}" font-family="sans-serif">Medium • 42 Tiles</text>

      <g transform="translate(${w * 0.50}, ${h * 0.033})">
        ${renderVectorIcon('star', 20)}
        <text x="18" y="5" fill="#facc15" font-size="${w * 0.035}" font-weight="bold" font-family="sans-serif">1,420</text>
      </g>
    </g>

    <!-- Multi-Layer 3D Board Layout -->
    <g id="board-tiles">
      <!-- Layer 1 (Bottom) -->
      ${renderTileCube(w * 0.12, h * 0.16, tw, th, 'kiwi', { layer: 1 })}
      ${renderTileCube(w * 0.32, h * 0.16, tw, th, 'orange', { layer: 1 })}
      ${renderTileCube(w * 0.52, h * 0.16, tw, th, 'kiwi', { layer: 1 })}
      ${renderTileCube(w * 0.72, h * 0.16, tw, th, 'peach', { layer: 1 })}

      <!-- Layer 2 (Middle) -->
      ${renderTileCube(w * 0.22, h * 0.27, tw, th, 'apple', { isMatched: true, layer: 2 })}
      ${renderTileCube(w * 0.42, h * 0.27, tw, th, 'apple', { isMatched: true, layer: 2 })}
      ${renderTileCube(w * 0.62, h * 0.27, tw, th, 'apple', { isMatched: true, layer: 2 })}

      <!-- Layer 3 (Foreground & Stack) -->
      ${renderTileCube(w * 0.15, h * 0.39, tw, th, 'hibiscus', { layer: 3 })}
      ${renderTileCube(w * 0.35, h * 0.39, tw, th, 'cherry', { layer: 3 })}
      ${renderTileCube(w * 0.55, h * 0.39, tw, th, 'hibiscus', { layer: 3 })}
      ${renderTileCube(w * 0.75, h * 0.39, tw, th, 'cherry', { layer: 3 })}

      <!-- Locked mystery tiles on side -->
      ${renderTileCube(w * 0.25, h * 0.51, tw, th, 'peach', { isLocked: true, layer: 4 })}
      ${renderTileCube(w * 0.45, h * 0.51, tw, th, 'hibiscus', { layer: 4 })}
      ${renderTileCube(w * 0.65, h * 0.51, tw, th, 'peach', { isLocked: true, layer: 4 })}
    </g>

    <!-- Danger Alert: 1 Slot Left! -->
    <g transform="translate(${w * 0.5}, ${h * 0.67})">
      <rect x="${-w * 0.32}" y="${-h * 0.022}" width="${w * 0.64}" height="${h * 0.044}" rx="${h * 0.022}" fill="#dc2626" opacity="0.95"/>
      <text x="0" y="${h * 0.008}" fill="#ffffff" font-size="${w * 0.036}" font-weight="900" text-anchor="middle" font-family="sans-serif">⚠ 1 TRAY SLOT REMAINING!</text>
    </g>

    <!-- Match Tray Dock (6 of 7 filled) -->
    <g transform="translate(${w * 0.04}, ${h * 0.71})">
      <rect width="${w * 0.92}" height="${h * 0.12}" rx="${w * 0.04}" fill="#111827" stroke="#ef4444" stroke-width="2.5"/>
      <!-- Filled slot tiles in tray -->
      ${renderTileCube(w * 0.03, h * 0.015, tw * 0.75, th * 0.75, 'apple')}
      ${renderTileCube(w * 0.16, h * 0.015, tw * 0.75, th * 0.75, 'apple')}
      ${renderTileCube(w * 0.29, h * 0.015, tw * 0.75, th * 0.75, 'orange')}
      ${renderTileCube(w * 0.42, h * 0.015, tw * 0.75, th * 0.75, 'orange')}
      ${renderTileCube(w * 0.55, h * 0.015, tw * 0.75, th * 0.75, 'cherry')}
      ${renderTileCube(w * 0.68, h * 0.015, tw * 0.75, th * 0.75, 'cherry')}
      <!-- Empty Slot 7 -->
      <rect x="${w * 0.81}" y="${h * 0.015}" width="${tw * 0.75}" height="${th * 0.75}" rx="10" fill="#1f2937" stroke="#374151" stroke-dasharray="4,4"/>
      <text x="${w * 0.87}" y="${h * 0.065}" fill="#6b7280" font-size="20" font-weight="bold" text-anchor="middle">+</text>
    </g>

    <!-- Boosters Deck -->
    <g transform="translate(${w * 0.1}, ${h * 0.86})">
      <!-- Undo -->
      <circle cx="${w * 0.1}" cy="${h * 0.05}" r="${w * 0.08}" fill="#1e293b" stroke="#334155" stroke-width="2"/>
      <g transform="translate(${w * 0.1}, ${h * 0.05})">${renderVectorIcon('undo', 32)}</g>
      <text x="${w * 0.1}" y="${h * 0.105}" fill="#cbd5e1" font-size="${w * 0.028}" text-anchor="middle" font-family="sans-serif">Undo (3)</text>

      <!-- Shuffle -->
      <circle cx="${w * 0.4}" cy="${h * 0.05}" r="${w * 0.08}" fill="#1e293b" stroke="#334155" stroke-width="2"/>
      <g transform="translate(${w * 0.4}, ${h * 0.05})">${renderVectorIcon('shuffle', 32)}</g>
      <text x="${w * 0.4}" y="${h * 0.105}" fill="#cbd5e1" font-size="${w * 0.028}" text-anchor="middle" font-family="sans-serif">Shuffle (5)</text>

      <!-- Magnet -->
      <circle cx="${w * 0.7}" cy="${h * 0.05}" r="${w * 0.08}" fill="#1e293b" stroke="#334155" stroke-width="2"/>
      <g transform="translate(${w * 0.7}, ${h * 0.05})">${renderVectorIcon('magnet', 32)}</g>
      <text x="${w * 0.7}" y="${h * 0.105}" fill="#cbd5e1" font-size="${w * 0.028}" text-anchor="middle" font-family="sans-serif">Magnet (2)</text>
    </g>
  `;
}

// ---------------- SCREEN 3: DIAMOND PYRAMID PUZZLE ----------------
function renderScreen3Pyramid(w, h) {
  const tw = Math.round(w * 0.16);
  const th = Math.round(tw * 1.15);

  return `
    <rect width="${w}" height="${h}" fill="#082f49"/>
    <defs>
      <radialGradient id="pyrAura" cx="50%" cy="40%" r="55%">
        <stop offset="0%" stop-color="#0e7490"/>
        <stop offset="60%" stop-color="#155e75"/>
        <stop offset="100%" stop-color="#083344"/>
      </radialGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="url(#pyrAura)"/>

    <!-- Header bar -->
    <g transform="translate(${w * 0.06}, ${h * 0.035})">
      <rect width="${w * 0.88}" height="${h * 0.065}" rx="${h * 0.032}" fill="#0f172a" opacity="0.9"/>
      <text x="${w * 0.08}" y="${h * 0.04}" fill="#f8fafc" font-size="${w * 0.042}" font-weight="900" font-family="sans-serif">LEVEL 6</text>
      <text x="${w * 0.08}" y="${h * 0.055}" fill="#38bdf8" font-size="${w * 0.025}" font-family="sans-serif">Emerald Sanctuary • Diamond Pattern</text>

      <g transform="translate(${w * 0.65}, ${h * 0.033})">
        <text x="0" y="5" fill="#fde047" font-size="${w * 0.032}" font-weight="bold" font-family="sans-serif">Tiles: 24/36</text>
      </g>
    </g>

    <!-- Symmetrical Diamond Pyramid -->
    <!-- Row 1: Apex -->
    ${renderTileCube(w * 0.42, h * 0.16, tw, th, 'kiwi')}

    <!-- Row 2 -->
    ${renderTileCube(w * 0.32, h * 0.25, tw, th, 'peach')}
    ${renderTileCube(w * 0.52, h * 0.25, tw, th, 'orange')}

    <!-- Row 3: Center Wide -->
    ${renderTileCube(w * 0.22, h * 0.34, tw, th, 'kiwi')}
    ${renderTileCube(w * 0.42, h * 0.34, tw, th, 'kiwi', { isMatched: true })}
    ${renderTileCube(w * 0.62, h * 0.34, tw, th, 'peach')}

    <!-- Row 4 -->
    ${renderTileCube(w * 0.32, h * 0.43, tw, th, 'orange')}
    ${renderTileCube(w * 0.52, h * 0.43, tw, th, 'orange')}

    <!-- Row 5: Base -->
    ${renderTileCube(w * 0.42, h * 0.52, tw, th, 'peach')}

    <!-- Overlay hint badge -->
    <g transform="translate(${w * 0.5}, ${h * 0.65})">
      <rect x="${-w * 0.36}" y="${-h * 0.022}" width="${w * 0.72}" height="${h * 0.044}" rx="${h * 0.022}" fill="#0369a1" stroke="#38bdf8" stroke-width="1.5"/>
      <text x="0" y="${h * 0.008}" fill="#e0f2fe" font-size="${w * 0.032}" font-weight="bold" text-anchor="middle" font-family="sans-serif">MATCH 3 KIWIS TO UNLOCK BASE</text>
    </g>

    <!-- Tray Dock (4 of 7 filled) -->
    <g transform="translate(${w * 0.04}, ${h * 0.71})">
      <rect width="${w * 0.92}" height="${h * 0.12}" rx="${w * 0.04}" fill="#0f172a" stroke="#0284c7" stroke-width="2"/>
      ${renderTileCube(w * 0.03, h * 0.015, tw * 0.75, th * 0.75, 'peach')}
      ${renderTileCube(w * 0.16, h * 0.015, tw * 0.75, th * 0.75, 'peach')}
      ${renderTileCube(w * 0.29, h * 0.015, tw * 0.75, th * 0.75, 'orange')}
      ${renderTileCube(w * 0.42, h * 0.015, tw * 0.75, th * 0.75, 'orange')}
    </g>

    <!-- Boosters Deck -->
    <g transform="translate(${w * 0.1}, ${h * 0.86})">
      <circle cx="${w * 0.1}" cy="${h * 0.05}" r="${w * 0.08}" fill="#1e293b"/>
      <g transform="translate(${w * 0.1}, ${h * 0.05})">${renderVectorIcon('undo', 32)}</g>

      <circle cx="${w * 0.4}" cy="${h * 0.05}" r="${w * 0.08}" fill="#1e293b"/>
      <g transform="translate(${w * 0.4}, ${h * 0.05})">${renderVectorIcon('shuffle', 32)}</g>

      <circle cx="${w * 0.7}" cy="${h * 0.05}" r="${w * 0.08}" fill="#1e293b"/>
      <g transform="translate(${w * 0.7}, ${h * 0.05})">${renderVectorIcon('magnet', 32)}</g>
    </g>
  `;
}

// ---------------- SCREEN 4: SANCTUARY VAULT & SHOP ----------------
function renderScreen4Shop(w, h) {
  return `
    <rect width="${w}" height="${h}" fill="#0f172a"/>
    <defs>
      <linearGradient id="vaultGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#1e1b4b"/>
        <stop offset="60%" stop-color="#0f172a"/>
        <stop offset="100%" stop-color="#090d16"/>
      </linearGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="url(#vaultGrad)"/>

    <!-- Header -->
    <g transform="translate(${w * 0.06}, ${h * 0.04})">
      <text x="0" y="${h * 0.02}" fill="#a855f7" font-size="${w * 0.035}" font-weight="900" letter-spacing="2" font-family="sans-serif">SANCTUARY MARKET</text>
      <text x="0" y="${h * 0.05}" fill="#ffffff" font-size="${w * 0.055}" font-weight="900" font-family="sans-serif">Cosmetics &amp; Tile Sets</text>
    </g>

    <!-- Featured Tile Set Card -->
    <g transform="translate(${w * 0.06}, ${h * 0.12})">
      <rect width="${w * 0.88}" height="${h * 0.22}" rx="${w * 0.04}" fill="#312e81" stroke="#6366f1" stroke-width="2"/>
      <text x="${w * 0.06}" y="${h * 0.04}" fill="#c7d2fe" font-size="${w * 0.03}" font-weight="bold" font-family="sans-serif">FEATURED THEME</text>
      <text x="${w * 0.06}" y="${h * 0.07}" fill="#ffffff" font-size="${w * 0.045}" font-weight="900" font-family="sans-serif">Emerald Jade Haven</text>
      <text x="${w * 0.06}" y="${h * 0.095}" fill="#a5b4fc" font-size="${w * 0.028}" font-family="sans-serif">Custom 3D Bevels • Golden Palm Crest</text>

      <!-- Mini preview tiles -->
      <g transform="translate(${w * 0.06}, ${h * 0.11})">
        ${renderTileCube(0, 0, w * 0.15, w * 0.18, 'palm')}
        ${renderTileCube(w * 0.18, 0, w * 0.15, w * 0.18, 'hibiscus')}
        ${renderTileCube(w * 0.36, 0, w * 0.15, w * 0.18, 'gem')}
      </g>

      <rect x="${w * 0.58}" y="${h * 0.13}" width="${w * 0.26}" height="${h * 0.055}" rx="${h * 0.027}" fill="#10b981"/>
      <text x="${w * 0.71}" y="${h * 0.165}" fill="#ffffff" font-size="${w * 0.032}" font-weight="bold" text-anchor="middle" font-family="sans-serif">EQUIPPED ✓</text>
    </g>

    <!-- Collection Vault Grid -->
    <g transform="translate(${w * 0.06}, ${h * 0.37})">
      <text x="0" y="0" fill="#f8fafc" font-size="${w * 0.04}" font-weight="bold" font-family="sans-serif">Unlockable Tile Themes</text>

      <!-- Theme 1: Tropical Orchard -->
      <g transform="translate(0, ${h * 0.03})">
        <rect width="${w * 0.42}" height="${h * 0.20}" rx="${w * 0.03}" fill="#1e293b" stroke="#334155"/>
        <text x="${w * 0.04}" y="${h * 0.035}" fill="#f8fafc" font-size="${w * 0.032}" font-weight="bold" font-family="sans-serif">Tropical Orchard</text>
        <g transform="translate(${w * 0.04}, ${h * 0.055})">
          ${renderTileCube(0, 0, w * 0.15, w * 0.17, 'apple')}
          ${renderTileCube(w * 0.18, 0, w * 0.15, w * 0.17, 'orange')}
        </g>
        <text x="${w * 0.04}" y="${h * 0.18}" fill="#34d399" font-size="${w * 0.028}" font-weight="bold" font-family="sans-serif">Unlocked (Default)</text>
      </g>

      <!-- Theme 2: Crystal Gemstones -->
      <g transform="translate(${w * 0.46}, ${h * 0.03})">
        <rect width="${w * 0.42}" height="${h * 0.20}" rx="${w * 0.03}" fill="#1e293b" stroke="#334155"/>
        <text x="${w * 0.04}" y="${h * 0.035}" fill="#f8fafc" font-size="${w * 0.032}" font-weight="bold" font-family="sans-serif">Crystal Gems</text>
        <g transform="translate(${w * 0.04}, ${h * 0.055})">
          ${renderTileCube(0, 0, w * 0.15, w * 0.17, 'gem')}
          ${renderTileCube(w * 0.18, 0, w * 0.15, w * 0.17, 'star')}
        </g>
        <rect x="${w * 0.04}" y="${h * 0.15}" width="${w * 0.34}" height="${h * 0.038}" rx="8" fill="#f59e0b"/>
        <text x="${w * 0.21}" y="${h * 0.175}" fill="#1e293b" font-size="${w * 0.026}" font-weight="bold" text-anchor="middle" font-family="sans-serif">150 GEMS</text>
      </g>

      <!-- Theme 3: Mystic Botanical -->
      <g transform="translate(0, ${h * 0.25})">
        <rect width="${w * 0.42}" height="${h * 0.20}" rx="${w * 0.03}" fill="#1e293b" stroke="#334155"/>
        <text x="${w * 0.04}" y="${h * 0.035}" fill="#f8fafc" font-size="${w * 0.032}" font-weight="bold" font-family="sans-serif">Mystic Botanical</text>
        <g transform="translate(${w * 0.04}, ${h * 0.055})">
          ${renderTileCube(0, 0, w * 0.15, w * 0.17, 'tulip')}
          ${renderTileCube(w * 0.18, 0, w * 0.15, w * 0.17, 'hibiscus')}
        </g>
        <rect x="${w * 0.04}" y="${h * 0.15}" width="${w * 0.34}" height="${h * 0.038}" rx="8" fill="#f59e0b"/>
        <text x="${w * 0.21}" y="${h * 0.175}" fill="#1e293b" font-size="${w * 0.026}" font-weight="bold" text-anchor="middle" font-family="sans-serif">200 GEMS</text>
      </g>

      <!-- Theme 4: Celestial Moon -->
      <g transform="translate(${w * 0.46}, ${h * 0.25})">
        <rect width="${w * 0.42}" height="${h * 0.20}" rx="${w * 0.03}" fill="#1e293b" stroke="#334155"/>
        <text x="${w * 0.04}" y="${h * 0.035}" fill="#f8fafc" font-size="${w * 0.032}" font-weight="bold" font-family="sans-serif">Celestial Stars</text>
        <g transform="translate(${w * 0.04}, ${h * 0.055})">
          ${renderTileCube(0, 0, w * 0.15, w * 0.17, 'star')}
          ${renderTileCube(w * 0.18, 0, w * 0.15, w * 0.17, 'peach', { isLocked: true })}
        </g>
        <rect x="${w * 0.04}" y="${h * 0.15}" width="${w * 0.34}" height="${h * 0.038}" rx="8" fill="#64748b"/>
        <text x="${w * 0.21}" y="${h * 0.175}" fill="#ffffff" font-size="${w * 0.026}" font-weight="bold" text-anchor="middle" font-family="sans-serif">LVL 50</text>
      </g>
    </g>

    <!-- Bottom Currency Bar -->
    <rect x="0" y="${h * 0.88}" width="${w}" height="${h * 0.12}" fill="#020617"/>
    <g transform="translate(${w * 0.5}, ${h * 0.94})">
      <text x="0" y="0" fill="#cbd5e1" font-size="${w * 0.032}" text-anchor="middle" font-family="sans-serif">All items unlockable via Free Gameplay Coins &amp; Gems</text>
    </g>
  `;
}

// ---------------- SCREEN 5: MULTILINGUAL SUPPORT ----------------
function renderScreen5Support(w, h) {
  return `
    <rect width="${w}" height="${h}" fill="#0b1329"/>
    <!-- Header -->
    <g transform="translate(${w * 0.06}, ${h * 0.04})">
      <text x="0" y="${h * 0.02}" fill="#38bdf8" font-size="${w * 0.035}" font-weight="900" letter-spacing="2" font-family="sans-serif">HELP &amp; LOCALIZATION</text>
      <text x="0" y="${h * 0.05}" fill="#ffffff" font-size="${w * 0.055}" font-weight="900" font-family="sans-serif">10 Global Languages</text>
    </g>

    <!-- Language Selector Pills -->
    <g transform="translate(${w * 0.06}, ${h * 0.12})">
      <!-- Active English -->
      <rect width="${w * 0.26}" height="${h * 0.045}" rx="${h * 0.022}" fill="#0284c7"/>
      <text x="${w * 0.13}" y="${h * 0.028}" fill="#ffffff" font-size="${w * 0.032}" font-weight="bold" text-anchor="middle" font-family="sans-serif">English ✓</text>

      <!-- Urdu -->
      <rect x="${w * 0.29}" width="${w * 0.26}" height="${h * 0.045}" rx="${h * 0.022}" fill="#1e293b" stroke="#334155"/>
      <text x="${w * 0.42}" y="${h * 0.028}" fill="#cbd5e1" font-size="${w * 0.032}" font-weight="bold" text-anchor="middle" font-family="sans-serif">اردو</text>

      <!-- Arabic -->
      <rect x="${w * 0.58}" width="${w * 0.26}" height="${h * 0.045}" rx="${h * 0.022}" fill="#1e293b" stroke="#334155"/>
      <text x="${w * 0.71}" y="${h * 0.028}" fill="#cbd5e1" font-size="${w * 0.032}" font-weight="bold" text-anchor="middle" font-family="sans-serif">العربية</text>
    </g>

    <g transform="translate(${w * 0.06}, ${h * 0.18})">
      <!-- Persian -->
      <rect width="${w * 0.26}" height="${h * 0.045}" rx="${h * 0.022}" fill="#1e293b" stroke="#334155"/>
      <text x="${w * 0.13}" y="${h * 0.028}" fill="#cbd5e1" font-size="${w * 0.032}" font-weight="bold" text-anchor="middle" font-family="sans-serif">فارسی</text>

      <!-- Turkish -->
      <rect x="${w * 0.29}" width="${w * 0.26}" height="${h * 0.045}" rx="${h * 0.022}" fill="#1e293b" stroke="#334155"/>
      <text x="${w * 0.42}" y="${h * 0.028}" fill="#cbd5e1" font-size="${w * 0.032}" font-weight="bold" text-anchor="middle" font-family="sans-serif">Türkçe</text>

      <!-- Spanish -->
      <rect x="${w * 0.58}" width="${w * 0.26}" height="${h * 0.045}" rx="${h * 0.022}" fill="#1e293b" stroke="#334155"/>
      <text x="${w * 0.71}" y="${h * 0.028}" fill="#cbd5e1" font-size="${w * 0.032}" font-weight="bold" text-anchor="middle" font-family="sans-serif">Español</text>
    </g>

    <!-- FAQ Accordion List -->
    <g transform="translate(${w * 0.06}, ${h * 0.27})">
      <text x="0" y="0" fill="#94a3b8" font-size="${w * 0.032}" font-weight="bold" font-family="sans-serif">FREQUENTLY ASKED QUESTIONS (30+ QUESTIONS)</text>

      <!-- FAQ Card 1 (Expanded) -->
      <g transform="translate(0, ${h * 0.03})">
        <rect width="${w * 0.88}" height="${h * 0.16}" rx="${w * 0.03}" fill="#1e293b" stroke="#0ea5e9" stroke-width="1.5"/>
        <text x="${w * 0.04}" y="${h * 0.038}" fill="#38bdf8" font-size="${w * 0.035}" font-weight="bold" font-family="sans-serif">Q1: How do I match tiles and clear levels?</text>
        <text x="${w * 0.04}" y="${h * 0.075}" fill="#cbd5e1" font-size="${w * 0.028}" font-family="sans-serif">Tap any unblocked tile to place it into your bottom tray.</text>
        <text x="${w * 0.04}" y="${h * 0.105}" fill="#cbd5e1" font-size="${w * 0.028}" font-family="sans-serif">Collect 3 identical tiles to instantly clear them.</text>
        <text x="${w * 0.04}" y="${h * 0.135}" fill="#cbd5e1" font-size="${w * 0.028}" font-family="sans-serif">Avoid filling all 7 tray slots!</text>
      </g>

      <!-- FAQ Card 2 -->
      <g transform="translate(0, ${h * 0.21})">
        <rect width="${w * 0.88}" height="${h * 0.10}" rx="${w * 0.03}" fill="#1e293b" stroke="#334155"/>
        <text x="${w * 0.04}" y="${h * 0.038}" fill="#f8fafc" font-size="${w * 0.035}" font-weight="bold" font-family="sans-serif">Q2: How do Boosters (Magnet, Shuffle) work?</text>
        <text x="${w * 0.04}" y="${h * 0.07}" fill="#94a3b8" font-size="${w * 0.026}" font-family="sans-serif">Magnet automatically finds and pulls a matching pair...</text>
      </g>

      <!-- FAQ Card 3 -->
      <g transform="translate(0, ${h * 0.33})">
        <rect width="${w * 0.88}" height="${h * 0.10}" rx="${w * 0.03}" fill="#1e293b" stroke="#334155"/>
        <text x="${w * 0.04}" y="${h * 0.038}" fill="#f8fafc" font-size="${w * 0.035}" font-weight="bold" font-family="sans-serif">Q3: Can I play 100% offline without internet?</text>
        <text x="${w * 0.04}" y="${h * 0.07}" fill="#94a3b8" font-size="${w * 0.026}" font-family="sans-serif">Yes! All levels and soundscapes run entirely on your device.</text>
      </g>

      <!-- Submit Feedback Button -->
      <g transform="translate(0, ${h * 0.46})">
        <rect width="${w * 0.88}" height="${h * 0.07}" rx="${h * 0.035}" fill="#059669"/>
        <text x="${w * 0.44}" y="${h * 0.042}" fill="#ffffff" font-size="${w * 0.035}" font-weight="bold" text-anchor="middle" font-family="sans-serif">Ask Question / Contact Support</text>
      </g>
    </g>
  `;
}

// ---------------- SCREEN 6: RELAXING ZEN BLOSSOM ----------------
function renderScreen6Zen(w, h) {
  const tw = Math.round(w * 0.17);
  const th = Math.round(tw * 1.15);

  return `
    <rect width="${w}" height="${h}" fill="#064e3b"/>
    <defs>
      <radialGradient id="zenAura" cx="50%" cy="40%" r="60%">
        <stop offset="0%" stop-color="#047857"/>
        <stop offset="60%" stop-color="#065f46"/>
        <stop offset="100%" stop-color="#022c22"/>
      </radialGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="url(#zenAura)"/>

    <!-- Header bar -->
    <g transform="translate(${w * 0.06}, ${h * 0.035})">
      <rect width="${w * 0.88}" height="${h * 0.065}" rx="${h * 0.032}" fill="#062e24" opacity="0.9"/>
      <text x="${w * 0.08}" y="${h * 0.04}" fill="#f8fafc" font-size="${w * 0.042}" font-weight="900" font-family="sans-serif">LEVEL 4</text>
      <text x="${w * 0.08}" y="${h * 0.055}" fill="#34d399" font-size="${w * 0.025}" font-family="sans-serif">Zen Blossom • No Time Limit</text>

      <g transform="translate(${w * 0.65}, ${h * 0.033})">
        <text x="0" y="5" fill="#a7f3d0" font-size="${w * 0.032}" font-weight="bold" font-family="sans-serif">Relax &amp; Match</text>
      </g>
    </g>

    <!-- Blossom Cross Layout -->
    <!-- Top Petal -->
    ${renderTileCube(w * 0.42, h * 0.16, tw, th, 'cherry')}
    ${renderTileCube(w * 0.42, h * 0.27, tw, th, 'cherry')}

    <!-- Left & Right Petals -->
    ${renderTileCube(w * 0.22, h * 0.27, tw, th, 'apple')}
    ${renderTileCube(w * 0.62, h * 0.27, tw, th, 'apple')}

    <!-- Center Blossom Cluster -->
    ${renderTileCube(w * 0.32, h * 0.38, tw, th, 'orange')}
    ${renderTileCube(w * 0.52, h * 0.38, tw, th, 'orange')}

    <!-- Bottom Stem Petals -->
    ${renderTileCube(w * 0.42, h * 0.49, tw, th, 'cherry')}
    ${renderTileCube(w * 0.22, h * 0.49, tw, th, 'apple')}
    ${renderTileCube(w * 0.62, h * 0.49, tw, th, 'apple')}

    <!-- Zen Quote Banner -->
    <g transform="translate(${w * 0.5}, ${h * 0.64})">
      <rect x="${-w * 0.38}" y="${-h * 0.022}" width="${w * 0.76}" height="${h * 0.044}" rx="${h * 0.022}" fill="#065f46" stroke="#34d399" stroke-width="1.5"/>
      <text x="0" y="${h * 0.008}" fill="#ecfdf5" font-size="${w * 0.032}" font-weight="bold" text-anchor="middle" font-family="sans-serif">GENTLE HAPTICS • CALM FLOW</text>
    </g>

    <!-- Tray Dock (3 of 7 filled) -->
    <g transform="translate(${w * 0.04}, ${h * 0.71})">
      <rect width="${w * 0.92}" height="${h * 0.12}" rx="${w * 0.04}" fill="#062e24" stroke="#059669" stroke-width="2"/>
      ${renderTileCube(w * 0.03, h * 0.015, tw * 0.75, th * 0.75, 'cherry')}
      ${renderTileCube(w * 0.16, h * 0.015, tw * 0.75, th * 0.75, 'cherry')}
      ${renderTileCube(w * 0.29, h * 0.015, tw * 0.75, th * 0.75, 'orange')}
    </g>

    <!-- Boosters Deck -->
    <g transform="translate(${w * 0.1}, ${h * 0.86})">
      <circle cx="${w * 0.1}" cy="${h * 0.05}" r="${w * 0.08}" fill="#062e24"/>
      <g transform="translate(${w * 0.1}, ${h * 0.05})">${renderVectorIcon('undo', 32)}</g>

      <circle cx="${w * 0.4}" cy="${h * 0.05}" r="${w * 0.08}" fill="#062e24"/>
      <g transform="translate(${w * 0.4}, ${h * 0.05})">${renderVectorIcon('shuffle', 32)}</g>

      <circle cx="${w * 0.7}" cy="${h * 0.05}" r="${w * 0.08}" fill="#062e24"/>
      <g transform="translate(${w * 0.7}, ${h * 0.05})">${renderVectorIcon('magnet', 32)}</g>
    </g>
  `;
}

// ---------------- SCREEN 7: POWERFUL BOOSTERS & COMBOS ----------------
function renderScreen7Boosters(w, h) {
  const tw = Math.round(w * 0.17);
  const th = Math.round(tw * 1.15);

  return `
    <rect width="${w}" height="${h}" fill="#1e1b4b"/>
    <defs>
      <radialGradient id="magAura" cx="50%" cy="45%" r="65%">
        <stop offset="0%" stop-color="#4338ca"/>
        <stop offset="60%" stop-color="#312e81"/>
        <stop offset="100%" stop-color="#0f172a"/>
      </radialGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="url(#magAura)"/>

    <!-- Header bar -->
    <g transform="translate(${w * 0.06}, ${h * 0.035})">
      <rect width="${w * 0.88}" height="${h * 0.065}" rx="${h * 0.032}" fill="#312e81" opacity="0.9"/>
      <text x="${w * 0.08}" y="${h * 0.04}" fill="#f8fafc" font-size="${w * 0.042}" font-weight="900" font-family="sans-serif">LEVEL 18</text>
      <text x="${w * 0.08}" y="${h * 0.055}" fill="#818cf8" font-size="${w * 0.025}" font-family="sans-serif">Hard • 3x Combo Surge Active!</text>

      <g transform="translate(${w * 0.65}, ${h * 0.033})">
        <text x="0" y="5" fill="#f43f5e" font-size="${w * 0.032}" font-weight="900" font-family="sans-serif">MAGNET ACTIVE!</text>
      </g>
    </g>

    <!-- Board with active magnet pulling beam -->
    ${renderTileCube(w * 0.15, h * 0.18, tw, th, 'tulip')}
    ${renderTileCube(w * 0.42, h * 0.18, tw, th, 'tulip', { isMatched: true })}
    ${renderTileCube(w * 0.69, h * 0.18, tw, th, 'tulip')}

    <!-- Glowing Magnetic Ray Beam -->
    <path d="M ${w * 0.5} ${h * 0.45} L ${w * 0.42 + tw/2} ${h * 0.18 + th/2}" stroke="#ec4899" stroke-width="4" stroke-dasharray="6,4"/>
    <circle cx="${w * 0.5}" cy="${h * 0.45}" r="35" fill="#ec4899" opacity="0.3"/>
    <circle cx="${w * 0.5}" cy="${h * 0.45}" r="22" fill="#be185d"/>
    <g transform="translate(${w * 0.5}, ${h * 0.45})">${renderVectorIcon('magnet', 36)}</g>

    ${renderTileCube(w * 0.22, h * 0.32, tw, th, 'apple')}
    ${renderTileCube(w * 0.62, h * 0.32, tw, th, 'orange')}

    ${renderTileCube(w * 0.32, h * 0.53, tw, th, 'peach')}
    ${renderTileCube(w * 0.52, h * 0.53, tw, th, 'peach')}

    <!-- Combo Burst Banner -->
    <g transform="translate(${w * 0.5}, ${h * 0.65})">
      <rect x="${-w * 0.38}" y="${-h * 0.026}" width="${w * 0.76}" height="${h * 0.052}" rx="${h * 0.026}" fill="#ec4899" stroke="#fbcfe8" stroke-width="2"/>
      <text x="0" y="${h * 0.009}" fill="#ffffff" font-size="${w * 0.04}" font-weight="900" text-anchor="middle" font-family="sans-serif">⚡ TRIPLE COMBO! +300 PTS</text>
    </g>

    <!-- Tray Dock with auto-completed match -->
    <g transform="translate(${w * 0.04}, ${h * 0.72})">
      <rect width="${w * 0.92}" height="${h * 0.12}" rx="${w * 0.04}" fill="#0f172a" stroke="#818cf8" stroke-width="2"/>
      ${renderTileCube(w * 0.03, h * 0.015, tw * 0.75, th * 0.75, 'tulip', { isMatched: true })}
      ${renderTileCube(w * 0.16, h * 0.015, tw * 0.75, th * 0.75, 'tulip', { isMatched: true })}
      ${renderTileCube(w * 0.29, h * 0.015, tw * 0.75, th * 0.75, 'tulip', { isMatched: true })}
    </g>

    <!-- Boosters Deck -->
    <g transform="translate(${w * 0.1}, ${h * 0.86})">
      <circle cx="${w * 0.1}" cy="${h * 0.05}" r="${w * 0.08}" fill="#1e1b4b"/>
      <g transform="translate(${w * 0.1}, ${h * 0.05})">${renderVectorIcon('undo', 32)}</g>

      <circle cx="${w * 0.4}" cy="${h * 0.05}" r="${w * 0.08}" fill="#1e1b4b"/>
      <g transform="translate(${w * 0.4}, ${h * 0.05})">${renderVectorIcon('shuffle', 32)}</g>

      <!-- Active glowing magnet circle -->
      <circle cx="${w * 0.7}" cy="${h * 0.05}" r="${w * 0.09}" fill="#ec4899" stroke="#f43f5e" stroke-width="3"/>
      <g transform="translate(${w * 0.7}, ${h * 0.05})">${renderVectorIcon('magnet', 34)}</g>
    </g>
  `;
}

// ---------------- SCREEN 8: VICTORY & STAR REWARDS ----------------
function renderScreen8Victory(w, h) {
  return `
    <rect width="${w}" height="${h}" fill="#022c22"/>
    <!-- Sunburst Victory background -->
    <defs>
      <radialGradient id="vicAura" cx="50%" cy="40%" r="70%">
        <stop offset="0%" stop-color="#047857"/>
        <stop offset="40%" stop-color="#065f46"/>
        <stop offset="100%" stop-color="#022c22"/>
      </radialGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="url(#vicAura)"/>

    <!-- Blurred background gameplay -->
    <g opacity="0.3">
      <rect x="${w * 0.1}" y="${h * 0.1}" width="${w * 0.8}" height="${h * 0.7}" fill="#0f172a" rx="20"/>
    </g>

    <!-- Victory Modal Card -->
    <g transform="translate(${w * 0.06}, ${h * 0.18})">
      <rect width="${w * 0.88}" height="${h * 0.64}" rx="${w * 0.06}" fill="#0f172a" stroke="#f59e0b" stroke-width="3"/>

      <!-- Golden Sunburst Header -->
      <path d="M 0 0 L ${w * 0.88} 0 L ${w * 0.88} ${h * 0.18} C ${w * 0.44} ${h * 0.24} 0 ${h * 0.18} Z" fill="#78350f" opacity="0.4"/>

      <!-- 3 Golden Stars -->
      <g transform="translate(${w * 0.22}, ${h * 0.10})">
        ${renderVectorIcon('star', 44)}
      </g>
      <g transform="translate(${w * 0.44}, ${h * 0.07})">
        ${renderVectorIcon('star', 62)}
      </g>
      <g transform="translate(${w * 0.66}, ${h * 0.10})">
        ${renderVectorIcon('star', 44)}
      </g>

      <!-- Victory Title -->
      <text x="${w * 0.44}" y="${h * 0.22}" fill="#fbbf24" font-size="${w * 0.065}" font-weight="900" text-anchor="middle" font-family="sans-serif">LEVEL COMPLETE!</text>
      <text x="${w * 0.44}" y="${h * 0.26}" fill="#94a3b8" font-size="${w * 0.035}" text-anchor="middle" font-family="sans-serif">Emerald Sanctuary • Level 42</text>

      <!-- Rewards Grid -->
      <g transform="translate(${w * 0.08}, ${h * 0.30})">
        <!-- Coin Reward -->
        <rect width="${w * 0.34}" height="${h * 0.11}" rx="${w * 0.03}" fill="#1e293b" stroke="#f59e0b"/>
        <circle cx="${w * 0.17}" cy="${h * 0.038}" r="16" fill="#f59e0b"/>
        <text x="${w * 0.17}" y="${h * 0.044}" fill="#78350f" font-size="14" font-weight="bold" text-anchor="middle">$</text>
        <text x="${w * 0.17}" y="${h * 0.085}" fill="#fde047" font-size="${w * 0.04}" font-weight="bold" text-anchor="middle" font-family="sans-serif">+500 COINS</text>

        <!-- Gem Reward -->
        <rect x="${w * 0.38}" width="${w * 0.34}" height="${h * 0.11}" rx="${w * 0.03}" fill="#1e293b" stroke="#06b6d4"/>
        <g transform="translate(${w * 0.55}, ${h * 0.038})">${renderVectorIcon('gem', 26)}</g>
        <text x="${w * 0.55}" y="${h * 0.085}" fill="#38bdf8" font-size="${w * 0.04}" font-weight="bold" text-anchor="middle" font-family="sans-serif">+25 GEMS</text>
      </g>

      <!-- Level Up Progress Bar -->
      <g transform="translate(${w * 0.08}, ${h * 0.44})">
        <text x="0" y="0" fill="#cbd5e1" font-size="${w * 0.03}" font-weight="bold" font-family="sans-serif">Sanctuary Progress: 96% &gt; 100%</text>
        <rect y="${h * 0.015}" width="${w * 0.72}" height="${h * 0.02}" rx="${h * 0.01}" fill="#334155"/>
        <rect y="${h * 0.015}" width="${w * 0.72}" height="${h * 0.02}" rx="${h * 0.01}" fill="#10b981"/>
      </g>

      <!-- Claim Reward Button -->
      <g transform="translate(${w * 0.08}, ${h * 0.51})">
        <rect width="${w * 0.72}" height="${h * 0.09}" rx="${h * 0.045}" fill="#059669" stroke="#34d399" stroke-width="2"/>
        <text x="${w * 0.36}" y="${h * 0.055}" fill="#ffffff" font-size="${w * 0.05}" font-weight="900" text-anchor="middle" font-family="sans-serif">CLAIM &amp; NEXT LEVEL</text>
      </g>
    </g>
  `;
}
