'use client';

import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  TrendingUp, 
  TrendingDown, 
  BookOpen, 
  Wallet, 
  LogOut,
  ChevronRight,
  UserPlus,
  Plus
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '@/hooks/use-language';
import { StudentManagement } from './StudentManagement';
import { AttendanceModule, FinanceManagement, ReportsModule } from './Modules';
import { ProfileSection } from './ProfileCards';

type Tab = 'dashboard' | 'students' | 'attendance' | 'finance' | 'reports';

export function Dashboard() {
  const { t, isRTL } = useLanguage();
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [loading, setLoading] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: t.dashboard || 'Dashboard', icon: LayoutDashboard },
    { id: 'students', label: t.students || 'Students', icon: Users },
    { id: 'attendance', label: t.attendance || 'Attendance', icon: Calendar },
    { id: 'finance', label: t.finance || 'Finance', icon: Wallet },
    { id: 'reports', label: t.reports || 'Reports', icon: BookOpen },
  ];

  return (
    <div className={`flex h-screen overflow-hidden bg-madrasa-cream ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Sidebar - Geometric Balance Theme */}
      <div className="w-[220px] bg-madrasa-deep text-white flex flex-col border-r-3 border-madrasa-gold shadow-2xl relative z-20">
        <div className="p-8 text-center border-b border-white/5">
          <div className="text-madrasa-gold font-bold text-[10px] tracking-widest uppercase mb-1">
            Windows Desktop
          </div>
          <div className="text-sm font-bold leading-tight">
            MANAGEMENT SYSTEM
          </div>
        </div>

        <nav className="flex-1 mt-6">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as Tab)}
              className={`w-full px-6 py-4 flex items-center gap-3 transition-all relative group ${
                activeTab === item.id 
                  ? 'bg-madrasa-green border-l-4 border-madrasa-gold text-white' 
                  : 'text-slate-400 hover:bg-madrasa-green/50 hover:text-white hover:border-l-4 hover:border-madrasa-gold/50'
              }`}
            >
              <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-madrasa-gold' : 'text-slate-500'}`} />
              <span className="text-sm font-bold tracking-tight">{item.label}</span>
              {activeTab === item.id && (
                <div className="absolute right-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-madrasa-gold" />
                </div>
              )}
            </button>
          ))}
        </nav>

        <button className="px-6 py-4 bg-red-900/40 text-red-200 flex items-center gap-3 hover:bg-red-800 transition-all border-t border-white/5">
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-bold tracking-tight">Logout</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Bar */}
        <header className="h-[80px] bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm relative z-10">
          <div className="flex items-center gap-4">
            <div className="px-3 py-1 border border-madrasa-gold rounded-full text-[10px] font-bold text-madrasa-gold tracking-tight">
              UR / EN
            </div>
          </div>
          
          <div className="urdu-text text-xl font-bold text-madrasa-green tracking-wide">
            بسم اللہ الرحمن الرحیم
          </div>

          <div className="flex flex-col items-end">
            <div className="text-sm font-bold text-madrasa-green">User: Admin@109</div>
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">Admin Access</div>
          </div>
        </header>

        {/* Content Scroll Area */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-8 custom-scrollbar">
          {/* Institution Header */}
          <div className="text-center mb-10">
            <h1 className="urdu-text text-4xl text-madrasa-green font-bold mb-2">جامعہ نقشبندیہ بارویہ رضویہ</h1>
            <p className="urdu-text text-slate-500 text-sm">چک نمبر 109 گ ب بجاجانوالہ جڑانوالہ فیصل آباد</p>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                {/* Stats Grid - 4 Columns per theme */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatCard label="Total Students" value="482" />
                  <StatCard label="Today Attendance" value="94%" color="text-green-600" />
                  <StatCard label="Monthly Income" value="Rs. 124k" />
                  <StatCard label="Remaining Balance" value="Rs. 45k" color="text-madrasa-gold" />
                </div>

                {/* Profile Cards Section - Core Geometric Balance Element */}
                <ProfileSection />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Recent Activity Table */}
                  <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                      <h3 className="font-bold text-madrasa-green">Recent Students</h3>
                      <button className="text-xs font-bold text-madrasa-gold hover:underline uppercase tracking-widest">View All</button>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="border-b border-slate-100">
                            <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">ID</th>
                            <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Student Name</th>
                            <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Father's Name</th>
                            <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                              <td className="px-6 py-4 font-mono text-xs font-bold text-slate-400">#JN-00{i}</td>
                              <td className="px-6 py-4 font-bold text-slate-800">Ahmad Khan</td>
                              <td className="px-6 py-4 text-sm text-slate-500">Muhammad Khan</td>
                              <td className="px-6 py-4">
                                <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded uppercase tracking-tighter">Active</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Quick Access */}
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <h3 className="font-bold text-madrasa-green mb-6 pb-2 border-b border-slate-100">Quick Tools</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <QuickButton icon={UserPlus} label="New Student" />
                      <QuickButton icon={Calendar} label="Attendance" />
                      <QuickButton icon={Plus} label="Add Expense" />
                      <QuickButton icon={BookOpen} label="Reports" />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'students' && (
              <motion.div key="students" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <StudentManagement />
              </motion.div>
            )}

            {activeTab === 'attendance' && (
              <motion.div key="attendance" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <AttendanceModule />
              </motion.div>
            )}

            {activeTab === 'finance' && (
              <motion.div key="finance" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <FinanceManagement />
              </motion.div>
            )}

            {activeTab === 'reports' && (
              <motion.div key="reports" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <ReportsModule />
              </motion.div>
            )}

            {activeTab === 'dashboard' === false && activeTab !== 'students' && activeTab !== 'attendance' && activeTab !== 'finance' && activeTab !== 'reports' && (
              <motion.div
                key="module"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center min-h-[400px] text-slate-400"
              >
                <div className="w-16 h-16 rounded-3xl bg-slate-100 flex items-center justify-center mb-4">
                  <LayoutDashboard className="w-8 h-8 opacity-20" />
                </div>
                <p className="font-bold tracking-widest uppercase text-xs">Module under construction</p>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        <footer className="h-12 bg-slate-50 border-t border-slate-200 flex items-center justify-between px-8 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
           <div>Software Version 2.0.4 | Offline DB: Connected</div>
           <div className="urdu-text text-sm">تعاون فرمایا باروی گرافکس فیصل آباد</div>
        </footer>
      </div>
    </div>
  );
}

function StatCard({ label, value, color = "text-slate-800" }: { label: string; value: string; color?: string }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border-t-4 border-madrasa-green border-r border-b border-l border-slate-100 transition-transform hover:-translate-y-1">
      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</div>
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
    </div>
  );
}

function QuickButton({ icon: Icon, label }: { icon: any; label: string }) {
  return (
    <button className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-madrasa-green hover:text-white transition-all gap-2 group">
      <Icon className="w-6 h-6 text-madrasa-green group-hover:text-white" />
      <span className="text-[10px] font-bold uppercase tracking-tight">{label}</span>
    </button>
  );
}
