'use client';

import { useState } from 'react';
import { BarChart3, Users, Settings, LogOut, LayoutDashboard, Calendar, Wallet, BookOpen, UserPlus, Plus, Key } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getAuthService } from '@/lib/firebase';
import { signOut, updatePassword } from 'firebase/auth';

export function Dashboard() {
  const auth = getAuthService();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [updateMsg, setUpdateMsg] = useState('');

  const handleLogout = () => {
    if (!auth) return;
    signOut(auth).then(() => window.location.reload());
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth || !auth.currentUser) {
      setUpdateMsg('Auth service not ready.');
      return;
    }
    try {
      await updatePassword(auth.currentUser, newPassword);
      setUpdateMsg('Password updated successfully!');
      setNewPassword('');
    } catch (err: any) {
      setUpdateMsg('Error: Re-login required to update password.');
    }
  };

  return (
    <div className="flex h-screen bg-[#FDFBF7]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#064E3B] text-white flex flex-col">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-xl font-bold tracking-tight">Madrasa Manager</h2>
          <p className="text-[10px] text-white/50 uppercase tracking-[0.2em] font-bold">Admin Panel</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <NavItem active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={LayoutDashboard} label="Dashboard" />
          <NavItem active={activeTab === 'students'} onClick={() => setActiveTab('students')} icon={Users} label="Students" />
          <NavItem active={activeTab === 'attendance'} onClick={() => setActiveTab('attendance')} icon={Calendar} label="Attendance" />
          <NavItem active={activeTab === 'finance'} onClick={() => setActiveTab('finance')} icon={Wallet} label="Finance" />
          <NavItem active={activeTab === 'reports'} onClick={() => setActiveTab('reports')} icon={BookOpen} label="Reports" />
        </nav>

        <div className="p-4 border-t border-white/10">
           <button 
             onClick={() => setActiveTab('settings')}
             className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${activeTab === 'settings' ? 'bg-white/10 text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}
           >
             <Settings className="w-5 h-5" />
             <span className="text-sm font-bold">Settings</span>
           </button>
           <button 
             onClick={handleLogout}
             className="w-full flex items-center gap-3 p-3 rounded-xl transition-all text-white/60 hover:bg-red-500 hover:text-white mt-1"
           >
             <LogOut className="w-5 h-5" />
             <span className="text-sm font-bold">Logout</span>
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Authenticated as</h3>
            <div className="text-xl font-bold text-[#064E3B]">{auth?.currentUser?.email || 'Guest'}</div>
          </div>
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 bg-[#D4AF37] rounded-full" />
          </div>
        </header>

        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
               <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                 <StatCard label="Total Students" value="--" />
                 <StatCard label="Today Active" value="--" />
                 <StatCard label="Total Income" value="--" />
                 <StatCard label="Total Expense" value="--" />
               </div>
               
               <div className="bg-white p-6 rounded-2xl border border-slate-200">
                  <h4 className="font-bold text-[#064E3B] mb-4">Quick Management</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <QuickActionButton icon={UserPlus} label="New Registration" />
                    <QuickActionButton icon={Plus} label="In/Out Entry" />
                    <QuickActionButton icon={Calendar} label="Mark Attendance" />
                    <QuickActionButton icon={BarChart3} label="View Analytics" />
                  </div>
               </div>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-md">
               <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-6 border-b pb-4">
                    <Key className="w-6 h-6 text-[#064E3B]" />
                    <h3 className="text-xl font-bold">Change Password</h3>
                  </div>

                  <form onSubmit={handleUpdatePassword} className="space-y-4">
                    {updateMsg && <div className="p-3 bg-slate-50 text-[#064E3B] text-xs font-bold rounded-lg border border-slate-100">{updateMsg}</div>}
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">New Password</label>
                      <input 
                        type="password" 
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password"
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-[#064E3B]"
                      />
                    </div>
                    <button className="w-full py-4 bg-[#064E3B] text-white rounded-xl font-bold shadow-lg hover:brightness-110">
                      Update Password
                    </button>
                  </form>
               </div>
            </motion.div>
          )}

          {['students', 'attendance', 'finance', 'reports'].includes(activeTab) && (
            <div className="flex flex-col items-center justify-center h-64 text-slate-300 border-2 border-dashed border-slate-100 rounded-3xl">
               <LayoutDashboard className="w-12 h-12 mb-4 opacity-50" />
               <p className="font-bold uppercase tracking-widest text-xs">Module under maintenance</p>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

function NavItem({ active, onClick, icon: Icon, label }: any) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${active ? 'bg-white text-[#064E3B] font-bold shadow-lg' : 'text-white/60 hover:bg-white/10 hover:text-white'}`}
    >
      <Icon className={`w-5 h-5 ${active ? 'text-[#064E3B]' : ''}`} />
      <span className="text-sm">{label}</span>
    </button>
  );
}

function StatCard({ label, value }: any) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200">
      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</div>
      <div className="text-3xl font-bold text-[#064E3B]">{value}</div>
    </div>
  );
}

function QuickActionButton({ icon: Icon, label }: any) {
  return (
    <button className="flex flex-col items-center justify-center p-4 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-[#064E3B] hover:text-white transition-all gap-2 group">
       <Icon className="w-6 h-6 text-[#064E3B] group-hover:text-white" />
       <span className="text-[10px] font-bold uppercase tracking-tight">{label}</span>
    </button>
  );
}
