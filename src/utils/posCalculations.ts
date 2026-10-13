/**
 * ============================================================================
 * MODUL LOGIKA KALKULASI & BISNIS POS KASIR FOODCOURT UNUGHA
 * ============================================================================
 * File ini menyediakan fungsi-fungsi murni (pure functions) yang menangani
 * perhitungan finansial kritis kasir, pembagian hasil stan UMKM 90:10,
 * dan pembentukan nomor invoice unik standar UNUGHA.
 *
 * Seluruh fungsi diuji secara ketat melalui Unit Testing.
 */

export interface CashChangeResult {
  /** Selisih kembalian yang harus diberikan ke pelanggan (>= 0) */
  change: number;
  /** True jika uang yang dibayarkan pas (tepat sama dengan tagihan) */
  isExact: boolean;
  /** True jika uang yang dibayarkan mencukupi tagihan (>= grandTotal) */
  isSufficient: boolean;
  /** Kekurangan uang tunai bila pembayaran belum mencukupi (>= 0) */
  shortfall: number;
}

export interface RevenueSplitResult {
  /** Komisi bagian pengelolaan kasir sentral Foodcourt UNUGHA (default 10%) */
  commissionAmount: number;
  /** Hak bersih yang ditransfer/dicairkan ke pemilik stan mitra UMKM (default 90%) */
  tenantNet: number;
  /** Persentase komisi yang diaplikasikan (misal 10) */
  ratePercent: number;
  /** Nilai bruto sebelum pembagian */
  grossTotal: number;
}

export interface OrderTotalsCalculation {
  subtotal: number;
  discountPercentAmount: number;
  customDiscountNominal: number;
  totalDiscount: number;
  taxableAmount: number;
  taxAmount: number;
  grandTotal: number;
}

/**
 * FUNGSI 1: KALKULASI KEMBALIAN UANG TUNAI (CASH CHANGE CALCULATOR)
 * Menghitung kembalian uang tunai, mendeteksi uang pas, uang lebih,
 * dan memproteksi kasus uang kurang (shortfall) agar kasir tidak rugi.
 *
 * @param cashReceived Nominal uang fisik yang diterima kasir (Rp)
 * @param grandTotal Total tagihan belanja yang harus dibayar (Rp)
 * @returns CashChangeResult
 */
export function calculateCashChange(
  cashReceived: number,
  grandTotal: number
): CashChangeResult {
  const safeCash = Math.max(0, Math.round(cashReceived || 0));
  const safeTotal = Math.max(0, Math.round(grandTotal || 0));

  if (safeTotal === 0) {
    return {
      change: safeCash,
      isExact: safeCash === 0,
      isSufficient: true,
      shortfall: 0,
    };
  }

  if (safeCash >= safeTotal) {
    const change = safeCash - safeTotal;
    return {
      change,
      isExact: change === 0,
      isSufficient: true,
      shortfall: 0,
    };
  }

  // Kasus uang tunai kurang dari total belanja
  const shortfall = safeTotal - safeCash;
  return {
    change: 0,
    isExact: false,
    isSufficient: false,
    shortfall,
  };
}

/**
 * FUNGSI 2: KALKULASI BAGI HASIL MITRA STAN & KOMISI KAMPUS (REVENUE SPLIT 90:10)
 * Menghitung pembagian komisi pengelolaan Foodcourt UNUGHA dan hak bersih stan.
 * Menggunakan pembulatan bulat (integer rounding) untuk mencegah selisih pecahan rupiah.
 *
 * Sifat Invarian: commissionAmount + tenantNet SELALU persis sama dengan grossTotal.
 *
 * @param grossTotal Omzet kotor pesanan stan (Rp)
 * @param commissionRate Rasio komisi (desimal 0.0 s/d 1.0, default 0.10 untuk 10%)
 * @returns RevenueSplitResult
 */
export function calculateRevenueSplit(
  grossTotal: number,
  commissionRate: number = 0.1
): RevenueSplitResult {
  const safeGross = Math.max(0, Math.round(grossTotal || 0));
  // Batasi tarif antara 0% hingga 100%
  const clampedRate = Math.min(1, Math.max(0, Number(commissionRate) || 0));
  const ratePercent = Math.round(clampedRate * 100);

  if (safeGross === 0) {
    return {
      commissionAmount: 0,
      tenantNet: 0,
      ratePercent,
      grossTotal: 0,
    };
  }

  const commissionAmount = Math.round(safeGross * clampedRate);
  // Hak bersih stan dihitung dengan pengurangan langsung untuk menjamin zero drift
  const tenantNet = safeGross - commissionAmount;

  return {
    commissionAmount,
    tenantNet,
    ratePercent,
    grossTotal: safeGross,
  };
}

/**
 * FUNGSI 3: GENERATOR NOMOR INVOICE OTOMATIS STANDAR UNUGHA
 * Menghasilkan kode faktur unik berformat resmi:
 * INV/UNUGHA/YYYYMMDD/XXXX
 *
 * Contoh: INV/UNUGHA/20261006/0001
 *
 * @param date Objek tanggal atau string tanggal transaksi
 * @param counter Nomor urut transaksi pada hari tersebut (integer >= 1)
 * @param prefix Awalan kode instansi (default 'INV/UNUGHA')
 * @returns String nomor invoice resmi
 */
export function generateInvoiceNumber(
  date: Date | string,
  counter: number,
  prefix: string = 'INV/UNUGHA'
): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const safeDate = isNaN(d.getTime()) ? new Date() : d;

  const year = safeDate.getFullYear();
  const month = String(safeDate.getMonth() + 1).padStart(2, '0');
  const day = String(safeDate.getDate()).padStart(2, '0');
  const dateFormatted = `${year}${month}${day}`;

  const safeCounter = Math.max(1, Math.floor(counter || 1));
  const paddedCounter = String(safeCounter).padStart(4, '0');

  const cleanPrefix = (prefix || 'INV/UNUGHA').trim().replace(/\/+$/, '');

  return `${cleanPrefix}/${dateFormatted}/${paddedCounter}`;
}

/**
 * FUNGSI 4: KALKULASI TOTAL PESANAN (SUBTOTAL, DISKON PERSEN/NOMINAL, & PAJAK)
 * Mengakumulasi item pesanan dan menghitung rincian pembayaran secara deterministik.
 *
 * @param subtotal Total harga kotor makanan/minuman
 * @param discountPercent Persentase diskon promo (0 - 100%)
 * @param customDiscountNominal Potongan kupon dalam nominal rupiah (Rp)
 * @param taxRate Tarif pajak restoran/PB1 (misal 0.10 untuk 10%, atau 0 untuk bebas pajak)
 * @returns OrderTotalsCalculation
 */
export function calculateOrderTotals(
  subtotal: number,
  discountPercent: number = 0,
  customDiscountNominal: number = 0,
  taxRate: number = 0
): OrderTotalsCalculation {
  const safeSubtotal = Math.max(0, Math.round(subtotal || 0));
  const safePercent = Math.min(100, Math.max(0, discountPercent || 0));
  const safeNominal = Math.max(0, Math.round(customDiscountNominal || 0));
  const safeTaxRate = Math.min(1, Math.max(0, taxRate || 0));

  // 1. Hitung potongan persentase
  const discountPercentAmount = Math.round((safeSubtotal * safePercent) / 100);

  // 2. Total akumulasi diskon (tidak boleh melebihi subtotal)
  const totalDiscount = Math.min(
    safeSubtotal,
    discountPercentAmount + safeNominal
  );

  // 3. Dasar Pengenaan Pajak (DPP) setelah diskon
  const taxableAmount = Math.max(0, safeSubtotal - totalDiscount);

  // 4. Pajak dihitung dari nilai kena pajak
  const taxAmount = Math.round(taxableAmount * safeTaxRate);

  // 5. Grand Total Tagihan
  const grandTotal = taxableAmount + taxAmount;

  return {
    subtotal: safeSubtotal,
    discountPercentAmount,
    customDiscountNominal: safeNominal,
    totalDiscount,
    taxableAmount,
    taxAmount,
    grandTotal,
  };
}
