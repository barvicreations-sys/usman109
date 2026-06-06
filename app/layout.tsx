import type { Metadata } from 'next';
import { Inter, Noto_Sans_Arabic } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/lib/contexts/AuthContext';
import { LanguageProvider } from '@/hooks/use-language';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const notoUrdu = Noto_Sans_Arabic({
  subsets: ['arabic'],
  variable: '--font-urdu',
  weight: ['400', '700'],
});

export const metadata: Metadata = {
  title: 'Madrasa Management System',
  description: 'Geometric Balance Theme',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${notoUrdu.variable}`}>
      <body suppressHydrationWarning className="bg-madrasa-cream min-h-screen text-slate-900 font-sans">
        <AuthProvider>
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
