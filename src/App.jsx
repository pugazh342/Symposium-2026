import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';

// Layout Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Public Pages
import HomePage from './pages/HomePage';
import EventsPage from './pages/EventsPage';
import RegistrationPage from './pages/RegistrationPage';
import StatusPage from './pages/StatusPage'; // ✅ NEW: Import Status Page

// Admin Pages
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

// 1. Layout for Public Pages (Navbar + Footer)
const PublicLayout = () => {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <Outlet /> {/* This renders the specific page content */}
      </main>
      <Footer />
    </>
  );
};

const App = () => {
  return (
    <Routes>
      
      {/* PUBLIC ROUTES (With Navbar & Footer) */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/status" element={<StatusPage />} /> {/* ✅ NEW: Route Added */}
      </Route>

      {/* ADMIN ROUTES (Fullscreen - No Navbar/Footer) */}
      <Route path="/admin" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />

    </Routes>
  );
};

export default App;