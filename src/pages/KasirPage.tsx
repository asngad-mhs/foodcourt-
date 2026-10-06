import React, { useRef } from 'react';
import { MenuCatalogGrid } from '../components/kasir/MenuCatalogGrid';
import { CartSidebar } from '../components/kasir/CartSidebar';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { useFoodcourtStore } from '../stores/useFoodcourtStore';
import { formatRupiah, getTodayDateString, isSameDay } from '../utils/formatters';

export const KasirPage: React.FC = () => {
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const simulateIncomingQrisOrder = useFoodcourtStore(
    (s) => s.simulateIncomingQrisOrder
  );
  const orders = useFoodcourtStore((s) => s.orders);
  const transactions = useFoodcourtStore((s) => s.transactions);
  const setActiveTab = useFoodcourtStore((s) => s.setActiveTab);

  useKeyboardShortcuts({
    onFocusSearch: () => searchInputRef.current?.focus(),
    onSimulateQris: () => simulateIncomingQrisOrder(),
  });

  const todayStr = getTodayDateString();
  const todayTransactions = transactions.filter((t) =>
    isSameDay(t.paid_at, todayStr)
  );
  const todayRevenue = todayTransactions.reduce(
    (sum, t) => sum + t.grand_total,
    0
  );
  const activeKitchenOrders = orders.filter(
    (o) =>
      o.order_status === 'menunggu' ||
      o.order_status === 'dimasak' ||
      o.order_status === 'siap_saji'
  );

  return (
    <div className="flex flex-col gap-5">
      {/* Contextual Top Summary Strip */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-900 font-display">
            Terminal Kasir Sentral — Foodcourt Kampus UNUGHA Cilacap
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Pilih sajian lintas stan dalam 1 struk terpadu · Bagi hasil otomatis
            90% Mitra Stan &amp; 10% Pengelola Foodcourt
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-5 text-xs border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
          <div>
            <span className="text-slate-500 block">Omzet Hari Ini</span>
            <span className="font-mono-tabular font-semibold text-sm text-slate-900">
              {formatRupiah(todayRevenue)} ({todayTransactions.length} nota)
            </span>
          </div>

          <div className="h-7 w-px bg-slate-200 hidden sm:block" />

          <div>
            <span className="text-slate-500 block">Antrean Dapur Aktif</span>
            <button
              type="button"
              onClick={() => setActiveTab('antrean')}
              className="font-mono-tabular font-semibold text-sm text-emerald-800 hover:underline cursor-pointer"
            >
              {activeKitchenOrders.length} pesanan diproses &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* Main Split Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        <div className="lg:col-span-8">
          <MenuCatalogGrid searchInputRef={searchInputRef} />
        </div>
        <div className="lg:col-span-4 lg:sticky lg:top-20">
          <CartSidebar />
        </div>
      </div>
    </div>
  );
};
