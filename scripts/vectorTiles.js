// Vector tile rendering for SVG screenshots (NO raw text emojis to prevent hex-code bugs)

export function renderTileCube(x, y, width, height, iconType, options = {}) {
  const { isMatched = false, isLocked = false, glow = false, layer = 1 } = options;
  const rx = Math.round(width * 0.16);
  const depth = Math.max(4, Math.round(height * 0.08));
  const innerW = width;
  const innerH = height;
  const strokeColor = isMatched ? '#38bdf8' : (isLocked ? '#475569' : '#059669');
  const strokeWidth = isMatched ? 3 : 2;
  const tileBaseColor = isLocked ? '#1e293b' : '#94a3b8';
  const tileFaceColor = isLocked ? '#334155' : '#ffffff';

  return `
    <g transform="translate(${x}, ${y})">
      <!-- Drop shadow -->
      <rect x="2" y="${depth + 2}" width="${innerW}" height="${innerH}" rx="${rx}" fill="#000000" opacity="0.3" filter="blur(3px)"/>
      <!-- 3D extrusion bottom shelf -->
      <rect x="0" y="${depth}" width="${innerW}" height="${innerH}" rx="${rx}" fill="${tileBaseColor}"/>
      <!-- Top Face -->
      <rect x="0" y="0" width="${innerW}" height="${innerH}" rx="${rx}" fill="${tileFaceColor}" stroke="${strokeColor}" stroke-width="${strokeWidth}"/>
      <!-- Inner Bevel Highlight -->
      <rect x="3" y="3" width="${innerW - 6}" height="${Math.round(innerH * 0.45)}" rx="${rx - 2}" fill="#ffffff" opacity="${isLocked ? '0.1' : '0.45'}"/>
      <!-- Vector Icon Inside -->
      <g transform="translate(${width / 2}, ${height / 2 + 1})">
        ${renderVectorIcon(iconType, Math.min(width, height) * 0.58, isLocked)}
      </g>
      ${isMatched ? `
        <rect x="-2" y="-2" width="${innerW + 4}" height="${innerH + 4}" rx="${rx + 2}" fill="none" stroke="#38bdf8" stroke-width="3" opacity="0.85"/>
        <text x="${width/2}" y="${height + depth + 14}" fill="#38bdf8" font-size="11" font-weight="900" text-anchor="middle" font-family="sans-serif">MATCH!</text>
      ` : ''}
    </g>
  `;
}

export function renderVectorIcon(type, size, isLocked = false) {
  const scale = (size / 50).toFixed(3);
  if (isLocked) {
    return `
      <g transform="scale(${scale})">
        <!-- Padlock -->
        <path d="M -10 -2 L -10 -12 C -10 -20 10 -20 10 -12 L 10 -2" fill="none" stroke="#f59e0b" stroke-width="4.5" stroke-linecap="round"/>
        <rect x="-14" y="-4" width="28" height="24" rx="5" fill="#f59e0b"/>
        <circle cx="0" cy="5" r="3" fill="#1e293b"/>
        <polygon points="-2,6 2,6 1.5,13 -1.5,13" fill="#1e293b"/>
      </g>
    `;
  }

  switch (type) {
    case 'apple':
      return `
        <g transform="scale(${scale})">
          <path d="M -2 -22 Q -2 -14 0 -10" stroke="#78350f" stroke-width="3.5" fill="none" stroke-linecap="round"/>
          <path d="M 0 -17 Q 9 -22 11 -15 Q 9 -11 0 -15" fill="#22c55e"/>
          <ellipse cx="-9" cy="2" rx="16" ry="17" fill="#ef4444"/>
          <ellipse cx="9" cy="2" rx="16" ry="17" fill="#dc2626"/>
          <ellipse cx="-10" cy="-3" rx="6" ry="9" fill="#fca5a5" opacity="0.6"/>
        </g>
      `;

    case 'orange':
      return `
        <g transform="scale(${scale})">
          <path d="M 0 -18 Q 8 -23 10 -16 Q 8 -12 0 -16" fill="#16a34a"/>
          <circle cx="0" cy="2" r="19" fill="#f97316"/>
          <circle cx="0" cy="2" r="15" fill="#fb923c"/>
          <!-- Citrus segments -->
          <circle cx="0" cy="2" r="11" fill="#fff7ed"/>
          <circle cx="0" cy="2" r="2" fill="#f97316"/>
          <path d="M -9 2 L 9 2 M 0 -7 L 0 11 M -6 -4 L 6 8 M -6 8 L 6 -4" stroke="#f97316" stroke-width="1.8"/>
        </g>
      `;

    case 'peach':
      return `
        <g transform="scale(${scale})">
          <path d="M 0 -17 Q 8 -22 10 -15 Q 8 -11 0 -15" fill="#22c55e"/>
          <path d="M 0 18 C -18 16 -20 -8 -6 -14 C -2 -16 0 -12 0 -12 C 0 -12 2 -16 6 -14 C 20 -8 18 16 0 18 Z" fill="#fb7185"/>
          <ellipse cx="-6" cy="0" rx="6" ry="10" fill="#fda4af" opacity="0.65"/>
        </g>
      `;

    case 'kiwi':
      return `
        <g transform="scale(${scale})">
          <circle cx="0" cy="0" r="20" fill="#a16207"/>
          <circle cx="0" cy="0" r="17" fill="#84cc16"/>
          <circle cx="0" cy="0" r="7.5" fill="#fef08a"/>
          <!-- Kiwi seeds -->
          <circle cx="-10" cy="0" r="1.5" fill="#1e293b"/>
          <circle cx="10" cy="0" r="1.5" fill="#1e293b"/>
          <circle cx="0" cy="-10" r="1.5" fill="#1e293b"/>
          <circle cx="0" cy="10" r="1.5" fill="#1e293b"/>
          <circle cx="-7" cy="-7" r="1.5" fill="#1e293b"/>
          <circle cx="7" cy="-7" r="1.5" fill="#1e293b"/>
          <circle cx="-7" cy="7" r="1.5" fill="#1e293b"/>
          <circle cx="7" cy="7" r="1.5" fill="#1e293b"/>
        </g>
      `;

    case 'cherry':
      return `
        <g transform="scale(${scale})">
          <path d="M -10 6 Q 0 -16 0 -20" stroke="#78350f" stroke-width="2.8" fill="none"/>
          <path d="M 10 8 Q 0 -16 0 -20" stroke="#78350f" stroke-width="2.8" fill="none"/>
          <path d="M 0 -20 Q 9 -24 11 -17 Q 7 -14 0 -18" fill="#22c55e"/>
          <circle cx="-10" cy="6" r="10.5" fill="#e11d48"/>
          <circle cx="-12" cy="3" r="3.5" fill="#fda4af" opacity="0.75"/>
          <circle cx="10" cy="8" r="10.5" fill="#be123c"/>
          <circle cx="8" cy="5" r="3.5" fill="#fda4af" opacity="0.75"/>
        </g>
      `;

    case 'hibiscus':
      return `
        <g transform="scale(${scale})">
          <!-- 5 tropical petals -->
          <circle cx="0" cy="-10" r="10" fill="#ec4899"/>
          <circle cx="9" cy="-3" r="10" fill="#f43f5e"/>
          <circle cx="6" cy="8" r="10" fill="#ec4899"/>
          <circle cx="-6" cy="8" r="10" fill="#f43f5e"/>
          <circle cx="-9" cy="-3" r="10" fill="#ec4899"/>
          <circle cx="0" cy="0" r="5" fill="#fde047"/>
          <circle cx="0" cy="0" r="2.5" fill="#eab308"/>
        </g>
      `;

    case 'tulip':
      return `
        <g transform="scale(${scale})">
          <line x1="0" y1="2" x2="0" y2="18" stroke="#10b981" stroke-width="3" stroke-linecap="round"/>
          <path d="M 0 10 Q 8 6 10 0 Q 6 6 0 10" fill="#10b981"/>
          <!-- Tulip bloom -->
          <path d="M -12 -6 C -12 8 12 8 12 -6 C 8 -2 5 -12 0 -6 C -5 -12 -8 -2 -12 -6 Z" fill="#f472b6"/>
          <path d="M -4 -6 C -4 4 4 4 4 -6 C 2 -4 0 -8 0 -6 C 0 -8 -2 -4 -4 -6 Z" fill="#ec4899"/>
        </g>
      `;

    case 'palm':
      return `
        <g transform="scale(${scale})">
          <!-- Sanctuary Golden Palm -->
          <rect x="-19" y="-19" width="38" height="38" rx="8" fill="#047857"/>
          <path d="M 0 16 Q 2 2 0 -1" stroke="#d97706" stroke-width="3" fill="none"/>
          <!-- Golden fronds -->
          <path d="M 0 -1 Q -14 -10 -15 2" stroke="#fbbf24" stroke-width="2.5" fill="none"/>
          <path d="M 0 -1 Q 14 -10 15 2" stroke="#fbbf24" stroke-width="2.5" fill="none"/>
          <path d="M 0 -1 Q -10 -16 -4 -16" stroke="#fbbf24" stroke-width="2.5" fill="none"/>
          <path d="M 0 -1 Q 10 -16 4 -16" stroke="#fbbf24" stroke-width="2.5" fill="none"/>
          <circle cx="0" cy="-1" r="2.5" fill="#f59e0b"/>
        </g>
      `;

    case 'gem':
      return `
        <g transform="scale(${scale})">
          <polygon points="0,-16 14,-6 9,14 -9,14 -14,-6" fill="#06b6d4"/>
          <polygon points="0,-16 14,-6 0,0" fill="#38bdf8"/>
          <polygon points="0,-16 -14,-6 0,0" fill="#0284c7"/>
          <polygon points="-14,-6 -9,14 0,0" fill="#0369a1"/>
          <polygon points="14,-6 9,14 0,0" fill="#0ea5e9"/>
        </g>
      `;

    case 'star':
      return `
        <g transform="scale(${scale})">
          <polygon points="0,-17 5,-5 17,-4 8,5 11,17 0,10 -11,17 -8,5 -17,-4 -5,-5" fill="#fbbf24" stroke="#d97706" stroke-width="1.5"/>
          <polygon points="0,-13 3,-4 13,-3 6,4 8,13 0,8 -8,13 -6,4 -13,-3 -3,-4" fill="#fde047"/>
        </g>
      `;

    case 'magnet':
      return `
        <g transform="scale(${scale})">
          <path d="M -12 -12 L -12 2 C -12 12 12 12 12 2 L 12 -12" fill="none" stroke="#ef4444" stroke-width="7" stroke-linecap="round"/>
          <rect x="-16" y="-16" width="8" height="6" fill="#cbd5e1"/>
          <rect x="8" y="-16" width="8" height="6" fill="#cbd5e1"/>
        </g>
      `;

    case 'shuffle':
      return `
        <g transform="scale(${scale})">
          <path d="M -14 10 L -4 10 L 4 -10 L 14 -10" stroke="#38bdf8" stroke-width="4" fill="none" stroke-linecap="round"/>
          <path d="M -14 -10 L -4 -10 L -1 -5 M 1 5 L 4 10 L 14 10" stroke="#38bdf8" stroke-width="4" fill="none" stroke-linecap="round"/>
          <polygon points="14,-14 20,-10 14,-6" fill="#38bdf8"/>
          <polygon points="14,6 20,10 14,14" fill="#38bdf8"/>
        </g>
      `;

    case 'undo':
      return `
        <g transform="scale(${scale})">
          <path d="M 12 12 C 12 -4 -6 -6 -12 0" fill="none" stroke="#a855f7" stroke-width="4.5" stroke-linecap="round"/>
          <polygon points="-16,-4 -12,4 -6,-2" fill="#a855f7"/>
        </g>
      `;

    default:
      return `<circle cx="0" cy="0" r="15" fill="#10b981"/>`;
  }
}
