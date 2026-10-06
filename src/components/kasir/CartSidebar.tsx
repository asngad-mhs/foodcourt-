import React, { useState } from 'react';
import {
  Minus,
  Plus,
  Trash2,
  Printer,
  ChevronDown,
  ChevronUp,
  Percent,
  CheckCircle,
  AlertCircle,
  QrCode,
  CreditCard,
  Building2,
  Banknote,
  Smartphone,
} from 'lucide-react';
import { OrderType, PaymentMethod } from '../../types';
import { useFoodcourtStore } from '../../stores/useFoodcourtStore';
import { formatRupiah } from '../../utils/formatters';

const ORDER_TYPES: OrderType[] = [
  'Dine-In',
  'Takeaway',
  'Pesan Antar Fakultas',
];

const TABLE_PRESETS = [
  'Meja 01',
  'Meja 02',
  'Meja 03',
  'Meja 05',
  'Meja 07',
  'Meja 10',
  'Meja VIP-01',
  'Takeaway',
];

interface PaymentOption {
  id: PaymentMethod;
  label: string;
  icon: React.ReactNode;
  desc: string;
}

const PAYMENT_OPTIONS: PaymentOption[] = [
  {
    id: 'Cash',
    label: 'Cash / Tunai',
    icon: <Banknote className="w-4 h-4 text-emerald-600" />,
    desc: 'Uang fisik & hitung kembalian',
  },
  {
    id: 'QRIS',
    label: 'QRIS',
    icon: <QrCode className="w-4 h-4 text-blue-600" />,
    desc: 'Scan GoPay, OVO, Dana, BCA dll',
  },
  {
    id: 'Transfer',
    label: 'Transfer Bank',
    icon: <Building2 className="w-4 h-4 text-indigo-600" />,
    desc: 'BSI Kas Sentral Foodcourt',
  },
  {
    id: 'E-Wallet',
    label: 'E-Wallet',
    icon: <Smartphone className="w-4 h-4 text-violet-600" />,
    desc: 'GoPay, ShopeePay, OVO, DANA',
  },
  {
    id: 'KTM UNUGHA',
    label: 'KTM UNUGHA',
    icon: <CreditCard className="w-4 h-4 text-amber-600" />,
    desc: 'Kartu Tanda Mahasiswa UNUGHA',
  },
];

const QUICK_DISCOUNT_PERCENTS = [0, 5, 10, 15, 20];
const QUICK_TAX_RATES = [
  { label: 'Bebas Pajak (0%)', rate: 0 },
  { label: 'PB1 / Resto (5%)', rate: 5 },
  { label: 'PB1 / Resto (10%)', rate: 10 },
  { label: 'PPN (11%)', rate: 11 },
];

export const CartSidebar: React.FC = () => {
  const cart = useFoodcourtStore((s) => s.cart);
  const orderType = useFoodcourtStore((s) => s.orderType);
  const tableNumber = useFoodcourtStore((s) => s.tableNumber);
  const customerName = useFoodcourtStore((s) => s.customerName);
  const studentNim = useFoodcourtStore((s) => s.studentNim);
  const paymentMethod = useFoodcourtStore((s) => s.paymentMethod);
  const voucherCode = useFoodcourtStore((s) => s.voucherCode);
  const discountPercent = useFoodcourtStore((s) => s.discountPercent);
  const customDiscountNominal = useFoodcourtStore(
    (s) => s.customDiscountNominal
  );
  const taxRate = useFoodcourtStore((s) => s.taxRate);
  const cashReceived = useFoodcourtStore((s) => s.cashReceived);
  const paymentReference = useFoodcourtStore((s) => s.paymentReference);

  const updateCartQuantity = useFoodcourtStore((s) => s.updateCartQuantity);
  const updateCartNotes = useFoodcourtStore((s) => s.updateCartNotes);
  const removeFromCart = useFoodcourtStore((s) => s.removeFromCart);
  const clearCart = useFoodcourtStore((s) => s.clearCart);
  const setOrderType = useFoodcourtStore((s) => s.setOrderType);
  const setTableNumber = useFoodcourtStore((s) => s.setTableNumber);
  const setCustomerName = useFoodcourtStore((s) => s.setCustomerName);
  const setStudentNim = useFoodcourtStore((s) => s.setStudentNim);
  const setPaymentMethod = useFoodcourtStore((s) => s.setPaymentMethod);
  const setVoucherCode = useFoodcourtStore((s) => s.setVoucherCode);
  const setDiscountPercent = useFoodcourtStore((s) => s.setDiscountPercent);
  const setCustomDiscountNominal = useFoodcourtStore(
    (s) => s.setCustomDiscountNominal
  );
  const setTaxRate = useFoodcourtStore((s) => s.setTaxRate);
  const setCashReceived = useFoodcourtStore((s) => s.setCashReceived);
  const setPaymentReference = useFoodcourtStore((s) => s.setPaymentReference);
  const processCheckout = useFoodcourtStore((s) => s.processCheckout);

  // Accordion toggle for Diskon & Pajak
  const [showDiscountTaxAccordion, setShowDiscountTaxAccordion] =
    useState<boolean>(false);
  const [qrisSimulatedSuccess, setQrisSimulatedSuccess] =
    useState<boolean>(false);

  // Financial calculations
  const subtotal = cart.reduce(
    (sum, item) => sum + item.menu.price * item.quantity,
    0
  );

  let discountAmount = 0;
  const cleanVoucher = voucherCode.trim().toUpperCase();
  if (customDiscountNominal > 0) {
    discountAmount = Math.min(subtotal, customDiscountNominal);
  } else if (discountPercent > 0) {
    discountAmount = Math.round(subtotal * (discountPercent / 100));
  } else if (cleanVoucher === 'MAHASISWA10') {
    discountAmount = Math.round(subtotal * 0.1);
  } else if (cleanVoucher === 'JUMATBERKAH') {
    discountAmount = Math.min(5000, subtotal);
  }

  const subtotalAfterDiscount = Math.max(0, subtotal - discountAmount);
  const taxAmount =
    taxRate > 0 ? Math.round(subtotalAfterDiscount * (taxRate / 100)) : 0;
  const grandTotal = subtotalAfterDiscount + taxAmount;

  // Cash change logic
  const isCash = paymentMethod === 'Cash';
  const effectiveCash = isCash
    ? cashReceived > 0
      ? cashReceived
      : grandTotal
    : grandTotal;
  const changeAmount = Math.max(0, effectiveCash - grandTotal);
  const isCashInsufficient =
    isCash && cashReceived > 0 && cashReceived < grandTotal;

  // Quick cash amounts based on grandTotal
  const getSmartCashSuggestions = (total: number) => {
    if (total <= 0) return [10000, 20000, 50000, 100000];
    const suggestions: number[] = [];
    const roundNext5k = Math.ceil(total / 5000) * 5000;
    const roundNext10k = Math.ceil(total / 10000) * 10000;
    const roundNext50k = Math.ceil(total / 50000) * 50000;
    const roundNext100k = Math.ceil(total / 100000) * 100000;

    if (roundNext5k > total && !suggestions.includes(roundNext5k)) {
      suggestions.push(roundNext5k);
    }
    if (roundNext10k >= total && !suggestions.includes(roundNext10k)) {
      suggestions.push(roundNext10k);
    }
    if (roundNext50k >= total && !suggestions.includes(roundNext50k)) {
      suggestions.push(roundNext50k);
    }
    if (roundNext100k >= total && !suggestions.includes(roundNext100k)) {
      suggestions.push(roundNext100k);
    }
    if (!suggestions.includes(50000) && total < 50000) suggestions.push(50000);
    if (!suggestions.includes(100000) && total < 100000) suggestions.push(100000);

    return suggestions.sort((a, b) => a - b).slice(0, 4);
  };

  const smartCashOptions = getSmartCashSuggestions(grandTotal);

  const distinctTenants = Array.from(
    new Set(cart.map((c) => `Stan ${c.booth_number} (${c.tenant_name})`))
  );

  const handleSimulateQrisSuccess = () => {
    const randomRrn = `QRIS-UNUGHA-${Math.floor(100000 + Math.random() * 900000)}`;
    setPaymentReference(randomRrn);
    setQrisSimulatedSuccess(true);
    setTimeout(() => setQrisSimulatedSuccess(false), 3000);
  };

  return (
    <aside
      aria-label="Keranjang Kasir & Pembayaran POS"
      className="bg-white border border-slate-200 rounded-xl flex flex-col shadow-xs overflow-hidden"
    >
      {/* 1. Header Keranjang */}
      <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold tracking-tight">Nota Transaksi Kasir</h2>
            <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 rounded">
              POS Sentral
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5 font-mono-tabular">
            {cart.reduce((s, i) => s + i.quantity, 0)} porsi dipilih ·{' '}
            {distinctTenants.length} mitra stan
          </p>
        </div>
        {cart.length > 0 && (
          <button
            type="button"
            onClick={clearCart}
            className="text-xs font-medium text-rose-300 hover:text-rose-100 transition-colors whitespace-nowrap cursor-pointer px-2 py-1 rounded bg-rose-500/10 hover:bg-rose-500/20"
          >
            Kosongkan
          </button>
        )}
      </div>

      {/* 2. Customer Info & Table Selection (Langkah 3) */}
      <div className="px-5 pt-3.5 pb-3 border-b border-slate-200 bg-slate-50/50 flex flex-col gap-3">
        {/* Tipe Pesanan */}
        <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-lg">
          {ORDER_TYPES.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setOrderType(type)}
              className={`flex-1 px-2 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap truncate cursor-pointer ${
                orderType === type
                  ? 'bg-white text-slate-900 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {type === 'Dine-In' ? '🍽️ Dine-In' : type === 'Takeaway' ? '🥡 Takeaway' : '🏢 Antar Kampus'}
            </button>
          ))}
        </div>

        {/* Pelanggan & Nomor Meja */}
        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <label
              htmlFor="pos-customer-name"
              className="block text-[11px] font-semibold text-slate-700 mb-1"
            >
              Nama Pelanggan (Opsional)
            </label>
            <input
              id="pos-customer-name"
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Cth: Budi (FTI)"
              className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700"
            />
          </div>

          <div>
            <label
              htmlFor="pos-table-number"
              className="block text-[11px] font-semibold text-slate-700 mb-1"
            >
              Nomor Meja / Lokasi
            </label>
            <input
              id="pos-table-number"
              type="text"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              placeholder="Cth: Meja 07"
              className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700"
            />
          </div>
        </div>

        {/* Quick Table Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          <span className="text-[10px] text-slate-400 font-medium shrink-0">Cepat:</span>
          {TABLE_PRESETS.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => setTableNumber(preset)}
              className={`text-[10px] px-2 py-0.5 rounded border transition-colors cursor-pointer shrink-0 font-mono-tabular ${
                tableNumber === preset
                  ? 'bg-emerald-800 text-white border-emerald-800 font-semibold'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
              }`}
            >
              {preset}
            </button>
          ))}
        </div>

        {/* NIM Mahasiswa UNUGHA (Opsional) */}
        <div>
          <label
            htmlFor="pos-student-nim"
            className="block text-[11px] font-semibold text-slate-700 mb-1"
          >
            NIM Mahasiswa UNUGHA (Opsional — untuk diskon/kartu KTM)
          </label>
          <input
            id="pos-student-nim"
            type="text"
            value={studentNim}
            onChange={(e) => setStudentNim(e.target.value)}
            placeholder="Cth: 230510104"
            className="w-full px-2.5 py-1.5 text-xs font-mono-tabular bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-700"
          />
        </div>
      </div>

      {/* 3. Cart Items List (Langkah 2: Tambah, Kurang, Hapus, Catatan) */}
      <div className="p-4 flex-1 overflow-y-auto max-h-[300px] divide-y divide-slate-100 bg-white">
        {cart.length === 0 ? (
          <div className="py-8 text-center flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-xl text-slate-400 mb-2">
              🛒
            </div>
            <p className="text-sm font-semibold text-slate-700">
              Keranjang masih kosong
            </p>
            <p className="mt-1 text-xs text-slate-500 max-w-[240px]">
              Klik item menu di katalog sebelah kiri untuk menambahkan pesanan ke nota.
            </p>
          </div>
        ) : (
          cart.map((item) => (
            <div key={item.menu.id} className="py-3 first:pt-0 last:pb-0">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-900 truncate">
                    {item.menu.name}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Stan {item.booth_number} ({item.tenant_name}) ·{' '}
                    <span className="font-mono-tabular">{formatRupiah(item.menu.price)}</span>
                  </p>
                </div>
                <p className="text-xs font-bold font-mono-tabular text-slate-900 shrink-0">
                  {formatRupiah(item.menu.price * item.quantity)}
                </p>
              </div>

              {/* Catatan Khusus & Kontrol Qty */}
              <div className="mt-2 flex items-center justify-between gap-2">
                <input
                  type="text"
                  value={item.notes}
                  onChange={(e) =>
                    updateCartNotes(item.menu.id, e.target.value)
                  }
                  placeholder="Catatan: pedas lv 3, tanpa es..."
                  aria-label={`Catatan untuk ${item.menu.name}`}
                  className="flex-1 px-2.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded-md text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-emerald-700 focus:bg-white"
                />

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => updateCartQuantity(item.menu.id, -1)}
                    aria-label={`Kurangi ${item.menu.name}`}
                    className="w-7 h-7 flex items-center justify-center text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors cursor-pointer"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-7 text-center text-xs font-bold font-mono-tabular text-slate-900">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateCartQuantity(item.menu.id, 1)}
                    disabled={item.quantity >= item.menu.stock}
                    aria-label={`Tambah ${item.menu.name}`}
                    className={`w-7 h-7 flex items-center justify-center rounded-md transition-colors ${
                      item.quantity >= item.menu.stock
                        ? 'bg-slate-100 text-slate-300 cursor-not-allowed'
                        : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 cursor-pointer'
                    }`}
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.menu.id)}
                    aria-label={`Hapus ${item.menu.name}`}
                    className="w-7 h-7 flex items-center justify-center text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer ml-0.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 4. Diskon & Pajak (Langkah 6 - Opsional) */}
      <div className="border-t border-slate-200 bg-slate-50/70">
        <button
          type="button"
          onClick={() => setShowDiscountTaxAccordion(!showDiscountTaxAccordion)}
          className="w-full px-5 py-2.5 flex items-center justify-between text-xs font-semibold text-slate-700 hover:bg-slate-100/80 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Percent className="w-3.5 h-3.5 text-emerald-700" />
            <span>Diskon &amp; Pajak (Opsional)</span>
            {(discountAmount > 0 || taxAmount > 0) && (
              <span className="px-1.5 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-800 rounded">
                Aktif
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-slate-500">
            <span className="text-[11px] font-mono-tabular">
              {discountAmount > 0 ? `-${formatRupiah(discountAmount)}` : '0%'} ·{' '}
              {taxRate > 0 ? `+${taxRate}%` : '0%'}
            </span>
            {showDiscountTaxAccordion ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </div>
        </button>

        {showDiscountTaxAccordion && (
          <div className="px-5 pb-3.5 pt-1 flex flex-col gap-3 border-t border-slate-100">
            {/* Diskon Section */}
            <div>
              <span className="text-[11px] font-semibold text-slate-700 block mb-1">
                Diskon Promo / Mahasiswa:
              </span>
              <div className="flex items-center gap-1 mb-2">
                {QUICK_DISCOUNT_PERCENTS.map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => {
                      setDiscountPercent(pct);
                      if (pct === 0) setVoucherCode('');
                    }}
                    className={`flex-1 py-1 text-xs font-semibold rounded border transition-colors cursor-pointer ${
                      discountPercent === pct && customDiscountNominal === 0
                        ? 'bg-emerald-800 text-white border-emerald-800'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {pct === 0 ? '0%' : `${pct}%`}
                  </button>
                ))}
              </div>

              {/* Input Voucher Code or Nominal */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <input
                    type="text"
                    value={voucherCode}
                    onChange={(e) => setVoucherCode(e.target.value)}
                    placeholder="Kode Voucher (cth: MAHASISWA10)"
                    className="w-full px-2.5 py-1 text-xs font-mono-tabular uppercase bg-white border border-slate-200 rounded-md text-slate-900 focus:outline-none focus:border-emerald-700"
                  />
                  <div className="flex gap-1 mt-1">
                    <button
                      type="button"
                      onClick={() => setVoucherCode('MAHASISWA10')}
                      className="text-[10px] text-emerald-700 hover:underline cursor-pointer"
                    >
                      + MAHASISWA10 (10%)
                    </button>
                    <span className="text-slate-300">·</span>
                    <button
                      type="button"
                      onClick={() => setVoucherCode('JUMATBERKAH')}
                      className="text-[10px] text-emerald-700 hover:underline cursor-pointer"
                    >
                      + JUMATBERKAH (5rb)
                    </button>
                  </div>
                </div>

                <div>
                  <div className="relative">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[11px] text-slate-400 font-semibold">
                      Rp
                    </span>
                    <input
                      type="number"
                      min={0}
                      step={500}
                      value={customDiscountNominal || ''}
                      onChange={(e) =>
                        setCustomDiscountNominal(Number(e.target.value))
                      }
                      placeholder="Potongan Nominal Langsung"
                      className="w-full pl-8 pr-2.5 py-1 text-xs font-mono-tabular bg-white border border-slate-200 rounded-md text-slate-900 focus:outline-none focus:border-emerald-700"
                    />
                  </div>
                  <span className="text-[10px] text-slate-500 block mt-1">
                    Potongan rupiah manual (opsional)
                  </span>
                </div>
              </div>
            </div>

            {/* Pajak (PB1 / Resto) Section */}
            <div className="pt-2 border-t border-slate-200">
              <span className="text-[11px] font-semibold text-slate-700 block mb-1">
                Pajak Resto / PB1 (Opsional):
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {QUICK_TAX_RATES.map((t) => (
                  <button
                    key={t.rate}
                    type="button"
                    onClick={() => setTaxRate(t.rate)}
                    className={`px-2 py-1 text-[11px] font-medium rounded border transition-colors cursor-pointer text-left ${
                      taxRate === t.rate
                        ? 'bg-slate-900 text-white border-slate-900 font-semibold'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 5. Metode Pembayaran (Langkah 4: Cash / QRIS / Transfer / E-Wallet) */}
      <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col gap-3">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-800">
              Pilih Metode Pembayaran:
            </span>
            <span className="text-[11px] font-semibold text-emerald-800">
              {paymentMethod === 'Cash'
                ? '💵 Uang Tunai'
                : paymentMethod === 'QRIS'
                ? '📱 Scan QRIS'
                : paymentMethod === 'Transfer'
                ? '🏦 Transfer Bank'
                : paymentMethod === 'E-Wallet'
                ? '📲 Dompet Digital'
                : '💳 KTM Mahasiswa'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            {PAYMENT_OPTIONS.map((opt) => {
              const isSelected = paymentMethod === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    setPaymentMethod(opt.id);
                  }}
                  className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-emerald-800 text-white border-emerald-800 shadow-sm ring-1 ring-emerald-800'
                      : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`p-1 rounded ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-slate-100'
                      }`}
                    >
                      {opt.icon}
                    </span>
                    <span className="text-xs font-bold whitespace-nowrap truncate">
                      {opt.label}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] mt-1 line-clamp-1 ${
                      isSelected ? 'text-emerald-100' : 'text-slate-500'
                    }`}
                  >
                    {opt.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 6. Detail Interaktif Pembayaran */}
        {/* A. JIKA CASH: Hitung Kembalian Otomatis (Langkah 5) */}
        {isCash && (
          <div className="p-3 bg-white border border-slate-200 rounded-lg flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="pos-cash-input"
                className="text-xs font-bold text-slate-800"
              >
                Uang Tunai Diterima dari Pembeli:
              </label>
              <span className="text-[11px] text-slate-500">
                Tagihan: {formatRupiah(grandTotal)}
              </span>
            </div>

            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                Rp
              </span>
              <input
                id="pos-cash-input"
                type="number"
                min={0}
                step={1000}
                value={cashReceived || ''}
                onChange={(e) => setCashReceived(Number(e.target.value))}
                placeholder={String(grandTotal)}
                className="w-full pl-10 pr-3 py-2 text-base font-bold font-mono-tabular bg-slate-50 border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:border-emerald-700 focus:bg-white focus:ring-2 focus:ring-emerald-700/20"
              />
            </div>

            {/* Tombol Pecahan Cepat */}
            <div>
              <span className="text-[11px] text-slate-500 block mb-1">
                Pecahan Cepat Uang Kertas:
              </span>
              <div className="grid grid-cols-5 gap-1">
                <button
                  type="button"
                  onClick={() => setCashReceived(grandTotal)}
                  className="py-1.5 text-[11px] font-bold font-mono-tabular bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded transition-colors cursor-pointer text-center"
                >
                  Uang Pas
                </button>
                {smartCashOptions.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setCashReceived(amt)}
                    className="py-1.5 text-[11px] font-semibold font-mono-tabular bg-slate-100 hover:bg-slate-200 text-slate-800 rounded transition-colors cursor-pointer text-center"
                  >
                    {amt >= 1000 ? `${amt / 1000}rb` : amt}
                  </button>
                ))}
              </div>
            </div>

            {/* Display Kembalian Otomatis yang Jelas & Mencolok */}
            <div
              className={`p-3 rounded-lg border flex items-center justify-between ${
                isCashInsufficient
                  ? 'bg-rose-50 border-rose-200 text-rose-900'
                  : cashReceived === grandTotal
                  ? 'bg-blue-50 border-blue-200 text-blue-900'
                  : 'bg-emerald-50 border-emerald-300 text-emerald-950'
              }`}
            >
              <div>
                <span className="text-[11px] font-semibold block uppercase tracking-wider">
                  {isCashInsufficient
                    ? '⚠️ Uang Tunai Kurang'
                    : cashReceived === grandTotal
                    ? '✓ Uang Pas'
                    : '💰 Kembalian Pelanggan'}
                </span>
                <span className="text-lg font-bold font-mono-tabular">
                  {isCashInsufficient
                    ? formatRupiah(grandTotal - (cashReceived || 0))
                    : formatRupiah(changeAmount)}
                </span>
              </div>
              <div className="text-right text-[11px]">
                {isCashInsufficient ? (
                  <span className="text-rose-700 font-semibold">
                    Belum bisa cetak struk
                  </span>
                ) : changeAmount > 0 ? (
                  <span className="text-emerald-800 font-medium">
                    Serahkan ke pembeli
                  </span>
                ) : (
                  <span className="text-blue-700 font-medium">
                    Tanpa kembalian
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* B. JIKA QRIS */}
        {paymentMethod === 'QRIS' && (
          <div className="p-3 bg-white border border-slate-200 rounded-lg flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">
                QRIS Dinamis Foodcourt UNUGHA
              </span>
              <span className="text-[10px] px-2 py-0.5 bg-blue-50 text-blue-800 rounded font-semibold">
                NMID: ID10202611928
              </span>
            </div>
            <div className="flex items-center gap-3 p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="w-16 h-16 bg-white p-1 rounded border border-slate-200 shrink-0 flex items-center justify-center">
                <QrCode className="w-14 h-14 text-slate-800" />
              </div>
              <div className="flex-1 text-xs">
                <p className="font-bold text-slate-900">
                  Tagihan: {formatRupiah(grandTotal)}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Arahkan pelanggan scan barcode via GoPay, BCA, OVO, Dana, atau ShopeePay.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={paymentReference}
                onChange={(e) => setPaymentReference(e.target.value)}
                placeholder="No. RRN / Kode Referensi QRIS (Opsional)"
                className="flex-1 px-2.5 py-1.5 text-xs font-mono-tabular bg-slate-50 border border-slate-200 rounded-md text-slate-900"
              />
              <button
                type="button"
                onClick={handleSimulateQrisSuccess}
                className="px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md border border-blue-200 transition-colors whitespace-nowrap cursor-pointer shrink-0"
              >
                {qrisSimulatedSuccess ? '✓ QRIS Valid' : 'Simulasi Berhasil'}
              </button>
            </div>
          </div>
        )}

        {/* C. JIKA TRANSFER */}
        {paymentMethod === 'Transfer' && (
          <div className="p-3 bg-white border border-slate-200 rounded-lg flex flex-col gap-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800">
                Rekening Penampung Kas Sentral
              </span>
              <span className="text-[10px] text-indigo-700 font-bold bg-indigo-50 px-2 py-0.5 rounded">
                BSI Syariah
              </span>
            </div>
            <div className="p-2 bg-indigo-50/60 border border-indigo-100 rounded-md">
              <p className="font-mono-tabular font-bold text-indigo-950 text-sm">
                7123-4567-89
              </p>
              <p className="text-[11px] text-indigo-800">
                a.n <strong>FOODCOURT UNUGHA CILACAP</strong>
              </p>
            </div>
            <div>
              <label
                htmlFor="pos-trf-ref"
                className="block text-[11px] font-semibold text-slate-600 mb-1"
              >
                No. Referensi Transfer / Nama Pengirim:
              </label>
              <input
                id="pos-trf-ref"
                type="text"
                value={paymentReference}
                onChange={(e) => setPaymentReference(e.target.value)}
                placeholder="Cth: BSI Mobile - Ahmad Fauzi / TRX-7712"
                className="w-full px-2.5 py-1.5 text-xs font-mono-tabular bg-slate-50 border border-slate-200 rounded-md text-slate-900"
              />
            </div>
          </div>
        )}

        {/* D. JIKA E-WALLET */}
        {paymentMethod === 'E-Wallet' && (
          <div className="p-3 bg-white border border-slate-200 rounded-lg flex flex-col gap-2 text-xs">
            <span className="font-bold text-slate-800">
              Konfirmasi Dompet Digital
            </span>
            <div className="flex items-center gap-1.5">
              {['GoPay', 'OVO', 'DANA', 'ShopeePay'].map((ew) => (
                <button
                  key={ew}
                  type="button"
                  onClick={() => setPaymentReference(`${ew} - ${paymentReference.split(' - ')[1] || ''}`)}
                  className="flex-1 py-1 text-[11px] font-semibold bg-slate-100 hover:bg-slate-200 rounded border border-slate-200 text-slate-800 text-center cursor-pointer"
                >
                  {ew}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={paymentReference}
              onChange={(e) => setPaymentReference(e.target.value)}
              placeholder="No. HP Pelanggan / ID Transaksi E-Wallet"
              className="w-full px-2.5 py-1.5 text-xs font-mono-tabular bg-slate-50 border border-slate-200 rounded-md text-slate-900"
            />
          </div>
        )}

        {/* E. JIKA KTM UNUGHA */}
        {paymentMethod === 'KTM UNUGHA' && (
          <div className="p-3 bg-white border border-slate-200 rounded-lg flex flex-col gap-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800">
                Kartu Tanda Mahasiswa RFID / Smart Card
              </span>
              <span className="text-[10px] text-amber-800 font-bold bg-amber-50 px-2 py-0.5 rounded">
                KTM Card
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Tempelkan kartu mahasiswa pada terminal scanner RFID atau input NIM mahasiswa di atas untuk mendebet saldo kampus.
            </p>
          </div>
        )}

        {/* 7. Financial Breakdown */}
        <div className="pt-2 border-t border-slate-200 flex flex-col gap-1.5 text-xs">
          <div className="flex items-center justify-between text-slate-600">
            <span>Subtotal ({cart.reduce((s, i) => s + i.quantity, 0)} item)</span>
            <span className="font-mono-tabular">{formatRupiah(subtotal)}</span>
          </div>

          {discountAmount > 0 && (
            <div className="flex items-center justify-between text-emerald-700 font-semibold">
              <span>
                Diskon Promo{' '}
                {cleanVoucher
                  ? `(${cleanVoucher})`
                  : discountPercent > 0
                  ? `(${discountPercent}%)`
                  : ''}
              </span>
              <span className="font-mono-tabular">- {formatRupiah(discountAmount)}</span>
            </div>
          )}

          {taxAmount > 0 && (
            <div className="flex items-center justify-between text-slate-700">
              <span>Pajak Resto / PB1 ({taxRate}%)</span>
              <span className="font-mono-tabular">+ {formatRupiah(taxAmount)}</span>
            </div>
          )}

          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
            <span>Bagi Hasil (90% Mitra Stan / 10% Foodcourt)</span>
            <span className="font-mono-tabular">
              {formatRupiah(Math.round(grandTotal * 0.9))} /{' '}
              {formatRupiah(Math.round(grandTotal * 0.1))}
            </span>
          </div>

          <div className="pt-2 border-t border-slate-300 flex items-center justify-between text-sm font-bold text-slate-900">
            <span>TOTAL TAGIHAN:</span>
            <span className="font-mono-tabular text-lg text-emerald-900">
              {formatRupiah(grandTotal)}
            </span>
          </div>
        </div>

        {/* 8. Tombol Eksekusi Checkout & Cetak Struk */}
        <button
          type="button"
          disabled={cart.length === 0 || isCashInsufficient}
          onClick={() => processCheckout()}
          className={`w-full py-3.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm ${
            cart.length === 0 || isCashInsufficient
              ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
              : 'bg-emerald-800 text-white hover:bg-emerald-900 active:scale-[0.99] cursor-pointer'
          }`}
        >
          <Printer className="w-4 h-4" />
          <span>
            {cart.length === 0
              ? 'Pilih Menu Katalog Terlebih Dahulu'
              : isCashInsufficient
              ? `Uang Tunai Kurang ${formatRupiah(grandTotal - (cashReceived || 0))}`
              : `Proses Transaksi & Cetak Struk (${formatRupiah(grandTotal)})`}
          </span>
        </button>
      </div>
    </aside>
  );
};
