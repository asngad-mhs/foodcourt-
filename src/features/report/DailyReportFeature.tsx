import React, { useState } from 'react';
import { Download, Printer } from 'lucide-react';
import { useFoodcourtStore } from '../../stores/useFoodcourtStore';
import {
  getTodayDateString,
  isSameDay,
  exportTransactionsToCsv,
  exportSettlementsToCsv,
  formatRupiah,
} from '../../utils/formatters';
import { DailySummaryMetrics } from '../../components/laporan/DailySummaryMetrics';
import { TenantSettlementTable } from '../../components/laporan/TenantSettlementTable';
import { TransactionHistoryTable } from '../../components/laporan/TransactionHistoryTable';

export const DailyReportFeature: React.FC = () => {
  const transactions = useFoodcourtStore((s) => s.transactions);
  const orders = useFoodcourtStore((s) => s.orders);
  const tenants = useFoodcourtStore((s) => s.tenants);
  const settlements = useFoodcourtStore((s) => s.settlements);
  const inspectOrderReceipt = useFoodcourtStore((s) => s.inspectOrderReceipt);
  const settleTenantDailyRevenue = useFoodcourtStore(
    (s) => s.settleTenantDailyRevenue
  );

  const todayStr = getTodayDateString();
  const [dateScope, setDateScope] = useState<'TODAY' | 'ALL'>('TODAY');
  const [paymentFilter, setPaymentFilter] = useState<string>('ALL');
  const [settlementFeedback, setSettlementFeedback] = useState<string | null>(
    null
  );

  const filteredTransactions = transactions.filter((t) => {
    const matchDate =
      dateScope === 'ALL' || isSameDay(t.paid_at, todayStr);
    const matchPayment =
      paymentFilter === 'ALL' || t.payment_method === paymentFilter;
    return matchDate && matchPayment;
  });

  const filteredOrders = orders.filter((o) => {
    const matchDate =
      dateScope === 'ALL' || isSameDay(o.created_at, todayStr);
    return matchDate;
  });

  const menuSalesMap = new Map<
    string,
    { name: string; booth: string; qty: number; revenue: number }
  >();
  filteredOrders.forEach((o) => {
    if (o.order_status === 'dibatalkan') return;
    o.items.forEach((item) => {
      const existing = menuSalesMap.get(item.menu_id);
      if (existing) {
        existing.qty += item.quantity;
        existing.revenue += item.subtotal;
      } else {
        menuSalesMap.set(item.menu_id, {
          name: item.menu_name,
          booth: item.booth_number,
          qty: item.quantity,
          revenue: item.subtotal,
        });
      }
    });
  });

  const topMenus = Array.from(menuSalesMap.values()).sort(
    (a, b) => b.qty - a.qty
  );

  const handleSettleToday = () => {
    const count = settleTenantDailyRevenue(todayStr);
    setSettlementFeedback(
      `Berhasil mencatat tutup buku untuk ${count} stan pada ${todayStr}`
    );
    setTimeout(() => setSettlementFeedback(null), 5000);
  };

  return (
    <section className="flex flex-col gap-6">
      {/* Header & Export Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 font-display">
            Laporan Penjualan Harian &amp; Settlement Stan
          </h1>
          <p className="text-sm text-slate-600 mt-0.5">
            Rekapitulasi transaksi real-time, komisi pengelolaan Foodcourt
            UNUGHA (10%), dan pencairan dana mitra UMKM (90%).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 no-print">
          <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-lg">
            <button
              type="button"
              onClick={() => setDateScope('TODAY')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                dateScope === 'TODAY'
                  ? 'bg-white text-slate-900 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Hari Ini ({todayStr})
            </button>
            <button
              type="button"
              onClick={() => setDateScope('ALL')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                dateScope === 'ALL'
                  ? 'bg-white text-slate-900 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semua Periode
            </button>
          </div>

          <select
            aria-label="Filter Metode Pembayaran"
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="px-3 py-2 text-xs font-medium bg-white border border-slate-200 rounded-lg text-slate-800"
          >
            <option value="ALL">Semua Metode Bayar</option>
            <option value="Cash">Cash (Uang Tunai)</option>
            <option value="QRIS">QRIS</option>
            <option value="Transfer">Transfer Bank</option>
            <option value="E-Wallet">E-Wallet</option>
            <option value="KTM UNUGHA">KTM UNUGHA</option>
          </select>

          <button
            type="button"
            onClick={() =>
              exportTransactionsToCsv(filteredTransactions, todayStr)
            }
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Ekspor CSV Transaksi</span>
          </button>

          <button
            type="button"
            onClick={() => exportSettlementsToCsv(settlements, todayStr)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>CSV Settlement</span>
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak Laporan</span>
          </button>
        </div>
      </div>

      {/* Summary Financial Metrics */}
      <DailySummaryMetrics
        transactions={filteredTransactions}
        orders={filteredOrders}
      />

      {/* Per-Tenant Revenue Share & Daily Settlement */}
      <TenantSettlementTable
        tenants={tenants}
        orders={filteredOrders}
        onSettleToday={handleSettleToday}
        settlementFeedback={settlementFeedback}
      />

      {/* Top Selling Menu Leaderboard */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200">
          <h3 className="text-base font-semibold text-slate-900">
            Menu Terlaris Hari Ini (Berdasarkan Volume Porsi)
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Agregasi langsung dari item pesanan mahasiswa yang telah lunas
          </p>
        </div>
        <div className="divide-y divide-slate-100">
          {topMenus.slice(0, 5).map((item, idx) => (
            <div
              key={item.name}
              className="px-5 py-3 flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-3">
                <span className="font-mono-tabular font-semibold text-slate-400 w-5">
                  0{idx + 1}.
                </span>
                <div>
                  <span className="font-semibold text-slate-900 text-sm">
                    {item.name}
                  </span>
                  <span className="text-slate-500 ml-2">
                    · Stan {item.booth}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-6 font-mono-tabular">
                <span className="text-slate-600">{item.qty} porsi terjual</span>
                <span className="font-semibold text-slate-900 w-28 text-right">
                  {formatRupiah(item.revenue)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transaction History Table */}
      <TransactionHistoryTable
        transactions={filteredTransactions}
        onInspectReceipt={inspectOrderReceipt}
      />
    </section>
  );
};
