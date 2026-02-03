import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => setIsOpen(false), [location]);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      scrolled ? 'bg-slate-950/80 backdrop-blur-md border-b border-white/10 py-4' : 'bg-transparent py-6'
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2 font-bold text-xl text-white tracking-wider">
           <img src="../public/logo.png" alt="Symposium Logo" className="h-8 w-auto" />
           <span>SYMPOSIUM 2026</span>
        </Link>

        {/* DESKTOP LINKS */}
        <div className="hidden md:flex items-center gap-8">
          {['Home', 'Events', 'Register', 'Status'].map((item) => (
            <Link 
              key={item}
              to={item === 'Home' ? '/' : `/${item.toLowerCase()}`} 
              className={`text-sm font-medium transition-colors uppercase tracking-widest ${
                location.pathname === (item === 'Home' ? '/' : `/${item.toLowerCase()}`) 
                ? 'text-blue-400' 
                : 'text-slate-300 hover:text-white'
              }`}
            >
              {item}
            </Link>
          ))}
          <Link 
            to="/admin" 
            className="text-xs font-bold text-slate-500 hover:text-blue-400 transition-colors uppercase border border-slate-700 px-3 py-1 rounded hover:border-blue-500"
          >
            Admin
          </Link>
        </div>

        {/* MOBILE MENU TOGGLE */}
        <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-slate-950 border-b border-slate-800 p-6 flex flex-col gap-4 shadow-xl">
          {['Home', 'Events', 'Register', 'Status', 'Admin'].map((item) => (
            <Link 
              key={item}
              to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
              className="text-slate-300 hover:text-white font-medium py-2 block border-b border-slate-900"
            >
              {item}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;