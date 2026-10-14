import React, { useState } from 'react';
import { Sidebar } from '../components/common/Sidebar';
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
  const [isSidebarOpenMobile, setIsSidebarOpenMobile] = useState(false);

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900">
      {/* 1. Vertical Sidebar on Left */}
      <Sidebar
        isOpenMobile={isSidebarOpenMobile}
        onCloseMobile={() => setIsSidebarOpenMobile(false)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
      />

      {/* 2. Main Content Column on Right */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <Header
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
          onOpenSidebarMobile={() => setIsSidebarOpenMobile(true)}
        />

        <main className="flex-1 w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>

        <footer className="border-t border-slate-200 bg-white px-6 py-4 text-xs text-slate-500 no-print">
          <div className="max-w-[1600px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>
              Unit Pengelola Usaha &amp; Foodcourt Kampus UNUGHA — Universitas
              Nahdlatul Ulama Al Ghazali Cilacap
            </span>
            <span className="font-mono-tabular">
              Jl. Kemerdekaan Barat No.17, Kesugihan, Cilacap
            </span>
          </div>
        </footer>
      </div>

      {/* Modals */}
      <ReceiptModal />
      <AuthSwitcherModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
};
