'use client';

import { 
  UserPlus, 
  Search, 
  Edit2, 
  Trash2, 
  X,
  Save,
  Loader2,
  Phone,
  FileText
} from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useFirestoreCollection } from '@/hooks/use-firebase-crud';
import { downloadStudentReport } from '@/lib/pdf';
import { collection, query, getDocs, where, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Student {
  id: string;
  studentId: string;
  name: string;
  fatherName: string;
  phone: string;
  admissionDate: string;
  status: 'active' | 'inactive';
}

export function StudentManagement() {
  const { data: students, loading, add, update, remove } = useFirestoreCollection<Student>('students');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    studentId: '',
    name: '',
    fatherName: '',
    phone: '',
    admissionDate: new Date().toISOString().split('T')[0],
    status: 'active'
  });

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.fatherName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingStudent) {
      await update(editingStudent.id, formData as any);
    } else {
      await add(formData as any);
    }
    setIsModalOpen(false);
    setEditingStudent(null);
    setFormData({
      studentId: '',
      name: '',
      fatherName: '',
      phone: '',
      admissionDate: new Date().toISOString().split('T')[0],
      status: 'active'
    });
  };

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    setFormData({
      studentId: student.studentId,
      name: student.name,
      fatherName: student.fatherName,
      phone: student.phone,
      admissionDate: student.admissionDate,
      status: student.status
    });
    setIsModalOpen(true);
  };

  const handleDownloadPdf = async (student: Student) => {
    setIsGeneratingPdf(student.id);
    try {
      const q = query(
        collection(db, 'reports'),
        where('studentId', '==', student.studentId),
        orderBy('date', 'desc')
      );
      const snap = await getDocs(q);
      const reports = snap.docs.map(d => d.data());
      downloadStudentReport(student, reports);
    } catch (err) {
      console.error(err);
      alert('Error generating PDF. Ensure reports exist and you are logged in.');
    } finally {
      setIsGeneratingPdf(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-madrasa-green uppercase tracking-tight">Student Ledger</h2>
          <p className="text-xs text-slate-400 font-bold tracking-widest uppercase">Admin Records Management</p>
        </div>
        <button 
          onClick={() => {
            setEditingStudent(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-6 py-3 green-gradient text-white rounded-xl font-bold shadow-lg hover:brightness-110 active:scale-95 transition-all"
        >
          <UserPlus className="w-5 h-5" />
          Add New Admission
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center gap-4">
          <Search className="w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by name, ID or Father's name..." 
            className="bg-transparent border-none outline-none w-full text-sm font-medium" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {loading ? (
          <div className="p-20 text-center text-slate-300">
             <Loader2 className="w-10 h-10 animate-spin mx-auto mb-4" />
             <p className="font-bold uppercase tracking-widest text-xs">Loading Secure Database...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
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
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400 italic">No students found matching your search.</td>
                  </tr>
                ) : filteredStudents.map((s) => (
                  <tr key={s.id} className="hover:bg-madrasa-cream/30 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs font-bold text-madrasa-gold">{s.studentId}</td>
                    <td className="px-6 py-4 font-bold text-slate-800">{s.name}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">{s.fatherName}</td>
                    <td className="px-6 py-4 text-sm text-slate-500 flex items-center gap-1">
                      <Phone className="w-3 h-3 text-slate-300" />
                      {s.phone}
                    </td>
                    <td className="px-6 py-4 text-right">
                       <div className="flex justify-end gap-2">
                         <button 
                            disabled={isGeneratingPdf === s.id}
                            onClick={() => handleDownloadPdf(s)}
                            className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                            title="Download Report Card"
                         >
                            {isGeneratingPdf === s.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
                         </button>
                         <button 
                            onClick={() => handleEdit(s)}
                            className="p-2 text-slate-400 hover:text-madrasa-green hover:bg-madrasa-green/10 rounded-lg transition-all"
                         >
                            <Edit2 className="w-4 h-4" />
                         </button>
                         <button 
                            onClick={() => { if(confirm('Are you sure?')) remove(s.id) }}
                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                         >
                            <Trash2 className="w-4 h-4" />
                         </button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal for Add/Edit */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-md rounded-2xl shadow-2xl relative z-10 overflow-hidden"
            >
              <div className="bg-madrasa-green p-6 text-white flex items-center justify-between">
                <h3 className="text-xl font-bold">{editingStudent ? 'Edit Student' : 'New Admission'}</h3>
                <button onClick={() => setIsModalOpen(false)}><X className="w-6 h-6" /></button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Student ID</label>
                    <input 
                      required
                      value={formData.studentId}
                      onChange={(e) => setFormData({...formData, studentId: e.target.value})}
                      placeholder="e.g. JN-001"
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-madrasa-green font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Phone</label>
                    <input 
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="03xx-xxxxxxx"
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-madrasa-green"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Full Name</label>
                  <input 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Enter Student Name"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-madrasa-green"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Father's Name</label>
                  <input 
                    required
                    value={formData.fatherName}
                    onChange={(e) => setFormData({...formData, fatherName: e.target.value})}
                    placeholder="Enter Father's Name"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-madrasa-green"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Admission Date</label>
                    <input 
                      type="date"
                      required
                      value={formData.admissionDate}
                      onChange={(e) => setFormData({...formData, admissionDate: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-madrasa-green"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Status</label>
                    <select 
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-madrasa-green"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="w-full py-4 green-gradient text-white rounded-xl font-bold shadow-lg hover:brightness-110 flex items-center justify-center gap-2 mt-4"
                >
                  <Save className="w-5 h-5" />
                  {editingStudent ? 'Update Record' : 'Save Admission'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
