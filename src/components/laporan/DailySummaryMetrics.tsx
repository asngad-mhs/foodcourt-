import React from 'react';
import { Transaction, Order } from '../../types';
import { formatRupiah } from '../../utils/formatters';

interface DailySummaryMetricsProps {
  transactions: Transaction[];
  orders: Order[];
}

export const DailySummaryMetrics: React.FC<DailySummaryMetricsProps> = ({
  transactions,
  orders,
}) => {
  const grossRevenue = transactions.reduce((sum, t) => sum + t.grand_total, 0);
  const foodcourtFee = transactions.reduce(
    (sum, t) => sum + t.foodcourt_commission,
    0
  );
  const tenantNetPayout = transactions.reduce(
    (sum, t) => sum + t.tenant_net_total,
    0
  );
  const totalPortionsSold = orders.reduce(
    (sum, o) =>
      sum + o.items.reduce((itemSum, item) => itemSum + item.quantity, 0),
    0
  );

  const qrisTotal = transactions
    .filter((t) => t.payment_method === 'QRIS')
    .reduce((s, t) => s + t.grand_total, 0);
  const cashTotal = transactions
    .filter((t) => t.payment_method === 'Cash')
    .reduce((s, t) => s + t.grand_total, 0);
  const transferTotal = transactions
    .filter((t) => t.payment_method === 'Transfer' || t.payment_method === 'Transfer Bank')
    .reduce((s, t) => s + t.grand_total, 0);
  const ewalletTotal = transactions
    .filter((t) => t.payment_method === 'E-Wallet')
    .reduce((s, t) => s + t.grand_total, 0);
  const ktmTotal = transactions
    .filter((t) => t.payment_method === 'KTM UNUGHA')
    .reduce((s, t) => s + t.grand_total, 0);

  return (
    <div className="flex flex-col gap-4">
      {/* Primary Financial Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 bg-white border border-slate-200 rounded-xl divide-y sm:divide-y-0 sm:divide-x divide-slate-200">
        <div className="p-5">
          <p className="text-xs font-medium text-slate-500">
            Total Omzet Penjualan Kotor
          </p>
          <p className="mt-2 text-2xl font-semibold font-mono-tabular text-slate-900">
            {formatRupiah(grossRevenue)}
          </p>
          <p className="mt-1 text-xs text-slate-500 font-mono-tabular">
            {transactions.length} transaksi lunas · {totalPortionsSold} porsi
          </p>
        </div>

        <div className="p-5">
          <p className="text-xs font-medium text-slate-500">
            Hak Bersih Mitra Stan (90%)
          </p>
          <p className="mt-2 text-2xl font-semibold font-mono-tabular text-emerald-800">
            {formatRupiah(tenantNetPayout)}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Siap dicairkan ke rekening 6 stan
          </p>
        </div>

        <div className="p-5">
          <p className="text-xs font-medium text-slate-500">
            Bagi Hasil Pengelola UNUGHA (10%)
          </p>
          <p className="mt-2 text-2xl font-semibold font-mono-tabular text-slate-900">
            {formatRupiah(foodcourtFee)}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Kas operasional & kebersihan foodcourt
          </p>
        </div>

        <div className="p-5">
          <p className="text-xs font-medium text-slate-500">
            Rata-Rata Nilai Nota (AOV)
          </p>
          <p className="mt-2 text-2xl font-semibold font-mono-tabular text-slate-900">
            {formatRupiah(
              transactions.length > 0
                ? Math.round(grossRevenue / transactions.length)
                : 0
            )}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Per pesanan mahasiswa / dosen
          </p>
        </div>
      </div>

      {/* Payment Method Breakdown */}
      <div className="p-5 bg-white border border-slate-200 rounded-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Komposisi Kanal Pembayaran Kasir
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Rekonsiliasi kas laci tunai vs settlement bank QRIS & Kartu KTM UNUGHA
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono-tabular">
            <span>QRIS: {formatRupiah(qrisTotal)}</span>
            <span aria-hidden="true">·</span>
            <span>Tunai: {formatRupiah(cashTotal)}</span>
            <span aria-hidden="true">·</span>
            <span>KTM: {formatRupiah(ktmTotal)}</span>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-3">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-700">💵 Cash (Tunai)</span>
              <span className="font-mono-tabular font-semibold text-slate-900">
                {grossRevenue > 0
                  ? Math.round((cashTotal / grossRevenue) * 100)
                  : 0}
                %
              </span>
            </div>
            <p className="mt-1 text-sm font-semibold font-mono-tabular text-emerald-800">
              {formatRupiah(cashTotal)}
            </p>
            <p className="text-[10px] text-slate-500 mt-0.5">Uang fisik laci kasir</p>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-700">📱 QRIS</span>
              <span className="font-mono-tabular font-semibold text-slate-900">
                {grossRevenue > 0
                  ? Math.round((qrisTotal / grossRevenue) * 100)
                  : 0}
                %
              </span>
            </div>
            <p className="mt-1 text-sm font-semibold font-mono-tabular text-slate-900">
              {formatRupiah(qrisTotal)}
            </p>
            <p className="text-[10px] text-slate-500 mt-0.5">Scan instan</p>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-700">🏦 Transfer Bank</span>
              <span className="font-mono-tabular font-semibold text-slate-900">
                {grossRevenue > 0
                  ? Math.round((transferTotal / grossRevenue) * 100)
                  : 0}
                %
              </span>
            </div>
            <p className="mt-1 text-sm font-semibold font-mono-tabular text-slate-900">
              {formatRupiah(transferTotal)}
            </p>
            <p className="text-[10px] text-slate-500 mt-0.5">BSI Kas Sentral</p>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-700">📲 E-Wallet</span>
              <span className="font-mono-tabular font-semibold text-slate-900">
                {grossRevenue > 0
                  ? Math.round((ewalletTotal / grossRevenue) * 100)
                  : 0}
                %
              </span>
            </div>
            <p className="mt-1 text-sm font-semibold font-mono-tabular text-slate-900">
              {formatRupiah(ewalletTotal)}
            </p>
            <p className="text-[10px] text-slate-500 mt-0.5">GoPay/OVO/DANA</p>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 col-span-2 md:col-span-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-700">💳 KTM UNUGHA</span>
              <span className="font-mono-tabular font-semibold text-slate-900">
                {grossRevenue > 0
                  ? Math.round((ktmTotal / grossRevenue) * 100)
                  : 0}
                %
              </span>
            </div>
            <p className="mt-1 text-sm font-semibold font-mono-tabular text-slate-900">
              {formatRupiah(ktmTotal)}
            </p>
            <p className="text-[10px] text-slate-500 mt-0.5">Kartu Mahasiswa</p>
          </div>
        </div>
      </div>
    </div>
  );
};
