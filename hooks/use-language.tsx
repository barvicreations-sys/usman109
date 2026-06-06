'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Language = 'en' | 'ur';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: any;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    dashboard: 'Dashboard',
    students: 'Students',
    attendance: 'Attendance',
    finance: 'Finance',
    reports: 'Reports',
  },
  ur: {
    dashboard: 'ڈیش بورڈ',
    students: 'طلباء',
    attendance: 'حاضری',
    finance: 'مالیات',
    reports: 'رپورٹس',
  }
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('ur');
  const isRTL = language === 'ur';

  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language, isRTL]);

  const value = {
    language,
    setLanguage,
    t: translations[language],
    isRTL,
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    // Fallback if provider is missing during development
    return { language: 'ur', setLanguage: () => {}, t: translations.ur, isRTL: true };
  }
  return context;
}
