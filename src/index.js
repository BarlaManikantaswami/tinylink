import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import StatsPage from './pages/StatsPage';
import NotFound from './pages/NotFound';
import './styles.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <header className="site-header">
          <div className="container header-inner">
            <h1 className="brand">TinyLink</h1>
            <nav>
              <a href="/">Dashboard</a>
            </nav>
          </div>
        </header>

        <main className="container main">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/code/:code" element={<StatsPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <footer className="site-footer">
          <div className="container">TinyLink • Simple URL shortening demo</div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

createRoot(document.getElementById('root')).render(<App />);
