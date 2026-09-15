import { ViewportDimensions, BoardAutoFitLayout } from '../types/gameEngine';

export class BoardAutoFitSystem {
  /**
   * Calculates dynamic board layout scaling rules based on viewport dimensions and safe areas.
   */
  public static calculateLayout(
    viewport: ViewportDimensions,
    gridBounds?: { minX: number; maxX: number; minY: number; maxY: number }
  ): BoardAutoFitLayout {
    // Determine available height for board after subtracting top HUD, tray, booster bar, and safe area notches
    const topHudHeight = 60 + viewport.safeAreaTop;
    const bottomTrayHeight = 160 + viewport.safeAreaBottom;
    const padding = 16;

    const availableWidth = Math.max(280, viewport.width - padding * 2 - viewport.safeAreaLeft - viewport.safeAreaRight);
    const availableHeight = Math.max(260, viewport.height - topHudHeight - bottomTrayHeight - padding * 2);

    const minX = gridBounds?.minX ?? 0;
    const maxX = gridBounds?.maxX ?? 5;
    const minY = gridBounds?.minY ?? 0;
    const maxY = gridBounds?.maxY ?? 5;

    const gridCols = Math.max(5, Math.ceil(maxX - minX + 1));
    const gridRows = Math.max(5, Math.ceil(maxY - minY + 1));

    const gridCenterX = (minX + maxX) / 2;
    const gridCenterY = (minY + maxY) / 2;

    // Calculate maximum tile size that fits both available width & height
    const maxTileSizeByWidth = availableWidth / (gridCols + 0.5);
    const maxTileSizeByHeight = availableHeight / ((gridRows + 0.5) * 1.16);

    // Target tile size capped between 36px (small screens) and 68px (tablets/desktops)
    const rawTileSize = Math.min(maxTileSizeByWidth, maxTileSizeByHeight);
    const tileSize = Math.max(36, Math.min(68, Math.floor(rawTileSize)));

    const tileSpacing = Math.floor(tileSize * 0.95);
    const layerOffsetPixels = Math.floor(tileSize * 0.1);

    const boardWidth = gridCols * tileSpacing;
    const boardHeight = gridRows * tileSpacing;

    const scaleFactor = tileSize / 56; // Standard 56px baseline reference scale

    const boardCenterX = viewport.width / 2;
    const boardCenterY = topHudHeight + availableHeight / 2;

    return {
      boardWidth,
      boardHeight,
      tileSize,
      tileSpacing,
      layerOffsetPixels,
      boardCenterX,
      boardCenterY,
      gridCenterX,
      gridCenterY,
      scaleFactor,
    };
  }

  /**
   * Helper presets for testing responsive viewports.
   */
  public static getDevicePresets(): Record<string, ViewportDimensions> {
    return {
      responsive: {
        width: 390,
        height: 700,
        safeAreaTop: 20,
        safeAreaBottom: 20,
        safeAreaLeft: 0,
        safeAreaRight: 0,
        deviceType: 'small_phone',
      },
      small_compact: {
        width: 320,
        height: 568,
        safeAreaTop: 10,
        safeAreaBottom: 10,
        safeAreaLeft: 0,
        safeAreaRight: 0,
        deviceType: 'small_phone',
      },
      iphone_15_pro: {
        width: 393,
        height: 852,
        safeAreaTop: 59, // Dynamic Island / Notch
        safeAreaBottom: 34, // Home indicator
        safeAreaLeft: 0,
        safeAreaRight: 0,
        deviceType: 'iphone_notch',
      },
      pixel_7: {
        width: 412,
        height: 915,
        safeAreaTop: 40,
        safeAreaBottom: 24,
        safeAreaLeft: 0,
        safeAreaRight: 0,
        deviceType: 'large_phone',
      },
      ipad_air: {
        width: 820,
        height: 1180,
        safeAreaTop: 24,
        safeAreaBottom: 20,
        safeAreaLeft: 0,
        safeAreaRight: 0,
        deviceType: 'tablet',
      },
    };
  }
}
