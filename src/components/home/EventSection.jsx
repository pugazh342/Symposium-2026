import React, { useState } from 'react';
import { events } from '../../data/events';

const EventSection = () => {
  const [activeTab, setActiveTab] = useState('Technical');
  const filteredEvents = events.filter(event => event.category === activeTab);

  return (
    <section className="py-12 bg-[#0f172a] text-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Event <span className="text-blue-500">Divisions</span>
          </h2>
          <div className="w-24 h-1 bg-blue-500 mx-auto mt-6 rounded-full"></div>
        </div>
        
        <div className="flex justify-center mb-12">
          <div className="bg-slate-800 p-1.5 rounded-full flex gap-2">
            {['Technical', 'Non-Technical'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-3 rounded-full font-bold transition-all duration-300 ${
                  activeTab === tab 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map((event) => (
            <div key={event.id} className="group bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-900/20 transition-all duration-300 flex flex-col">
              <div className="relative h-56 overflow-hidden">
                <div className="absolute inset-0 bg-blue-900/20 group-hover:bg-transparent transition-colors z-10"></div>
                <img 
                  src={event.image} 
                  alt={event.title} 
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                <span className="absolute top-4 right-4 z-20 bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
                  {event.category}
                </span>
              </div>

              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                  {event.title}
                </h3>
                <p className="text-slate-400 text-sm mb-6 flex-1 leading-relaxed">
                  {event.description}
                </p>
                <div className="pt-4 border-t border-slate-800 flex justify-between items-center text-xs font-mono text-slate-500">
                  <span>{event.info}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EventSection;