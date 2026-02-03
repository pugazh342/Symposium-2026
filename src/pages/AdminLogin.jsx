import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';

const AdminLogin = () => {
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Simple hardcoded password (Change this!)
    if (password === 'admin123') {
      localStorage.setItem('isAdmin', 'true');
      navigate('/admin/dashboard');
    } else {
      alert("Invalid Password!");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <form onSubmit={handleLogin} className="bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-xl w-full max-w-sm space-y-6">
        <div className="text-center">
          <div className="bg-blue-600/20 text-blue-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock size={32} />
          </div>
          <h2 className="text-2xl font-bold text-white">Admin Access</h2>
          <p className="text-slate-400 text-sm">Enter password to view dashboard</p>
        </div>
        
        <input 
          type="password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg px-4 py-3 focus:border-blue-500 outline-none"
          placeholder="Password"
        />
        
        <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition-all">
          Login
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;