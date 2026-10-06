import React, { useState } from 'react';
import { Header } from '../components/common/Header';
import { ReceiptModal } from '../components/kasir/ReceiptModal';
import { AuthSwitcherModal } from '../features/auth/AuthSwitcherModal';
import { useRealtimeSync } from '../hooks/useRealtimeSync';

interface MainPosLayoutProps {
  children: React.ReactNode;
}

export const MainPosLayout: React.FC<MainPosLayoutProps> = ({ children }) => {
  useRealtimeSync();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Header onOpenAuthModal={() => setIsAuthModalOpen(true)} />

      <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 sm:px-6 py-6">
        {children}
      </main>

      <footer className="border-t border-slate-200 bg-white px-6 py-4 text-xs text-slate-500 no-print">
        <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            Unit Pengelola Usaha &amp; Foodcourt Kampus UNUGHA — Universitas
            Nahdlatul Ulama Al Ghazali Cilacap
          </span>
          <span className="font-mono-tabular">
            Jl. Kemerdekaan Barat No.17, Kesugihan, Cilacap
          </span>
        </div>
      </footer>

      <ReceiptModal />
      <AuthSwitcherModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
};
