'use client';

import { useState } from 'react';
import { useFirestoreCollection } from '@/hooks/use-firebase-crud';
import { 
  CheckCircle2, 
  XCircle, 
  MinusCircle, 
  Plus, 
  Trash2, 
  TrendingUp, 
  TrendingDown,
  Download,
  Loader2
} from 'lucide-react';
import { downloadFinanceReport } from '@/lib/pdf';

// --- ATTENDANCE MODULE ---
export function AttendanceModule() {
  const { data: students } = useFirestoreCollection<any>('students');
  const { data: attendance, add } = useFirestoreCollection<any>('attendance');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const recordAttendance = async (studentId: string, status: string) => {
    await add({ studentId, date: selectedDate, status });
  };

  const getStatus = (studentId: string) => {
    return attendance.find(a => a.studentId === studentId && a.date === selectedDate)?.status;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-madrasa-green">Daily attendance</h2>
        <input 
          type="date" 
          value={selectedDate} 
          onChange={(e) => setSelectedDate(e.target.value)}
          className="px-4 py-2 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-madrasa-green"
        />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Student</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {students.map(s => (
              <tr key={s.id}>
                <td className="px-6 py-4">
                  <div className="font-bold text-slate-800">{s.name}</div>
                  <div className="text-xs text-slate-400 font-mono">{s.studentId}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-center gap-4">
                    <button 
                      onClick={() => recordAttendance(s.studentId, 'present')}
                      className={`p-2 rounded-lg transition-all ${getStatus(s.studentId) === 'present' ? 'bg-green-100 text-green-600' : 'bg-slate-50 text-slate-300 hover:text-green-500'}`}
                    >
                      <CheckCircle2 className="w-6 h-6" />
                    </button>
                    <button 
                      onClick={() => recordAttendance(s.studentId, 'absent')}
                      className={`p-2 rounded-lg transition-all ${getStatus(s.studentId) === 'absent' ? 'bg-red-100 text-red-600' : 'bg-slate-50 text-slate-300 hover:text-red-500'}`}
                    >
                      <XCircle className="w-6 h-6" />
                    </button>
                    <button 
                      onClick={() => recordAttendance(s.studentId, 'leave')}
                      className={`p-2 rounded-lg transition-all ${getStatus(s.studentId) === 'leave' ? 'bg-amber-100 text-amber-600' : 'bg-slate-50 text-slate-300 hover:text-amber-500'}`}
                    >
                      <MinusCircle className="w-6 h-6" />
                    </button>
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

// --- FINANCE MODULE ---
export function FinanceManagement() {
  const { data: income, add: addIn, remove: remIn, loading: loadIn } = useFirestoreCollection<any>('income');
  const { data: expense, add: addEx, remove: remEx, loading: loadEx } = useFirestoreCollection<any>('expense');
  
  const [formData, setFormData] = useState({ description: '', amount: '', category: '', type: 'income' });

  const totalIncome = income.reduce((sum, item) => sum + (item.amount || 0), 0);
  const totalExpense = expense.reduce((sum, item) => sum + (item.amount || 0), 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = { ...formData, amount: parseFloat(formData.amount as string), date: new Date().toISOString().split('T')[0] };
    if (formData.type === 'income') await addIn(data);
    else await addEx(data);
    setFormData({ description: '', amount: '', category: '', type: 'income' });
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-2xl">
          <div className="flex items-center gap-3 mb-2 text-emerald-600">
            <TrendingUp className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Total Income</span>
          </div>
          <div className="text-3xl font-bold text-emerald-700">Rs. {totalIncome.toLocaleString()}</div>
        </div>
        <div className="bg-rose-50 border border-rose-100 p-6 rounded-2xl">
          <div className="flex items-center gap-3 mb-2 text-rose-600">
            <TrendingDown className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Total Expense</span>
          </div>
          <div className="text-3xl font-bold text-rose-700">Rs. {totalExpense.toLocaleString()}</div>
        </div>
        <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-2xl">
          <div className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 mb-2">Net Balance</div>
          <div className="text-3xl font-bold text-indigo-700">Rs. {(totalIncome - totalExpense).toLocaleString()}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Entry Form */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200">
          <h3 className="font-bold text-madrasa-green mb-6 border-b pb-2">Add New Transaction</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <select 
                value={formData.type} 
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                className="col-span-2 p-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-madrasa-green"
              >
                <option value="income">Income / آمدنی</option>
                <option value="expense">Expense / خرچ</option>
              </select>
              <input 
                placeholder="Description" 
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="p-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-madrasa-green"
              />
              <input 
                type="number" 
                placeholder="Amount"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                className="p-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-madrasa-green"
              />
            </div>
            <button className="w-full py-3 green-gradient text-white rounded-xl font-bold shadow-lg hover:brightness-110">Save Transaction</button>
          </form>
        </div>

        {/* History & Downloads */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200">
          <h3 className="font-bold text-madrasa-green mb-6 border-b pb-2">Reports & History</h3>
          <div className="space-y-4">
            <button 
              onClick={() => downloadFinanceReport('income', income)}
              className="w-full p-4 flex items-center justify-between bg-emerald-50 text-emerald-700 rounded-xl hover:bg-emerald-100 transition-all font-bold"
            >
              <span>Download Income Report</span>
              <Download className="w-5 h-5" />
            </button>
            <button 
              onClick={() => downloadFinanceReport('expense', expense)}
              className="w-full p-4 flex items-center justify-between bg-rose-50 text-rose-700 rounded-xl hover:bg-rose-100 transition-all font-bold"
            >
              <span>Download Expense Report</span>
              <Download className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- REPORTS MODULE ---
export function ReportsModule() {
  const { data: students } = useFirestoreCollection<any>('students');
  const { add } = useFirestoreCollection<any>('reports');
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    sabaq: '',
    sabqi: '',
    manzil: '',
    namaz: 0,
    date: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;
    await add({ ...formData, studentId: selectedStudent });
    setFormData({ sabaq: '', sabqi: '', manzil: '', namaz: 0, date: new Date().toISOString().split('T')[0] });
    alert('Progress Report Saved');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-100 font-bold text-xs uppercase tracking-widest text-slate-400">Select Student</div>
        <div className="divide-y divide-slate-50 h-[500px] overflow-y-auto custom-scrollbar">
          {students.map(s => (
            <button 
              key={s.id}
              onClick={() => setSelectedStudent(s.studentId)}
              className={`w-full p-4 text-left hover:bg-madrasa-cream/50 transition-all ${selectedStudent === s.studentId ? 'bg-madrasa-green text-white' : ''}`}
            >
              <div className="font-bold">{s.name}</div>
              <div className={`text-xs ${selectedStudent === s.studentId ? 'text-white/60' : 'text-slate-400'}`}>{s.studentId}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-8">
        <h3 className="text-xl font-bold text-madrasa-green border-b pb-4 mb-6 uppercase tracking-tight">Educational Progress Log</h3>
        
        {selectedStudent ? (
          <form onSubmit={handleSubmit} className="space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Today's Sabaq (Lesson)</label>
                  <input value={formData.sabaq} onChange={e => setFormData({...formData, sabaq: e.target.value})} className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Sabqi (Previous Lesson)</label>
                  <input value={formData.sabqi} onChange={e => setFormData({...formData, sabqi: e.target.value})} className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Manzil (Review)</label>
                  <input value={formData.manzil} onChange={e => setFormData({...formData, manzil: e.target.value})} className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Namaz Count (0-5)</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(n => (
                      <button 
                        key={n}
                        type="button"
                        onClick={() => setFormData({...formData, namaz: n})}
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${formData.namaz >= n ? 'bg-madrasa-gold text-white' : 'bg-slate-100 text-slate-300'}`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
             </div>
             <button className="px-10 py-4 green-gradient text-white rounded-xl font-bold shadow-lg hover:brightness-110">Submit Report</button>
          </form>
        ) : (
          <div className="p-20 text-center text-slate-300 italic">Please select a student from the sidebar to record progress.</div>
        )}
      </div>
    </div>
  );
}
