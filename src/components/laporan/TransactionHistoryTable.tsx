import React from 'react';
import { Receipt } from 'lucide-react';
import { Transaction } from '../../types';
import {
  formatRupiah,
  formatTimeShort,
  formatDateId,
} from '../../utils/formatters';

interface TransactionHistoryTableProps {
  transactions: Transaction[];
  onInspectReceipt: (orderId: string) => void;
}

export const TransactionHistoryTable: React.FC<
  TransactionHistoryTableProps
> = ({ transactions, onInspectReceipt }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-slate-900">
            Jurnal Transaksi Kasir Real-Time (Tabel{' '}
            <span className="font-mono-tabular">transactions</span>)
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Klik tombol &ldquo;Lihat Struk&rdquo; untuk mencetak ulang nota
            pembayaran mahasiswa
          </p>
        </div>
        <span className="text-xs font-mono-tabular text-slate-500">
          {transactions.length} baris jurnal
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-600">
              <th className="py-3 px-4">Kode Transaksi</th>
              <th className="py-3 px-4">Waktu Lunas</th>
              <th className="py-3 px-4">Pemesan</th>
              <th className="py-3 px-4">Metode Bayar</th>
              <th className="py-3 px-4 text-right">Tagihan Bersih</th>
              <th className="py-3 px-4 text-right">Diterima</th>
              <th className="py-3 px-4 text-right">Kembalian</th>
              <th className="py-3 px-4">Kasir / Kanal</th>
              <th className="py-3 px-4 text-right">Struk</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {transactions.map((trx) => (
              <tr
                key={trx.id}
                className="hover:bg-slate-50/80 transition-colors"
              >
                <td className="py-3 px-4 font-mono-tabular font-semibold text-slate-900">
                  {trx.transaction_code}
                </td>
                <td className="py-3 px-4 font-mono-tabular text-slate-600">
                  {formatDateId(trx.paid_at)} · {formatTimeShort(trx.paid_at)}
                </td>
                <td className="py-3 px-4 font-medium text-slate-900">
                  {trx.customer_name}
                </td>
                <td className="py-3 px-4 text-slate-700">
                  {trx.payment_method}
                </td>
                <td className="py-3 px-4 text-right font-mono-tabular font-semibold text-slate-900">
                  {formatRupiah(trx.grand_total)}
                </td>
                <td className="py-3 px-4 text-right font-mono-tabular text-slate-600">
                  {formatRupiah(trx.amount_received)}
                </td>
                <td className="py-3 px-4 text-right font-mono-tabular text-slate-600">
                  {formatRupiah(trx.change_amount)}
                </td>
                <td className="py-3 px-4 text-slate-500 truncate max-w-[160px]">
                  {trx.cashier_name}
                </td>
                <td className="py-3 px-4 text-right">
                  <button
                    type="button"
                    onClick={() => onInspectReceipt(trx.order_id)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors whitespace-nowrap cursor-pointer"
                  >
                    <Receipt className="w-3.5 h-3.5" />
                    <span>Lihat Struk</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
