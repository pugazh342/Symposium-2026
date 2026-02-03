import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full -z-10">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-600/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[150px]"></div>
      </div>

      {/* Content */}
      <div className="text-center z-10 max-w-5xl mx-auto">
        <p className="text-blue-400 font-bold tracking-[0.3em] uppercase text-sm mb-6 animate-pulse">
          National Level Technical Symposium 2026
        </p>
        
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent drop-shadow-2xl">
          AANIVARU <br /> AKKUVARU
        </h1>

        <p className="max-w-2xl mx-auto text-slate-400 text-lg md:text-xl mb-12 leading-relaxed font-light">
          Unleash your technical prowess and creative spark. Join us for a day of 
          innovation, competition, and networking with the brightest minds in the state.
        </p>

        <div className="flex flex-col sm:flex-row gap-5 justify-center">
          <Link to="/register">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-full font-bold transition-all transform hover:scale-105 shadow-lg shadow-blue-600/25">
              REGISTER NOW
            </button>
          </Link>
          <Link to="/events">
            <button className="border border-slate-700 hover:bg-slate-800 text-white px-10 py-4 rounded-full font-bold transition-all">
              EXPLORE EVENTS
            </button>
          </Link>
        </div>
      </div>

      {/* Info Footer */}
      <div className="absolute bottom-8 w-full flex flex-wrap justify-center gap-8 md:gap-16 text-slate-500 text-xs font-bold tracking-[0.2em] uppercase">
        <div className="flex flex-col items-center">
          <span className="text-blue-500 mb-1">Date</span>
          <span>March 15, 2026</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-blue-500 mb-1">Venue</span>
          <span>Main Auditorium</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-blue-500 mb-1">Location</span>
          <span>Tiruvannamalai, TN</span>
        </div>
      </div>
    </section>
  );
};

export default Hero;