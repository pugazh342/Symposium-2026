import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Mail, MapPin, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 text-slate-400 py-12">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 font-bold text-xl text-white tracking-wider">
            {/* Make sure logo.png is in your public folder, or remove the img tag if not ready */}
            <img src="../public/logo.png" alt="Logo" className="h-8 w-auto" /> 
            <span>SYMPOSIUM 2026</span>
          </div>
          <p className="text-sm leading-relaxed">
            The ultimate national-level technical symposium. Unleash your potential and compete with the best minds.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-bold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-blue-400 transition-colors">Home</Link></li>
            <li><Link to="/events" className="hover:text-blue-400 transition-colors">Events</Link></li>
            <li><Link to="/register" className="hover:text-blue-400 transition-colors">Register</Link></li>
            <li><Link to="/admin" className="hover:text-blue-400 transition-colors">Admin Login</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-white font-bold mb-4">Contact Us</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-3">
              <MapPin size={18} className="text-blue-500 shrink-0" />
              <span>SKP Engineering College,<br />Tiruvannamalai, Tamil Nadu.</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone size={18} className="text-blue-500 shrink-0" />
              <span>+91 98765 43210</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail size={18} className="text-blue-500 shrink-0" />
              <span>symposium2026@skp.edu</span>
            </li>
          </ul>
        </div>

        {/* Socials */}
        <div>
          <h3 className="text-white font-bold mb-4">Follow Us</h3>
          <div className="flex gap-4">
            <a href="#" className="bg-slate-900 p-2 rounded-lg hover:bg-blue-600 hover:text-white transition-all">
              <Instagram size={20} />
            </a>
            {/* Add more social icons here if needed */}
          </div>
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-slate-900 text-center text-xs">
        <p>&copy; 2026 Symposium Team. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;