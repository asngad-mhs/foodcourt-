import React from 'react';
import { Menu, Plus, UserCheck, Calendar, Clock } from 'lucide-react';
import { useFoodcourtStore } from '../../stores/useFoodcourtStore';
import { formatDateId } from '../../utils/formatters';

interface HeaderProps {
  onOpenAuthModal: () => void;
  onOpenSidebarMobile?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAuthModal,
  onOpenSidebarMobile,
}) => {
  const activeTab = useFoodcourtStore((s) => s.activeTab);
  const currentUser = useFoodcourtStore((s) => s.currentUser);
  const simulateIncomingQrisOrder = useFoodcourtStore(
    (s) => s.simulateIncomingQrisOrder
  );

  const getPageInfo = () => {
    switch (activeTab) {
      case 'dashboard':
        return {
          title: 'Dashboard Utama Foodcourt',
          badge: 'Pusat Kendali & Ringkasan Eksekutif',
        };
      case 'kasir':
        return {
          title: 'Kasir POS Sentral',
          badge: 'Transaksi & Nota Belanja',
        };
      case 'antrean':
        return {
          title: 'Antrean Dapur (KDS)',
          badge: 'Distribusi Pesanan Stan',
        };
      case 'menu':
        return {
          title: 'Manajemen Menu & Stok',
          badge: 'Katalog Multi-Tenant',
        };
      case 'laporan':
        return {
          title: 'Laporan Penjualan & Settlement',
          badge: 'Bagi Hasil 90:10',
        };
      case 'tenant':
        return {
          title: 'Mitra Stan Kuliner',
          badge: 'Direktori & Rekening',
        };
      case 'database':
        return {
          title: 'Skema Database Relasional',
          badge: 'Arsitektur DDL & ERD',
        };
      case 'presentasi':
        return {
          title: 'Laporan PPT, RCA & Test Case',
          badge: '15 Slide & Unit Test Runner',
        };
      default:
        return {
          title: 'Sistem POS Foodcourt',
          badge: 'UNUGHA Cilacap',
        };
    }
  };

  const pageInfo = getPageInfo();
  const todayFormatted = formatDateId(new Date().toISOString());

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between px-4 sm:px-6 py-3 bg-white/95 backdrop-blur-xs border-b border-slate-200 no-print">
      {/* Left: Mobile Hamburger & Active Page Title */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenSidebarMobile}
          className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg lg:hidden cursor-pointer"
          aria-label="Buka Menu Navigasi Samping"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <h1 className="text-base sm:text-lg font-bold text-slate-900 font-display">
            {pageInfo.title}
          </h1>
          <span className="hidden sm:inline-flex px-2.5 py-0.5 text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-md">
            {pageInfo.badge}
          </span>
        </div>
      </div>

      {/* Right: Date, Fast Simulation, & User Pill */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-500 font-mono-tabular bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>{todayFormatted}</span>
        </div>

        <button
          type="button"
          onClick={() => simulateIncomingQrisOrder()}
          title="Simulasikan pesanan masuk dari scan QRIS meja mahasiswa"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 text-emerald-700" />
          <span>Simulasi QRIS</span>
        </button>

        <button
          type="button"
          onClick={onOpenAuthModal}
          className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-emerald-950 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors cursor-pointer"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-600" />
          <span className="truncate max-w-[120px]">{currentUser.username}</span>
        </button>
      </div>
    </header>
  );
};
