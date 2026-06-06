'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LogIn, 
  UserCircle, 
  School, 
  ShieldCheck, 
  Loader2, 
  X, 
  Search, 
  Mail,
  KeyRound,
  ArrowLeft
} from 'lucide-react';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { getAuthService, getDb } from '@/lib/firebase';
import { collection, query, where, getDocs, limit, orderBy } from 'firebase/firestore';

export default function Home() {
  const auth = getAuthService();
  const db = getDb();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // View states
  const [view, setView] = useState<'login' | 'forgot' | 'search'>('login');

  // Login State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Forgot Password State
  const [resetEmail, setResetEmail] = useState('');

  // Search Student State
  const [studentId, setStudentId] = useState('');
  const [searching, setSearching] = useState(false);
  const [foundStudent, setFoundStudent] = useState<any>(null);
  const [recentReports, setRecentReports] = useState<any[]>([]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const email = username.includes('@') ? username : `${username}@madrasa.com`;
      await signInWithEmailAndPassword(auth, email, password);
      setIsLoggedIn(true);
    } catch (err: any) {
      console.error(err);
      setError('Invalid credentials. Ensure your account is active.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const email = resetEmail.includes('@') ? resetEmail : `${resetEmail}@madrasa.com`;
      await sendPasswordResetEmail(auth, email);
      setSuccess('Password reset link sent to your email.');
    } catch (err: any) {
      console.error(err);
      setError('Could not send reset email. Check if the username/email is correct.');
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

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center p-6">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl text-[#064E3B] font-bold mb-2">جامعہ نقشبندیہ بارویہ رضویہ</h1>
        <p className="text-slate-500">Chak No. 109 GB, Faisalabad</p>
      </div>

      <div className="w-full max-w-md">
        <AnimatePresence mode="wait">
          {view === 'login' && (
            <motion.div 
              key="login"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100"
            >
              <div className="flex items-center gap-3 mb-8 border-b pb-4">
                <ShieldCheck className="w-6 h-6 text-[#064E3B]" />
                <h3 className="text-xl font-bold">Portal Access</h3>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                {error && <div className="p-3 bg-red-50 text-red-600 text-xs rounded-lg border border-red-100">{error}</div>}
                
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Username</label>
                  <input 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. Usman"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-[#064E3B] outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Password</label>
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-[#064E3B] outline-none"
                  />
                </div>

                <button 
                  disabled={loading}
                  className="w-full py-4 bg-[#064E3B] text-white rounded-xl font-bold shadow-lg flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <LogIn className="w-5 h-5" />}
                  Login
                </button>

                <div className="text-center mt-4">
                  <button 
                    type="button" 
                    onClick={() => setView('forgot')}
                    className="text-xs text-slate-400 hover:text-[#064E3B] font-bold uppercase tracking-widest"
                  >
                    Forgot Password?
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {view === 'forgot' && (
            <motion.div 
              key="forgot"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100"
            >
              <button 
                onClick={() => { setView('login'); setError(''); setSuccess(''); }}
                className="flex items-center gap-2 text-slate-400 hover:text-[#064E3B] mb-6 font-bold text-xs uppercase"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Login
              </button>

              <div className="flex items-center gap-3 mb-8 border-b pb-4">
                <KeyRound className="w-6 h-6 text-[#064E3B]" />
                <h3 className="text-xl font-bold">Reset Password</h3>
              </div>

              <form onSubmit={handleForgotPassword} className="space-y-4">
                {error && <div className="p-3 bg-red-50 text-red-600 text-xs rounded-lg border border-red-100">{error}</div>}
                {success && <div className="p-3 bg-green-50 text-green-600 text-xs rounded-lg border border-green-100">{success}</div>}
                
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Username / Email</label>
                  <input 
                    type="text" 
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="Enter your username"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-[#064E3B] outline-none"
                    required
                  />
                </div>

                <p className="text-xs text-slate-500 italic">
                  A reset link will be sent to the email associated with this account.
                </p>

                <button 
                  disabled={loading}
                  className="w-full py-4 bg-[#064E3B] text-white rounded-xl font-bold shadow-lg flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Mail className="w-5 h-5" />}
                  Send Reset Link
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Public Search Toggle */}
        <div className="mt-8 text-center">
           <button 
              onClick={() => setView(view === 'search' ? 'login' : 'search')}
              className="text-xs font-bold text-[#D4AF37] uppercase tracking-[0.2em] hover:brightness-110"
           >
              {view === 'search' ? 'Go to Admin Portal' : 'Public Inquiry (Search Student)'}
           </button>
        </div>

        {view === 'search' && (
           <motion.div 
             initial={{ opacity: 0, scale: 0.95 }} 
             animate={{ opacity: 1, scale: 1 }}
             className="mt-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-lg"
           >
              {!foundStudent ? (
                <div className="space-y-4">
                  <input 
                    type="text" 
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    placeholder="Student ID (JN-001)"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-slate-800 font-mono"
                  />
                  <button 
                    onClick={searchStudent}
                    disabled={searching}
                    className="w-full py-3 bg-slate-800 text-white rounded-xl font-bold flex items-center justify-center gap-2"
                  >
                    {searching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                    Verify Progress
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                   <div className="flex justify-between border-b pb-2">
                      <div className="font-bold text-[#064E3B]">{foundStudent.name}</div>
                      <button onClick={() => setFoundStudent(null)} className="text-slate-300 hover:text-red-500"><X className="w-5 h-5" /></button>
                   </div>
                   <div className="space-y-2">
                      {recentReports.map((r, i) => (
                        <div key={i} className="p-3 bg-slate-50 rounded-lg text-xs grid grid-cols-2 gap-1 border border-slate-100">
                          <div className="col-span-2 font-bold text-[#064E3B] border-b mb-1">{r.date}</div>
                          <div>Sabaq: {r.sabaq}</div>
                          <div>Sabqi: {r.sabqi}</div>
                          <div>Manzil: {r.manzil}</div>
                          <div>Namaz: {r.namaz}/5</div>
                        </div>
                      ))}
                   </div>
                </div>
              )}
           </motion.div>
        )}
      </div>

      <div className="mt-12 text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em]">
        Geometric Balance v2.1
      </div>
    </div>
  );
}
