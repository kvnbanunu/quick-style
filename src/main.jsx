import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import QuickStyle from './components/QuickStyle.jsx'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QuickStyle />
    <div>
      Test Element
      <div>
        Child Element
        <p>
          Paragraph
        </p>
      </div>
    </div>
    
  </StrictMode>,
)
