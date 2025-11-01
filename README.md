# Color Band Art Generator

Transform your photos into abstract horizontal color bands with smart segmentation based on color distribution.

## Features

- **Smart Color Segmentation**: Intelligently groups rows of pixels with similar colors instead of using fixed-size bands
- **Drag & Drop Interface**: Easy-to-use image upload with drag-and-drop support
- **Live Preview**: See changes in real-time as you adjust settings
- **Adjustable Controls**:
  - Color Sensitivity: Control how many bands are created (lower = more bands)
  - Minimum Band Height: Set the minimum height for each color band
- **Export**: Download your color band art as a PNG image

## Getting Started

### Prerequisites

- Node.js 20.6.1 or higher

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build

```bash
npm run build
```

## How It Works

The app uses a smart segmentation algorithm that:

1. Analyzes each row of pixels in the uploaded image
2. Calculates the average color for each row
3. Groups consecutive rows with similar colors into bands
4. Uses color distance (Euclidean distance in RGB space) to determine when to create a new band
5. Renders the final color bands maintaining the original proportions

## Tech Stack

- React 18
- TypeScript
- Vite
- HTML5 Canvas API

## Usage

1. Drag and drop an image or click to browse
2. Adjust the Color Sensitivity slider to control the number of bands
3. Adjust the Minimum Band Height to prevent very thin bands
4. Click "Download Color Bands" to save your creation
