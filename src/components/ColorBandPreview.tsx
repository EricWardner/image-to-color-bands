import { useEffect, useRef, useState } from 'react';
import { generateColorBands, renderColorBands } from '../utils/colorBands';
import type { ColorBand } from '../utils/colorBands';
import './ColorBandPreview.css';

interface ColorBandPreviewProps {
  image: HTMLImageElement;
  onReset: () => void;
}

export function ColorBandPreview({ image, onReset }: ColorBandPreviewProps) {
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const [colorThreshold, setColorThreshold] = useState(25);
  const [minBandHeight, setMinBandHeight] = useState(2);
  const [outputWidth, setOutputWidth] = useState(Math.min(image.width, 1920));
  const [bands, setBands] = useState<ColorBand[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!image || !previewCanvasRef.current) return;

    setIsProcessing(true);

    // Use setTimeout to allow UI to update
    setTimeout(() => {
      try {
        const colorBands = generateColorBands(image, colorThreshold, minBandHeight);
        setBands(colorBands);

        const canvas = previewCanvasRef.current;
        if (canvas) {
          // Render at a reasonable size
          const maxWidth = 800;
          const scale = Math.min(1, maxWidth / image.width);
          const width = image.width * scale;
          const height = image.height * scale;

          const renderedCanvas = renderColorBands(colorBands, width, height);

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(renderedCanvas, 0, 0);
          }
        }
      } catch (error) {
        console.error('Error generating color bands:', error);
      } finally {
        setIsProcessing(false);
      }
    }, 10);
  }, [image, colorThreshold, minBandHeight]);

  const handleDownload = () => {
    if (!bands.length) return;

    // Render at the specified output resolution
    const scale = outputWidth / image.width;
    const width = outputWidth;
    const height = image.height * scale;

    const downloadCanvas = renderColorBands(bands, width, height);

    const link = document.createElement('a');
    link.download = 'color-bands.png';
    link.href = downloadCanvas.toDataURL();
    link.click();
  };

  return (
    <div className="preview-container">
      <div className="preview-header">
        <h2>Color Band Art</h2>
        <button onClick={onReset} className="reset-button">
          Upload New Image
        </button>
      </div>

      <div className="preview-content">
        <div className="preview-section">
          <h3>Original Image</h3>
          <div className="image-container">
            <img src={image.src} alt="Original" />
          </div>
        </div>

        <div className="preview-section">
          <h3>Color Bands ({bands.length} bands)</h3>
          <div className="canvas-container">
            {isProcessing && <div className="processing-overlay">Processing...</div>}
            <canvas ref={previewCanvasRef} />
          </div>
        </div>
      </div>

      <div className="controls">
        <div className="control-group">
          <label>
            <span>Color Sensitivity</span>
            <span className="control-value">{colorThreshold}</span>
          </label>
          <input
            type="range"
            min="5"
            max="100"
            value={colorThreshold}
            onChange={(e) => setColorThreshold(Number(e.target.value))}
            className="slider"
          />
          <p className="control-hint">Lower = more bands, Higher = fewer bands</p>
        </div>

        <div className="control-group">
          <label>
            <span>Minimum Band Height</span>
            <span className="control-value">{minBandHeight}px</span>
          </label>
          <input
            type="range"
            min="1"
            max="20"
            value={minBandHeight}
            onChange={(e) => setMinBandHeight(Number(e.target.value))}
            className="slider"
          />
          <p className="control-hint">Minimum height for each color band</p>
        </div>
      </div>

      <div className="download-section">
        <div className="resolution-control">
          <label>
            <span>Output Resolution</span>
            <span className="control-value">{outputWidth}px</span>
          </label>
          <input
            type="range"
            min="400"
            max={Math.max(image.width, 3840)}
            step="100"
            value={outputWidth}
            onChange={(e) => setOutputWidth(Number(e.target.value))}
            className="slider"
          />
          <p className="control-hint">Width of downloaded image (original: {image.width}px)</p>
        </div>
        <button onClick={handleDownload} className="download-button">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Download Color Bands
        </button>
      </div>
    </div>
  );
}
