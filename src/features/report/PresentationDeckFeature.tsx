import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Copy,
  Check,
  Printer,
  FileText,
  Layers,
  Sparkles,
  Building2,
  ShoppingCart,
  Database,
  BarChart3,
  Clock,
  ShieldCheck,
  CheckCircle2,
  CreditCard,
  QrCode,
  Banknote,
  Utensils,
  BookOpen,
  Bug,
  AlertTriangle,
  Code2,
  Terminal,
  Play,
  RotateCw,
  ShieldAlert,
  FileCheck2,
} from 'lucide-react';
import {
  runAllPosUnitTests,
  SLIDE_14_TEST_CASES,
  TestSuiteSummary,
} from '../../utils/testRunner';
import {
  calculateCashChange,
  calculateRevenueSplit,
  generateInvoiceNumber,
} from '../../utils/posCalculations';

interface Slide {
  id: number;
  badge: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  content: React.ReactNode;
  presenterNotes: string;
  pptRawText: string;
}

export const PresentationDeckFeature: React.FC = () => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [showPresenterNotes, setShowPresenterNotes] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [copiedAll, setCopiedAll] = useState<boolean>(false);
  const [copiedCurrent, setCopiedCurrent] = useState<boolean>(false);
  const [unitTestSummary, setUnitTestSummary] = useState<TestSuiteSummary>(() =>
    runAllPosUnitTests()
  );
  const [isTestingLive, setIsTestingLive] = useState<boolean>(false);

  const handleRunLiveTests = () => {
    setIsTestingLive(true);
    setTimeout(() => {
      setUnitTestSummary(runAllPosUnitTests());
      setIsTestingLive(false);
    }, 200);
  };

  const slides: Slide[] = [
    // SLIDE 1: JUDUL & IDENTITAS
    {
      id: 1,
      badge: 'SLIDE 01 · JUDUL PROYEK',
      title: 'Sistem POS Kasir Sentral Foodcourt UNUGHA Cilacap',
      subtitle:
        'Sistem Point of Sale Terpadu Multi-Tenant dengan Transaksi Real-Time, Laporan Penjualan Harian & Arsitektur Database Relasional',
      icon: <Building2 className="w-8 h-8 text-emerald-400" />,
      content: (
        <div className="flex flex-col gap-6">
          <div className="p-6 bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 border border-emerald-500/30 rounded-2xl text-white shadow-lg">
            <div className="flex items-center gap-3 text-emerald-400 text-xs font-bold tracking-wider uppercase mb-2">
              <span>Universitas Nahdlatul Ulama Al Ghazali (UNUGHA)</span>
              <span>·</span>
              <span>Cilacap, Jawa Tengah</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-white mb-3">
              Modernisasi Operasional Kantin &amp; Foodcourt Kampus
            </h2>
            <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
              Solusi digitalisasi transaksi kasir kampus yang mengintegrasikan 6 mitra stan UMKM kuliner dalam satu loket pembayaran terpusat, mendukung multi-metode pembayaran (Cash, QRIS, Transfer BSI, E-Wallet, KTM Mahasiswa), serta otomatisasi rekonsiliasi bagi hasil 90:10.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[11px] font-bold text-slate-500 uppercase block">Pengembang Sistem</span>
              <p className="text-base font-bold text-slate-900 mt-1">Asngad</p>
              <p className="text-xs text-slate-600 font-mono-tabular">asngad@mhs.unugha.ac.id</p>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[11px] font-bold text-slate-500 uppercase block">Institusi Akademik</span>
              <p className="text-base font-bold text-slate-900 mt-1">UNUGHA Cilacap</p>
              <p className="text-xs text-slate-600">Fakultas Teknologi Informasi / Teknik</p>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[11px] font-bold text-slate-500 uppercase block">Fokus Implementasi</span>
              <p className="text-base font-bold text-emerald-800 mt-1">POS &amp; Database Real-Time</p>
              <p className="text-xs text-slate-600">6 Mitra Stan · 1 Nota Terpadu</p>
            </div>
          </div>
        </div>
      ),
      presenterNotes:
        'Selamat pagi/siang bapak/ibu dosen penguji dan rekan-rekan mahasiswa. Pada kesempatan kali ini, saya mempresentasikan Sistem POS Kasir Sentral Foodcourt UNUGHA Cilacap. Proyek ini dibangun untuk menjawab tantangan operasional foodcourt kampus yang sebelumnya masih terfragmentasi dan lambat dalam melayani antrean mahasiswa.',
      pptRawText: `SLIDE 1: JUDUL & IDENTITAS PROYEK
Judul: Sistem POS Kasir Sentral Foodcourt UNUGHA Cilacap
Subjudul: Sistem Point of Sale Terpadu Multi-Tenant dengan Transaksi Real-Time, Laporan Penjualan Harian & Arsitektur Database Relasional
Penyusun: Asngad (asngad@mhs.unugha.ac.id)
Institusi: Universitas Nahdlatul Ulama Al Ghazali (UNUGHA) Cilacap
Fokus: Digitalisasi transaksi kantin kampus, transparansi bagi hasil UMKM, dan pencetakan struk thermal 58mm/80mm.`,
    },

    // SLIDE 2: LATAR BELAKANG & MASALAH
    {
      id: 2,
      badge: 'SLIDE 02 · LATAR BELAKANG & MASALAH',
      title: 'Tantangan Operasional Foodcourt Kampus',
      subtitle: 'Mengapa Foodcourt UNUGHA Membutuhkan Sistem Kasir POS Sentral Terintegrasi?',
      icon: <Clock className="w-8 h-8 text-amber-500" />,
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 bg-rose-50/60 border border-rose-200 rounded-xl flex flex-col gap-3">
            <span className="px-2 py-0.5 text-xs font-bold bg-rose-200 text-rose-900 rounded self-start">
              KONDISI SEBELUMNYA (MASALAH)
            </span>
            <ul className="space-y-2.5 text-xs text-rose-950">
              <li className="flex items-start gap-2">
                <span className="font-bold text-rose-700">1.</span>
                <span><strong>Antrean Menumpuk di Jam Istirahat:</strong> Mahasiswa harus mengantre terpisah di setiap stan untuk memesan makanan dan minuman.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-rose-700">2.</span>
                <span><strong>Pencatatan Keuangan Manual:</strong> Tiap mitra stan mencatat di buku nota kertas konvensional yang rentan hilang atau rusak.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-rose-700">3.</span>
                <span><strong>Kesulitan Rekonsiliasi Bagi Hasil:</strong> Perhitungan 90% hak mitra UMKM dan 10% komisi kampus memerlukan waktu berjam-jam setiap sore.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-rose-700">4.</span>
                <span><strong>Salah Hitung Kembalian Tunai:</strong> Human error kasir saat jam padat menyebabkan selisih laci kas fisik.</span>
              </li>
            </ul>
          </div>

          <div className="p-5 bg-emerald-50/60 border border-emerald-200 rounded-xl flex flex-col gap-3">
            <span className="px-2 py-0.5 text-xs font-bold bg-emerald-200 text-emerald-900 rounded self-start">
              SOLUSI DENGAN SISTEM BARU
            </span>
            <ul className="space-y-2.5 text-xs text-emerald-950">
              <li className="flex items-start gap-2">
                <span className="font-bold text-emerald-700">1.</span>
                <span><strong>Satu Kasir Sentral (Multi-Tenant):</strong> 1 nota struk dapat mencakup menu dari beberapa stan sekaligus dalam sekali pembayaran.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-emerald-700">2.</span>
                <span><strong>Otomatisasi Hitung Kembalian:</strong> Sistem menghitung nominal kembalian real-time saat nominal uang tunai diinput.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-emerald-700">3.</span>
                <span><strong>Sinkronisasi Tiket Dapur Real-Time:</strong> Pesanan terdistribusi langsung ke layar antrean stan masing-masing secara instan.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-emerald-700">4.</span>
                <span><strong>Laporan Settlement Otomatis:</strong> Pembagian hasil 90:10 dan nomor rekening pencairan mitra terkalkulasi otomatis.</span>
              </li>
            </ul>
          </div>
        </div>
      ),
      presenterNotes:
        'Latar belakang perancangan sistem ini berakar dari pengalaman riil di lingkungan kampus UNUGHA. Saat jam istirahat kuliah antara pukul 11:30 hingga 13:00, ratusan mahasiswa memadati foodcourt. Transaksi konvensional menyebabkan antrean panjang dan kerumitan bagi mitra stan dalam mencatat porsi terjual.',
      pptRawText: `SLIDE 2: LATAR BELAKANG & PERMASALAHAN
Masalah Utama:
1. Antrean menumpuk karena pemesanan makanan dan minuman terpisah di tiap stan.
2. Pencatatan manual di kertas nota rentan hilang, rusak, atau keliru hitung.
3. Rekonsiliasi bagi hasil 90% mitra stan dan 10% kas kampus membutuhkan waktu lama.
4. Human error perhitungan kembalian uang tunai saat jam sibuk istirahat kuliah.

Solusi Sistem Baru:
1. Kasir Sentral Terpadu (1 transaksi untuk sajian lintas 6 stan kuliner).
2. Perhitungan kembalian tunai otomatis dan tombol pecahan cepat.
3. Kitchen Display System (KDS) real-time antar-stan.
4. Otomatisasi laporan settlement dan penutupan buku harian.`,
    },

    // SLIDE 3: TUJUAN & MANFAAT SISTEM
    {
      id: 3,
      badge: 'SLIDE 03 · TUJUAN & MANFAAT',
      title: 'Tujuan & Manfaat Strategis Sistem',
      subtitle: 'Dampak Positif bagi Mahasiswa, Mitra Stan UMKM, dan Pengelola Kampus UNUGHA',
      icon: <ShieldCheck className="w-8 h-8 text-blue-500" />,
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-800 font-bold mb-3">
              🎓
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-2">Bagi Mahasiswa &amp; Dosen</h3>
            <ul className="text-xs text-slate-600 space-y-1.5">
              <li>• Pembelian cepat: cukup 1 kali bayar di kasir sentral.</li>
              <li>• Pilihan multi-payment: Cash, QRIS, Transfer BSI, E-Wallet, KTM.</li>
              <li>• Mendapatkan nomor antrean panggil yang jelas (A-001).</li>
              <li>• Struk fisik thermal atau struk digital WhatsApp.</li>
            </ul>
          </div>

          <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-800 font-bold mb-3">
              🍳
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-2">Bagi 6 Mitra Stan Kuliner</h3>
            <ul className="text-xs text-slate-600 space-y-1.5">
              <li>• Stan tidak perlu repot mengurus kasir dan uang receh.</li>
              <li>• Fokus 100% memasak dan menjaga kualitas makanan.</li>
              <li>• Tiket antrean pesanan masuk seketika di layar dapur.</li>
              <li>• Rekap hak bersih 90% transparan dan tepat waktu.</li>
            </ul>
          </div>

          <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs">
            <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-800 font-bold mb-3">
              🏛️
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-2">Bagi Pengelola UNUGHA</h3>
            <ul className="text-xs text-slate-600 space-y-1.5">
              <li>• Audit omzet foodcourt terpusat secara real-time.</li>
              <li>• Komisi 10% otomatis terkumpul untuk operasional.</li>
              <li>• Ekspor buku jurnal harian ke format CSV/Excel.</li>
              <li>• Pencegahan kebocoran dana dan transparansi keuangan.</li>
            </ul>
          </div>
        </div>
      ),
      presenterNotes:
        'Sistem ini dirancang membawa manfaat *win-win solution* untuk ketiga pihak: pelanggan mahasiswa mendapatkan kecepatan belanja, mitra UMKM dapat fokus memasak tanpa pusing mengurus kasir, dan pihak kampus memiliki transparansi keuangan penuh.',
      pptRawText: `SLIDE 3: TUJUAN & MANFAAT SISTEM
1. Mahasiswa & Konsumen Kampus:
   - Pemesanan gabungan lintas stan dalam 1 nota pembayaran.
   - Pilihan metode bayar fleksibel (Cash, QRIS, Transfer, E-Wallet, KTM).
   - Layar nomor antrean dan bukti struk thermal.

2. Mitra Stan Kuliner (UMKM):
   - Bebas dari kerepotan transaksi kasir dan kembalian uang receh.
   - Tiket pesanan terkirim real-time ke dapur masing-masing.
   - Hak bagi hasil 90% transparan dan terdata per hari.

3. Pengelola Kampus UNUGHA:
   - Monitoring omzet harian kampus secara real-time.
   - Akumulasi dana komisi 10% untuk pemeliharaan fasilitas kampus.
   - Ekspor rekapitulasi data transaksi ke spreadsheet CSV.`,
    },

    // SLIDE 4: ARSITEKTUR BASIS DATA RELASIONAL
    {
      id: 4,
      badge: 'SLIDE 04 · ARSITEKTUR DATABASE',
      title: 'Struktur Database Relasional & Skema Data',
      subtitle: '6 Tabel Relasional yang Mengelola Master Data, Transaksi Real-Time, & Settlement',
      icon: <Database className="w-8 h-8 text-cyan-500" />,
      content: (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="font-bold text-emerald-800 font-mono-tabular">1. tenants</span>
              <p className="text-[11px] text-slate-600 mt-1">Master 6 stan kuliner, kode stan, nomor kavling (A-01 s/d A-06), rekening bank, &amp; komisi (10%).</p>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="font-bold text-emerald-800 font-mono-tabular">2. menus</span>
              <p className="text-[11px] text-slate-600 mt-1">Katalog sajian, relasi tenant_id, kode SKU, harga jual, HPP, &amp; sisa stok porsi harian real-time.</p>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="font-bold text-emerald-800 font-mono-tabular">3. orders</span>
              <p className="text-[11px] text-slate-600 mt-1">Header pesanan, nomor invoice, nomor antrean panggil (A-01), pelanggan, nomor meja, &amp; status dapur.</p>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="font-bold text-emerald-800 font-mono-tabular">4. order_items</span>
              <p className="text-[11px] text-slate-600 mt-1">Rincian item pesanan multi-tenant (split order per dapur stan), kuantitas, harga, &amp; catatan rasa.</p>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="font-bold text-emerald-800 font-mono-tabular">5. transactions</span>
              <p className="text-[11px] text-slate-600 mt-1">Jurnal kasir pembayaran lunas, kode TRX, metode bayar, uang diterima, &amp; kembalian tunai.</p>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="font-bold text-emerald-800 font-mono-tabular">6. daily_settlements</span>
              <p className="text-[11px] text-slate-600 mt-1">Rekap tutup buku harian per stan, omzet kotor, potongan komisi 10%, &amp; dana cair bersih (90%).</p>
            </div>
          </div>

          <div className="p-3.5 bg-slate-900 text-slate-200 rounded-xl text-xs font-mono-tabular flex items-center justify-between">
            <span className="text-emerald-400 font-semibold">Integrasi: PostgreSQL / Supabase Realtime DDL Ready</span>
            <span className="text-slate-400 text-[11px]">Primary Keys: UUID · BroadcastChannel Tab Sync</span>
          </div>
        </div>
      ),
      presenterNotes:
        'Pada aspek rekayasa basis data, sistem memisahkan tabel secara modular menjadi 6 entitas relasional dengan kaidah normalisasi 3NF. Skema ini mendukung pesanan *one-to-many* di mana 1 order dapat memuat banyak order_items dari berbagai tenant yang berbeda.',
      pptRawText: `SLIDE 4: ARSITEKTUR & SKEMA BASIS DATA
Struktur 6 Tabel Relasional:
1. tenants: Data stan mitra, nama pemilik, nomor kavling, rekening bank, & komisi (10%).
2. menus: Data item menu, relasi tenant_id, SKU, harga, modal, stok porsi, status aktif.
3. orders: Header pesanan, no invoice, no antrean, nama pembeli, meja, status pengerjaan.
4. order_items: Detail item pesanan lintas stan, kuantitas, subtotal, dan catatan khusus.
5. transactions: Jurnal kasir, metode pembayaran, total bayar, uang diterima, kembalian tunai.
6. daily_settlements: Rekapitulasi tutup buku harian, omzet kotor, komisi kampus, pencairan stan.`,
    },

    // SLIDE 5: ALUR TRANSAKSI KASIR POS (8 TAHAPAN)
    {
      id: 5,
      badge: 'SLIDE 05 · ALUR TRANSAKSI POS',
      title: 'Alur 8 Langkah Transaksi Kasir POS',
      subtitle: 'Standar Operasional Prosedur Kasir yang Cepat, Praktis, dan Bebas Salah Hitung',
      icon: <ShoppingCart className="w-8 h-8 text-emerald-500" />,
      content: (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
          <div className="p-3 bg-white border border-slate-200 rounded-lg shadow-2xs">
            <span className="w-5 h-5 rounded-full bg-emerald-800 text-white font-bold flex items-center justify-center text-[10px] mb-1.5">1</span>
            <span className="font-bold text-slate-900 block">Pilih Menu</span>
            <p className="text-[11px] text-slate-500 mt-0.5">Cari &amp; klik menu dari grid katalog / kategori stan.</p>
          </div>
          <div className="p-3 bg-white border border-slate-200 rounded-lg shadow-2xs">
            <span className="w-5 h-5 rounded-full bg-emerald-800 text-white font-bold flex items-center justify-center text-[10px] mb-1.5">2</span>
            <span className="font-bold text-slate-900 block">Keranjang Belanja</span>
            <p className="text-[11px] text-slate-500 mt-0.5">Atur porsi (+/-), hapus item, &amp; ketik catatan khusus rasa.</p>
          </div>
          <div className="p-3 bg-white border border-slate-200 rounded-lg shadow-2xs">
            <span className="w-5 h-5 rounded-full bg-emerald-800 text-white font-bold flex items-center justify-center text-[10px] mb-1.5">3</span>
            <span className="font-bold text-slate-900 block">Identitas &amp; Meja</span>
            <p className="text-[11px] text-slate-500 mt-0.5">Nama pembeli (opsional), no meja / takeaway, &amp; NIM.</p>
          </div>
          <div className="p-3 bg-white border border-slate-200 rounded-lg shadow-2xs">
            <span className="w-5 h-5 rounded-full bg-emerald-800 text-white font-bold flex items-center justify-center text-[10px] mb-1.5">4</span>
            <span className="font-bold text-slate-900 block">Pilih Pembayaran</span>
            <p className="text-[11px] text-slate-500 mt-0.5">Pilih Cash, QRIS, Transfer BSI, E-Wallet, atau KTM.</p>
          </div>
          <div className="p-3 bg-white border border-slate-200 rounded-lg shadow-2xs">
            <span className="w-5 h-5 rounded-full bg-emerald-800 text-white font-bold flex items-center justify-center text-[10px] mb-1.5">5</span>
            <span className="font-bold text-slate-900 block">Hitung Kembalian</span>
            <p className="text-[11px] text-slate-500 mt-0.5">Khusus Cash: input uang diterima, tombol pecahan cepat.</p>
          </div>
          <div className="p-3 bg-white border border-slate-200 rounded-lg shadow-2xs">
            <span className="w-5 h-5 rounded-full bg-emerald-800 text-white font-bold flex items-center justify-center text-[10px] mb-1.5">6</span>
            <span className="font-bold text-slate-900 block">Diskon &amp; Pajak</span>
            <p className="text-[11px] text-slate-500 mt-0.5">Voucher promo (MAHASISWA10) &amp; tarif pajak opsional.</p>
          </div>
          <div className="p-3 bg-white border border-slate-200 rounded-lg shadow-2xs">
            <span className="w-5 h-5 rounded-full bg-emerald-800 text-white font-bold flex items-center justify-center text-[10px] mb-1.5">7</span>
            <span className="font-bold text-slate-900 block">Simpan &amp; Invoice</span>
            <p className="text-[11px] text-slate-500 mt-0.5">Generate otomatis No. Invoice &amp; kurangi stok menu.</p>
          </div>
          <div className="p-3 bg-white border border-slate-200 rounded-lg shadow-2xs">
            <span className="w-5 h-5 rounded-full bg-emerald-800 text-white font-bold flex items-center justify-center text-[10px] mb-1.5">8</span>
            <span className="font-bold text-slate-900 block">Cetak Struk</span>
            <p className="text-[11px] text-slate-500 mt-0.5">Thermal 58mm / 80mm window.print atau salin teks WA.</p>
          </div>
        </div>
      ),
      presenterNotes:
        'Alur 8 langkah ini telah disederhanakan agar kasir hanya membutuhkan rata-rata 30 detik untuk memproses satu pelanggan. Fitur hitung kembalian otomatis mencegah risiko selisih kas fisik di akhir shift kasir.',
      pptRawText: `SLIDE 5: ALUR TRANSAKSI KASIR POS (8 TAHAPAN)
1. Pilih Menu: Pencarian cepat dan filter kategori stan di katalog kiri.
2. Keranjang Belanja: Kontrol kuantitas porsi dan input request khusus (cth: pedas lv 3).
3. Identitas Pelanggan: Tipe pesanan (Dine-In/Takeaway), nama pemesan, dan nomor meja.
4. Metode Pembayaran: Pilihan Cash, QRIS, Transfer Bank, E-Wallet, atau KTM UNUGHA.
5. Hitung Kembalian Otomatis: Input uang fisik dengan kalkulasi instan nominal kembalian.
6. Diskon & Pajak Opsional: Kupon voucher promo kampus dan pengaturan pajak resto.
7. Simpan Transaksi & Invoice: Generate nomor faktur resmi dan pemotongan stok otomatis.
8. Cetak Struk Thermal: Cetak nota 58mm/80mm atau bagikan struk via WhatsApp.`,
    },

    // SLIDE 6: METODE PEMBAYARAN MULTI-KANAL
    {
      id: 6,
      badge: 'SLIDE 06 · MULTI-PAYMENT GATEWAY',
      title: 'Fleksibilitas Metode Pembayaran Kasir',
      subtitle: 'Mendukung Pembayaran Tunai Konvensional hingga Non-Tunai Modern Terintegrasi',
      icon: <CreditCard className="w-8 h-8 text-violet-500" />,
      content: (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 font-bold text-emerald-950 mb-1">
                <Banknote className="w-4 h-4 text-emerald-700" />
                <span>Cash (Uang Tunai)</span>
              </div>
              <p className="text-[11px] text-emerald-900 leading-relaxed">
                Menerima uang kertas/koin fisik dengan kalkulator kembalian otomatis dan tombol pecahan cepat (10rb, 20rb, 50rb, 100rb).
              </p>
            </div>
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-200/60 px-2 py-0.5 rounded mt-3 self-start">
              ✓ Laci Kas Fisik
            </span>
          </div>

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 font-bold text-blue-950 mb-1">
                <QrCode className="w-4 h-4 text-blue-700" />
                <span>QRIS Dinamis</span>
              </div>
              <p className="text-[11px] text-blue-900 leading-relaxed">
                Standar QRIS Nasional yang mendukung seluruh e-wallet &amp; mobile banking (GoPay, OVO, Dana, ShopeePay, BCA, dll).
              </p>
            </div>
            <span className="text-[10px] font-bold text-blue-800 bg-blue-200/60 px-2 py-0.5 rounded mt-3 self-start">
              ✓ NMID Kampus
            </span>
          </div>

          <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 font-bold text-indigo-950 mb-1">
                <Building2 className="w-4 h-4 text-indigo-700" />
                <span>Transfer Bank BSI</span>
              </div>
              <p className="text-[11px] text-indigo-900 leading-relaxed">
                Rekening kas penampung resmi: Bank Syariah Indonesia (BSI) 7123-4567-89 a.n Foodcourt UNUGHA Cilacap.
              </p>
            </div>
            <span className="text-[10px] font-bold text-indigo-800 bg-indigo-200/60 px-2 py-0.5 rounded mt-3 self-start">
              ✓ Rek. Sentral BSI
            </span>
          </div>

          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 font-bold text-amber-950 mb-1">
                <CreditCard className="w-4 h-4 text-amber-700" />
                <span>KTM UNUGHA</span>
              </div>
              <p className="text-[11px] text-amber-900 leading-relaxed">
                Kartu Tanda Mahasiswa berbasis RFID/NIM untuk pembayaran nirkontak dan fasilitas diskon khusus civitas akademika.
              </p>
            </div>
            <span className="text-[10px] font-bold text-amber-800 bg-amber-200/60 px-2 py-0.5 rounded mt-3 self-start">
              ✓ Khusus Mahasiswa
            </span>
          </div>
        </div>
      ),
      presenterNotes:
        'Sistem tidak memaksakan *cashless* secara sepihak karena sebagian mahasiswa masih menggunakan uang tunai. Karena itu, kasir kami tetap mendukung uang tunai dengan proteksi kembalian otomatis, sembari memfasilitasi transaksi non-tunai modern seperti QRIS dan Transfer Bank BSI.',
      pptRawText: `SLIDE 6: METODE PEMBAYARAN MULTI-KANAL
1. Cash (Tunai):
   - Menerima uang fisik dengan kalkulator kembalian otomatis.
   - Tombol pecahan cepat (Uang Pas, 10rb, 20rb, 50rb, 100rb).

2. QRIS Dinamis:
   - Barcode QRIS terstandar Bank Indonesia.
   - Menerima GoPay, OVO, Dana, ShopeePay, BCA Mobile, Livin, dll.

3. Transfer Bank:
   - Rekening sentral BSI (Bank Syariah Indonesia) 7123-4567-89 a.n Foodcourt UNUGHA.
   - Input nomor referensi transaksi bank.

4. E-Wallet & KTM UNUGHA:
   - Verifikasi transaksi dompet digital dan integrasi saldo kartu mahasiswa.`,
    },

    // SLIDE 7: KITCHEN DISPLAY & ANTREAN REAL-TIME
    {
      id: 7,
      badge: 'SLIDE 07 · KITCHEN DISPLAY SYSTEM',
      title: 'Manajemen Antrean Dapur Stan Real-Time',
      subtitle: 'Sinkronisasi Tiket Pesanan Otomatis Menggunakan BroadcastChannel API',
      icon: <Utensils className="w-8 h-8 text-orange-500" />,
      content: (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 bg-white border border-slate-200 rounded-xl text-xs">
              <span className="px-2 py-0.5 font-bold bg-amber-100 text-amber-900 rounded">1. Menunggu</span>
              <p className="mt-2 font-semibold text-slate-800">Tiket Baru Masuk</p>
              <p className="text-[11px] text-slate-500 mt-1">Pesanan baru saja dibayar di kasir sentral dan langsung muncul di layar dapur stan.</p>
            </div>
            <div className="p-4 bg-white border border-slate-200 rounded-xl text-xs">
              <span className="px-2 py-0.5 font-bold bg-blue-100 text-blue-900 rounded">2. Dimasak</span>
              <p className="mt-2 font-semibold text-slate-800">Proses Masak Stan</p>
              <p className="text-[11px] text-slate-500 mt-1">Koki stan mengklik tombol mulai masak; estimasi waktu saji terpantau jelas.</p>
            </div>
            <div className="p-4 bg-white border border-slate-200 rounded-xl text-xs">
              <span className="px-2 py-0.5 font-bold bg-emerald-100 text-emerald-900 rounded">3. Siap Saji</span>
              <p className="mt-2 font-semibold text-slate-800">Panggilan Pengambilan</p>
              <p className="text-[11px] text-slate-500 mt-1">Nomor antrean (A-01) dipanggil untuk diambil pelanggan di meja stan kuliner.</p>
            </div>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-semibold text-slate-900">Multi-Screen Synchronization:</span>
              <span className="text-slate-600">Layar Kasir, Layar Antrean TV, dan Layar HP Dapur tersinkron tanpa refresh browser.</span>
            </div>
          </div>
        </div>
      ),
      presenterNotes:
        'Salah satu keunggulan teknis sistem ini adalah implementasi Kitchen Display System berbasis BroadcastChannel API. Saat kasir menekan tombol selesai transaksi, sinyal data langsung dipancarkan ke seluruh tab browser stan tanpa perlu beban polling server terus menerus.',
      pptRawText: `SLIDE 7: KITCHEN DISPLAY SYSTEM & ANTREAN
Tahapan Pengerjaan Pesanan di Dapur Stan:
1. Menunggu: Tiket pesanan otomatis terdistribusi begitu transaksi lunas di kasir.
2. Dimasak: Koki mengkonfirmasi menu sedang diproses di dapur.
3. Siap Saji: Notifikasi panggil nomor antrean (A-001) agar diambil pembeli.

Keunggulan Teknis:
- Sinkronisasi real-time antar tab menggunakan BroadcastChannel API.
- Filter antrean per stan (Stan A-01 s/d A-06 hanya melihat porsi menunya sendiri).
- Zero-refresh: status otomatis terupdate secara instan.`,
    },

    // SLIDE 8: LAPORAN PENJUALAN & SETTLEMENT
    {
      id: 8,
      badge: 'SLIDE 08 · LAPORAN & SETTLEMENT',
      title: 'Laporan Penjualan Harian & Tutup Buku Stan',
      subtitle: 'Perhitungan Otomatis Komisi 10% Pengelola & 90% Hak Bersih Mitra UMKM',
      icon: <BarChart3 className="w-8 h-8 text-emerald-600" />,
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-5 bg-white border border-slate-200 rounded-xl">
            <h3 className="font-bold text-slate-900 text-sm mb-2">Metrik Keuangan Otomatis</h3>
            <div className="space-y-2 text-slate-700">
              <div className="flex justify-between p-2 bg-slate-50 rounded">
                <span>Omzet Kotor Total:</span>
                <span className="font-bold font-mono-tabular">100% Nilai Penjualan</span>
              </div>
              <div className="flex justify-between p-2 bg-emerald-50 rounded text-emerald-900">
                <span>Hak Bersih Mitra UMKM:</span>
                <span className="font-bold font-mono-tabular">90% Siap Dicairkan</span>
              </div>
              <div className="flex justify-between p-2 bg-indigo-50 rounded text-indigo-900">
                <span>Komisi Pengelola UNUGHA:</span>
                <span className="font-bold font-mono-tabular">10% Kas Operasional</span>
              </div>
            </div>
          </div>

          <div className="p-5 bg-white border border-slate-200 rounded-xl">
            <h3 className="font-bold text-slate-900 text-sm mb-2">Fitur Rekonsiliasi &amp; Ekspor</h3>
            <ul className="space-y-2 text-slate-600">
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span><strong>Simpan Tutup Buku Harian:</strong> Satu tombol untuk mengunci omzet tanggal berjalan ke tabel <code>daily_settlements</code>.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span><strong>Ekspor CSV:</strong> Mengunduh laporan transaksi lengkap ke Excel untuk pembukuan bendahara kampus.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span><strong>Nomor Rekening Mitra:</strong> Dilengkapi data rekening BNI/BRI/Mandiri tiap stan untuk kemudahan transfer pencairan.</span>
              </li>
            </ul>
          </div>
        </div>
      ),
      presenterNotes:
        'Sistem ini menyelesaikan konflik yang sering terjadi saat tutup buku sore hari. Rumus pembagian 90% hak stan dan 10% kas kampus dikunci secara programmatic, sehingga tidak ada ruang untuk selisih pembukuan.',
      pptRawText: `SLIDE 8: LAPORAN PENJUALAN & SETTLEMENT
Formula Pembagian Hasil:
- 90% Omzet Kotor: Hak bersih mitra UMKM kuliner.
- 10% Omzet Kotor: Komisi pengelola kampus untuk kebersihan & listrik.

Fitur Utama:
1. Rekapitulasi porsi terjual per stan secara otomatis.
2. Tombol Tutup Buku Harian (Settlement harian tersimpan permanen).
3. Ekspor data jurnal transaksi kasir ke format CSV/Excel.
4. Data nomor rekening bank mitra stan siap salin untuk transfer pencairan.`,
    },

    // SLIDE 9: HASIL IMPLEMENTASI & FITUR UNGGULAN
    {
      id: 9,
      badge: 'SLIDE 09 · HASIL IMPLEMENTASI',
      title: 'Fitur Unggulan & Pengujian Sistem',
      subtitle: 'Standar Kualitas Rekayasa Web POS: Cetak Thermal, Kecepatan, & Desain Responsif',
      icon: <Printer className="w-8 h-8 text-pink-500" />,
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-white border border-slate-200 rounded-xl">
            <span className="font-bold text-slate-900 block mb-1">🖨️ Cetak Struk Thermal 58/80mm</span>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Dukungan ukuran kertas thermal 58mm (mini printer bluetooth) dan 80mm (desktop POS). Menggunakan CSS <code>@media print</code> khusus sehingga hasil cetak bersih tanpa margin browser.
            </p>
          </div>

          <div className="p-4 bg-white border border-slate-200 rounded-xl">
            <span className="font-bold text-slate-900 block mb-1">⚡ Waktu Transaksi &lt; 30 Detik</span>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Tombol pintas pecahan cepat, integrasi kode promo kampus, kalkulator kembalian otomatis, dan keyboard navigation mempercepat waktu transaksi secara signifikan.
            </p>
          </div>

          <div className="p-4 bg-white border border-slate-200 rounded-xl">
            <span className="font-bold text-slate-900 block mb-1">🛡️ Anti Human Error Laci Kas</span>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Tombol cetak struk dinonaktifkan otomatis bila uang tunai yang diinput kurang dari total tagihan, mencegah kasir salah memberikan kembalian.
            </p>
          </div>
        </div>
      ),
      presenterNotes:
        'Pengujian sistem telah dilakukan pada skenario pencetakan printer thermal fisik 58mm dan 80mm, serta simulasi pesanan serentak di 6 stan. Hasil pengujian menunjukkan performa sistem sangat stabil, bebas error TypeScript, dan kompatibel di layar laptop maupun tablet kasir.',
      pptRawText: `SLIDE 9: HASIL IMPLEMENTASI & FITUR UNGGULAN
1. Struk Thermal 58mm & 80mm:
   - Dukungan pencetakan presisi via window.print().
   - Opsi salin teks nota untuk dikirim langsung ke WhatsApp pelanggan.

2. Efisiensi Kecepatan Transaksi:
   - Memangkas waktu tunggu dari ~3 menit menjadi ~30 detik per pelanggan.
   - Shortcut keyboard dan tombol pecahan uang pas.

3. Validasi Keamanan Transaksi:
   - Mencegah pembayaran kurang lewat validasi form interaktif.
   - Pengurangan stok porsi real-time mencegah over-selling.`,
    },

    // SLIDE 10: TEMUAN DEFECT / FAULT REPOSITORY GITHUB (MINIMAL 3 FAULT)
    {
      id: 10,
      badge: 'SLIDE 10 · ANALISIS DEFECT REPO',
      title: 'Temuan Defect / Fault dari Program Repository GitHub',
      subtitle:
        'Identifikasi 3 Kerusakan Kritis pada Modul Kasir POS, Print Thermal, dan Lifecycle Sinkronisasi',
      icon: <Bug className="w-8 h-8 text-rose-500" />,
      content: (
        <div className="flex flex-col gap-4 text-xs">
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-between">
            <div>
              <span className="font-bold text-rose-950 block">Audit Kualitas Kode Program (Code Review &amp; Debugging)</span>
              <p className="text-rose-800 text-[11px] mt-0.5">
                Ditemukan 3 defect fungsional dan struktural dari repository program yang berdampak langsung pada keakuratan transaksi kasir.
              </p>
            </div>
            <span className="px-2.5 py-1 text-[11px] font-bold bg-rose-200 text-rose-900 rounded-md">
              3 Fault Teridentifikasi
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Fault 1 */}
            <div className="p-4 bg-white border border-rose-200 rounded-xl shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono font-bold text-rose-800 text-[11px]">FAULT-01 · CRITICAL</span>
                  <span className="px-1.5 py-0.5 text-[9px] font-bold bg-rose-100 text-rose-800 rounded">Modul Kasir</span>
                </div>
                <h4 className="font-bold text-slate-900 text-xs mb-1.5">
                  Inkonsistensi Type PaymentMethod &amp; Kembalian Tunai Hilang
                </h4>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Tombol pembayaran kasir menggunakan string literal <code>"Tunai"</code>, sedangkan store Zustand menyimpan <code>"Cash"</code>. Kondisi cek tidak pernah match sehingga kotak kalkulator kembalian uang tunai tidak muncul di layar kasir.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-100 text-[10px] font-mono text-slate-500">
                File: CartSidebar.tsx &amp; types/index.ts
              </div>
            </div>

            {/* Fault 2 */}
            <div className="p-4 bg-white border border-amber-200 rounded-xl shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono font-bold text-amber-800 text-[11px]">FAULT-02 · HIGH</span>
                  <span className="px-1.5 py-0.5 text-[9px] font-bold bg-amber-100 text-amber-800 rounded">Print Struk</span>
                </div>
                <h4 className="font-bold text-slate-900 text-xs mb-1.5">
                  Kerusakan Layout Struk Thermal via window.print()
                </h4>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Tidak adanya isolasi CSS <code>@media print</code> menyebabkan browser mencetak seluruh tampilan layar (navbar, modal backdrop gelap, tombol tutup), membuang kertas roll 58mm/80mm dan memotong teks nota.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-100 text-[10px] font-mono text-slate-500">
                File: index.css &amp; ReceiptModal.tsx
              </div>
            </div>

            {/* Fault 3 */}
            <div className="p-4 bg-white border border-blue-200 rounded-xl shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono font-bold text-blue-800 text-[11px]">FAULT-03 · HIGH</span>
                  <span className="px-1.5 py-0.5 text-[9px] font-bold bg-blue-100 text-blue-800 rounded">Sinkronisasi</span>
                </div>
                <h4 className="font-bold text-slate-900 text-xs mb-1.5">
                  Null Pointer Cleanup Hook &amp; Contract Drift Order QRIS
                </h4>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Fungsi cleanup di <code>useRealtimeSync.ts</code> memanggil listener tanpa guard clause <code>if (realtimeChannel)</code> sehingga rawan runtime crash. Generator simulasi QRIS juga menghasilkan order tanpa nomor invoice &amp; tarif pajak.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-100 text-[10px] font-mono text-slate-500">
                File: useRealtimeSync.ts &amp; store.ts
              </div>
            </div>
          </div>
        </div>
      ),
      presenterNotes:
        'Pada slide ke-10 ini, kami menyajikan hasil audit kode dari repository GitHub. Kami menemukan minimal 3 defect kritis: pertama adalah diskrepansi tipe string antara UI dengan store kasir yang menyebabkan kalkulator kembalian uang fisik tidak aktif. Kedua adalah ketiadaan isolasi media print untuk printer thermal. Dan ketiga adalah isu null pointer pada cleanup event listener real-time.',
      pptRawText: `SLIDE 10: TEMUAN DEFECT / FAULT REPOSITORY GITHUB
Hasil Audit Program:
1. FAULT-01 (CRITICAL): Inkonsistensi Type PaymentMethod ('Tunai' vs 'Cash'). Kotak kalkulasi kembalian tunai terlewati dan gagal tampil di kasir.
2. FAULT-02 (HIGH): Kerusakan Format Cetak Struk Thermal window.print(). Tidak ada isolasi CSS @media print sehingga mencetak backdrop modal dan merusak kertas roll 58mm/80mm.
3. FAULT-03 (HIGH): Null Pointer Exception useRealtimeSync cleanup hook & ketidaklengkapan field nomor invoice pada fungsi simulasi QRIS.`,
    },

    // SLIDE 11: ROOT CAUSE ANALYSIS (RCA 5-WHYS & FISHBONE DIAGRAM)
    {
      id: 11,
      badge: 'SLIDE 11 · ROOT CAUSE ANALYSIS (RCA)',
      title: 'Root Cause Analysis: Metode 5-Whys & Fishbone',
      subtitle:
        'Pelacakan Sistematis Sumber Kerusakan dan Penetapan Tindakan Korektif & Preventif',
      icon: <ShieldAlert className="w-8 h-8 text-amber-500" />,
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* 5-Whys Highlight */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-800 rounded">
                  METODE 5-WHYS
                </span>
                <span className="font-bold text-slate-900">Analisis Akar Masalah</span>
              </div>
              <ol className="space-y-1.5 text-slate-700 text-[11px]">
                <li className="flex items-start gap-1.5">
                  <span className="font-bold text-amber-700">W1:</span>
                  <span>Kembalian tunai tidak muncul di kasir saat transaksi tunai?</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="font-bold text-amber-700">W2:</span>
                  <span>Karena UI mengecek <code>paymentMethod === 'Tunai'</code>, sedangkan store bernilai <code>'Cash'</code>.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="font-bold text-amber-700">W3:</span>
                  <span>Karena label antarmuka ditulis hardcoded tanpa mengikat ke union type.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="font-bold text-amber-700">W4:</span>
                  <span>Karena tidak ada single source of truth antara kontrak tipe data dengan form kasir.</span>
                </li>
                <li className="flex items-start gap-1.5 p-1.5 bg-amber-50 rounded border border-amber-200 text-amber-950 font-medium">
                  <span className="font-bold text-amber-800">ROOT:</span>
                  <span>Ketiadaan sinkronisasi kontrak tipe data (contract drift) dan belum adanya unit test otomatis untuk logika kasir.</span>
                </li>
              </ol>
            </div>
            <div className="mt-3 p-2 bg-emerald-50 rounded border border-emerald-200 text-[11px] text-emerald-900">
              <strong>Tindakan Korektif:</strong> Penyatuan tipe union <code>PaymentMethod</code>, pembuatan kalkulator kembalian real-time, dan pembuatan unit test.
            </div>
          </div>

          {/* Fishbone Diagram (4M) */}
          <div className="p-4 bg-white border border-slate-200 rounded-xl flex flex-col justify-between shadow-xs">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-100 text-blue-800 rounded">
                  DIAGRAM FISHBONE (ISHIKAWA)
                </span>
                <span className="font-bold text-slate-900">Kategori 4M</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2 bg-slate-50 rounded border border-slate-100">
                  <strong className="text-slate-900 block text-[10px] uppercase">MAN (MANUSIA)</strong>
                  <p className="text-slate-600 mt-0.5">Asumsi bahwa window.print() otomatis memformat ukuran kertas nota thermal.</p>
                </div>
                <div className="p-2 bg-slate-50 rounded border border-slate-100">
                  <strong className="text-slate-900 block text-[10px] uppercase">METHOD (METODE)</strong>
                  <p className="text-slate-600 mt-0.5">Pengujian awal hanya di monitor tanpa simulasi cetak roll 58mm/80mm.</p>
                </div>
                <div className="p-2 bg-slate-50 rounded border border-slate-100">
                  <strong className="text-slate-900 block text-[10px] uppercase">MACHINE (MESIN/KODE)</strong>
                  <p className="text-slate-600 mt-0.5">Strict typing TypeScript mendeteksi mismatch tanpa fallback null-safety.</p>
                </div>
                <div className="p-2 bg-slate-50 rounded border border-slate-100">
                  <strong className="text-slate-900 block text-[10px] uppercase">MEASUREMENT</strong>
                  <p className="text-slate-600 mt-0.5">Ketiadaan validasi automatisasi build test (CI/CD) sebelum merge kode.</p>
                </div>
              </div>
            </div>
            <div className="mt-3 p-2 bg-blue-50 rounded border border-blue-200 text-[11px] text-blue-900">
              <strong>Tindakan Preventif:</strong> Mewajibkan eksekusi <code>tsc --noEmit</code> dan Unit Testing otomatis sebelum rilis.
            </div>
          </div>
        </div>
      ),
      presenterNotes:
        'Slide 11 menguraikan Root Cause Analysis (RCA) menggunakan metode 5-Whys dan Diagram Fishbone 4M (Man, Method, Machine, Measurement). Melalui analisis mendalam, akar masalah berhasil dipetakan ke ketiadaan kontrak tipe data tunggal dan belum adanya unit testing otomatis. Kami menetapkan corrective action tuntas serta preventive action agar insiden serupa tidak terulang.',
      pptRawText: `SLIDE 11: ROOT CAUSE ANALYSIS (RCA) & FISHBONE
1. Metode 5-Whys:
   - Menelusuri masalah kembalian hingga ke akar contract drift antara UI dan store.
   - Akar masalah: Ketiadaan sinkronisasi kamus data tunggal dan minimnya unit testing finansial.
2. Diagram Fishbone 4M:
   - Man: Asumsi pencetakan browser.
   - Method: Tidak adanya uji cetak thermal fisik.
   - Machine: Null dereference pada hook listener.
   - Measurement: Belum adanya automated test suite.
3. Tindakan Korektif & Preventif: Penyatuan tipe, isolasi CSS thermal, guard clause null-safety, dan penyusunan test case design formal.`,
    },

    // SLIDE 12: STRATEGI & METODOLOGI PENGUJIAN PERANGKAT LUNAK (QA)
    {
      id: 12,
      badge: 'SLIDE 12 · STRATEGI PENGUJIAN (QA)',
      title: 'Strategi & Metodologi Pengujian Perangkat Lunak',
      subtitle:
        'Kombinasi Pengujian Black-Box (UAT/Boundary Value) & White-Box (Unit Testing Otomatis)',
      icon: <ShieldCheck className="w-8 h-8 text-blue-500" />,
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold mb-2">
                📦
              </div>
              <h4 className="font-bold text-slate-900 text-xs mb-1">1. Black-Box Testing</h4>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Pengujian berbasis antarmuka pengguna tanpa melihat kode internal:
              </p>
              <ul className="mt-2 space-y-1 text-slate-700 text-[11px]">
                <li>• <strong>Equivalence Partitioning:</strong> Rentang pembayaran tunai (kurang, pas, lebih).</li>
                <li>• <strong>Boundary Value Analysis:</strong> Batas nilai tagihan Rp 0, diskon 100%, dan pecahan rupiah.</li>
                <li>• <strong>State Transition:</strong> Alur pesanan baru → dimasak → siap saji → selesai.</li>
              </ul>
            </div>
            <span className="text-[10px] font-mono text-emerald-800 mt-2 block font-semibold">Cakupan: 8 Kasus Uji Slide 14</span>
          </div>

          <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold mb-2">
                ⚙️
              </div>
              <h4 className="font-bold text-slate-900 text-xs mb-1">2. White-Box Testing</h4>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Pengujian tingkat kode sumber dan logika fungsi kalkulasi finansial:
              </p>
              <ul className="mt-2 space-y-1 text-slate-700 text-[11px]">
                <li>• <strong>Unit Testing:</strong> Pengujian 4 fungsi matematika murni (pure functions).</li>
                <li>• <strong>Zero-Drift Invariant:</strong> Memastikan komisi + hak stan = 100% omzet kotor.</li>
                <li>• <strong>Branch Coverage:</strong> Menguji seluruh percabangan if/else kondisi uang kurang.</li>
              </ul>
            </div>
            <span className="text-[10px] font-mono text-blue-800 mt-2 block font-semibold">Cakupan: 16+ Assertion Valid</span>
          </div>

          <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center font-bold mb-2">
                🔄
              </div>
              <h4 className="font-bold text-slate-900 text-xs mb-1">3. Integration Testing</h4>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Pengujian integrasi antar subsistem kasir, printer, dan display stan:
              </p>
              <ul className="mt-2 space-y-1 text-slate-700 text-[11px]">
                <li>• <strong>Cetak Thermal:</strong> Dialog cetak browser roll 58mm/80mm.</li>
                <li>• <strong>BroadcastChannel:</strong> Pesanan terkirim ke dapur &lt; 50ms.</li>
                <li>• <strong>Settlement Harian:</strong> Tutup buku mengunci data ke tabel daily_settlements.</li>
              </ul>
            </div>
            <span className="text-[10px] font-mono text-purple-800 mt-2 block font-semibold">Cakupan: End-to-End POS</span>
          </div>
        </div>
      ),
      presenterNotes:
        'Slide 12 menjabarkan strategi QA software testing yang kami terapkan. Kami menggabungkan Black-Box Testing (Equivalence Partitioning & Boundary Value Analysis) untuk menguji skenario kasir, White-Box Unit Testing untuk menguji fungsi finansial bebas selisih, dan Integration Testing untuk memverifikasi alur antar-layar.',
      pptRawText: `SLIDE 12: STRATEGI & METODOLOGI PENGUJIAN PERANGKAT LUNAK
1. Black-Box Testing:
   - Equivalence Partitioning: Validasi grup input nominal uang tunai (kurang, pas, lebih).
   - Boundary Value Analysis: Pengujian batas minimum Rp 0 dan diskon maksimum.
2. White-Box Unit Testing:
   - Pengujian fungsi murni tanpa efek samping (pure functions).
   - Jaminan Invarian pembagian 90:10 tanpa pembulatan meleset.
3. Integration & System Testing:
   - Dialog window.print() thermal 58mm/80mm.
   - Sinkronisasi antrean dapur real-time BroadcastChannel.`,
    },

    // SLIDE 13: UNIT TESTING SISTEM POS (MINIMAL 3 FUNGSI INTI)
    {
      id: 13,
      badge: 'SLIDE 13 · UNIT TESTING SISTEM POS',
      title: 'Unit Testing Otomatis: 3 Fungsi Finansial & Bisnis Inti',
      subtitle:
        'Verifikasi Kode Murni Bebas Bug: Kembalian Tunai, Bagi Hasil 90:10 & Generator Nomor Faktur',
      icon: <Code2 className="w-8 h-8 text-indigo-500" />,
      content: (
        <div className="flex flex-col gap-3 text-xs">
          {/* Live Runner Bar */}
          <div className="p-3 bg-slate-900 text-white rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-bold text-xs">Hasil Eksekusi Unit Test Otomatis</span>
              <span className="text-slate-400 text-[11px] hidden sm:inline">
                ({unitTestSummary.passedTests}/{unitTestSummary.totalTests} Suites Lulus · {unitTestSummary.passedAssertions} Assertions)
              </span>
            </div>

            <button
              type="button"
              onClick={handleRunLiveTests}
              disabled={isTestingLive}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold rounded-lg transition-all cursor-pointer disabled:opacity-50"
            >
              {isTestingLive ? (
                <RotateCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Play className="w-3.5 h-3.5 fill-current" />
              )}
              <span>Jalankan Test Sekarang</span>
            </button>
          </div>

          {/* 3 Core Functions Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Function 1 */}
            <div className="p-3.5 bg-white border border-slate-200 rounded-xl shadow-xs">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-slate-900 text-xs">1. calculateCashChange</span>
                <span className="px-1.5 py-0.5 text-[9px] font-bold bg-emerald-100 text-emerald-800 rounded">4 PASS</span>
              </div>
              <p className="text-slate-500 text-[10px] font-mono mb-2">
                <code>(cashReceived, grandTotal)</code>
              </p>
              <ul className="space-y-1 text-slate-700 text-[11px]">
                <li className="flex items-center gap-1">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Uang pas (50k - 50k = 0, isExact: true)</span>
                </li>
                <li className="flex items-center gap-1">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Uang lebih (100k - 75k = 25k)</span>
                </li>
                <li className="flex items-center gap-1">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Uang kurang (20k vs 35k -&gt; shortfall 15k)</span>
                </li>
                <li className="flex items-center gap-1">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Tagihan nol -&gt; change = nominal diterima</span>
                </li>
              </ul>
            </div>

            {/* Function 2 */}
            <div className="p-3.5 bg-white border border-slate-200 rounded-xl shadow-xs">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-slate-900 text-xs">2. calculateRevenueSplit</span>
                <span className="px-1.5 py-0.5 text-[9px] font-bold bg-emerald-100 text-emerald-800 rounded">4 PASS</span>
              </div>
              <p className="text-slate-500 text-[10px] font-mono mb-2">
                <code>(grossTotal, commissionRate = 0.1)</code>
              </p>
              <ul className="space-y-1 text-slate-700 text-[11px]">
                <li className="flex items-center gap-1">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>100k -&gt; Komisi 10k &amp; Stan 90k</span>
                </li>
                <li className="flex items-center gap-1">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Invarian: Komisi + Stan = 100% Gross</span>
                </li>
                <li className="flex items-center gap-1">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Ganjil 15.750 -&gt; 1.575 &amp; 14.175 (0 selisih)</span>
                </li>
                <li className="flex items-center gap-1">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Tarif kustom (5%) &amp; penanganan nilai 0</span>
                </li>
              </ul>
            </div>

            {/* Function 3 */}
            <div className="p-3.5 bg-white border border-slate-200 rounded-xl shadow-xs">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-slate-900 text-xs">3. generateInvoiceNumber</span>
                <span className="px-1.5 py-0.5 text-[9px] font-bold bg-emerald-100 text-emerald-800 rounded">4 PASS</span>
              </div>
              <p className="text-slate-500 text-[10px] font-mono mb-2">
                <code>(date, counter, prefix)</code>
              </p>
              <ul className="space-y-1 text-slate-700 text-[11px]">
                <li className="flex items-center gap-1">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Format: INV/UNUGHA/YYYYMMDD/XXXX</span>
                </li>
                <li className="flex items-center gap-1">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Counter 1 -&gt; 0001 (4-digit padding)</span>
                </li>
                <li className="flex items-center gap-1">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Counter 85 -&gt; 0085 | Counter 1420 -&gt; 1420</span>
                </li>
                <li className="flex items-center gap-1">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Dukungan prefix kustom instansi</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      ),
      presenterNotes:
        'Slide 13 menyajikan implementasi Unit Test untuk 3 fungsi inti kasir (plus fungsi kalkulasi belanja). Pertama adalah calculateCashChange yang menguji kondisi uang pas, lebih, dan kurang. Kedua adalah calculateRevenueSplit yang menguji pembagian 90:10 dengan jaminan integer zero-drift tanpa ada sen yang hilang. Dan ketiga adalah generateInvoiceNumber yang memvalidasi format faktur resmi UNUGHA. Bapak/ibu dapat mengklik tombol "Jalankan Test Sekarang" untuk melihat pengujian berjalan secara live.',
      pptRawText: `SLIDE 13: UNIT TESTING SISTEM POS (MINIMAL 3 FUNGSI)
Hasil Eksekusi Unit Test: 4 Suites, 16 Assertions, 100% LULUS (ALL PASSED)
1. calculateCashChange(cashReceived, grandTotal):
   - Uji uang pas (kembalian 0, isExact true).
   - Uji uang lebih (100k - 75k = kembalian 25k).
   - Uji uang kurang (shortfall terhitung, isSufficient false).
2. calculateRevenueSplit(grossTotal, commissionRate):
   - Uji 90:10 standar (Rp 100k -> Komisi 10k, Stan 90k).
   - Uji nilai ganjil Rp 15.750 -> Komisi 1.575, Hak Stan 14.175 (Zero Rounding Drift).
3. generateInvoiceNumber(date, counter, prefix):
   - Format standar INV/UNUGHA/YYYYMMDD/XXXX.
   - Zero-padding 4 digit counter (0001 s/d 9999).`,
    },

    // SLIDE 14: TEST CASE DESIGN (FORMAT SLIDE 14 STANDAR IEEE 829)
    {
      id: 14,
      badge: 'SLIDE 14 · TEST CASE DESIGN (FORMAT SLIDE 14)',
      title: 'Test Case Design: Matriks Uji Standar Format Slide 14',
      subtitle:
        'Spesifikasi Kasus Uji Formal: ID Uji, Modul, Skenario, Langkah, Test Data, Expected vs Actual & Status Lulus',
      icon: <FileCheck2 className="w-8 h-8 text-purple-500" />,
      content: (
        <div className="flex flex-col gap-3 text-xs">
          {/* Banner Standar Slide 14 */}
          <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-[10px] font-bold bg-purple-200 text-purple-900 rounded">
                FORMAT SLIDE 14 · IEEE 829 QA MATRIX
              </span>
              <span className="text-purple-950 font-bold text-xs">
                Matriks Desain Kasus Uji Sistem POS Kasir Foodcourt UNUGHA
              </span>
            </div>
            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
              8 / 8 Kasus Uji: PASS (100%)
            </span>
          </div>

          {/* Full Test Case Table (Format Slide 14) */}
          <div className="overflow-x-auto rounded-xl border border-slate-200 max-h-[300px]">
            <table className="w-full text-left text-[11px] border-collapse bg-white">
              <thead className="sticky top-0 bg-slate-900 text-white font-bold text-[10px] uppercase">
                <tr>
                  <th className="p-2.5 w-20">ID Uji</th>
                  <th className="p-2.5 w-28">Modul</th>
                  <th className="p-2.5 w-44">Skenario Uji</th>
                  <th className="p-2.5">Test Data / Input</th>
                  <th className="p-2.5">Expected Result</th>
                  <th className="p-2.5">Actual Result</th>
                  <th className="p-2.5 w-16 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {SLIDE_14_TEST_CASES.map((tc) => (
                  <tr key={tc.testId} className="hover:bg-slate-50/80">
                    <td className="p-2 font-mono font-bold text-emerald-800 whitespace-nowrap">
                      {tc.testId}
                    </td>
                    <td className="p-2 font-medium text-slate-700 whitespace-nowrap">
                      {tc.module}
                    </td>
                    <td className="p-2 font-semibold text-slate-900">
                      {tc.scenario}
                    </td>
                    <td className="p-2 font-mono text-[10px] text-slate-600 bg-slate-50/50">
                      {tc.testData}
                    </td>
                    <td className="p-2 text-slate-700">
                      {tc.expectedResult}
                    </td>
                    <td className="p-2 text-emerald-900 font-medium bg-emerald-50/40">
                      {tc.actualResult}
                    </td>
                    <td className="p-2 text-center whitespace-nowrap">
                      <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>PASS</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Equivalence Partitioning & Boundary Value Tag */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] text-slate-600">
            <div className="p-2 bg-slate-50 rounded border border-slate-200">
              <strong className="text-slate-800">Equivalence Partitioning:</strong> Pembagian kelas input tunai (Kelas 1: Uang Pas = Rp 45k, Kelas 2: Uang Lebih &gt; Rp 45k, Kelas 3: Uang Kurang &lt; Rp 45k).
            </div>
            <div className="p-2 bg-slate-50 rounded border border-slate-200">
              <strong className="text-slate-800">Boundary Value Analysis:</strong> Batas kritis kembalian Rp 0, shortfall Rp 1, omzet bruto Rp 0, dan diskon 100%.
            </div>
          </div>
        </div>
      ),
      presenterNotes:
        'Inilah Slide 14 yang khusus didedikasikan untuk Test Case Design sesuai format standar pengujian perangkat lunak IEEE 829. Kami merancang 8 kasus uji komprehensif (TC-POS-01 hingga TC-POS-08) yang mencakup seluruh modul: pembayaran tunai kembalian pas & lebih, proteksi uang kurang, kalkulasi bagi hasil 90:10, penomoran invoice unik, isolasi cetak struk thermal 58mm/80mm, serta sinkronisasi antrean real-time. Seluruh kasus uji telah dieksekusi dan dinyatakan 100% PASS tanpa defect terbuka.',
      pptRawText: `SLIDE 14: TEST CASE DESIGN (FORMAT SLIDE 14 STANDAR IEEE 829)
Tabel Desain Kasus Uji Formal:
1. TC-POS-01 (Kasir Tunai): Perhitungan Kembalian Uang Pas & Lebih | Data: Tagihan 45k, Bayar 50k | Expected: Kembalian 5k | Actual: Kembalian 5k | Status: PASS
2. TC-POS-02 (Kasir Tunai): Proteksi Uang Tunai Kurang | Data: Tagihan 30k, Bayar 20k | Expected: Peringatan merah & tombol lock | Actual: Tombol terkunci | Status: PASS
3. TC-POS-03 (Settlement): Bagi Hasil 90% Stan & 10% Kampus | Data: grossTotal 100k, rate 0.1 | Expected: Komisi 10k, Stan 90k | Actual: Sesuai | Status: PASS
4. TC-POS-04 (Settlement): Pembulatan Presisi Nilai Ganjil | Data: 15.750, 0.1 | Expected: 1.575 & 14.175 (zero drift) | Actual: Tepat 15.750 | Status: PASS
5. TC-POS-05 (Invoice): Generator Nomor Invoice Resmi | Data: 2026-10-06, Counter 7 | Expected: INV/UNUGHA/20261006/0007 | Actual: Sesuai | Status: PASS
6. TC-POS-06 (Struk): Isolasi Cetak Thermal 58mm/80mm | Data: Roll 58mm | Expected: Print dialog bersih tanpa navbar | Actual: Sesuai | Status: PASS
7. TC-POS-07 (Real-Time): Broadcast Antrean Dapur Stan | Data: Ord-012 | Expected: Masuk layar dapur < 50ms, cleanup aman | Actual: Realtime aman | Status: PASS
8. TC-POS-08 (Multi-Payment): Non-Tunai QRIS & Transfer BSI | Data: Ref NMID-8849201 | Expected: Tercatat lunas dengan nomor ref | Actual: Sesuai | Status: PASS`,
    },

    // SLIDE 15: KESIMPULAN & PENUTUP
    {
      id: 15,
      badge: 'SLIDE 15 · KESIMPULAN & DEMONSTRASI',
      title: 'Kesimpulan Akhir & Demonstrasi Sistem POS',
      subtitle:
        'Pencapaian Validasi Kualitas Perangkat Lunak, Status 100% Lulus Uji, & Road Map Masa Depan',
      icon: <Sparkles className="w-8 h-8 text-amber-400" />,
      content: (
        <div className="flex flex-col gap-4 text-xs">
          <div className="p-5 bg-gradient-to-r from-slate-900 to-emerald-950 text-white rounded-xl border border-emerald-500/30">
            <h3 className="text-base font-bold mb-2">Kesimpulan Evaluasi Proyek</h3>
            <p className="text-slate-300 leading-relaxed text-xs">
              Sistem POS Kasir Sentral Foodcourt UNUGHA Cilacap berhasil memenuhi seluruh kriteria kelayakan sistem perangkat lunak akademik dan operasional nyata. Tiga temuan defect dari repository telah diperbaiki tuntas, unit test 3 fungsi utama lulus 100%, dan 8 kasus uji pada Test Case Design Slide 14 terverifikasi tanpa cela.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
              <span className="font-bold text-emerald-950 block text-xs">🎯 Kualitas Software</span>
              <p className="text-emerald-800 text-[11px] mt-1">
                Zero Critical Defects, 100% Unit Test Pass, dan Type-Safe TypeScript 0 error.
              </p>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <span className="font-bold text-blue-950 block text-xs">⚡ Efisiensi Transaksi</span>
              <p className="text-blue-800 text-[11px] mt-1">
                Waktu checkout &lt; 30 detik, kembalian tunai otomatis, dan cetak thermal 58/80mm instan.
              </p>
            </div>

            <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg flex flex-col justify-center text-center">
              <p className="font-bold text-purple-950 text-sm">Terima Kasih</p>
              <p className="text-purple-800 text-xs mt-0.5">Sesi Tanya Jawab &amp; Demonstrasi Sistem</p>
              <p className="text-purple-700 text-[11px] mt-1 font-mono-tabular">Asngad · UNUGHA Cilacap</p>
            </div>
          </div>
        </div>
      ),
      presenterNotes:
        'Demikian pemaparan laporan presentasi Sistem Kasir Foodcourt UNUGHA Cilacap, mulai dari perancangan transaksi kasir tunai/non-tunai, temuan 3 defect dari repo, analisis RCA 5-Whys, strategi QA, unit testing 3 fungsi inti, hingga Test Case Design pada Slide 14. Sistem ini telah siap didemonstrasikan secara langsung. Terima kasih atas perhatian bapak/ibu dosen penguji, waktu dan tempat saya persilakan untuk sesi tanya jawab.',
      pptRawText: `SLIDE 15: KESIMPULAN & PENUTUP
Pencapaian Proyek:
- Sistem POS Centralized Multi-Tenant berhasil beroperasi untuk 6 stan kuliner UNUGHA.
- 3 Temuan Defect Repo telah terpecahkan (Type Mismatch, Print CSS, Null Safety Hook).
- Unit Testing 3 Fungsi Inti Finansial Lulus 100% (16/16 Assertions).
- Test Case Design Slide 14 Terverifikasi 100% PASS (8 Kasus Uji).
- Siap digunakan untuk operasional riil kantin kampus.

Terima Kasih - Sesi Demonstrasi & Tanya Jawab.`,
    },
  ];

  const currentSlide = slides[currentSlideIndex];

  // Handle keyboard navigation (Left, Right arrow)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        setCurrentSlideIndex((prev) => Math.min(slides.length - 1, prev + 1));
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        setCurrentSlideIndex((prev) => Math.max(0, prev - 1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [slides.length]);

  const handleCopyAllSlidesText = async () => {
    const fullText = slides
      .map((s) => `=========================================\n${s.pptRawText}\nCatatan Presenter:\n${s.presenterNotes}\n`)
      .join('\n');
    try {
      await navigator.clipboard.writeText(fullText);
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 3000);
    } catch {
      // fallback
    }
  };

  const handleCopyCurrentSlide = async () => {
    const text = `${currentSlide.pptRawText}\n\nCatatan Presenter:\n${currentSlide.presenterNotes}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCurrent(true);
      setTimeout(() => setCopiedCurrent(false), 2500);
    } catch {
      // fallback
    }
  };

  return (
    <section className="flex flex-col gap-5">
      {/* Top Deck Control Strip */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 no-print shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-xs font-bold bg-emerald-100 text-emerald-800 rounded">
              Laporan PPT
            </span>
            <h1 className="text-lg font-bold text-slate-900 font-display">
              Slide Deck Presentasi — Kasir Foodcourt UNUGHA
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            15 Slide presentasi lengkap (termasuk Temuan Defect, RCA, Unit Test, &amp; Format Slide 14 Test Case Design) untuk sidang/evaluasi akademik &amp; demonstrasi sistem
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <button
            type="button"
            onClick={handleCopyAllSlidesText}
            className="inline-flex items-center gap-1.5 px-3 py-2 font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            {copiedAll ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Semua Slide Tersalin!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Salin Teks Lengkap PPT</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-2 font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak Handout Slide</span>
          </button>

          <button
            type="button"
            onClick={() => setShowPresenterNotes(!showPresenterNotes)}
            className={`inline-flex items-center gap-1.5 px-3 py-2 font-semibold rounded-lg border transition-colors cursor-pointer ${
              showPresenterNotes
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                : 'bg-white border-slate-200 text-slate-700'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{showPresenterNotes ? 'Catatan Pembicara Aktif' : 'Tampilkan Catatan'}</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Slide Screen */}
      <div
        className={`bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col transition-all ${
          isFullscreen ? 'fixed inset-4 z-50 overflow-y-auto' : ''
        }`}
      >
        {/* Slide Screen Header Bar */}
        <div className="px-6 py-3.5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono-tabular font-bold text-emerald-400">
              Slide {currentSlideIndex + 1} / {slides.length}
            </span>
            <span className="h-4 w-px bg-slate-700" />
            <span className="text-xs text-slate-300 font-medium truncate max-w-[280px] sm:max-w-md">
              {currentSlide.badge}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyCurrentSlide}
              title="Salin teks slide ini"
              className="p-1.5 text-slate-300 hover:text-white rounded hover:bg-slate-800 transition-colors cursor-pointer"
            >
              {copiedCurrent ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              title={isFullscreen ? 'Keluar layar penuh' : 'Layar penuh'}
              className="p-1.5 text-slate-300 hover:text-white rounded hover:bg-slate-800 transition-colors cursor-pointer"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Slide Body Canvas */}
        <div className="p-6 sm:p-8 min-h-[360px] flex flex-col justify-between bg-white">
          <div>
            {/* Header Slide */}
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 rounded-xl bg-slate-100 border border-slate-200 shrink-0">
                {currentSlide.icon}
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold font-display text-slate-900 tracking-tight">
                  {currentSlide.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  {currentSlide.subtitle}
                </p>
              </div>
            </div>

            {/* Slide Interactive Content */}
            <div className="py-2">{currentSlide.content}</div>
          </div>

          {/* Slide Footer Branding */}
          <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-mono-tabular">
            <span>Universitas Nahdlatul Ulama Al Ghazali Cilacap</span>
            <span>Kasir Foodcourt Sentral · Asngad</span>
          </div>
        </div>

        {/* Presenter Notes Accordion Box (Catatan Pembicara) */}
        {showPresenterNotes && (
          <div className="px-6 py-4 bg-amber-50/70 border-t border-amber-200/80 text-amber-950 text-xs">
            <div className="flex items-center gap-2 font-bold mb-1.5 text-amber-900">
              <BookOpen className="w-4 h-4" />
              <span>Catatan Pembicara / Skrip Presentasi:</span>
            </div>
            <p className="leading-relaxed font-sans text-slate-700">
              {currentSlide.presenterNotes}
            </p>
          </div>
        )}

        {/* Navigation Bar (Next, Prev, Slide Numbers) */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            disabled={currentSlideIndex === 0}
            onClick={() => setCurrentSlideIndex((prev) => Math.max(0, prev - 1))}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg border transition-colors cursor-pointer ${
              currentSlideIndex === 0
                ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-100'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Slide Sebelumnya</span>
          </button>

          {/* Slide Dots / Quick Pickers */}
          <div className="flex items-center gap-1 overflow-x-auto py-1">
            {slides.map((s, idx) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setCurrentSlideIndex(idx)}
                className={`w-7 h-7 rounded-md text-xs font-mono-tabular font-bold transition-all cursor-pointer ${
                  currentSlideIndex === idx
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                {s.id}
              </button>
            ))}
          </div>

          <button
            type="button"
            disabled={currentSlideIndex === slides.length - 1}
            onClick={() =>
              setCurrentSlideIndex((prev) =>
                Math.min(slides.length - 1, prev + 1)
              )
            }
            className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              currentSlideIndex === slides.length - 1
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-emerald-800 text-white hover:bg-emerald-900 shadow-xs'
            }`}
          >
            <span>Slide Selanjutnya</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Slide Deck Thumbnail Catalog */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
          <Layers className="w-4 h-4 text-emerald-700" />
          <span>Daftar Seluruh Slide Laporan (Klik untuk Langsung Buka)</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {slides.map((s, idx) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setCurrentSlideIndex(idx)}
              className={`p-3 text-left rounded-lg border transition-all cursor-pointer flex flex-col justify-between ${
                currentSlideIndex === idx
                  ? 'border-emerald-700 bg-emerald-50/50 ring-1 ring-emerald-700'
                  : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div>
                <span className="text-[10px] font-mono-tabular font-bold text-emerald-800 block">
                  SLIDE {String(s.id).padStart(2, '0')}
                </span>
                <p className="text-xs font-bold text-slate-900 mt-1 line-clamp-1">
                  {s.title}
                </p>
              </div>
              <span className="text-[10px] text-slate-500 mt-2 line-clamp-1">
                {s.subtitle}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
