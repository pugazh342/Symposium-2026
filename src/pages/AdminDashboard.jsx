import React, { useEffect, useState } from 'react';
import { supabase } from '../api/SupabaseClient';
import { useNavigate } from 'react-router-dom';
import emailjs from '@emailjs/browser'; // ✅ Import EmailJS
import { Users, CreditCard, Calendar, FileDown, LogOut, Search, BarChart3, CheckCircle, XCircle, Loader2 } from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, revenue: 0, pending: 0 });
  const [eventCounts, setEventCounts] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin');
    if (!isAdmin) {
      navigate('/admin');
      return;
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data, error } = await supabase
        .from('registrations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setRegistrations(data);
      calculateStats(data);

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data) => {
    // 1. General Stats
    const totalRev = data.reduce((sum, item) => sum + (item.total_fee || 0), 0);
    const pendingCount = data.filter(item => item.status === 'pending').length;
    
    setStats({
      total: data.length,
      revenue: totalRev,
      pending: pendingCount
    });

    // 2. Event Popularity
    const counts = {};
    data.forEach(user => {
      const userEvents = Array.isArray(user.selected_events) ? user.selected_events : [user.selected_events];
      userEvents.forEach(eventName => {
        if (eventName) counts[eventName] = (counts[eventName] || 0) + 1;
      });
    });
    setEventCounts(counts);
  };

  // ✅ UPDATED: Approve/Reject with Auto-Email
  const updateStatus = async (id, newStatus, studentEmail, studentName) => {
    setUpdatingId(id);
    try {
      // 1. Update Database
      const { error } = await supabase
        .from('registrations')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      // 2. Send Email ONLY if Approved
      if (newStatus === 'confirmed') {
        const emailParams = {
          to_email: studentEmail, 
          to_name: studentName,
          // Make sure your EmailJS template uses {{to_email}} and {{to_name}} variables!
          message: "Congratulations! Your registration has been approved. Please visit the Status page to download your entry ticket.",
        };

        await emailjs.send(
          "service_oyls64s",       // ❌ REPLACE THIS
          "template_6lus445",      // ❌ REPLACE THIS (Create a new 'Approval' template in EmailJS)
          emailParams,
          "_ejheO0SbyP8Gu4TE"        // ❌ REPLACE THIS
        );
        
        // Optional: Alert purely for testing, you can remove this later
        // alert(`Email sent to ${studentName}`); 
      }

      // 3. Update Local State (Instant Refresh)
      const updatedData = registrations.map(item => 
        item.id === id ? { ...item, status: newStatus } : item
      );
      setRegistrations(updatedData);
      calculateStats(updatedData);

    } catch (error) {
      console.error("Error:", error);
      alert("Status updated, but email failed: " + error.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    navigate('/');
  };

  const exportToCSV = () => {
    if (registrations.length === 0) {
      alert("No data to export!");
      return;
    }
    const headers = ["ID", "Name", "Email", "Phone", "College", "Type", "Team Name", "Events", "Total Fee", "Transaction ID", "Status", "Date"];
    const csvRows = [
      headers.join(','),
      ...registrations.map(row => {
        const date = new Date(row.created_at).toISOString().split('T')[0];
        const events = Array.isArray(row.selected_events) ? row.selected_events.join(' | ') : row.selected_events;
        const cleanName = (row.full_name || '').replace(/,/g, '');
        const cleanCollege = (row.college || '').replace(/,/g, '');

        return [
          row.id,
          cleanName,
          row.email,
          row.phone,
          cleanCollege,
          row.reg_type,
          row.team_name || "N/A",
          `"${events}"`, 
          row.total_fee,
          row.transaction_id,
          row.status,
          date
        ].join(',');
      })
    ];
    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `symposium_data_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const filteredData = registrations.filter(item => 
    item.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.transaction_id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 hidden md:flex flex-col">
        <div className="p-6 border-b border-slate-800 flex items-center gap-2 font-bold text-xl">
           <img src="/logo.png" className="w-8 h-8" alt="Logo" />
           Admin
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <div className="flex items-center gap-3 px-4 py-3 bg-blue-600/10 text-blue-400 rounded-lg cursor-pointer">
            <Users size={20} /> Dashboard
          </div>
        </nav>
        <div className="p-4 border-t border-slate-800">
          <button onClick={handleLogout} className="flex items-center gap-2 text-slate-400 hover:text-red-400 transition-colors">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold">Dashboard Overview</h1>
            <p className="text-slate-400 text-sm">Welcome back, Admin</p>
          </div>
          <div className="flex gap-3">
             <button onClick={exportToCSV} className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-all font-bold">
               <FileDown size={18} /> Export CSV
             </button>
             <button onClick={fetchData} className="bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-all">
               Refresh
             </button>
          </div>
        </header>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-400 text-sm font-medium">Total Registrations</p>
                <h3 className="text-3xl font-bold mt-2">{stats.total}</h3>
              </div>
              <div className="bg-blue-500/10 p-3 rounded-lg text-blue-500"><Users size={24} /></div>
            </div>
          </div>
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-400 text-sm font-medium">Total Revenue</p>
                <h3 className="text-3xl font-bold mt-2 text-green-400">₹ {stats.revenue}</h3>
              </div>
              <div className="bg-green-500/10 p-3 rounded-lg text-green-500"><CreditCard size={24} /></div>
            </div>
          </div>
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-400 text-sm font-medium">Pending Verifications</p>
                <h3 className="text-3xl font-bold mt-2 text-orange-400">{stats.pending}</h3>
              </div>
              <div className="bg-orange-500/10 p-3 rounded-lg text-orange-500"><Calendar size={24} /></div>
            </div>
          </div>
        </div>

        {/* EVENT ANALYTICS */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 mb-8">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <BarChart3 className="text-purple-400" size={20}/> Event Popularity
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(eventCounts).map(([event, count]) => (
              <div key={event} className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex justify-between items-center">
                <span className="text-sm text-slate-300 font-medium truncate pr-2">{event}</span>
                <span className="bg-purple-500 text-white text-xs font-bold px-2 py-1 rounded-full">{count}</span>
              </div>
            ))}
            {Object.keys(eventCounts).length === 0 && <p className="text-slate-500 text-sm">No data yet.</p>}
          </div>
        </div>

        {/* TABLE SECTION */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
          <div className="p-6 border-b border-slate-800 flex flex-col md:flex-row justify-between gap-4">
            <h3 className="text-lg font-bold">Recent Registrations</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm outline-none focus:border-blue-500 w-full md:w-64"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-400">
              <thead className="bg-slate-950 text-slate-200 uppercase font-bold text-xs">
                <tr>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">College</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Proof</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {loading ? (
                  <tr><td colSpan="7" className="text-center py-8">Loading data...</td></tr>
                ) : filteredData.length === 0 ? (
                  <tr><td colSpan="7" className="text-center py-8">No registrations found</td></tr>
                ) : (
                  filteredData.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-800/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-white">{user.full_name}</td>
                      <td className="px-6 py-4">{user.college}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${user.reg_type === 'team' ? 'bg-purple-500/10 text-purple-400' : 'bg-blue-500/10 text-blue-400'}`}>
                          {user.reg_type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${
                          user.status === 'confirmed' ? 'bg-green-500/10 text-green-400' : 
                          user.status === 'rejected' ? 'bg-red-500/10 text-red-400' :
                          'bg-yellow-500/10 text-yellow-400'
                        }`}>
                          {user.status || 'pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <a href={user.proof_url} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">View</a>
                      </td>
                      <td className="px-6 py-4">{new Date(user.created_at).toLocaleDateString()}</td>
                      
                      {/* ACTION BUTTONS */}
                      <td className="px-6 py-4 flex gap-2">
                        {updatingId === user.id ? (
                          <Loader2 className="animate-spin text-blue-400" size={18} />
                        ) : (
                          <>
                            <button 
                              onClick={() => updateStatus(user.id, 'confirmed', user.email, user.full_name)}
                              title="Approve & Send Email"
                              className="p-1 rounded hover:bg-green-500/20 text-green-500 transition-colors"
                            >
                              <CheckCircle size={20} />
                            </button>
                            <button 
                              onClick={() => updateStatus(user.id, 'rejected', user.email, user.full_name)}
                              title="Reject"
                              className="p-1 rounded hover:bg-red-500/20 text-red-500 transition-colors"
                            >
                              <XCircle size={20} />
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;