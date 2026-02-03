import React from 'react';

const AdminPage = () => {
  return (
    <div className="pt-28 px-6 min-h-screen bg-[#0f172a] text-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold border-l-4 border-blue-500 pl-4">Admin Dashboard</h1>
          <button className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-bold transition-all text-sm">
            Export CSV
          </button>
        </div>
        
        <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700 text-center">
          <div className="text-slate-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
            </svg>
            <p>Database Integration Pending</p>
          </div>
          <p className="text-sm text-slate-400">
            Once connected to Supabase, student registrations and payment proofs will appear here.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;