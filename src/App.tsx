import { useState } from 'react'
import { ImageUpload } from './components/ImageUpload'
import { ColorBandPreview } from './components/ColorBandPreview'
import './App.css'

function App() {
  const [image, setImage] = useState<HTMLImageElement | null>(null)

  const handleImageLoad = (img: HTMLImageElement) => {
    setImage(img)
  }

  const handleReset = () => {
    setImage(null)
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Color Band Art Generator</h1>
        <p>Transform your photos into abstract horizontal color bands</p>
      </header>

      <main className="app-main">
        {!image ? (
          <ImageUpload onImageLoad={handleImageLoad} />
        ) : (
          <ColorBandPreview image={image} onReset={handleReset} />
        )}
      </main>

      <footer className="app-footer">
        <p className="privacy-notice">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          All images are processed locally in your browser. No data is uploaded or stored.
        </p>
      </footer>
    </div>
  )
}

export default App
