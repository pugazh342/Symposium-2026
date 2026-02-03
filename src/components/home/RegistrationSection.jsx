import React, { useState } from 'react';
import { events } from '../../data/events';
import { supabase } from '../../api/SupabaseClient'; 
import emailjs from '@emailjs/browser';
import QRCode from "react-qr-code"; 
import { User, Users, Plus, X, Check, Loader2 } from 'lucide-react';

const RegistrationSection = () => {
  const [regType, setRegType] = useState('individual'); // 'individual' or 'team'
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    teamName: '',
    leaderName: '', 
    email: '',
    college: '',
    phone: '',
    teamMembers: [],
    selectedEvents: [],
    transactionId: '',
    file: null
  });

  const FEE_PER_PERSON = 200;

  // 1. Calculate Total Fee
  const totalPeople = regType === 'individual' ? 1 : 1 + formData.teamMembers.length;
  const totalFee = totalPeople * FEE_PER_PERSON;

  // 2. Generate Dynamic UPI Link (UPDATED WITH YOUR ID)
  // pa = Payee Address
  // pn = Payee Name (Symposium)
  // am = Amount
  // cu = Currency
  const upiLink = `upi://pay?pa=pugazhmanik24@okaxis&pn=Symposium2026&am=${totalFee}&cu=INR`;

  // --- HANDLERS ---
  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, file: e.target.files[0] }));
  };

  const toggleEvent = (eventTitle) => {
    setFormData(prev => {
      const isSelected = prev.selectedEvents.includes(eventTitle);
      return {
        ...prev,
        selectedEvents: isSelected
          ? prev.selectedEvents.filter(e => e !== eventTitle)
          : [...prev.selectedEvents, eventTitle]
      };
    });
  };

  // --- TEAM LOGIC ---
  const addTeamMember = () => {
    if (formData.teamMembers.length < 4) { 
      setFormData(prev => ({ ...prev, teamMembers: [...prev.teamMembers, ""] }));
    }
  };

  const updateMemberName = (index, value) => {
    const updatedMembers = [...formData.teamMembers];
    updatedMembers[index] = value;
    setFormData(prev => ({ ...prev, teamMembers: updatedMembers }));
  };

  const removeMember = (index) => {
    const updatedMembers = formData.teamMembers.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, teamMembers: updatedMembers }));
  };

  // --- SUBMISSION LOGIC ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.file) {
      alert("Please upload the payment screenshot!");
      return;
    }
    
    if (formData.selectedEvents.length === 0) {
      alert("Please select at least one event!");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Upload Image to Supabase Storage
      const fileExt = formData.file.name.split('.').pop();
      const cleanName = (formData.leaderName || 'user').replace(/\s+/g, '_'); 
      const fileName = `${Date.now()}_${cleanName}.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('payments-proof') // Matches your bucket name
        .upload(fileName, formData.file);

      if (uploadError) throw uploadError;

      // 2. Get the Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('payments-proof')
        .getPublicUrl(fileName);

      // 3. Insert Data into Database
      const { error: insertError } = await supabase
        .from('registrations')
        .insert([
          {
            reg_type: regType,
            full_name: formData.leaderName, 
            email: formData.email,
            phone: formData.phone,
            college: formData.college,
            team_name: regType === 'team' ? formData.teamName : null,
            team_members: regType === 'team' ? formData.teamMembers : [], 
            selected_events: formData.selectedEvents, 
            total_fee: totalFee,
            transaction_id: formData.transactionId,
            proof_url: publicUrl,
            status: 'pending'
          }
        ]);

      if (insertError) throw insertError;

      // 4. SEND EMAIL NOTIFICATION (EmailJS)
      const emailParams = {
        to_name: "Admin",
        from_name: formData.leaderName,
        reg_type: regType.toUpperCase(),
        college: formData.college,
        team_name: regType === 'team' ? formData.teamName : "N/A",
        events: formData.selectedEvents.join(", "),
        total_fee: totalFee,
        transaction_id: formData.transactionId,
        proof_link: publicUrl
      };

      await emailjs.send(
        "service_oyls64s",         // ✅ Your Service ID
        "template_887gzox",  // ❌ REPLACE THIS with your actual Template ID
        emailParams,
        "_ejheO0SbyP8Gu4TE"    // ❌ REPLACE THIS with your actual Public Key
      );

      // 5. Success Message
      alert("Registration Successful! Confirmation email sent.");
      window.location.reload(); 

    } catch (error) {
      console.error("Error:", error);
      alert("Registration Failed: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-12 bg-[#0f172a] text-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row gap-12">
        
        {/* LEFT SIDE: Logic & Payment Summary */}
        <div className="lg:w-1/3 space-y-6">
          <div>
            <h2 className="text-3xl font-bold mb-2">Registration</h2>
            <p className="text-slate-400 text-sm">
              One fee, unlimited events. Register as an individual or bring your squad.
            </p>
          </div>

          {/* Toggle Type */}
          <div className="bg-slate-900 p-1.5 rounded-xl flex border border-slate-700">
            <button
              type="button"
              onClick={() => { setRegType('individual'); setFormData(prev => ({ ...prev, teamMembers: [] })); }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-bold text-sm transition-all ${
                regType === 'individual' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
              }`}
            >
              <User size={18} /> Individual
            </button>
            <button
              type="button"
              onClick={() => setRegType('team')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-bold text-sm transition-all ${
                regType === 'team' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Users size={18} /> Team
            </button>
          </div>

          {/* Sticky Payment Card */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-2xl border border-slate-700 shadow-xl sticky top-24">
            <h3 className="text-lg font-bold mb-4 text-white flex items-center gap-2">
              Payment Summary
            </h3>
            
            <div className="space-y-4 text-sm text-slate-300">
              <div className="flex justify-between">
                <span>Base Fee</span>
                <span>₹ {FEE_PER_PERSON} / person</span>
              </div>
              <div className="flex justify-between">
                <span>Total Members</span>
                <span className="text-white font-bold">x {totalPeople}</span>
              </div>
              
              <div className="flex justify-between items-center pt-4 border-t border-slate-700">
                <span className="text-lg text-white">Total To Pay</span>
                <span className="font-bold text-3xl text-blue-400">₹ {totalFee}</span>
              </div>

              {/* ✅ DYNAMIC QR CODE SECTION */}
              <div className="bg-white p-4 rounded-lg mt-4 flex flex-col items-center justify-center">
                 <div style={{ height: "auto", margin: "0 auto", maxWidth: "100%", width: "100%" }}>
                    <QRCode
                      size={256}
                      style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                      value={upiLink}
                      viewBox={`0 0 256 256`}
                    />
                 </div>
                 <p className="text-slate-900 text-[10px] mt-3 font-mono font-bold">
                   Scan to pay <span className="text-blue-600 text-sm">₹{totalFee}</span>
                 </p>
                 <p className="text-slate-400 text-[9px] uppercase tracking-widest mt-1">
                   UPI: pugazhmanik24@okaxis
                 </p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: The Form */}
        <div className="lg:w-2/3 bg-slate-900/40 p-8 rounded-3xl border border-white/5 shadow-2xl backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* SECTION 1: Personal / Team Leader Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-blue-400 border-l-4 border-blue-500 pl-3">
                {regType === 'individual' ? 'Personal Details' : 'Team Leader Details'}
              </h3>
              
              {regType === 'team' && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Team Name</label>
                  <input type="text" name="teamName" required onChange={handleChange} className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 focus:border-blue-500 outline-none transition-colors" placeholder="e.g. Cyber Knights" />
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase">Name</label>
                  <input type="text" name="leaderName" required onChange={handleChange} className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 focus:border-blue-500 outline-none" placeholder="Full Name" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase">Phone</label>
                  <input type="tel" name="phone" required onChange={handleChange} className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 focus:border-blue-500 outline-none" placeholder="+91 ..." />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase">Email</label>
                  <input type="email" name="email" required onChange={handleChange} className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 focus:border-blue-500 outline-none" placeholder="email@college.edu" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase">College</label>
                  <input type="text" name="college" required onChange={handleChange} className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 focus:border-blue-500 outline-none" placeholder="College Name" />
                </div>
              </div>
            </div>

            {/* SECTION 2: Team Members (Conditional) */}
            {regType === 'team' && (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <h3 className="text-lg font-bold text-purple-400 border-l-4 border-purple-500 pl-3">Team Members</h3>
                  <button 
                    type="button" 
                    onClick={addTeamMember}
                    className="text-xs font-bold bg-purple-500/10 text-purple-400 px-3 py-1.5 rounded-full hover:bg-purple-500 hover:text-white transition-all flex items-center gap-1"
                  >
                    <Plus size={14} /> ADD MEMBER
                  </button>
                </div>

                <div className="space-y-3">
                  {formData.teamMembers.map((member, index) => (
                    <div key={index} className="flex gap-2">
                      <input 
                        type="text" 
                        value={member}
                        onChange={(e) => updateMemberName(index, e.target.value)}
                        placeholder={`Member ${index + 1} Name`}
                        className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 focus:border-purple-500 outline-none"
                      />
                      <button 
                        type="button" 
                        onClick={() => removeMember(index)}
                        className="bg-red-500/10 text-red-500 p-3 rounded-lg hover:bg-red-500 hover:text-white transition-colors"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  ))}
                  {formData.teamMembers.length === 0 && (
                    <p className="text-sm text-slate-500 italic">No members added yet. (It's just you!)</p>
                  )}
                </div>
              </div>
            )}

            {/* SECTION 3: Event Selection */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-green-400 border-l-4 border-green-500 pl-3">Select Events</h3>
              <p className="text-xs text-slate-400 mb-4">You can select multiple events. Price remains same.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {events.map((event) => (
                  <div 
                    key={event.id}
                    onClick={() => toggleEvent(event.title)}
                    className={`cursor-pointer p-3 rounded-xl border transition-all flex items-center justify-between group ${
                      formData.selectedEvents.includes(event.title)
                      ? 'bg-blue-600/20 border-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.2)]'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${event.category === 'Technical' ? 'bg-blue-400' : 'bg-purple-400'}`}></div>
                      <div>
                        <span className="font-medium text-sm block text-slate-200">{event.title}</span>
                        <span className="text-[10px] text-slate-500 uppercase tracking-wider">{event.category}</span>
                      </div>
                    </div>
                    
                    {formData.selectedEvents.includes(event.title) && (
                      <span className="bg-blue-500 text-white p-1 rounded-full">
                        <Check size={12} strokeWidth={4} />
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 4: Payment Upload */}
            <div className="pt-6 border-t border-slate-800">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase">Transaction ID</label>
                  <input type="text" name="transactionId" required onChange={handleChange} className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 focus:border-blue-500 outline-none font-mono" placeholder="UPI Ref No." />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase">Proof Screenshot</label>
                  <input type="file" accept="image/*" onChange={handleFileChange} required className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-slate-800 file:text-blue-400 hover:file:bg-slate-700 cursor-pointer" />
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-900/20 transform hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" /> Processing...
                </>
              ) : (
                `COMPLETE REGISTRATION (₹${totalFee})`
              )}
            </button>

          </form>
        </div>
      </div>
    </section>
  );
};

export default RegistrationSection;