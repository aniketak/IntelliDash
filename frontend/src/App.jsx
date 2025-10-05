// frontend/src/App.jsx
import React, { useState, useEffect } from 'react';
import './App.css';
import { FiGrid, FiMessageSquare, FiClock } from 'react-icons/fi'; // Import icons

// Import your existing components
import Dashboard from './components/Dashboard';
import AIFeature from './components/AIFeature'; // We will create this
import History from './components/History';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="app-shell">
      <nav className="sidebar">
        <div className="sidebar-header">
          <h1>IntelliDash 💡</h1>
        </div>
        <ul className="nav-menu">
          <li 
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <FiGrid />
            <span>Executive Dashboard</span>
          </li>
          <li 
            className={`nav-item ${activeTab === 'ai_deep_dive' ? 'active' : ''}`}
            onClick={() => setActiveTab('ai_deep_dive')}
          >
            <FiMessageSquare />
            <span>AI Deep Dive</span>
          </li>
        </ul>
      </nav>

      <main className="main-content">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'ai_deep_dive' && <AIFeature />}
      </main>
    </div>
  );
}

export default App;