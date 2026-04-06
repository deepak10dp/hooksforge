import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Privacy from './pages/Privacy';
import ErrorBoundary from './components/ErrorBoundary';
import '@/App.css';

function App() {
  return (
    <ErrorBoundary>
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/privacy" element={<Privacy />} />
          </Routes>
        </BrowserRouter>
      </div>
    </ErrorBoundary>
  );
}

export default App;