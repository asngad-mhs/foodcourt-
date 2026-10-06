import React, { useState } from 'react';
import {
  Printer,
  CheckCircle2,
  Copy,
  Check,
  FileText,
  Building,
} from 'lucide-react';
import { useFoodcourtStore } from '../../stores/useFoodcourtStore';
import {
  formatRupiah,
  formatDateId,
  formatTimeShort,
} from '../../utils/formatters';
import { Modal } from '../common/Modal';
import { ReceiptPaperSize } from '../../types';

export const ReceiptModal: React.FC = () => {
  const order = useFoodcourtStore((s) => s.activeReceiptOrder);
  const transaction = useFoodcourtStore((s) => s.activeReceiptTransaction);
  const receiptPaperSize = useFoodcourtStore((s) => s.receiptPaperSize);
  const setReceiptPaperSize = useFoodcourtStore((s) => s.setReceiptPaperSize);
  const closeReceiptModal = useFoodcourtStore((s) => s.closeReceiptModal);

  const [copied, setCopied] = useState<boolean>(false);

  if (!order || !transaction) return null;

  const handlePrintReceipt = () => {
    window.print();
  };

  // Plain-text formatted receipt for copy/paste or WhatsApp sending
  const buildPlainTextReceipt = () => {
    const divider = '------------------------------------------';
    const lines = [
      'FOODCOURT KAMPUS UNUGHA CILACAP',
      'Universitas Nahdlatul Ulama Al Ghazali',
      'Jl. Kemerdekaan Barat No.17, Kesugihan, Cilacap',
      divider,
      `NOMOR ANTREAN: ${order.queue_number} (${order.order_type})`,
      divider,
      `No. Invoice  : ${order.invoice_number}`,
      `Kode Trx     : ${transaction.transaction_code}`,
      `Waktu        : ${formatDateId(transaction.paid_at)} ${formatTimeShort(transaction.paid_at)}`,
      `Kasir        : ${transaction.cashier_name}`,
      `Pelanggan    : ${order.customer_name}`,
      `Lokasi / Meja: ${order.table_number}`,
    ];

    if (order.student_nim) {
      lines.push(`NIM Mahasiswa: ${order.student_nim}`);
    }

    lines.push(divider);
    lines.push('RINCIAN PESANAN:');
    order.items.forEach((item) => {
      lines.push(
        `${item.quantity}x ${item.menu_name} - ${formatRupiah(item.subtotal)}`
      );
      lines.push(`   [Stan ${item.booth_number} - ${item.tenant_name}]`);
      if (item.notes) {
        lines.push(`   * Catatan: ${item.notes}`);
      }
    });

    lines.push(divider);
    lines.push(`Subtotal        : ${formatRupiah(transaction.subtotal)}`);
    if (transaction.discount_amount > 0) {
      lines.push(
        `Diskon Promo    : -${formatRupiah(transaction.discount_amount)}`
      );
    }
    if (transaction.tax_amount > 0) {
      lines.push(
        `Pajak Resto     : +${formatRupiah(transaction.tax_amount)}`
      );
    }
    lines.push(`TOTAL TAGIHAN   : ${formatRupiah(transaction.grand_total)}`);
    lines.push(divider);
    lines.push(`Metode Bayar    : ${transaction.payment_method.toUpperCase()}`);
    lines.push(`Jumlah Diterima : ${formatRupiah(transaction.amount_received)}`);
    if (transaction.payment_method === 'Cash') {
      lines.push(
        `Kembalian Tunai : ${formatRupiah(transaction.change_amount)}`
      );
    } else if (transaction.payment_reference) {
      lines.push(`No. Referensi   : ${transaction.payment_reference}`);
    }
    lines.push(divider);
    lines.push('Harap tunjukkan struk ini saat mengambil pesanan');
    lines.push('di stan masing-masing. Terima kasih atas kunjungan Anda!');
    return lines.join('\n');
  };

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(buildPlainTextReceipt());
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
    }
  };

  const is58mm = receiptPaperSize === '58mm';

  return (
    <Modal
      isOpen={Boolean(order && transaction)}
      onClose={closeReceiptModal}
      title="Struk Pembayaran — Foodcourt UNUGHA"
      subtitle={`Invoice: ${order.invoice_number} · Antrean: ${order.queue_number}`}
      maxWidthClass="max-w-xl"
    >
      <div className="flex flex-col gap-4">
        {/* Banner Status Lunas */}
        <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-900 text-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>
              Pembayaran via <strong>{transaction.payment_method}</strong> berhasil dicatat.
            </span>
          </div>
          <span className="font-mono-tabular font-bold text-xs bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded">
            LUNAS
          </span>
        </div>

        {/* Paper Size Selector (58mm vs 80mm) */}
        <div className="flex items-center justify-between p-2.5 bg-slate-100 rounded-lg no-print">
          <div className="flex items-center gap-1.5 text-xs text-slate-700 font-medium">
            <FileText className="w-3.5 h-3.5 text-slate-500" />
            <span>Format Ukuran Kertas Thermal:</span>
          </div>
          <div className="flex items-center gap-1 bg-white p-0.5 rounded-md border border-slate-200">
            {(['58mm', '80mm'] as ReceiptPaperSize[]).map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => setReceiptPaperSize(size)}
                className={`px-3 py-1 text-xs font-semibold rounded transition-colors cursor-pointer ${
                  receiptPaperSize === size
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {size} {size === '58mm' ? '(Mini / Bluetooth)' : '(Standard POS)'}
              </button>
            ))}
          </div>
        </div>

        {/* Outer Receipt Preview Wrapper */}
        <div className="flex justify-center bg-slate-100/70 p-4 rounded-xl border border-slate-200 overflow-x-auto">
          {/* Real Thermal Receipt Paper Box */}
          <div
            id="thermal-receipt-print-area"
            className={`bg-white text-slate-900 p-5 shadow-md border border-slate-200 font-mono-tabular text-xs flex flex-col gap-3 transition-all ${
              is58mm
                ? 'paper-58mm max-w-[320px] w-full text-[11px]'
                : 'paper-80mm max-w-[440px] w-full text-xs'
            }`}
          >
            {/* Header Kampus */}
            <div className="text-center border-b border-dashed border-slate-400 pb-3">
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <Building className="w-4 h-4 text-emerald-800" />
                <span className="font-bold text-sm tracking-wide uppercase">
                  Foodcourt Kampus UNUGHA
                </span>
              </div>
              <p className="text-[11px] text-slate-600 leading-tight">
                Universitas Nahdlatul Ulama Al Ghazali
              </p>
              <p className="text-[10px] text-slate-500 leading-tight mt-0.5">
                Jl. Kemerdekaan Barat No.17, Kesugihan, Cilacap
              </p>
              <p className="text-[10px] text-slate-500 mt-0.5">
                WA: 0812-3456-7890 · Cilacap, Jawa Tengah
              </p>
            </div>

            {/* Nomor Antrean yang Sangat Menonjol */}
            <div className="text-center py-2.5 bg-slate-50 border border-slate-200 rounded my-0.5">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">
                Nomor Antrean Pengambilan
              </span>
              <p className="text-2xl font-black text-emerald-900 tracking-wider">
                {order.queue_number}
              </p>
              <span className="text-[11px] font-semibold text-slate-700 uppercase">
                {order.order_type}
              </span>
            </div>

            {/* Metadata Nota */}
            <div className="flex flex-col gap-1 text-[11px] border-b border-dashed border-slate-400 pb-3 text-slate-700">
              <div className="flex justify-between">
                <span>No. Invoice:</span>
                <span className="font-bold text-slate-900">{order.invoice_number}</span>
              </div>
              <div className="flex justify-between">
                <span>Kode Trx:</span>
                <span className="font-bold text-slate-900">{transaction.transaction_code}</span>
              </div>
              <div className="flex justify-between">
                <span>Waktu Bayar:</span>
                <span>
                  {formatDateId(transaction.paid_at)} {formatTimeShort(transaction.paid_at)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Kasir:</span>
                <span>{transaction.cashier_name}</span>
              </div>
              <div className="flex justify-between">
                <span>Pelanggan:</span>
                <span className="font-bold text-slate-900">{order.customer_name}</span>
              </div>
              {order.student_nim && (
                <div className="flex justify-between">
                  <span>NIM Mahasiswa:</span>
                  <span className="font-mono-tabular font-semibold">{order.student_nim}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Meja / Lokasi:</span>
                <span className="font-semibold text-slate-900">{order.table_number}</span>
              </div>
            </div>

            {/* Rincian Pesanan per Stan */}
            <div className="flex flex-col gap-2.5 border-b border-dashed border-slate-400 pb-3">
              <span className="text-[10px] font-bold uppercase text-slate-500">
                Menu Sajian Makanan &amp; Minuman:
              </span>
              {order.items.map((item) => (
                <div key={item.id} className="flex flex-col">
                  <div className="flex justify-between font-bold text-slate-900">
                    <span className="truncate pr-2">
                      {item.quantity}x {item.menu_name}
                    </span>
                    <span className="shrink-0">{formatRupiah(item.subtotal)}</span>
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Stan {item.booth_number} ({item.tenant_name})
                  </div>
                  {item.notes && (
                    <div className="text-[10px] text-amber-900 italic bg-amber-50/80 px-1 py-0.5 rounded mt-0.5 border border-amber-200/50">
                      * Catatan: {item.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Kalkulasi Total, Diskon & Pajak */}
            <div className="flex flex-col gap-1.5 text-[11px] border-b border-dashed border-slate-400 pb-3">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal Pesanan:</span>
                <span>{formatRupiah(transaction.subtotal)}</span>
              </div>

              {transaction.discount_amount > 0 && (
                <div className="flex justify-between text-emerald-800 font-semibold">
                  <span>Potongan Diskon:</span>
                  <span>- {formatRupiah(transaction.discount_amount)}</span>
                </div>
              )}

              {transaction.tax_amount > 0 && (
                <div className="flex justify-between text-slate-700">
                  <span>Pajak Resto:</span>
                  <span>+ {formatRupiah(transaction.tax_amount)}</span>
                </div>
              )}

              <div className="flex justify-between text-sm font-black text-slate-950 pt-1 border-t border-slate-200">
                <span>TOTAL AKHIR:</span>
                <span className="text-emerald-950">
                  {formatRupiah(transaction.grand_total)}
                </span>
              </div>

              <div className="flex justify-between text-slate-700 pt-1">
                <span>
                  Bayar ({transaction.payment_method}):
                </span>
                <span className="font-bold">
                  {formatRupiah(transaction.amount_received)}
                </span>
              </div>

              {/* Kembalian Tunai khusus Cash */}
              {transaction.payment_method === 'Cash' && (
                <div className="flex justify-between text-slate-900 font-bold bg-slate-100 p-1 rounded">
                  <span>KEMBALIAN TUNAI:</span>
                  <span className="text-emerald-900 text-xs">
                    {formatRupiah(transaction.change_amount)}
                  </span>
                </div>
              )}

              {/* Kode Referensi jika Non-Tunai */}
              {transaction.payment_method !== 'Cash' && transaction.payment_reference && (
                <div className="flex justify-between text-[10px] text-slate-500 pt-0.5">
                  <span>No. Referensi:</span>
                  <span className="font-mono-tabular font-medium">
                    {transaction.payment_reference}
                  </span>
                </div>
              )}
            </div>

            {/* Footer Nota */}
            <div className="pt-1 text-center text-[10px] text-slate-600 flex flex-col gap-1">
              <p className="font-bold text-slate-800">
                Terima kasih atas kunjungan Anda di UNUGHA!
              </p>
              <p className="text-slate-500 leading-tight">
                Harap simpan struk ini &amp; ambil pesanan di meja stan masing-masing saat nomor antrean dipanggil.
              </p>
              <p className="text-[9px] text-slate-400 mt-1">
                Layanan POS Sentral Foodcourt UNUGHA Cilacap
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 no-print">
          <button
            type="button"
            onClick={handleCopyText}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Tersalin ke Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Salin Teks Struk / WA</span>
              </>
            )}
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrintReceipt}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Struk ({receiptPaperSize})</span>
            </button>
            <button
              type="button"
              onClick={closeReceiptModal}
              className="px-4 py-2.5 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg transition-colors cursor-pointer shadow-xs"
            >
              Selesai &amp; Transaksi Baru
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
