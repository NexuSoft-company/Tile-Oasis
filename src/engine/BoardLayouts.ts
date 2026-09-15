export type BoardLayoutPattern = 
  | 'Pyramid' 
  | 'Diamond' 
  | 'Circle' 
  | 'Cross' 
  | 'Spiral' 
  | 'Island' 
  | 'Wave' 
  | 'Fortress'
  | 'Hourglass'
  | 'Butterfly'
  | 'Honeycomb'
  | 'Clover'
  | 'Crown'
  | 'Temple'
  | 'TwinPeaks'
  | 'Helix'
  | 'ZenGarden'
  | 'Custom';

export interface GridPosition {
  x: number;
  y: number;
  layer: number;
}

/**
 * Generates structured 3D grid layout coordinates for all board patterns.
 * Coordinates are bounded, non-overlapping, and structured for deterministic layer occlusion.
 */
export class BoardLayouts {
  public static readonly ALL_PATTERNS: BoardLayoutPattern[] = [
    'Pyramid',
    'Diamond',
    'Circle',
    'Cross',
    'Spiral',
    'Island',
    'Wave',
    'Fortress',
    'Hourglass',
    'Butterfly',
    'Honeycomb',
    'Clover',
    'Crown',
    'Temple',
    'TwinPeaks',
    'Helix',
    'ZenGarden',
  ];

  public static generatePositions(
    pattern: BoardLayoutPattern,
    tileCount: number,
    layersCount: number = 3
  ): GridPosition[] {
    switch (pattern) {
      case 'Pyramid':
        return this.generatePyramidLayout(tileCount, layersCount);
      case 'Diamond':
        return this.generateDiamondLayout(tileCount, layersCount);
      case 'Circle':
        return this.generateCircleLayout(tileCount, layersCount);
      case 'Cross':
        return this.generateCrossLayout(tileCount, layersCount);
      case 'Spiral':
        return this.generateSpiralLayout(tileCount, layersCount);
      case 'Island':
        return this.generateIslandLayout(tileCount, layersCount);
      case 'Wave':
        return this.generateWaveLayout(tileCount, layersCount);
      case 'Fortress':
        return this.generateFortressLayout(tileCount, layersCount);
      case 'Hourglass':
        return this.generateHourglassLayout(tileCount, layersCount);
      case 'Butterfly':
        return this.generateButterflyLayout(tileCount, layersCount);
      case 'Honeycomb':
        return this.generateHoneycombLayout(tileCount, layersCount);
      case 'Clover':
        return this.generateCloverLayout(tileCount, layersCount);
      case 'Crown':
        return this.generateCrownLayout(tileCount, layersCount);
      case 'Temple':
        return this.generateTempleLayout(tileCount, layersCount);
      case 'TwinPeaks':
        return this.generateTwinPeaksLayout(tileCount, layersCount);
      case 'Helix':
        return this.generateHelixLayout(tileCount, layersCount);
      case 'ZenGarden':
        return this.generateZenGardenLayout(tileCount, layersCount);
      case 'Custom':
      default:
        return this.generatePyramidLayout(tileCount, layersCount);
    }
  }

  private static generatePyramidLayout(tileCount: number, maxLayers: number): GridPosition[] {
    const positions: GridPosition[] = [];
    let count = 0;

    for (let layer = 0; layer < maxLayers && count < tileCount; layer++) {
      const cols = Math.max(2, 6 - layer);
      const rows = Math.max(2, 5 - layer);
      const offsetX = (6 - cols) * 0.45 + (layer % 2 === 1 ? 0.35 : 0);
      const offsetY = (5 - rows) * 0.45 + (layer % 2 === 1 ? 0.35 : 0);

      for (let r = 0; r < rows && count < tileCount; r++) {
        for (let c = 0; c < cols && count < tileCount; c++) {
          positions.push({
            x: Number((1.2 + c * 0.85 + offsetX).toFixed(2)),
            y: Number((1.2 + r * 0.85 + offsetY).toFixed(2)),
            layer,
          });
          count++;
        }
      }
    }

    let overflowLayer = maxLayers;
    while (count < tileCount) {
      const row = Math.floor((count % 9) / 3);
      const col = (count % 9) % 3;
      positions.push({
        x: Number((1.8 + col * 0.85 + (overflowLayer * 0.15)).toFixed(2)),
        y: Number((1.8 + row * 0.85 + (overflowLayer * 0.15)).toFixed(2)),
        layer: overflowLayer,
      });
      count++;
      if (count % 9 === 0) overflowLayer++;
    }

    return positions;
  }

  private static generateDiamondLayout(tileCount: number, maxLayers: number): GridPosition[] {
    const positions: GridPosition[] = [];
    let count = 0;

    for (let layer = 0; layer < maxLayers && count < tileCount; layer++) {
      const radius = Math.max(1, 3 - layer);
      const offset = layer * 0.25;

      for (let y = -radius; y <= radius && count < tileCount; y++) {
        const xSpan = radius - Math.abs(y);
        for (let x = -xSpan; x <= xSpan && count < tileCount; x++) {
          positions.push({
            x: Number((3.0 + x * 0.85 + offset).toFixed(2)),
            y: Number((2.5 + y * 0.85 + offset).toFixed(2)),
            layer,
          });
          count++;
        }
      }
    }

    while (count < tileCount) {
      positions.push({
        x: Number((3.0 + (count % 3 - 1) * 0.8).toFixed(2)),
        y: Number((2.5 + (Math.floor(count / 3) % 3 - 1) * 0.8).toFixed(2)),
        layer: maxLayers,
      });
      count++;
    }

    return positions;
  }

  private static generateCircleLayout(tileCount: number, maxLayers: number): GridPosition[] {
    const positions: GridPosition[] = [];
    let count = 0;

    for (let layer = 0; layer < maxLayers && count < tileCount; layer++) {
      const layerRadius = 2.0 - layer * 0.35;
      const numOnRing = Math.max(4, Math.floor((tileCount - count) / (maxLayers - layer)));
      
      for (let i = 0; i < numOnRing && count < tileCount; i++) {
        const angle = (i / numOnRing) * Math.PI * 2 + (layer * 0.3);
        positions.push({
          x: Number((3.0 + Math.cos(angle) * layerRadius).toFixed(2)),
          y: Number((2.5 + Math.sin(angle) * layerRadius).toFixed(2)),
          layer,
        });
        count++;
      }
    }

    while (count < tileCount) {
      positions.push({
        x: Number((3.0 + (count % 2 === 0 ? 0.35 : -0.35)).toFixed(2)),
        y: Number((2.5 + (count % 4 >= 2 ? 0.35 : -0.35)).toFixed(2)),
        layer: maxLayers + Math.floor(count / 4),
      });
      count++;
    }

    return positions;
  }

  private static generateCrossLayout(tileCount: number, maxLayers: number): GridPosition[] {
    const positions: GridPosition[] = [];
    let count = 0;

    for (let layer = 0; layer < maxLayers && count < tileCount; layer++) {
      const armLength = Math.max(1, 3 - layer);
      const offset = layer * 0.2;

      positions.push({ x: Number((3.0 + offset).toFixed(2)), y: Number((2.5 + offset).toFixed(2)), layer });
      count++;

      for (let d = 1; d <= armLength && count < tileCount; d++) {
        const arms = [
          { x: 3.0 + d * 0.85 + offset, y: 2.5 + offset },
          { x: 3.0 - d * 0.85 + offset, y: 2.5 + offset },
          { x: 3.0 + offset, y: 2.5 + d * 0.85 + offset },
          { x: 3.0 + offset, y: 2.5 - d * 0.85 + offset },
        ];
        for (const arm of arms) {
          if (count < tileCount) {
            positions.push({ x: Number(arm.x.toFixed(2)), y: Number(arm.y.toFixed(2)), layer });
            count++;
          }
        }
      }
    }

    while (count < tileCount) {
      positions.push({
        x: Number((3.0 + (count % 3 - 1) * 0.75).toFixed(2)),
        y: Number((2.5 + (Math.floor(count / 3) % 3 - 1) * 0.75).toFixed(2)),
        layer: maxLayers,
      });
      count++;
    }

    return positions;
  }

  private static generateSpiralLayout(tileCount: number, maxLayers: number): GridPosition[] {
    const positions: GridPosition[] = [];
    let count = 0;

    for (let i = 0; i < tileCount; i++) {
      const angle = 0.55 * i;
      const radius = 0.28 * Math.sqrt(i);
      const layer = Math.min(maxLayers - 1, Math.floor(i / Math.max(1, tileCount / maxLayers)));
      
      positions.push({
        x: Number((3.0 + Math.cos(angle) * radius).toFixed(2)),
        y: Number((2.5 + Math.sin(angle) * radius).toFixed(2)),
        layer,
      });
      count++;
    }

    return positions;
  }

  private static generateIslandLayout(tileCount: number, maxLayers: number): GridPosition[] {
    const positions: GridPosition[] = [];
    let count = 0;
    const centers = [
      { cx: 1.8, cy: 1.8 },
      { cx: 4.2, cy: 1.8 },
      { cx: 3.0, cy: 3.4 },
    ];

    while (count < tileCount) {
      const center = centers[count % centers.length];
      const subIdx = Math.floor(count / centers.length);
      const layer = Math.min(maxLayers - 1, Math.floor(subIdx / 4));
      const offsetX = (subIdx % 2) * 0.8 + (layer * 0.15);
      const offsetY = Math.floor((subIdx % 4) / 2) * 0.8 + (layer * 0.15);

      positions.push({
        x: Number((center.cx + offsetX).toFixed(2)),
        y: Number((center.cy + offsetY).toFixed(2)),
        layer,
      });
      count++;
    }

    return positions;
  }

  private static generateWaveLayout(tileCount: number, maxLayers: number): GridPosition[] {
    const positions: GridPosition[] = [];
    let count = 0;

    for (let layer = 0; layer < maxLayers && count < tileCount; layer++) {
      const cols = 6;
      const rows = Math.ceil((tileCount / maxLayers) / cols);

      for (let r = 0; r < rows && count < tileCount; r++) {
        for (let c = 0; c < cols && count < tileCount; c++) {
          const waveY = Math.sin(c * 0.8 + layer) * 0.35;
          positions.push({
            x: Number((1.0 + c * 0.8 + layer * 0.15).toFixed(2)),
            y: Number((1.2 + r * 0.8 + waveY + layer * 0.15).toFixed(2)),
            layer,
          });
          count++;
        }
      }
    }

    while (count < tileCount) {
      positions.push({
        x: Number((2.6 + (count % 3) * 0.75).toFixed(2)),
        y: Number((2.4 + Math.floor(count / 3) * 0.75).toFixed(2)),
        layer: maxLayers,
      });
      count++;
    }

    return positions;
  }

  private static generateFortressLayout(tileCount: number, maxLayers: number): GridPosition[] {
    const positions: GridPosition[] = [];
    let count = 0;

    // Outer perimeter walls with inner courtyard keep
    for (let layer = 0; layer < maxLayers && count < tileCount; layer++) {
      const size = 5 - layer;
      const startX = 3.0 - (size * 0.85) / 2 + layer * 0.15;
      const startY = 2.5 - (size * 0.85) / 2 + layer * 0.15;

      for (let r = 0; r < size && count < tileCount; r++) {
        for (let c = 0; c < size && count < tileCount; c++) {
          // Perimeter or center keep
          const isWall = r === 0 || r === size - 1 || c === 0 || c === size - 1;
          const isKeep = layer > 0 && r === Math.floor(size / 2) && c === Math.floor(size / 2);
          if (isWall || isKeep) {
            positions.push({
              x: Number((startX + c * 0.85).toFixed(2)),
              y: Number((startY + r * 0.85).toFixed(2)),
              layer,
            });
            count++;
          }
        }
      }
    }

    while (count < tileCount) {
      positions.push({
        x: Number((3.0 + (count % 3 - 1) * 0.75).toFixed(2)),
        y: Number((2.5 + (Math.floor(count / 3) % 3 - 1) * 0.75).toFixed(2)),
        layer: maxLayers,
      });
      count++;
    }

    return positions;
  }

  private static generateHourglassLayout(tileCount: number, maxLayers: number): GridPosition[] {
    const positions: GridPosition[] = [];
    let count = 0;

    for (let layer = 0; layer < maxLayers && count < tileCount; layer++) {
      const span = 5 - layer;
      for (let r = 0; r < span && count < tileCount; r++) {
        const widthAtRow = Math.abs(r - Math.floor(span / 2)) + 1;
        const startX = 3.0 - (widthAtRow * 0.85) / 2 + layer * 0.15;
        const posY = 1.2 + r * 0.85 + layer * 0.15;

        for (let c = 0; c < widthAtRow && count < tileCount; c++) {
          positions.push({
            x: Number((startX + c * 0.85).toFixed(2)),
            y: Number(posY.toFixed(2)),
            layer,
          });
          count++;
        }
      }
    }

    while (count < tileCount) {
      positions.push({
        x: Number((3.0 + (count % 2 === 0 ? 0.4 : -0.4)).toFixed(2)),
        y: Number((2.5 + (Math.floor(count / 2) % 3 - 1) * 0.75).toFixed(2)),
        layer: maxLayers,
      });
      count++;
    }

    return positions;
  }

  private static generateButterflyLayout(tileCount: number, maxLayers: number): GridPosition[] {
    const positions: GridPosition[] = [];
    let count = 0;

    for (let layer = 0; layer < maxLayers && count < tileCount; layer++) {
      const wingRadius = 1.8 - layer * 0.3;
      const wingCenters = [
        { cx: 2.1, cy: 1.8 }, // Left top
        { cx: 3.9, cy: 1.8 }, // Right top
        { cx: 2.3, cy: 3.2 }, // Left bottom
        { cx: 3.7, cy: 3.2 }, // Right bottom
      ];

      // Central body
      positions.push({ x: Number((3.0 + layer * 0.1).toFixed(2)), y: Number((2.5 + layer * 0.1).toFixed(2)), layer });
      count++;

      for (let i = 0; i < 4 && count < tileCount; i++) {
        const center = wingCenters[i];
        for (let a = 0; a < 3 && count < tileCount; a++) {
          const angle = (a / 3) * Math.PI + (i < 2 ? 0 : Math.PI);
          positions.push({
            x: Number((center.cx + Math.cos(angle) * wingRadius * 0.6 + layer * 0.1).toFixed(2)),
            y: Number((center.cy + Math.sin(angle) * wingRadius * 0.6 + layer * 0.1).toFixed(2)),
            layer,
          });
          count++;
        }
      }
    }

    while (count < tileCount) {
      positions.push({
        x: Number((3.0 + (count % 3 - 1) * 0.75).toFixed(2)),
        y: Number((2.5 + (Math.floor(count / 3) % 3 - 1) * 0.75).toFixed(2)),
        layer: maxLayers,
      });
      count++;
    }

    return positions;
  }

  private static generateHoneycombLayout(tileCount: number, maxLayers: number): GridPosition[] {
    const positions: GridPosition[] = [];
    let count = 0;

    const hexOffsets = [
      { q: 0, r: 0 },
      { q: 1, r: 0 }, { q: 1, r: -1 }, { q: 0, r: -1 },
      { q: -1, r: 0 }, { q: -1, r: 1 }, { q: 0, r: 1 },
      { q: 2, r: 0 }, { q: 2, r: -1 }, { q: 2, r: -2 },
      { q: 1, r: -2 }, { q: 0, r: -2 }, { q: -1, r: -1 },
      { q: -2, r: 0 }, { q: -2, r: 1 }, { q: -2, r: 2 },
      { q: -1, r: 2 }, { q: 0, r: 2 }, { q: 1, r: 1 },
    ];

    for (let layer = 0; layer < maxLayers && count < tileCount; layer++) {
      const scale = 0.85;
      for (const hex of hexOffsets) {
        if (count >= tileCount) break;
        const x = 3.0 + scale * (Math.sqrt(3) * hex.q + (Math.sqrt(3) / 2) * hex.r) * 0.55 + layer * 0.15;
        const y = 2.5 + scale * (1.5 * hex.r) * 0.55 + layer * 0.15;
        positions.push({
          x: Number(x.toFixed(2)),
          y: Number(y.toFixed(2)),
          layer,
        });
        count++;
      }
    }

    while (count < tileCount) {
      positions.push({
        x: Number((3.0 + (count % 3 - 1) * 0.75).toFixed(2)),
        y: Number((2.5 + (Math.floor(count / 3) % 3 - 1) * 0.75).toFixed(2)),
        layer: maxLayers,
      });
      count++;
    }

    return positions;
  }

  private static generateCloverLayout(tileCount: number, maxLayers: number): GridPosition[] {
    const positions: GridPosition[] = [];
    let count = 0;
    const lobes = [
      { cx: 2.2, cy: 1.8 },
      { cx: 3.8, cy: 1.8 },
      { cx: 2.2, cy: 3.2 },
      { cx: 3.8, cy: 3.2 },
    ];

    for (let layer = 0; layer < maxLayers && count < tileCount; layer++) {
      // Center stem
      positions.push({ x: Number((3.0 + layer * 0.15).toFixed(2)), y: Number((2.5 + layer * 0.15).toFixed(2)), layer });
      count++;

      for (let l = 0; l < 4 && count < tileCount; l++) {
        const lobe = lobes[l];
        for (let i = 0; i < 4 && count < tileCount; i++) {
          const angle = (i / 4) * Math.PI * 2;
          positions.push({
            x: Number((lobe.cx + Math.cos(angle) * 0.65 + layer * 0.15).toFixed(2)),
            y: Number((lobe.cy + Math.sin(angle) * 0.65 + layer * 0.15).toFixed(2)),
            layer,
          });
          count++;
        }
      }
    }

    while (count < tileCount) {
      positions.push({
        x: Number((3.0 + (count % 2 === 0 ? 0.4 : -0.4)).toFixed(2)),
        y: Number((2.5 + (Math.floor(count / 2) % 3 - 1) * 0.75).toFixed(2)),
        layer: maxLayers,
      });
      count++;
    }

    return positions;
  }

  private static generateCrownLayout(tileCount: number, maxLayers: number): GridPosition[] {
    const positions: GridPosition[] = [];
    let count = 0;

    for (let layer = 0; layer < maxLayers && count < tileCount; layer++) {
      const peaks = [
        { x: 1.6, y: 1.5 },
        { x: 3.0, y: 1.1 },
        { x: 4.4, y: 1.5 },
      ];
      // Base band
      for (let c = 0; c < 5 && count < tileCount; c++) {
        positions.push({
          x: Number((1.5 + c * 0.75 + layer * 0.15).toFixed(2)),
          y: Number((3.2 + layer * 0.15).toFixed(2)),
          layer,
        });
        count++;
      }
      // Mid band
      for (let c = 0; c < 5 && count < tileCount; c++) {
        positions.push({
          x: Number((1.5 + c * 0.75 + layer * 0.15).toFixed(2)),
          y: Number((2.4 + layer * 0.15).toFixed(2)),
          layer,
        });
        count++;
      }
      // Peaks
      for (const p of peaks) {
        if (count < tileCount) {
          positions.push({
            x: Number((p.x + layer * 0.15).toFixed(2)),
            y: Number((p.y + layer * 0.15).toFixed(2)),
            layer,
          });
          count++;
        }
      }
    }

    while (count < tileCount) {
      positions.push({
        x: Number((3.0 + (count % 3 - 1) * 0.75).toFixed(2)),
        y: Number((2.5 + (Math.floor(count / 3) % 3 - 1) * 0.75).toFixed(2)),
        layer: maxLayers,
      });
      count++;
    }

    return positions;
  }

  private static generateTempleLayout(tileCount: number, maxLayers: number): GridPosition[] {
    const positions: GridPosition[] = [];
    let count = 0;

    for (let layer = 0; layer < maxLayers && count < tileCount; layer++) {
      // Pediment / Triangular roof
      const roofCols = [1, 3, 5];
      for (let r = 0; r < 3 && count < tileCount; r++) {
        const span = roofCols[r];
        const startX = 3.0 - (span * 0.75) / 2 + layer * 0.15;
        for (let c = 0; c < span && count < tileCount; c++) {
          positions.push({
            x: Number((startX + c * 0.75).toFixed(2)),
            y: Number((1.0 + r * 0.7 + layer * 0.15).toFixed(2)),
            layer,
          });
          count++;
        }
      }
      // Columns & Base
      const cols = [1.5, 2.5, 3.5, 4.5];
      for (const colX of cols) {
        if (count < tileCount) {
          positions.push({
            x: Number((colX + layer * 0.15).toFixed(2)),
            y: Number((3.1 + layer * 0.15).toFixed(2)),
            layer,
          });
          count++;
        }
      }
    }

    while (count < tileCount) {
      positions.push({
        x: Number((3.0 + (count % 3 - 1) * 0.75).toFixed(2)),
        y: Number((2.5 + (Math.floor(count / 3) % 3 - 1) * 0.75).toFixed(2)),
        layer: maxLayers,
      });
      count++;
    }

    return positions;
  }

  private static generateTwinPeaksLayout(tileCount: number, maxLayers: number): GridPosition[] {
    const positions: GridPosition[] = [];
    let count = 0;
    const peaks = [
      { cx: 2.1, cy: 2.2 },
      { cx: 3.9, cy: 2.2 },
    ];

    for (let layer = 0; layer < maxLayers && count < tileCount; layer++) {
      for (const peak of peaks) {
        const rows = Math.max(2, 4 - layer);
        for (let r = 0; r < rows && count < tileCount; r++) {
          const span = r + 1;
          const startX = peak.cx - (span * 0.75) / 2 + layer * 0.15;
          for (let c = 0; c < span && count < tileCount; c++) {
            positions.push({
              x: Number((startX + c * 0.75).toFixed(2)),
              y: Number((peak.cy - 0.7 + r * 0.7 + layer * 0.15).toFixed(2)),
              layer,
            });
            count++;
          }
        }
      }
    }

    while (count < tileCount) {
      positions.push({
        x: Number((3.0 + (count % 2 === 0 ? 0.4 : -0.4)).toFixed(2)),
        y: Number((2.5 + (Math.floor(count / 2) % 3 - 1) * 0.75).toFixed(2)),
        layer: maxLayers,
      });
      count++;
    }

    return positions;
  }

  private static generateHelixLayout(tileCount: number, maxLayers: number): GridPosition[] {
    const positions: GridPosition[] = [];
    let count = 0;

    for (let i = 0; i < tileCount; i++) {
      const strand = i % 2 === 0 ? 1 : -1;
      const progress = i / tileCount;
      const angle = progress * Math.PI * 4;
      const layer = Math.min(maxLayers - 1, Math.floor(progress * maxLayers));
      
      const x = 3.0 + strand * Math.cos(angle) * 1.4;
      const y = 1.0 + progress * 3.0;

      positions.push({
        x: Number(x.toFixed(2)),
        y: Number(y.toFixed(2)),
        layer,
      });
      count++;
    }

    return positions;
  }

  private static generateZenGardenLayout(tileCount: number, maxLayers: number): GridPosition[] {
    const positions: GridPosition[] = [];
    let count = 0;

    // Raked sand ripples and central cairn stones
    const cairnCenters = [
      { cx: 3.0, cy: 2.2, size: 3 },
      { cx: 1.8, cy: 3.4, size: 2 },
      { cx: 4.2, cy: 3.4, size: 2 },
    ];

    for (let layer = 0; layer < maxLayers && count < tileCount; layer++) {
      for (const cairn of cairnCenters) {
        const radius = (cairn.size - layer * 0.5) * 0.45;
        if (radius <= 0) continue;
        const countOnCircle = Math.max(3, cairn.size * 2);
        for (let i = 0; i < countOnCircle && count < tileCount; i++) {
          const angle = (i / countOnCircle) * Math.PI * 2 + layer * 0.4;
          positions.push({
            x: Number((cairn.cx + Math.cos(angle) * radius).toFixed(2)),
            y: Number((cairn.cy + Math.sin(angle) * radius).toFixed(2)),
            layer,
          });
          count++;
        }
      }
    }

    while (count < tileCount) {
      positions.push({
        x: Number((3.0 + (count % 3 - 1) * 0.75).toFixed(2)),
        y: Number((2.5 + (Math.floor(count / 3) % 3 - 1) * 0.75).toFixed(2)),
        layer: maxLayers,
      });
      count++;
    }

    return positions;
  }
}
