import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import AIChatWidget from './components/AIChatWidget';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between relative selection:bg-red-500 selection:text-white">
          <div>
            <Navbar />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />

                {/* Protected Routes */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/profile" element={<Profile />} />
                </Route>
              </Routes>
            </main>
          </div>

          <AIChatWidget />

          <footer className="bg-white border-t border-slate-200/80 py-8 text-center text-xs text-slate-500 mt-16">
            <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="font-medium text-slate-600">
                © 2026 <span className="text-red-600 font-bold">CineMind</span> AI Movie Reservation System.
              </p>
              <div className="flex gap-6 text-slate-400">
                <a href="#" className="hover:text-red-600 transition">Chính sách bảo mật</a>
                <a href="#" className="hover:text-red-600 transition">Điều khoản sử dụng</a>
                <a href="#" className="hover:text-red-600 transition">Liên hệ & Hỗ trợ</a>
              </div>
            </div>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
