'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Dashboard } from '@/components/Dashboard';
import { LogIn, UserCircle, School, ShieldCheck, Loader2, X, ChevronRight, BookOpen, Search } from 'lucide-react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Login State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Search Student State
  const [studentId, setStudentId] = useState('');
  const [searching, setSearching] = useState(false);
  const [foundStudent, setFoundStudent] = useState<any>(null);
  const [recentReports, setRecentReports] = useState<any[]>([]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Map username to an email for Firebase Auth
      const email = username.includes('@') ? username : `${username}@madrasa.com`;
      await signInWithEmailAndPassword(auth, email, password);
      setIsLoggedIn(true);
    } catch (err: any) {
      console.error(err);
      setError('Invalid Credentials. Note: Ensure "Usman@madrasa.com" is created in Firebase Auth with password "Usman109".');
    } finally {
      setLoading(false);
    }
  };

  const searchStudent = async () => {
    if (!studentId) return;
    setSearching(true);
    setFoundStudent(null);
    setRecentReports([]);
    
    try {
      const q = query(collection(db, 'students'), where('studentId', '==', studentId), limit(1));
      const snap = await getDocs(q);
      
      if (!snap.empty) {
        const studentData = { id: snap.docs[0].id, ...snap.docs[0].data() };
        setFoundStudent(studentData);
        
        // Fetch last 3 reports
        const rq = query(
          collection(db, 'reports'), 
          where('studentId', '==', studentId), 
          orderBy('date', 'desc'), 
          limit(3)
        );
        const rSnap = await getDocs(rq);
        setRecentReports(rSnap.docs.map(d => d.data()));
      } else {
        alert('Student not found with this ID.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSearching(false);
    }
  };

  if (isLoggedIn) {
    return <Dashboard />;
  }

  return (
    <div className="min-h-screen bg-madrasa-cream flex flex-col items-center justify-center p-6 custom-scrollbar">
      {/* Institution Header */}
      <div className="text-center mb-12">
        <h1 className="urdu-text text-5xl text-madrasa-green font-bold mb-4 drop-shadow-sm">جامعہ نقشبندیہ بارویہ رضویہ</h1>
        <p className="urdu-text text-slate-500 text-lg">چک نمبر 109 گ ب بجاجانوالہ جڑانوالہ فیصل آباد</p>
        <div className="mt-6 urdu-text text-2xl font-bold text-madrasa-gold tracking-widest">بسم اللہ الرحمن الرحیم</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl relative z-10">
        {/* Admin Login Panel */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200 relative overflow-hidden group"
        >
          <div className="flex items-center gap-3 mb-6 pb-2 border-b-2 border-madrasa-gold/20">
            <ShieldCheck className="w-6 h-6 text-madrasa-green" />
            <h3 className="text-xl font-bold text-madrasa-green">Manager Portal</h3>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 text-red-600 text-xs rounded-lg border border-red-100 animate-pulse">
                {error}
              </div>
            )}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Manager Username</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. Usman"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-madrasa-green transition-all"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Pass-Code</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="e.g. Usman109"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-madrasa-green transition-all"
              />
            </div>
            <button 
              disabled={loading}
              className="w-full py-4 green-gradient text-white rounded-xl font-bold shadow-lg shadow-madrasa-green/20 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <LogIn className="w-5 h-5" />}
              Begin Session
            </button>
          </form>
        </motion.div>

        {/* Student/Public Access Panel */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200 relative overflow-hidden group h-full"
        >
          <div className="flex items-center gap-3 mb-6 pb-2 border-b-2 border-slate-100">
            <UserCircle className="w-6 h-6 text-slate-600" />
            <h3 className="text-xl font-bold text-slate-800">Public Inquiry</h3>
          </div>
          
          <div className="space-y-6">
            {!foundStudent ? (
              <>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Check Progress (Student ID)</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                      placeholder="e.g. JN-001"
                      className="w-full px-4 py-4 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-slate-800 transition-all font-mono"
                    />
                    <button 
                      onClick={searchStudent}
                      disabled={searching}
                      className="absolute right-2 top-2 bottom-2 px-4 bg-slate-800 text-white rounded-lg text-xs font-bold hover:bg-slate-700 transition-all flex items-center gap-1"
                    >
                      {searching ? <Loader2 className="w-3 h-3 animate-spin" /> : <Search className="w-3 h-3" />}
                      Verify
                    </button>
                  </div>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 italic text-slate-400 text-sm text-center">
                  Search student ID to view Sabaq, Sabqi, and Namaz progress.
                </div>
              </>
            ) : (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <div>
                    <div className="text-lg font-bold text-madrasa-green">{foundStudent.name}</div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{foundStudent.studentId}</div>
                  </div>
                  <button onClick={() => setFoundStudent(null)} className="p-1 hover:bg-slate-100 rounded-lg text-slate-400"><X className="w-5 h-5" /></button>
                </div>

                <div className="space-y-3">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Recent Activity Log</div>
                  {recentReports.length > 0 ? recentReports.map((r, i) => (
                    <div key={i} className="p-4 bg-madrasa-cream/30 rounded-xl border border-madrasa-gold/10 grid grid-cols-2 gap-2 text-xs">
                      <div className="col-span-2 font-bold text-madrasa-green mb-1">{r.date}</div>
                      <div><span className="text-slate-400">Sabaq:</span> {r.sabaq}</div>
                      <div><span className="text-slate-400">Sabqi:</span> {r.sabqi}</div>
                      <div><span className="text-slate-400">Manzil:</span> {r.manzil}</div>
                      <div><span className="text-slate-400">Namaz:</span> {r.namaz}/5</div>
                    </div>
                  )) : (
                    <div className="text-center py-4 text-slate-400 text-sm italic">No recent reports found.</div>
                  )}
                </div>
              </motion.div>
            )}

            <div className="flex items-center gap-2 text-madrasa-gold font-bold text-[10px] uppercase tracking-widest justify-center mt-auto">
              <School className="w-4 h-4" />
              Verified Performance Tracking
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer Branding */}
      <div className="mt-16 flex flex-col items-center gap-2">
         <div className="px-4 py-1 bg-white border border-madrasa-gold/30 rounded-full text-[10px] font-bold text-madrasa-gold uppercase tracking-[0.2em]">
            Geometric Balance v2.0
         </div>
         <div className="urdu-text text-slate-400 text-sm opacity-50">تعاون فرمایا باروی گرافکس فیصل آباد</div>
      </div>
    </div>
  );
}
