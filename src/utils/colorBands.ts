export interface ColorBand {
  color: string;
  height: number;
  startY: number;
}

interface RGB {
  r: number;
  g: number;
  b: number;
}

// Calculate color distance using Euclidean distance in RGB space
function colorDistance(color1: RGB, color2: RGB): number {
  const rDiff = color1.r - color2.r;
  const gDiff = color1.g - color2.g;
  const bDiff = color1.b - color2.b;
  return Math.sqrt(rDiff * rDiff + gDiff * gDiff + bDiff * bDiff);
}

// Convert RGB to hex string
function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => {
    const hex = Math.round(x).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

// Get average color of a row of pixels
function getRowAverageColor(
  imageData: ImageData,
  rowIndex: number,
  width: number
): RGB {
  let r = 0, g = 0, b = 0;
  const startIndex = rowIndex * width * 4;

  for (let x = 0; x < width; x++) {
    const pixelIndex = startIndex + (x * 4);
    r += imageData.data[pixelIndex];
    g += imageData.data[pixelIndex + 1];
    b += imageData.data[pixelIndex + 2];
  }

  return {
    r: r / width,
    g: g / width,
    b: b / width
  };
}

// Get average color for a range of rows
function getAverageColor(
  rowColors: RGB[],
  startRow: number,
  endRow: number
): RGB {
  let r = 0, g = 0, b = 0;
  const count = endRow - startRow;

  for (let i = startRow; i < endRow; i++) {
    r += rowColors[i].r;
    g += rowColors[i].g;
    b += rowColors[i].b;
  }

  return {
    r: r / count,
    g: g / count,
    b: b / count
  };
}

export function generateColorBands(
  image: HTMLImageElement,
  colorThreshold: number = 25,
  minBandHeight: number = 2
): ColorBand[] {
  // Create canvas to read pixel data
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d', { willReadFrequently: true });

  if (!ctx) {
    throw new Error('Could not get canvas context');
  }

  canvas.width = image.width;
  canvas.height = image.height;
  ctx.drawImage(image, 0, 0);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  // Calculate average color for each row
  const rowColors: RGB[] = [];
  for (let y = 0; y < canvas.height; y++) {
    rowColors.push(getRowAverageColor(imageData, y, canvas.width));
  }

  // Group rows into bands based on color similarity
  const bands: ColorBand[] = [];
  let bandStartRow = 0;
  let bandRows: RGB[] = [rowColors[0]];

  for (let y = 1; y < canvas.height; y++) {
    const currentRowColor = rowColors[y];
    const bandAvgColor = getAverageColor(rowColors, bandStartRow, y);
    const distance = colorDistance(currentRowColor, bandAvgColor);

    // If color is too different or band is getting too large, start a new band
    if (distance > colorThreshold || (y - bandStartRow) > canvas.height / 3) {
      // Only create band if it meets minimum height
      if (y - bandStartRow >= minBandHeight) {
        const avgColor = getAverageColor(rowColors, bandStartRow, y);
        bands.push({
          color: rgbToHex(avgColor.r, avgColor.g, avgColor.b),
          height: y - bandStartRow,
          startY: bandStartRow
        });

        bandStartRow = y;
        bandRows = [currentRowColor];
      }
    } else {
      bandRows.push(currentRowColor);
    }
  }

  // Add the last band
  if (bandStartRow < canvas.height) {
    const avgColor = getAverageColor(rowColors, bandStartRow, canvas.height);
    bands.push({
      color: rgbToHex(avgColor.r, avgColor.g, avgColor.b),
      height: canvas.height - bandStartRow,
      startY: bandStartRow
    });
  }

  return bands;
}

export function renderColorBands(
  bands: ColorBand[],
  width: number,
  height: number
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Could not get canvas context');
  }

  canvas.width = width;
  canvas.height = height;

  // Calculate scale factor
  const totalHeight = bands.reduce((sum, band) => sum + band.height, 0);
  const scale = height / totalHeight;

  let currentY = 0;
  for (const band of bands) {
    const bandHeight = band.height * scale;
    ctx.fillStyle = band.color;
    ctx.fillRect(0, currentY, width, bandHeight);
    currentY += bandHeight;
  }

  return canvas;
}
