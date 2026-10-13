import React from 'react';
import { NavigationTab } from '../../types';
import { useFoodcourtStore } from '../../stores/useFoodcourtStore';

interface HeaderProps {
  onOpenAuthModal: () => void;
}

const NAV_ITEMS: { id: NavigationTab; label: string }[] = [
  { id: 'kasir', label: 'Kasir POS' },
  { id: 'antrean', label: 'Antrean Live' },
  { id: 'menu', label: 'Manajemen Menu' },
  { id: 'laporan', label: 'Laporan Harian' },
  { id: 'tenant', label: 'Mitra Stan' },
  { id: 'database', label: 'Skema Database' },
  { id: 'presentasi', label: '📊 Laporan PPT' },
];

export const Header: React.FC<HeaderProps> = ({ onOpenAuthModal }) => {
  const activeTab = useFoodcourtStore((s) => s.activeTab);
  const setActiveTab = useFoodcourtStore((s) => s.setActiveTab);
  const currentUser = useFoodcourtStore((s) => s.currentUser);
  const simulateIncomingQrisOrder = useFoodcourtStore(
    (s) => s.simulateIncomingQrisOrder
  );

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-3.5 bg-white border-b border-slate-200 no-print">
      {/* Zone 1: Single text element wordmark */}
      <button
        type="button"
        onClick={() => setActiveTab('kasir')}
        className="text-xl font-semibold tracking-tight text-slate-900 font-display whitespace-nowrap shrink-0 text-left focus-visible:outline-2 focus-visible:outline-emerald-700 cursor-pointer"
      >
        Foodcourt UNUGHA
      </button>

      {/* Zone 2: Clean text navigation links */}
      <nav
        aria-label="Navigasi Utama Kasir Foodcourt UNUGHA"
        className="flex items-center gap-5 overflow-x-auto text-sm font-medium text-slate-600"
      >
        {NAV_ITEMS.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              className={`py-1 whitespace-nowrap shrink-0 transition-colors border-b-2 cursor-pointer ${
                isActive
                  ? 'border-emerald-700 text-slate-900 font-semibold'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Zone 3: Primary action & cashier session */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          type="button"
          onClick={() => simulateIncomingQrisOrder()}
          title="Simulasikan pesanan masuk dari scan QRIS meja mahasiswa (F4)"
          className="hidden sm:inline-flex items-center px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          + Simulasi Order QRIS
        </button>
        <button
          type="button"
          onClick={onOpenAuthModal}
          className="px-4 py-2 text-xs font-semibold text-white bg-emerald-800 rounded-lg hover:bg-emerald-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          {currentUser.username}
        </button>
      </div>
    </header>
  );
};
