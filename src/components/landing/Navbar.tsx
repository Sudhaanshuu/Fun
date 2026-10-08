import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Radio, Menu, X, Terminal, User as UserIcon, LogOut, ShieldAlert } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-emerald-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Radio className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-xl font-bold tracking-tight text-slate-900">
                  Tele<span className="text-emerald-600">Sim</span>
                </span>
                <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 tracking-wider">
                  Lab
                </span>
              </div>
              <p className="text-[11px] text-slate-600 font-medium">Educational Telecom Simulator</p>
            </div>
          </Link>

          {/* Desktop Navigation Pill Menu (Matching Reference UI) */}
          <nav aria-label="Desktop navigation" className="hidden lg:flex items-center space-x-1 bg-slate-50 border border-slate-200/80 rounded-full px-2 py-1.5 shadow-inner">
            <Link
              to="/"
              className="px-4 py-1.5 rounded-full text-xs font-semibold bg-emerald-600 text-white shadow-sm transition-all"
            >
              Home
            </Link>
            <a
              href="#architecture"
              className="px-3.5 py-1.5 rounded-full text-xs font-medium text-slate-600 hover:text-emerald-700 hover:bg-slate-100 transition-colors"
            >
              Architecture
            </a>
            <Link
              to="/simulate"
              className="px-3.5 py-1.5 rounded-full text-xs font-medium text-slate-600 hover:text-emerald-700 hover:bg-slate-100 transition-colors"
            >
              Simulator
            </Link>
            <a
              href="#security"
              className="px-3.5 py-1.5 rounded-full text-xs font-medium text-slate-600 hover:text-emerald-700 hover:bg-slate-100 transition-colors"
            >
              Security
            </a>
            <a
              href="#edge-network"
              className="px-3.5 py-1.5 rounded-full text-xs font-medium text-slate-600 hover:text-emerald-700 hover:bg-slate-100 transition-colors"
            >
              PoP Network
            </a>
            <a
              href="#insights"
              className="px-3.5 py-1.5 rounded-full text-xs font-medium text-slate-600 hover:text-emerald-700 hover:bg-slate-100 transition-colors"
            >
              Insights
            </a>
            <Link
              to="/report-abuse"
              className="px-3.5 py-1.5 rounded-full text-xs font-medium text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-colors"
            >
              Report Abuse
            </Link>
          </nav>

          {/* Right Action / Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300 hover:bg-amber-200 transition-colors"
                  >
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                    <span>Admin Console</span>
                  </Link>
                )}
                <Link
                  to="/dashboard"
                  className="px-4 py-2 rounded-full text-xs font-semibold text-slate-700 hover:text-slate-900 border border-slate-200 hover:border-slate-300 transition-colors flex items-center space-x-1.5"
                >
                  <Terminal className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Dashboard</span>
                </Link>
                <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
                  <Link to="/account" className="flex items-center space-x-2 group">
                    <img
                      src={user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60'}
                      alt={user?.display_name}
                      className="w-8 h-8 rounded-full border border-emerald-300 object-cover"
                    />
                    <span className="text-xs font-medium text-slate-700 group-hover:text-emerald-700">
                      {user?.display_name?.split(' ')[0]}
                    </span>
                  </Link>
                  <button
                    onClick={logout}
                    title="Logout"
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-full hover:bg-slate-100"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-full text-xs font-semibold text-slate-700 hover:text-slate-900 border border-slate-200 hover:border-slate-300 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/login"
                  className="px-5 py-2 rounded-full text-xs font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-md shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all"
                >
                  Try the Simulator
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-3 shadow-lg animate-in slide-in-from-top duration-200">
          <nav className="flex flex-col space-y-1">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sm font-semibold text-emerald-700 bg-emerald-50"
            >
              Home
            </Link>
            <Link
              to="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              User Dashboard
            </Link>
            <Link
              to="/simulate"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              New Simulation
            </Link>
            <Link
              to="/simulations"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Simulation History
            </Link>
            <a
              href="#architecture"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Architecture & Security
            </a>
            <Link
              to="/report-abuse"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sm font-medium text-rose-600 hover:bg-rose-50"
            >
              Report Abuse
            </Link>
            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-sm font-bold text-amber-700 bg-amber-50"
              >
                Admin Console
              </Link>
            )}
          </nav>

          <div className="pt-3 border-t border-slate-200 flex flex-col space-y-2">
            {isAuthenticated ? (
              <div className="flex items-center justify-between">
                <Link
                  to="/account"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-2 text-sm font-medium text-slate-800"
                >
                  <UserIcon className="w-4 h-4 text-emerald-600" />
                  <span>My Account ({user?.email})</span>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-xs text-rose-600 font-semibold"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-xl font-semibold text-sm bg-emerald-600 text-white shadow-md shadow-emerald-500/20"
              >
                Sign In with Google
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
