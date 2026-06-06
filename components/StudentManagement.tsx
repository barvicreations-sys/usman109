'use client';

import { 
  UserPlus, 
  Search, 
  Edit2, 
  Trash2, 
  X,
  Save,
  Loader2
} from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export function StudentManagement() {
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState([
    { id: '1', studentId: 'JN-001', name: 'Ahmad Khan', fatherName: 'Muhammad Khan', phone: '0300-1234567' },
    { id: '2', studentId: 'JN-002', name: 'Usman Ali', fatherName: 'Ali Ahmad', phone: '0300-7654321' },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-madrasa-green uppercase tracking-tight">Student Ledger</h2>
          <p className="text-xs text-slate-400 font-bold tracking-widest uppercase">Manage Admission Records</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 green-gradient text-white rounded-xl font-bold shadow-lg hover:brightness-110 active:scale-95 transition-all">
          <UserPlus className="w-5 h-5" />
          Add New Admission
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center gap-4">
          <Search className="w-5 h-5 text-slate-400" />
          <input type="text" placeholder="Search by name or ID..." className="bg-transparent border-none outline-none w-full text-sm font-medium" />
        </div>
        
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Reg ID</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Student Name</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Father Name</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Phone</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {students.map((s) => (
              <tr key={s.id} className="hover:bg-madrasa-cream/30 transition-colors">
                <td className="px-6 py-4 font-mono text-xs font-bold text-madrasa-gold">{s.studentId}</td>
                <td className="px-6 py-4 font-bold text-slate-800">{s.name}</td>
                <td className="px-6 py-4 text-sm text-slate-500">{s.fatherName}</td>
                <td className="px-6 py-4 text-sm text-slate-500">{s.phone}</td>
                <td className="px-6 py-4 text-right">
                   <div className="flex justify-end gap-2">
                     <button className="p-2 text-slate-400 hover:text-madrasa-green hover:bg-madrasa-green/10 rounded-lg transition-all"><Edit2 className="w-4 h-4" /></button>
                     <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"><Trash2 className="w-4 h-4" /></button>
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
