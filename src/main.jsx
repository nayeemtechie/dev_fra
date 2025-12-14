import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Remove StrictMode to prevent double-rendering in development
// StrictMode intentionally double-invokes effects, components, and functions
// to help detect side effects, but this causes multiple API requests
ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
)