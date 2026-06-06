'use client';

import { UserCircle } from 'lucide-react';

interface ProfileProps {
  title?: string;
  name: string;
  role: string;
  urduTitle: string;
}

export function ProfileCard({ title, name, role, urduTitle }: ProfileProps) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-slate-200 transition-all hover:-translate-y-2 group cursor-pointer">
      <div className="bg-madrasa-green p-3 text-center">
        <h4 className="urdu-text text-white text-sm font-bold tracking-widest">{urduTitle}</h4>
      </div>
      
      <div className="p-8 flex flex-col items-center">
        <div className="w-24 h-24 rounded-full bg-slate-50 border-4 border-madrasa-gold shadow-inner flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
          <UserCircle className="w-16 h-16 text-slate-300" />
        </div>
        
        <h3 className="font-bold text-slate-800 text-lg mb-1">{name}</h3>
        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{role}</p>
      </div>
    </div>
  );
}

export function ProfileSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8 px-4">
      <ProfileCard 
        urduTitle="زیر نگرانی (Supervisor)" 
        name="Maulana Rizwan Sadiq" 
        role="Chief Administrator" 
      />
      <ProfileCard 
        urduTitle="فیضان نظر (Faizan-e-Nazar)" 
        name="Pir Syed Naqshband" 
        role="Spiritual Head" 
      />
      <ProfileCard 
        urduTitle="معلم (Teacher)" 
        name="Qari Muhammad Usman" 
        role="Senior Tajweed Expert" 
      />
    </div>
  );
}
