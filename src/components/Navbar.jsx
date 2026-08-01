import React from 'react';
import { Link } from 'react-router-dom';
import { Film } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center font-bold text-white shadow-md shadow-red-600/30 group-hover:scale-105 transition-transform duration-200">
              <Film className="w-5.5 h-5.5 text-white" />
            </div>
            <span className="text-xl font-black tracking-wider text-slate-900">
              CINE<span className="text-red-600">MIND</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-8 text-sm font-semibold">
            <Link to="/" className="text-slate-700 hover:text-red-600 transition">Trang chủ</Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
