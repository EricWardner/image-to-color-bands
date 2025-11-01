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
        <p>Built with React + TypeScript</p>
      </footer>
    </div>
  )
}

export default App
