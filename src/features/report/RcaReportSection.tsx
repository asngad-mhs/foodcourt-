import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Bug,
  Search,
  FileCode2,
  Terminal,
  ShieldAlert,
  ArrowRight,
  Copy,
  Check,
  Printer,
  ChevronRight,
  GitBranch,
} from 'lucide-react';

interface DefectItem {
  id: string;
  code: string;
  title: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  location: string;
  symptoms: string;
  impact: string;
  fiveWhys: string[];
  fishbone: {
    people: string;
    method: string;
    machine: string;
    measurement: string;
  };
  rootCause: string;
  correctiveAction: string;
  preventiveAction: string;
  codeBefore: string;
  codeAfter: string;
}

const DEFECT_LIST: DefectItem[] = [
  {
    id: 'defect-1',
    code: 'FAULT-01 / BUG-POS-001',
    title: 'Inkonsistensi Type PaymentMethod & Kegagalan Kalkulasi Kembalian Uang Tunai',
    severity: 'CRITICAL',
    location: 'src/components/kasir/CartSidebar.tsx & src/types/index.ts',
    symptoms:
      'Di komponen CartSidebar, metode pembayaran tunai menggunakan string literal "Tunai" dan "QRIS Kampus", sedangkan skema TypeScript dan store mendefinisikan "Cash" dan "QRIS". Hal ini menyebabkan kondisi pengecekan paymentMethod === "Tunai" tidak pernah valid saat store diinisialisasi dengan "Cash". Akibatnya, kotak input nominal uang diterima dan kalkulasi otomatis kembalian tunai tidak muncul di layar kasir, serta transaksi non-tunai seperti Transfer Bank dan E-Wallet belum memiliki field referensi pembayaran.',
    impact:
      'Kasir tidak dapat memproses pembayaran uang tunai fisik secara benar, kembalian tidak terkalkulasi otomatis (rawan salah hitung kasir), dan kompilasi TypeScript gagal (error TS2367 type mismatch no overlap).',
    fiveWhys: [
      'Why 1: Mengapa kembalian uang tunai tidak muncul di kasir? Karena komponen CartSidebar mengecek paymentMethod === "Tunai", sedangkan store menyimpan nilai "Cash".',
      'Why 2: Mengapa string literal yang digunakan berbeda? Karena pengembang awal menulis label bahasa Indonesia ("Tunai") langsung sebagai ID state tanpa mengikat ke union type PaymentMethod.',
      'Why 3: Mengapa tidak ada validasi kontrak antarmuka? Karena data opsi pembayaran di CartSidebar ditulis secara hardcoded terpisah dari tipe data resmi di src/types/index.ts.',
      'Why 4: Mengapa sistem menerima metode pembayaran lain tanpa input referensi? Karena kanal Transfer Bank dan E-Wallet belum diintegrasikan ke dalam form input kasir.',
      'Why 5: ROOT CAUSE: Tidak adanya integrasi tipe tunggal (single source of truth) antara antarmuka UI kasir dan kontrak tipe data PaymentMethod pada lapisan state management.',
    ],
    fishbone: {
      people: 'Kurangnya koordinasi standar penamaan kamus data (Indonesia "Tunai" vs English "Cash").',
      method: 'Belum diterapkannya strict typing pada array deklarasi PAYMENT_METHODS di komponen view.',
      machine: 'Compiler TypeScript mendeteksi zero overlap antara type union PaymentMethod dengan string lokal.',
      measurement: 'Uji fungsional kasir tunai belum mencakup verifikasi input cashReceived dengan variasi nominal.',
    },
    rootCause:
      'Terjadinya diskrepansi tipe data (type mismatch) antara state paymentMethod di Zustand ("Cash") dengan nilai id di tombol pembayaran UI ("Tunai"), sehingga logika perulangan kalkulasi kembalian tunai terlewati (bypassed).',
    correctiveAction:
      '1. Menyelaraskan seluruh tipe data menjadi "Cash", "QRIS", "Transfer", "Transfer Bank", "E-Wallet", dan "KTM UNUGHA".\n2. Menambahkan kalkulator kembalian otomatis real-time (effectiveCash - grandTotal) dengan peringatan uang kurang bila cashReceived < grandTotal.\n3. Menambahkan tombol pecahan rupiah cepat (Uang Pas, 10rb, 20rb, 50rb, 100rb).\n4. Menonaktifkan tombol checkout jika nominal tunai belum mencukupi tagihan.',
    preventiveAction:
      'Menerapkan strict TypeScript linting (tsc --noEmit) pada pipeline build CI/CD dan menggunakan Enum/Union type terpusat dari src/types/index.ts tanpa pernah menulis hardcoded string bebas.',
    codeBefore: `// SEBELUM PERBAIKAN (FAULT):
const PAYMENT_METHODS = [
  { id: 'Tunai', label: 'Tunai (Cash)' }, // MISMATCH dengan type PaymentMethod
  { id: 'QRIS Kampus', label: 'QRIS Kampus' },
];
// Kondisi ini tidak pernah terpenuhi karena store bernilai 'Cash'
{paymentMethod === 'Tunai' && (
  <div>...input cash...</div>
)}`,
    codeAfter: `// SETELAH PERBAIKAN (RESOLVED):
export type PaymentMethod = 'Cash' | 'QRIS' | 'Transfer' | 'Transfer Bank' | 'E-Wallet' | 'KTM UNUGHA';

const isCash = paymentMethod === 'Cash';
const changeAmount = Math.max(0, (cashReceived || grandTotal) - grandTotal);
const isCashInsufficient = isCash && cashReceived > 0 && cashReceived < grandTotal;

{isCash && (
  <div className="p-3 bg-white border rounded-lg">
    <input value={cashReceived || ''} onChange={(e) => setCashReceived(Number(e.target.value))} />
    <span className="font-bold text-emerald-900">Kembalian: {formatRupiah(changeAmount)}</span>
  </div>
)}`,
  },

  {
    id: 'defect-2',
    code: 'FAULT-02 / BUG-PRT-002',
    title: 'Kerusakan Format Cetak Struk Thermal via window.print() (Print Bleeding & Page Overflow)',
    severity: 'HIGH',
    location: 'src/index.css & src/components/kasir/ReceiptModal.tsx',
    symptoms:
      'Ketika kasir menekan tombol "Cetak Struk", browser memanggil fungsi window.print() standar. Namun, karena tidak ada isolasi styling CSS cetak (@media print), printer thermal mencetak seluruh halaman monitor (termasuk background warna gelap modal backdrop, header aplikasi, tombol tutup modal, dan margin default A4 20mm). Hasil cetak pada kertas roll 58mm/80mm menjadi terpotong, berantakan, teks terlalu kecil, dan menghabiskan kertas struk.',
    impact:
      'Struk fisik kasir tidak dapat terbaca oleh pelanggan maupun koki stan, membuang-buang gulungan kertas kasir (paper waste), dan memperlambat antrean karena kasir harus mengulang cetak.',
    fiveWhys: [
      'Why 1: Mengapa kertas thermal mencetak navbar dan modal backdrop? Karena window.print() merender seluruh elemen DOM yang sedang aktif di viewport browser.',
      'Why 2: Mengapa elemen di luar struk tidak disembunyikan? Karena stylesheet global belum memiliki selektor display: none pada elemen luar nota saat mode cetak aktif.',
      'Why 3: Mengapa lebar cetakan melebihi lebar kertas thermal kasir? Karena lebar container struk menggunakan satuan pixel layar (px) dan persen (%), bukan millimeter fisik (mm) kertas printer thermal.',
      'Why 4: Mengapa printer menambahkan header tanggal & footer URL bawaan browser? Karena tidak ada direktif @page { margin: 0 } pada konfigurasi CSS cetak.',
      'Why 5: ROOT CAUSE: Ketiadaan arsitektur Thermal Print Styling (@media print isolation) yang mengisolasi elemen nota ke id #thermal-receipt-print-area dengan lebar presisi 48mm/72mm.',
    ],
    fishbone: {
      people: 'Asumsi bahwa window.print() otomatis hanya mencetak konten modal popup.',
      method: 'Pengujian awal hanya dilakukan secara visual di layar monitor (preview modal), bukan simulasi cetak kertas.',
      machine: 'Printer kasir thermal POS bekerja dengan spesifikasi lebar fisik roll (58mm / 80mm) berbasis fixed column feed.',
      measurement: 'Ketiadaan validasi layout pada dialog browser print preview.',
    },
    rootCause:
      'CSS global tidak memiliki aturan isolasi @media print yang mematikan visibility seluruh elemen DOM halaman kecuali kontainer struk thermal (#thermal-receipt-print-area), serta tidak mengatur @page margin: 0.',
    correctiveAction:
      '1. Menambahkan CSS @media print di src/index.css dengan aturan: body * { visibility: hidden } dan #thermal-receipt-print-area * { visibility: visible }.\n2. Memberikan kelas ukuran kertas presisi: .paper-58mm (lebar cetak 48mm) dan .paper-80mm (lebar cetak 72mm).\n3. Mengatur @page { margin: 0; size: auto; } agar printer tidak mencetak header/footer URL browser.\n4. Menambahkan toggle ukuran kertas (58mm Mini Bluetooth vs 80mm Standard POS) serta tombol opsi "Salin Teks Struk / WA".',
    preventiveAction:
      'Membuat komponen cetak struk modular yang memisahkan antara layer display visual di layar dengan layer print canvas yang terisolasi.',
    codeBefore: `/* SEBELUM PERBAIKAN (FAULT): */
@media print {
  .no-print {
    display: none !important;
  }
}
/* Modal backdrop dan seluruh halaman tetap ikut tercetak ke kertas kasir! */`,
    codeAfter: `/* SETELAH PERBAIKAN (RESOLVED): */
@media print {
  body { background: white !important; margin: 0 !important; }
  body * { visibility: hidden; }
  #thermal-receipt-print-area, #thermal-receipt-print-area * {
    visibility: visible;
  }
  #thermal-receipt-print-area {
    position: fixed; left: 0; top: 0; width: 100%;
    margin: 0 !important; padding: 2mm !important;
  }
  .paper-58mm { width: 48mm !important; font-size: 10px !important; }
  .paper-80mm { width: 72mm !important; font-size: 12px !important; }
  @page { margin: 0; size: auto; }
}`,
  },

  {
    id: 'defect-3',
    code: 'FAULT-03 / BUG-RT-003',
    title: 'Null Pointer Exception Cleanup Hook useRealtimeSync & Data Inconsistency Payload QRIS',
    severity: 'HIGH',
    location: 'src/hooks/useRealtimeSync.ts & src/stores/useFoodcourtStore.ts',
    symptoms:
      'Pada file useRealtimeSync.ts, cleanup function di useEffect memanggil realtimeChannel.removeEventListener() tanpa validasi keberadaan objek. Jika aplikasi dijalankan di lingkungan browser yang menonaktifkan BroadcastChannel atau bernilai null, terjadi unhandled TypeError / crash runtime. Selain itu, fungsi simulasi simulateIncomingQrisOrder di store meng-generate objek Order tanpa field mandatory: invoice_number, discount_percent, dan tax_rate, serta menggunakan string payment_method: "QRIS Kampus" yang tidak valid pada antarmuka Order.',
    impact:
      'Memory leak dan potensi crash saat komponen unmount di browser tertentu, serta kompilasi TypeScript gagal (error TS18047 "realtimeChannel is possibly null" dan TS2739 missing required properties in Order). Di tabel laporan, pesanan QRIS menampilkan nomor invoice kosong/undefined.',
    fiveWhys: [
      'Why 1: Mengapa linter dan build tsc --noEmit gagal? Karena compiler mendeteksi akses properti pada variabel yang nullable (realtimeChannel) dan properti wajib Order yang hilang.',
      'Why 2: Mengapa realtimeChannel bisa bernilai null? Karena di foodcourtApi.ts terdapat pengecekan typeof BroadcastChannel !== "undefined", jika tidak ada maka nilainya null.',
      'Why 3: Mengapa fungsi unmount listener tetap memanggilnya? Karena developer tidak memberikan guard clause `if (realtimeChannel)` sebelum removeEventListener.',
      'Why 4: Mengapa payload simulateIncomingQrisOrder tidak lengkap? Karena fungsi simulasi dibuat terburu-buru dengan mock data statis tanpa mengacu pada interface Order yang baru diperbarui.',
      'Why 5: ROOT CAUSE: Tidak adanya sinkronisasi pembaruan skema data (contract drift) saat menambahkan field invoice_number & tax_rate, serta pengabaian defensive programming pada lifecycle cleanup.',
    ],
    fishbone: {
      people: 'Asumsi bahwa seluruh peramban web selalu menyediakan BroadcastChannel aktif tanpa fallback.',
      method: 'Refactoring interface Order (penambahan nomor faktur & pajak) tidak diperiksa silang ke generator mock data.',
      machine: 'Strict Null Checking pada TypeScript compiler (tsconfig strict mode).',
      measurement: 'Ketiadaan static analysis automated check sebelum deployment.',
    },
    rootCause:
      'Pengabaian null-safety guard pada event listener cleanup dan kegagalan sinkronisasi skema data (contract drift) saat penambahan field invoice_number, discount_percent, dan tax_rate pada entitas pesanan.',
    correctiveAction:
      '1. Menambahkan guard safety pada cleanup hook: if (realtimeChannel) { realtimeChannel.removeEventListener(...) }.\n2. Melengkapi objek pesanan di simulateIncomingQrisOrder dengan invoice_number otomatis format INV/UNUGHA/YYYYMMDD/XXX, discount_percent: 0, tax_rate: 0, dan payment_method: "QRIS".\n3. Memperbaiki pemanggilan linter sehingga tsc --noEmit lulus dengan 0 kesalahan.',
    preventiveAction:
      'Mewajibkan eksekusi perintah lint_applet / tsc --noEmit setiap kali terjadi penambahan atau modifikasi tipe data pada interface global.',
    codeBefore: `// SEBELUM PERBAIKAN (FAULT):
// 1. Unsafe cleanup hook:
return () => {
  realtimeChannel.removeEventListener('message', handleMessage); // CRASH jika null!
};

// 2. Missing fields di store:
const newOrder: Order = {
  id: orderId,
  // TIDAK ADA invoice_number!
  // TIDAK ADA discount_percent!
  // TIDAK ADA tax_rate!
  payment_method: 'QRIS Kampus', // Type Error!
};`,
    codeAfter: `// SETELAH PERBAIKAN (RESOLVED):
// 1. Safe cleanup hook:
return () => {
  if (realtimeChannel) {
    realtimeChannel.removeEventListener('message', handleMessage);
  }
  window.removeEventListener('storage', handleStorage);
};

// 2. Complete payload di store:
const newOrder: Order = {
  id: orderId,
  invoice_number: invoiceNumber,
  discount_percent: 0,
  tax_rate: 0,
  payment_method: 'QRIS',
  ...
};`,
  },

  {
    id: 'defect-4',
    code: 'FAULT-04 / BUG-STK-004 (BONUS)',
    title: 'Potensi Over-Selling Porsi Makanan Tanpa Batas Maksimum Stok di Keranjang POS',
    severity: 'MEDIUM',
    location: 'src/components/kasir/CartSidebar.tsx & src/stores/useFoodcourtStore.ts',
    symptoms:
      'Kasir dapat menekan tombol tambah porsi (+) secara berulang-ulang melampaui sisa stok menu yang tersedia di stan dapur. Contoh: Ayam Geprek hanya tersisa 2 porsi, namun kasir dapat memasukkan 10 porsi ke nota.',
    impact:
      'Dapur stan menerima pesanan makanan yang bahan bakunya sudah habis. Hal ini mengakibatkan pembatalan pesanan manual, kekecewaan pelanggan, dan selisih pembukuan kasir.',
    fiveWhys: [
      'Why 1: Mengapa kasir bisa menjual 10 porsi padahal stok hanya 2? Karena tombol (+) tidak memiliki atribut disabled saat kuantitas mencapai stok.',
      'Why 2: Mengapa tombol (+) tidak dinonaktifkan? Karena tombol hanya mengecek onClick updateCartQuantity tanpa memeriksa relasi item.quantity >= item.menu.stock.',
      'Why 3: Mengapa store mengizinkan penambahan? Karena logika addToCart dan updateCartQuantity belum dilengkapi guard clause sisa stok.',
      'Why 4: Mengapa validasi stok dilewati? Karena fokus awal pengembangan hanya pada penambahan item ke array keranjang.',
      'Why 5: ROOT CAUSE: Tidak adanya validasi batas atas stok (upper-bound boundary check) pada level interaksi UI keranjang kasir.',
    ],
    fishbone: {
      people: 'Kasir tidak memperhatikan label sisa stok porsi pada kartu menu.',
      method: 'Alur checkout POS tidak menerapkan pengecekan ketersediaan inventaris sebelum nota disimpan.',
      machine: 'Sistem penyimpanan lokal (local state) tidak membatasi kuantitas maksimum per baris belanja.',
      measurement: 'Ketiadaan visual feedback (stok habis / kuantitas maksimal) pada tombol kuantitas keranjang.',
    },
    rootCause:
      'Ketiadaan boundary validation kuantitas terhadap sisa stok (item.quantity >= item.menu.stock) baik pada handler tombol UI maupun logika mutasi state Zustand.',
    correctiveAction:
      '1. Menambahkan atribut disabled pada tombol (+) di keranjang jika item.quantity >= item.menu.stock.\n2. Memberikan styling visual non-aktif (warna abu-abu & cursor-not-allowed).\n3. Memperbarui logika updateCartQuantity di store agar mengabaikan penambahan jika kuantitas melebihi stok.',
    preventiveAction:
      'Menerapkan validasi ganda (defense-in-depth): validasi di level UI tombol dan validasi di level reducer/action checkout.',
    codeBefore: `// SEBELUM PERBAIKAN:
<button onClick={() => updateCartQuantity(item.menu.id, 1)}>
  <Plus />
</button>`,
    codeAfter: `// SETELAH PERBAIKAN:
<button
  disabled={item.quantity >= item.menu.stock}
  onClick={() => updateCartQuantity(item.menu.id, 1)}
  className={item.quantity >= item.menu.stock ? 'bg-slate-100 text-slate-300 cursor-not-allowed' : 'bg-emerald-100 text-emerald-800'}
>
  <Plus />
</button>`,
  },
];

export const RcaReportSection: React.FC = () => {
  const [selectedDefectId, setSelectedDefectId] = useState<string>('defect-1');
  const [copiedAll, setCopiedAll] = useState<boolean>(false);

  const activeDefect =
    DEFECT_LIST.find((d) => d.id === selectedDefectId) || DEFECT_LIST[0];

  const handleCopyMarkdownReport = async () => {
    let md = `# LAPORAN DEFECT & ROOT CAUSE ANALYSIS (RCA)\n`;
    md += `Sistem Kasir Sentral Foodcourt UNUGHA Cilacap\n`;
    md += `Pengembang: Asngad (asngad@mhs.unugha.ac.id)\n\n`;

    DEFECT_LIST.forEach((d, idx) => {
      md += `## ${idx + 1}. [${d.code}] ${d.title}\n`;
      md += `- **Severity:** ${d.severity}\n`;
      md += `- **Lokasi File:** ${d.location}\n`;
      md += `- **Gejala (Symptoms):** ${d.symptoms}\n`;
      md += `- **Dampak (Impact):** ${d.impact}\n\n`;
      md += `### Metode 5-Whys:\n`;
      d.fiveWhys.forEach((w) => (md += `- ${w}\n`));
      md += `\n### Analisis Fishbone (Ishikawa):\n`;
      md += `- People: ${d.fishbone.people}\n`;
      md += `- Method: ${d.fishbone.method}\n`;
      md += `- Machine/Code: ${d.fishbone.machine}\n`;
      md += `- Measurement: ${d.fishbone.measurement}\n\n`;
      md += `### Akar Masalah (Root Cause):\n${d.rootCause}\n\n`;
      md += `### Tindakan Korektif (Corrective Action):\n${d.correctiveAction}\n\n`;
      md += `### Tindakan Pencegahan (Preventive Action / CAPA):\n${d.preventiveAction}\n\n`;
      md += `### Bukti Kode Sebelum vs Sesudah:\n`;
      md += `\`\`\`tsx\n${d.codeBefore}\n\`\`\`\n`;
      md += `\`\`\`tsx\n${d.codeAfter}\n\`\`\`\n\n`;
      md += `---\n\n`;
    });

    try {
      await navigator.clipboard.writeText(md);
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 3000);
    } catch {
      // fallback
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-xs font-bold bg-rose-100 text-rose-800 rounded">
              QA &amp; RCA Report
            </span>
            <h2 className="text-xl font-bold text-slate-900 font-display">
              Catatan Defect / Fault &amp; Root Cause Analysis (RCA)
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Dokumentasi pengujian perangkat lunak, investigasi 5-Whys, diagram Ishikawa, dan matriks CAPA Kasir Foodcourt UNUGHA
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button
            type="button"
            onClick={handleCopyMarkdownReport}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            {copiedAll ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Laporan Tersalin!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Salin Laporan Format Markdown</span>
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak Dokumen</span>
          </button>
        </div>
      </div>

      {/* Program & Repository Overview Card */}
      <div className="p-5 bg-gradient-to-r from-slate-900 to-slate-950 text-white rounded-xl border border-slate-800 shadow-xs">
        <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase mb-2">
          <GitBranch className="w-4 h-4" />
          <span>Informasi Program &amp; Arsitektur Repositori</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs mt-3 pt-3 border-t border-slate-800">
          <div>
            <span className="text-slate-400 block text-[11px]">Nama Aplikasi:</span>
            <span className="font-bold text-white text-sm">Kasir Foodcourt UNUGHA</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Stack Teknologi:</span>
            <span className="font-medium text-slate-200">React 19 · TypeScript · Tailwind CSS · Zustand</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Metode Sinkronisasi:</span>
            <span className="font-medium text-emerald-300">BroadcastChannel API (Real-Time)</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Total Fault Teridentifikasi:</span>
            <span className="font-bold text-rose-400 text-sm">4 Defect (Semua Resolved 100%)</span>
          </div>
        </div>
      </div>

      {/* Defect Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {DEFECT_LIST.map((d) => {
          const isSelected = selectedDefectId === d.id;
          return (
            <button
              key={d.id}
              type="button"
              onClick={() => setSelectedDefectId(d.id)}
              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-slate-900 text-white border-slate-900 shadow-sm ring-1 ring-slate-900'
                  : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className={`text-[10px] font-bold font-mono-tabular px-1.5 py-0.5 rounded ${
                      isSelected
                        ? 'bg-white/20 text-emerald-300'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {d.code.split(' / ')[0]}
                  </span>
                  <span
                    className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase ${
                      d.severity === 'CRITICAL'
                        ? 'bg-rose-500 text-white'
                        : d.severity === 'HIGH'
                        ? 'bg-amber-500 text-white'
                        : 'bg-blue-500 text-white'
                    }`}
                  >
                    {d.severity}
                  </span>
                </div>
                <h4 className="text-xs font-bold line-clamp-2 leading-snug">
                  {d.title}
                </h4>
              </div>
              <span
                className={`text-[10px] mt-2 font-mono-tabular truncate ${
                  isSelected ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                {d.location.split(' & ')[0]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected Defect Detail Card */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        {/* Card Header */}
        <div className="p-6 bg-slate-50/70 border-b border-slate-200 flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2 py-0.5 text-xs font-bold font-mono-tabular bg-slate-200 text-slate-800 rounded">
              {activeDefect.code}
            </span>
            <span
              className={`px-2 py-0.5 text-xs font-extrabold rounded uppercase ${
                activeDefect.severity === 'CRITICAL'
                  ? 'bg-rose-100 text-rose-800 border border-rose-300'
                  : activeDefect.severity === 'HIGH'
                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                  : 'bg-blue-100 text-blue-800 border border-blue-300'
              }`}
            >
              Severity: {activeDefect.severity}
            </span>
            <span className="px-2 py-0.5 text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 rounded">
              Status: RESOLVED &amp; VERIFIED
            </span>
          </div>
          <h3 className="text-lg font-bold text-slate-900 font-display mt-1">
            {activeDefect.title}
          </h3>
          <p className="text-xs text-slate-500 font-mono-tabular">
            File Location: <code>{activeDefect.location}</code>
          </p>
        </div>

        {/* Card Body */}
        <div className="p-6 flex flex-col gap-6 text-xs">
          {/* Gejala & Dampak */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-rose-50/60 border border-rose-200 rounded-xl">
              <span className="font-bold text-rose-900 block mb-1">
                🔍 Gejala (Symptoms / Defect Behavior):
              </span>
              <p className="text-slate-700 leading-relaxed text-xs">
                {activeDefect.symptoms}
              </p>
            </div>

            <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-xl">
              <span className="font-bold text-amber-900 block mb-1">
                💥 Dampak Operasional (Operational Impact):
              </span>
              <p className="text-slate-700 leading-relaxed text-xs">
                {activeDefect.impact}
              </p>
            </div>
          </div>

          {/* Root Cause Analysis (5-Whys) */}
          <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                5W
              </span>
              <h4 className="font-bold text-slate-900 text-sm">
                Analisis Metodologi 5-Whys (Mengapa Terjadi):
              </h4>
            </div>
            <div className="space-y-2 mt-1">
              {activeDefect.fiveWhys.map((step, idx) => (
                <div
                  key={idx}
                  className={`p-2.5 rounded-lg border text-xs leading-relaxed ${
                    idx === activeDefect.fiveWhys.length - 1
                      ? 'bg-rose-50 border-rose-300 text-rose-950 font-semibold'
                      : 'bg-white border-slate-200 text-slate-700'
                  }`}
                >
                  {step}
                </div>
              ))}
            </div>
          </div>

          {/* Ishikawa Fishbone Diagram */}
          <div className="p-5 bg-white border border-slate-200 rounded-xl flex flex-col gap-3">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <span>🐟 Diagram Tulang Ikan (Fishbone / Ishikawa Matrix):</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="font-bold text-slate-800 block text-[11px] uppercase mb-1">
                  1. People (Manusia)
                </span>
                <p className="text-slate-600">{activeDefect.fishbone.people}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="font-bold text-slate-800 block text-[11px] uppercase mb-1">
                  2. Method (Metode)
                </span>
                <p className="text-slate-600">{activeDefect.fishbone.method}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="font-bold text-slate-800 block text-[11px] uppercase mb-1">
                  3. Machine (Teknologi/Kode)
                </span>
                <p className="text-slate-600">{activeDefect.fishbone.machine}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="font-bold text-slate-800 block text-[11px] uppercase mb-1">
                  4. Measurement (Pengujian)
                </span>
                <p className="text-slate-600">
                  {activeDefect.fishbone.measurement}
                </p>
              </div>
            </div>
          </div>

          {/* Root Cause, Corrective Action & CAPA */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl flex flex-col justify-between">
              <div>
                <span className="font-bold text-emerald-950 block text-xs uppercase mb-1.5 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>Tindakan Korektif (Corrective Action Telah Dilakukan):</span>
                </span>
                <p className="text-emerald-900 text-xs whitespace-pre-line leading-relaxed">
                  {activeDefect.correctiveAction}
                </p>
              </div>
            </div>

            <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl flex flex-col justify-between">
              <div>
                <span className="font-bold text-blue-950 block text-xs uppercase mb-1.5 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-blue-700" />
                  <span>Tindakan Pencegahan (Preventive Action / CAPA):</span>
                </span>
                <p className="text-blue-900 text-xs leading-relaxed">
                  {activeDefect.preventiveAction}
                </p>
              </div>
            </div>
          </div>

          {/* Code Before vs After Diff */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="px-4 py-2.5 bg-slate-900 text-white flex items-center justify-between text-xs font-mono-tabular">
              <span className="font-semibold text-emerald-400">
                Bukti Kode Perbaikan (Code Diff Verification)
              </span>
              <span className="text-slate-400">Before (Fault) vs After (Fixed)</span>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-200 text-[11px] font-mono-tabular">
              <div className="p-4 bg-rose-50/40 text-slate-800 overflow-x-auto">
                <span className="text-[10px] font-bold text-rose-700 uppercase block mb-2">
                  ❌ SEBELUM PERBAIKAN (FAULT KODE):
                </span>
                <pre className="whitespace-pre-wrap">{activeDefect.codeBefore}</pre>
              </div>
              <div className="p-4 bg-emerald-50/40 text-slate-800 overflow-x-auto">
                <span className="text-[10px] font-bold text-emerald-800 uppercase block mb-2">
                  ✓ SESUDAH PERBAIKAN (KODE TERVALIDASI):
                </span>
                <pre className="whitespace-pre-wrap">{activeDefect.codeAfter}</pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
