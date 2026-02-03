import React, { useState } from 'react';
import { supabase } from '../api/SupabaseClient';
import { Search, CheckCircle, Clock, Loader2, Download } from 'lucide-react';
import jsPDF from 'jspdf'; // ✅ Import PDF Library

const StatusPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery) return;
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const { data, error } = await supabase
        .from('registrations')
        .select('*')
        .or(`email.eq.${searchQuery},transaction_id.eq.${searchQuery}`)
        .single();

      if (error) throw new Error("No registration found.");
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ NEW: Generate PDF Ticket
  const downloadTicket = () => {
    const doc = new jsPDF();
    
    // Design the Ticket
    doc.setFillColor(15, 23, 42); // Dark Blue Header
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text("SYMPOSIUM 2026", 105, 20, null, null, "center");
    doc.setFontSize(12);
    doc.text("Official Entry Pass", 105, 30, null, null, "center");

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.text(`Name: ${result.full_name}`, 20, 60);
    doc.text(`ID: ${result.id}`, 150, 60);
    
    doc.text(`College: ${result.college}`, 20, 75);
    doc.text(`Events: ${Array.isArray(result.selected_events) ? result.selected_events.join(', ') : result.selected_events}`, 20, 90);
    
    doc.setTextColor(0, 150, 0);
    doc.setFontSize(16);
    doc.text("STATUS: APPROVED", 20, 110);

    doc.setTextColor(100, 100, 100);
    doc.setFontSize(10);
    doc.text("Please show this ticket at the registration desk.", 105, 140, null, null, "center");

    // Save
    doc.save(`Symposium_Ticket_${result.full_name}.pdf`);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white pt-24 px-6 flex flex-col items-center">
      <div className="max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-2">Check Status</h1>
        <p className="text-slate-400 text-center mb-8">Enter Email or Transaction ID</p>

        <form onSubmit={handleSearch} className="relative mb-8">
          <input 
            type="text" 
            placeholder="e.g. email@college.edu" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-4 pl-4 focus:border-blue-500 outline-none"
          />
          <button type="submit" className="absolute right-2 top-2 bottom-2 bg-blue-600 px-4 rounded-lg">
            {loading ? <Loader2 className="animate-spin" /> : <Search />}
          </button>
        </form>

        {error && <div className="text-red-400 text-center mb-6">{error}</div>}

        {result && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-xl font-bold">{result.full_name}</h3>
                <p className="text-sm text-slate-400">{result.college}</p>
              </div>
              {result.status === 'confirmed' ? (
                <CheckCircle className="text-green-400" size={32} />
              ) : (
                <Clock className="text-yellow-400" size={32} />
              )}
            </div>

            <div className="space-y-2 text-sm text-slate-300">
               <p>Event: {Array.isArray(result.selected_events) ? result.selected_events.join(', ') : result.selected_events}</p>
               <p>Status: <span className="uppercase font-bold">{result.status}</span></p>
            </div>

            {/* ✅ NEW: Download Ticket Button */}
            {result.status === 'confirmed' && (
              <button 
                onClick={downloadTicket}
                className="w-full mt-6 bg-green-600 hover:bg-green-500 py-3 rounded-lg font-bold flex items-center justify-center gap-2"
              >
                <Download size={18} /> Download Ticket
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatusPage;