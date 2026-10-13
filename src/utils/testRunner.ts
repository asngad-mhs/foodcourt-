/**
 * ============================================================================
 * TEST RUNNER & UNIT TEST SUITES UNTUK SISTEM POS FOODCOURT UNUGHA
 * ============================================================================
 * Menyediakan eksekutor unit test in-app yang memvalidasi fungsi-fungsi
 * bisnis penting:
 * 1. calculateCashChange (Perhitungan Kembalian Uang Tunai)
 * 2. calculateRevenueSplit (Bagi Hasil 90% Mitra Stan & 10% Komisi Kampus)
 * 3. generateInvoiceNumber (Generator Faktur Unik Standar UNUGHA)
 * 4. calculateOrderTotals (Perhitungan Total, Diskon & Pajak)
 */

import {
  calculateCashChange,
  calculateRevenueSplit,
  generateInvoiceNumber,
  calculateOrderTotals,
  CashChangeResult,
  RevenueSplitResult,
  OrderTotalsCalculation,
} from './posCalculations';

export interface TestAssertion {
  description: string;
  passed: boolean;
  expected: unknown;
  actual: unknown;
  error?: string;
}

export interface TestCaseResult {
  id: string;
  name: string;
  suite: string;
  targetFunction: string;
  description: string;
  status: 'PASSED' | 'FAILED';
  durationMs: number;
  assertions: TestAssertion[];
}

export interface TestSuiteSummary {
  totalTests: number;
  passedTests: number;
  failedTests: number;
  totalAssertions: number;
  passedAssertions: number;
  totalDurationMs: number;
  timestamp: string;
  results: TestCaseResult[];
}

/**
 * STRUKTUR TEST CASE DESIGN (FORMAT SLIDE 14 STANDAR QA IEEE 829)
 * Format tabel uji yang dipresentasikan pada Slide 14 PPT
 */
export interface Slide14TestCase {
  testId: string;
  module: string;
  scenario: string;
  precondition: string;
  testSteps: string[];
  testData: string;
  expectedResult: string;
  actualResult: string;
  status: 'PASS' | 'FAIL';
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
}

export const SLIDE_14_TEST_CASES: Slide14TestCase[] = [
  {
    testId: 'TC-POS-01',
    module: 'Kasir & Tunai (Cash)',
    scenario: 'Perhitungan Kembalian Uang Pas & Uang Lebih',
    precondition: 'Keranjang belanja terisi menu Rp 45.000',
    testSteps: [
      '1. Pilih menu Ayam Geprek & Es Teh Manis (Total Rp 45.000)',
      '2. Pilih metode pembayaran "Cash"',
      '3. Klik tombol pecahan cepat "Rp 50.000"',
      '4. Periksa kalkulasi kembalian di layar kasir',
    ],
    testData: 'Tagihan = Rp 45.000, Uang Diterima = Rp 50.000',
    expectedResult: 'Kembalian terhitung Rp 5.000, status uang cukup, tombol checkout aktif.',
    actualResult: 'Kembalian tepat Rp 5.000, status "Kembalian Rp 5.000", tombol checkout aktif.',
    status: 'PASS',
    severity: 'CRITICAL',
  },
  {
    testId: 'TC-POS-02',
    module: 'Kasir & Tunai (Cash)',
    scenario: 'Validasi Proteksi Uang Tunai Kurang (Shortfall Guard)',
    precondition: 'Keranjang belanja terisi tagihan Rp 30.000',
    testSteps: [
      '1. Input nominal uang diterima Rp 20.000 (kurang Rp 10.000)',
      '2. Amati respons peringatan di antarmuka kasir',
      '3. Uji apakah tombol proses pembayaran terkunci/disabled',
    ],
    testData: 'Tagihan = Rp 30.000, Uang Diterima = Rp 20.000',
    expectedResult: 'Muncul banner peringatan merah "Uang Kurang Rp 10.000" dan tombol checkout disabled.',
    actualResult: 'Peringatan merah muncul, tombol nonaktif hingga kasir menginput uang cukup.',
    status: 'PASS',
    severity: 'CRITICAL',
  },
  {
    testId: 'TC-POS-03',
    module: 'Settlement & Akuntansi',
    scenario: 'Kalkulasi Bagi Hasil 90% Stan & 10% Komisi Kampus',
    precondition: 'Transaksi selesai dari Stan Mie Ayam UNUGHA senilai Rp 100.000',
    testSteps: [
      '1. Sistem memicu fungsi calculateRevenueSplit(100000, 0.1)',
      '2. Periksa alokasi dana 10% kas operasional kampus',
      '3. Periksa alokasi dana 90% hak bersih pencairan mitra stan',
    ],
    testData: 'grossTotal = 100000, commissionRate = 0.10',
    expectedResult: 'Komisi kampus = Rp 10.000, Hak bersih stan = Rp 90.000 (total pas Rp 100.000).',
    actualResult: 'Komisi kampus Rp 10.000, Hak stan Rp 90.000, zero rounding drift.',
    status: 'PASS',
    severity: 'CRITICAL',
  },
  {
    testId: 'TC-POS-04',
    module: 'Settlement & Akuntansi',
    scenario: 'Pembulatan Presisi Rupiah pada Nilai Belanja Ganjil',
    precondition: 'Transaksi menu dengan harga tidak genap (misal Rp 15.750)',
    testSteps: [
      '1. Panggil calculateRevenueSplit(15750, 0.1)',
      '2. Uji penjumlahan: commissionAmount + tenantNet harus persis sama dengan 15750',
    ],
    testData: 'grossTotal = 15750, commissionRate = 0.10',
    expectedResult: 'Komisi = Rp 1.575, Hak Stan = Rp 14.175 (1575 + 14175 = 15750, tidak ada sen hilang).',
    actualResult: 'Komisi Rp 1.575, Hak Stan Rp 14.175, total akumulasi tepat 100%.',
    status: 'PASS',
    severity: 'HIGH',
  },
  {
    testId: 'TC-POS-05',
    module: 'Invoice & Transaksi',
    scenario: 'Generator Nomor Invoice Otomatis Format Resmi',
    precondition: 'Transaksi ke-7 pada tanggal 6 Oktober 2026',
    testSteps: [
      '1. Panggil generateInvoiceNumber(new Date(2026, 9, 6), 7)',
      '2. Periksa susunan prefix, format YYYYMMDD, dan 4 digit padding',
    ],
    testData: 'Date = 2026-10-06, Counter = 7',
    expectedResult: 'Terbentuk nomor invoice "INV/UNUGHA/20261006/0007".',
    actualResult: 'Nomor faktur "INV/UNUGHA/20261006/0007" ter-generate dengan presisi.',
    status: 'PASS',
    severity: 'HIGH',
  },
  {
    testId: 'TC-POS-06',
    module: 'Cetak Struk Thermal',
    scenario: 'Isolasi @media print Kertas Roll 58mm & 80mm',
    precondition: 'Modal nota tampil di layar kasir, klik tombol cetak struk',
    testSteps: [
      '1. Pilih ukuran kertas 58mm pada tombol toggle modal',
      '2. Tekan tombol "Cetak Struk (Ctrl+P)"',
      '3. Periksa jendela print preview browser',
    ],
    testData: 'Kertas = 58mm roll (lebar fisik 48mm)',
    expectedResult: 'Hanya struk nota yang tercetak, background modal dan navbar kasir tersembunyi.',
    actualResult: 'Hanya elemen #thermal-receipt-print-area yang tercetak bersih tanpa margin browser.',
    status: 'PASS',
    severity: 'HIGH',
  },
  {
    testId: 'TC-POS-07',
    module: 'Sinkronisasi Real-Time',
    scenario: 'Broadcast Antrean Pesanan Multi-Stan Tanpa Crash',
    precondition: 'Dua tab browser aktif: Tab 1 (Kasir), Tab 2 (Layar Dapur Stan A-01)',
    testSteps: [
      '1. Kasir menyelesaikan transaksi pesanan A-012',
      '2. Amati perubahan di layar antrean stan tanpa refresh halaman',
      '3. Uji unmount komponen saat cleanup hook dijalankan',
    ],
    testData: 'Order ID = ORD-20261006-012, Multi-item Stan A-01 & A-02',
    expectedResult: 'Pesanan baru langsung muncul di dapur stan dalam < 50ms, cleanup hook aman dari null error.',
    actualResult: 'Tiket pesanan masuk secara real-time via BroadcastChannel & safe cleanup tanpa error.',
    status: 'PASS',
    severity: 'HIGH',
  },
  {
    testId: 'TC-POS-08',
    module: 'Multi-Payment & QRIS',
    scenario: 'Pembayaran Non-Tunai QRIS, Transfer BSI & E-Wallet',
    precondition: 'Kasir memilih metode QRIS / Transfer',
    testSteps: [
      '1. Pilih metode pembayaran "QRIS"',
      '2. Input nomor referensi transaksi digital "NMID-8849201"',
      '3. Klik tombol checkout dan verifikasi data transaksi tersimpan',
    ],
    testData: 'PaymentMethod = "QRIS", paymentReference = "NMID-8849201"',
    expectedResult: 'Transaksi berhasil tercatat dengan payment_method QRIS dan payment_reference tersimpan.',
    actualResult: 'Tersimpan ke database dengan status lunas dan nomor referensi digital valid.',
    status: 'PASS',
    severity: 'MEDIUM',
  },
];

/**
 * MENJALANKAN SELURUH UNIT TEST SECARA OTOMATIS
 * Menguji 3 fungsi utama (+ 1 fungsi kalkulasi belanja)
 */
export function runAllPosUnitTests(): TestSuiteSummary {
  const startTime = performance.now();
  const results: TestCaseResult[] = [];

  // ==========================================================================
  // SUITE 1: UNIT TEST calculateCashChange
  // ==========================================================================
  {
    const tStart = performance.now();
    const assertions: TestAssertion[] = [];

    // Test 1.1: Pembayaran Uang Pas
    const r1: CashChangeResult = calculateCashChange(50000, 50000);
    assertions.push({
      description: 'Uang pas: Kembalian harus Rp 0',
      passed: r1.change === 0,
      expected: 0,
      actual: r1.change,
    });
    assertions.push({
      description: 'Uang pas: isExact harus true',
      passed: r1.isExact === true,
      expected: true,
      actual: r1.isExact,
    });
    assertions.push({
      description: 'Uang pas: isSufficient harus true',
      passed: r1.isSufficient === true,
      expected: true,
      actual: r1.isSufficient,
    });

    // Test 1.2: Pembayaran Uang Lebih
    const r2: CashChangeResult = calculateCashChange(100000, 75000);
    assertions.push({
      description: 'Uang lebih: Kembalian Rp 100.000 - Rp 75.000 harus Rp 25.000',
      passed: r2.change === 25000,
      expected: 25000,
      actual: r2.change,
    });
    assertions.push({
      description: 'Uang lebih: isExact harus false',
      passed: r2.isExact === false,
      expected: false,
      actual: r2.isExact,
    });
    assertions.push({
      description: 'Uang lebih: shortfall harus 0',
      passed: r2.shortfall === 0,
      expected: 0,
      actual: r2.shortfall,
    });

    // Test 1.3: Pembayaran Uang Kurang
    const r3: CashChangeResult = calculateCashChange(20000, 35000);
    assertions.push({
      description: 'Uang kurang: Kembalian harus 0',
      passed: r3.change === 0,
      expected: 0,
      actual: r3.change,
    });
    assertions.push({
      description: 'Uang kurang: isSufficient harus false',
      passed: r3.isSufficient === false,
      expected: false,
      actual: r3.isSufficient,
    });
    assertions.push({
      description: 'Uang kurang: shortfall harus Rp 15.000',
      passed: r3.shortfall === 15000,
      expected: 15000,
      actual: r3.shortfall,
    });

    // Test 1.4: Tagihan Rp 0 (Edge Case)
    const r4 = calculateCashChange(10000, 0);
    assertions.push({
      description: 'Edge case tagihan 0: Kembalian sama dengan nominal diterima',
      passed: r4.change === 10000 && r4.isSufficient === true,
      expected: { change: 10000, isSufficient: true },
      actual: { change: r4.change, isSufficient: r4.isSufficient },
    });

    const isPassed = assertions.every((a) => a.passed);
    results.push({
      id: 'UT-01',
      name: 'Unit Test calculateCashChange()',
      suite: 'Modul Pembayaran Tunai & Kasir',
      targetFunction: 'calculateCashChange(cashReceived, grandTotal)',
      description:
        'Menguji ketepatan kalkulasi uang kembalian pada kasus uang pas, uang lebih, uang kurang, dan nilai batas.',
      status: isPassed ? 'PASSED' : 'FAILED',
      durationMs: Math.round((performance.now() - tStart) * 100) / 100,
      assertions,
    });
  }

  // ==========================================================================
  // SUITE 2: UNIT TEST calculateRevenueSplit
  // ==========================================================================
  {
    const tStart = performance.now();
    const assertions: TestAssertion[] = [];

    // Test 2.1: Nilai Standar 100.000 dengan rasio 10%
    const s1: RevenueSplitResult = calculateRevenueSplit(100000, 0.1);
    assertions.push({
      description: 'Komisi 10% dari Rp 100.000 harus Rp 10.000',
      passed: s1.commissionAmount === 10000,
      expected: 10000,
      actual: s1.commissionAmount,
    });
    assertions.push({
      description: 'Hak stan 90% dari Rp 100.000 harus Rp 90.000',
      passed: s1.tenantNet === 90000,
      expected: 90000,
      actual: s1.tenantNet,
    });
    assertions.push({
      description: 'Invarian: Komisi + Hak Stan harus persis sama dengan Gross Total',
      passed: s1.commissionAmount + s1.tenantNet === 100000,
      expected: 100000,
      actual: s1.commissionAmount + s1.tenantNet,
    });

    // Test 2.2: Nilai Ganjil dengan pembulatan integer
    const s2: RevenueSplitResult = calculateRevenueSplit(15750, 0.1);
    assertions.push({
      description: 'Komisi nilai ganjil Rp 15.750 harus Rp 1.575',
      passed: s2.commissionAmount === 1575,
      expected: 1575,
      actual: s2.commissionAmount,
    });
    assertions.push({
      description: 'Hak stan nilai ganjil Rp 15.750 harus Rp 14.175',
      passed: s2.tenantNet === 14175,
      expected: 14175,
      actual: s2.tenantNet,
    });
    assertions.push({
      description: 'Zero drift: Komisi + Hak Stan persis Rp 15.750',
      passed: s2.commissionAmount + s2.tenantNet === 15750,
      expected: 15750,
      actual: s2.commissionAmount + s2.tenantNet,
    });

    // Test 2.3: Tarif Kustom (misal 5% dan 0%)
    const s3: RevenueSplitResult = calculateRevenueSplit(200000, 0.05);
    assertions.push({
      description: 'Komisi tarif kustom 5% dari Rp 200.000 harus Rp 10.000',
      passed: s3.commissionAmount === 10000 && s3.tenantNet === 190000,
      expected: { commission: 10000, net: 190000 },
      actual: { commission: s3.commissionAmount, net: s3.tenantNet },
    });

    // Test 2.4: Gross Total 0
    const s4: RevenueSplitResult = calculateRevenueSplit(0, 0.1);
    assertions.push({
      description: 'Gross total 0: Komisi 0 dan Hak Stan 0',
      passed: s4.commissionAmount === 0 && s4.tenantNet === 0,
      expected: { commission: 0, net: 0 },
      actual: { commission: s4.commissionAmount, net: s4.tenantNet },
    });

    const isPassed = assertions.every((a) => a.passed);
    results.push({
      id: 'UT-02',
      name: 'Unit Test calculateRevenueSplit()',
      suite: 'Modul Bagi Hasil & Settlement Finansial',
      targetFunction: 'calculateRevenueSplit(grossTotal, commissionRate)',
      description:
        'Menguji integritas pembagian hasil 90:10, pembulatan integer bulat, dan jaminan zero-drift tanpa sen hilang.',
      status: isPassed ? 'PASSED' : 'FAILED',
      durationMs: Math.round((performance.now() - tStart) * 100) / 100,
      assertions,
    });
  }

  // ==========================================================================
  // SUITE 3: UNIT TEST generateInvoiceNumber
  // ==========================================================================
  {
    const tStart = performance.now();
    const assertions: TestAssertion[] = [];

    // Test 3.1: Format Standar Counter 1 Digit
    const fixedDate = new Date(2026, 9, 6); // 6 Oktober 2026
    const inv1 = generateInvoiceNumber(fixedDate, 1);
    assertions.push({
      description: 'Format nomor faktur urut 1 harus INV/UNUGHA/20261006/0001',
      passed: inv1 === 'INV/UNUGHA/20261006/0001',
      expected: 'INV/UNUGHA/20261006/0001',
      actual: inv1,
    });

    // Test 3.2: Counter Lebih dari 1 Digit (misal urut ke-85)
    const inv2 = generateInvoiceNumber(fixedDate, 85);
    assertions.push({
      description: 'Zero padding 4 digit untuk counter 85 harus 0085',
      passed: inv2 === 'INV/UNUGHA/20261006/0085',
      expected: 'INV/UNUGHA/20261006/0085',
      actual: inv2,
    });

    // Test 3.3: Counter 4 Digit (misal urut ke-1420)
    const inv3 = generateInvoiceNumber(fixedDate, 1420);
    assertions.push({
      description: 'Counter 4 digit (1420) mempertahankan 4 karakter',
      passed: inv3 === 'INV/UNUGHA/20261006/1420',
      expected: 'INV/UNUGHA/20261006/1420',
      actual: inv3,
    });

    // Test 3.4: Custom Prefix
    const inv4 = generateInvoiceNumber(fixedDate, 5, 'TRX/FOODCOURT');
    assertions.push({
      description: 'Dukungan prefix kustom: TRX/FOODCOURT/20261006/0005',
      passed: inv4 === 'TRX/FOODCOURT/20261006/0005',
      expected: 'TRX/FOODCOURT/20261006/0005',
      actual: inv4,
    });

    const isPassed = assertions.every((a) => a.passed);
    results.push({
      id: 'UT-03',
      name: 'Unit Test generateInvoiceNumber()',
      suite: 'Modul Penomoran Faktur & Transaksi',
      targetFunction: 'generateInvoiceNumber(date, counter, prefix)',
      description:
        'Menguji pembuatan kode invoice unik dengan tanggal terformat YYYYMMDD dan padding 4-digit zero-lead.',
      status: isPassed ? 'PASSED' : 'FAILED',
      durationMs: Math.round((performance.now() - tStart) * 100) / 100,
      assertions,
    });
  }

  // ==========================================================================
  // SUITE 4: UNIT TEST calculateOrderTotals
  // ==========================================================================
  {
    const tStart = performance.now();
    const assertions: TestAssertion[] = [];

    // Test 4.1: Subtotal 50.000 dengan Diskon 10% dan Tanpa Pajak
    const tot1: OrderTotalsCalculation = calculateOrderTotals(50000, 10, 0, 0);
    assertions.push({
      description: 'Diskon 10% dari Rp 50.000 harus Rp 5.000',
      passed: tot1.totalDiscount === 5000,
      expected: 5000,
      actual: tot1.totalDiscount,
    });
    assertions.push({
      description: 'Grand total tagihan setelah diskon harus Rp 45.000',
      passed: tot1.grandTotal === 45000,
      expected: 45000,
      actual: tot1.grandTotal,
    });

    // Test 4.2: Diskon Nominal Rp 10.000 dan Pajak PB1 10%
    const tot2: OrderTotalsCalculation = calculateOrderTotals(100000, 0, 10000, 0.1);
    assertions.push({
      description: 'Dasar pengenaan pajak (Rp 100.000 - Rp 10.000) harus Rp 90.000',
      passed: tot2.taxableAmount === 90000,
      expected: 90000,
      actual: tot2.taxableAmount,
    });
    assertions.push({
      description: 'Pajak 10% dari DPP Rp 90.000 harus Rp 9.000',
      passed: tot2.taxAmount === 9000,
      expected: 9000,
      actual: tot2.taxAmount,
    });
    assertions.push({
      description: 'Grand total (DPP 90.000 + Pajak 9.000) harus Rp 99.000',
      passed: tot2.grandTotal === 99000,
      expected: 99000,
      actual: tot2.grandTotal,
    });

    const isPassed = assertions.every((a) => a.passed);
    results.push({
      id: 'UT-04',
      name: 'Unit Test calculateOrderTotals()',
      suite: 'Modul Diskon, Pajak & Grand Total',
      targetFunction: 'calculateOrderTotals(subtotal, discountPercent, nominalDiscount, taxRate)',
      description:
        'Menguji akurasi pengurangan diskon kupon, perhitungan DPP, dan penerapan tarif pajak restoran PB1.',
      status: isPassed ? 'PASSED' : 'FAILED',
      durationMs: Math.round((performance.now() - tStart) * 100) / 100,
      assertions,
    });
  }

  const totalDurationMs = Math.round((performance.now() - startTime) * 100) / 100;
  const totalTests = results.length;
  const passedTests = results.filter((r) => r.status === 'PASSED').length;
  const failedTests = totalTests - passedTests;

  let totalAssertions = 0;
  let passedAssertions = 0;
  for (const r of results) {
    totalAssertions += r.assertions.length;
    passedAssertions += r.assertions.filter((a) => a.passed).length;
  }

  return {
    totalTests,
    passedTests,
    failedTests,
    totalAssertions,
    passedAssertions,
    totalDurationMs,
    timestamp: new Date().toISOString(),
    results,
  };
}
