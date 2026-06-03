import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { GameProgressProvider } from './context/GameProgressContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GameProgressProvider>
      <App />
    </GameProgressProvider>
  </StrictMode>,
)
