'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { Dashboard } from '@/components/Dashboard';
import { LogIn, UserCircle, School, ShieldCheck } from 'lucide-react';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (isLoggedIn) {
    return <Dashboard />;
  }

  return (
    <div className="min-h-screen bg-madrasa-cream flex flex-col items-center justify-center p-6">
      {/* Institution Header */}
      <div className="text-center mb-12">
        <h1 className="urdu-text text-5xl text-madrasa-green font-bold mb-4 drop-shadow-sm">جامعہ نقشبندیہ بارویہ رضویہ</h1>
        <p className="urdu-text text-slate-500 text-lg">چک نمبر 109 گ ب بجاجانوالہ جڑانوالہ فیصل آباد</p>
        <div className="mt-6 urdu-text text-2xl font-bold text-madrasa-gold tracking-widest">بسم اللہ الرحمن الرحیم</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        {/* Admin Login Panel */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
             <ShieldCheck className="w-24 h-24 text-madrasa-green" />
          </div>
          
          <div className="flex items-center gap-3 mb-6 pb-2 border-b-2 border-madrasa-gold/20">
            <ShieldCheck className="w-6 h-6 text-madrasa-green" />
            <h3 className="text-xl font-bold text-madrasa-green">Admin Access</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Username / ID</label>
              <input 
                type="text" 
                placeholder="Manager Username"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-madrasa-green transition-all"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Pass-Code</label>
              <input 
                type="password" 
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-madrasa-green transition-all"
              />
            </div>
            <button 
              onClick={() => setIsLoggedIn(true)}
              className="w-full py-4 green-gradient text-white rounded-xl font-bold shadow-lg shadow-madrasa-green/20 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <LogIn className="w-5 h-5" />
              Secure Login
            </button>
          </div>
        </motion.div>

        {/* Student/Public Access Panel */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
             <School className="w-24 h-24 text-slate-800" />
          </div>

          <div className="flex items-center gap-3 mb-6 pb-2 border-b-2 border-slate-100">
            <UserCircle className="w-6 h-6 text-slate-600" />
            <h3 className="text-xl font-bold text-slate-800">Student Portal</h3>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Enter Student ID</label>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="e.g. JN-001"
                  className="w-full px-4 py-4 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-slate-800 transition-all font-mono"
                />
                <button className="absolute right-2 top-2 bottom-2 px-4 bg-slate-800 text-white rounded-lg text-xs font-bold hover:bg-slate-700 transition-all">
                  Search
                </button>
              </div>
            </div>
            
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 italic text-slate-400 text-sm text-center">
              View Sabaq, Sabqi, and Namaz records without logging in.
            </div>

            <div className="flex items-center gap-2 text-madrasa-gold font-bold text-[10px] uppercase tracking-widest justify-center">
              <School className="w-4 h-4" />
              Academic Progress Tracking
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer Branding per theme */}
      <div className="mt-16 flex flex-col items-center gap-2">
         <div className="px-4 py-1 bg-white border border-madrasa-gold/30 rounded-full text-[10px] font-bold text-madrasa-gold uppercase tracking-[0.2em]">
            Geometric Balance v2.0
         </div>
         <div className="urdu-text text-slate-400 text-sm opacity-50">تعاون فرمایا باروی گرافکس فیصل آباد</div>
      </div>
    </div>
  );
}
