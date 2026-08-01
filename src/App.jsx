import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between selection:bg-red-500 selection:text-white">
        <div>
          <Navbar />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center py-20 space-y-4">
              <h1 className="text-4xl font-extrabold text-slate-900">
                CineMind AI Movie Reservation System
              </h1>
              <p className="text-slate-500 font-medium">
                Base Setup & Architecture Ready
              </p>
            </div>
          </main>
        </div>

        <footer className="bg-white border-t border-slate-200/80 py-8 text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="font-medium text-slate-600">
              © 2026 <span className="text-red-600 font-bold">CineMind</span>. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
