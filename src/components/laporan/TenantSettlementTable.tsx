import React from 'react';
import { Order, Tenant } from '../../types';
import { formatRupiah } from '../../utils/formatters';

interface TenantSettlementTableProps {
  tenants: Tenant[];
  orders: Order[];
  onSettleToday: () => void;
  settlementFeedback: string | null;
}

export const TenantSettlementTable: React.FC<TenantSettlementTableProps> = ({
  tenants,
  orders,
  onSettleToday,
  settlementFeedback,
}) => {
  const rows = tenants.map((tenant) => {
    let orderCount = 0;
    let portionsSold = 0;
    let grossSales = 0;

    orders.forEach((order) => {
      if (order.order_status === 'dibatalkan') return;
      const itemsForTenant = order.items.filter(
        (i) => i.tenant_id === tenant.id
      );
      if (itemsForTenant.length > 0) {
        orderCount += 1;
        itemsForTenant.forEach((item) => {
          portionsSold += item.quantity;
          grossSales += item.subtotal;
        });
      }
    });

    const commission = Math.round(
      (grossSales * tenant.commission_percent) / 100
    );
    const netPayout = grossSales - commission;

    return {
      tenant,
      orderCount,
      portionsSold,
      grossSales,
      commission,
      netPayout,
    };
  });

  const totalGross = rows.reduce((s, r) => s + r.grossSales, 0);
  const totalCommission = rows.reduce((s, r) => s + r.commission, 0);
  const totalNet = rows.reduce((s, r) => s + r.netPayout, 0);

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-slate-900">
            Rekapitulasi Bagi Hasil & Settlement Per Stan (Multi-Tenant)
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Perhitungan otomatis dari tabel relasional{' '}
            <span className="font-mono-tabular">order_items</span> &amp;{' '}
            <span className="font-mono-tabular">daily_settlements</span>
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {settlementFeedback && (
            <span className="text-xs font-medium text-emerald-800">
              {settlementFeedback}
            </span>
          )}
          <button
            type="button"
            onClick={onSettleToday}
            className="px-4 py-2 text-xs font-semibold text-white bg-emerald-800 rounded-lg hover:bg-emerald-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Simpan Tutup Buku Harian
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-600">
              <th className="py-3 px-4">Kavling Stan</th>
              <th className="py-3 px-4">Nama Stan & Mitra</th>
              <th className="py-3 px-4">Rekening Pencairan</th>
              <th className="py-3 px-4 text-right">Nota</th>
              <th className="py-3 px-4 text-right">Porsi Terjual</th>
              <th className="py-3 px-4 text-right">Penjualan Kotor</th>
              <th className="py-3 px-4 text-right">Komisi UNUGHA (10%)</th>
              <th className="py-3 px-4 text-right">Dana Bersih Cair (90%)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {rows.map((r) => (
              <tr
                key={r.tenant.id}
                className="hover:bg-slate-50/80 transition-colors"
              >
                <td className="py-3 px-4 font-mono-tabular font-semibold text-slate-900">
                  Stan {r.tenant.booth_number}
                </td>
                <td className="py-3 px-4">
                  <div className="font-semibold text-slate-900">
                    {r.tenant.name}
                  </div>
                  <div className="text-slate-500">{r.tenant.owner_name}</div>
                </td>
                <td className="py-3 px-4 font-mono-tabular text-slate-600">
                  {r.tenant.bank_account}
                </td>
                <td className="py-3 px-4 text-right font-mono-tabular text-slate-700">
                  {r.orderCount}
                </td>
                <td className="py-3 px-4 text-right font-mono-tabular text-slate-700">
                  {r.portionsSold} porsi
                </td>
                <td className="py-3 px-4 text-right font-mono-tabular font-medium text-slate-900">
                  {formatRupiah(r.grossSales)}
                </td>
                <td className="py-3 px-4 text-right font-mono-tabular text-slate-600">
                  {formatRupiah(r.commission)}
                </td>
                <td className="py-3 px-4 text-right font-mono-tabular font-semibold text-emerald-800">
                  {formatRupiah(r.netPayout)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-slate-200 bg-slate-50 text-xs font-semibold text-slate-900 font-mono-tabular">
              <td colSpan={5} className="py-3 px-4 text-right">
                TOTAL SETTLEMENT KESELURUHAN STAN:
              </td>
              <td className="py-3 px-4 text-right">
                {formatRupiah(totalGross)}
              </td>
              <td className="py-3 px-4 text-right">
                {formatRupiah(totalCommission)}
              </td>
              <td className="py-3 px-4 text-right text-emerald-800">
                {formatRupiah(totalNet)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};
