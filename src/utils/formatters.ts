import { DatabaseTableSchema, Transaction, DailySettlement } from '../types';

export function formatRupiah(amount: number): string {
  const rounded = Math.round(amount);
  return 'Rp ' + rounded.toLocaleString('id-ID');
}

export function formatTimeShort(isoString: string): string {
  try {
    const date = new Date(isoString);
    return date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  } catch {
    return '-';
  }
}

export function formatDateId(isoOrDateString: string): string {
  try {
    const date = new Date(isoOrDateString);
    return date.toLocaleDateString('id-ID', {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return isoOrDateString;
  }
}

export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function isSameDay(isoString: string, targetDateYYYYMMDD: string): boolean {
  try {
    const d = new Date(isoString);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}` === targetDateYYYYMMDD;
  } catch {
    return false;
  }
}

export function exportTransactionsToCsv(transactions: Transaction[], dateLabel: string): void {
  const headers = [
    'Kode Transaksi',
    'No Pesanan',
    'Waktu Bayar',
    'Pelanggan',
    'Metode Pembayaran',
    'Status',
    'Subtotal (Rp)',
    'Diskon (Rp)',
    'Total Akhir (Rp)',
    'Komisi Foodcourt 10% (Rp)',
    'Hak Bersih Stan (Rp)',
    'Kasir',
  ];

  const rows = transactions.map((trx) => [
    trx.transaction_code,
    trx.order_number,
    formatTimeShort(trx.paid_at),
    `"${trx.customer_name.replace(/"/g, '""')}"`,
    trx.payment_method,
    trx.payment_status,
    trx.subtotal,
    trx.discount_amount,
    trx.grand_total,
    trx.foodcourt_commission,
    trx.tenant_net_total,
    `"${trx.cashier_name}"`,
  ]);

  const csvContent =
    'data:text/csv;charset=utf-8,' +
    [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `Laporan_Foodcourt_UNUGHA_${dateLabel}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportSettlementsToCsv(settlements: DailySettlement[], dateLabel: string): void {
  const headers = [
    'Tanggal Settlement',
    'Kode Stan',
    'Nama Tenant / Stan',
    'Total Pesanan',
    'Porsi Terjual',
    'Penjualan Kotor (Rp)',
    'Komisi (%)',
    'Potongan Foodcourt (Rp)',
    'Dana Cair ke Tenant (Rp)',
    'Status',
  ];

  const rows = settlements.map((s) => [
    s.settlement_date,
    s.booth_number,
    `"${s.tenant_name}"`,
    s.total_orders,
    s.items_sold,
    s.gross_sales,
    s.commission_percent,
    s.commission_amount,
    s.net_payout,
    s.status,
  ]);

  const csvContent =
    'data:text/csv;charset=utf-8,' +
    [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `Settlement_Tenant_UNUGHA_${dateLabel}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export const FOODCOURT_DATABASE_SCHEMAS: DatabaseTableSchema[] = [
  {
    table_name: 'tenants',
    domain_group: 'Master Data',
    description: 'Data master stan/booth penjual di Foodcourt Kampus UNUGHA beserta persentase bagi hasil.',
    primary_key: 'id (UUID)',
    foreign_keys: [],
    realtime_enabled: false,
    columns: [
      { name: 'id', type: 'UUID', constraints: 'PRIMARY KEY', description: 'ID unik stan/tenant' },
      { name: 'code', type: 'VARCHAR(16)', constraints: 'UNIQUE NOT NULL', description: 'Kode registrasi tenant (TN-UNUGHA-01)' },
      { name: 'name', type: 'VARCHAR(100)', constraints: 'NOT NULL', description: 'Nama stan kuliner' },
      { name: 'owner_name', type: 'VARCHAR(100)', constraints: 'NOT NULL', description: 'Nama pemilik/mitra UMKM' },
      { name: 'booth_number', type: 'VARCHAR(10)', constraints: 'NOT NULL', description: 'Nomor blok kavling stan (A-01 s/d A-06)' },
      { name: 'commission_percent', type: 'NUMERIC(5,2)', constraints: 'DEFAULT 10.00', description: 'Persentase bagi hasil manajemen foodcourt' },
      { name: 'is_open', type: 'BOOLEAN', constraints: 'DEFAULT TRUE', description: 'Status operasional stan saat ini' },
    ],
  },
  {
    table_name: 'menus',
    domain_group: 'Master Data',
    description: 'Katalog menu makanan & minuman per stan dengan pelacakan stok porsi real-time dan HPP.',
    primary_key: 'id (UUID)',
    foreign_keys: ['tenant_id -> tenants.id'],
    realtime_enabled: true,
    columns: [
      { name: 'id', type: 'UUID', constraints: 'PRIMARY KEY', description: 'ID unik item menu' },
      { name: 'tenant_id', type: 'UUID', constraints: 'FOREIGN KEY NOT NULL', description: 'Relasi ke stan pemilik menu' },
      { name: 'sku', type: 'VARCHAR(24)', constraints: 'UNIQUE NOT NULL', description: 'Kode SKU kasir cepat' },
      { name: 'name', type: 'VARCHAR(120)', constraints: 'NOT NULL', description: 'Nama sajian makanan/minuman' },
      { name: 'category', type: 'VARCHAR(40)', constraints: 'NOT NULL', description: 'Kategori menu katalog' },
      { name: 'price', type: 'INTEGER', constraints: 'NOT NULL CHECK (price >= 0)', description: 'Harga jual mahasiswa (IDR)' },
      { name: 'cost_price', type: 'INTEGER', constraints: 'NOT NULL', description: 'Harga pokok produksi / modal (IDR)' },
      { name: 'stock', type: 'INTEGER', constraints: 'NOT NULL DEFAULT 0', description: 'Sisa stok porsi harian real-time' },
      { name: 'is_available', type: 'BOOLEAN', constraints: 'DEFAULT TRUE', description: 'Status aktif di layar POS Kasir' },
    ],
  },
  {
    table_name: 'orders',
    domain_group: 'Transaksi Real-Time',
    description: 'Header pesanan pelanggan/mahasiswa secara real-time baik dari Kasir Sentral maupun QRIS Meja.',
    primary_key: 'id (UUID)',
    foreign_keys: ['cashier_id -> users.id'],
    realtime_enabled: true,
    columns: [
      { name: 'id', type: 'UUID', constraints: 'PRIMARY KEY', description: 'ID unik pesanan' },
      { name: 'order_number', type: 'VARCHAR(32)', constraints: 'UNIQUE NOT NULL', description: 'Nomor struk pesanan (ORD-20261006-XXX)' },
      { name: 'queue_number', type: 'VARCHAR(10)', constraints: 'NOT NULL', description: 'Nomor panggil layar antrean (A-012)' },
      { name: 'customer_name', type: 'VARCHAR(80)', constraints: 'NOT NULL', description: 'Nama pemesan / mahasiswa' },
      { name: 'student_nim', type: 'VARCHAR(24)', constraints: 'NULLABLE', description: 'NIM Mahasiswa UNUGHA (opsional untuk diskon KTM)' },
      { name: 'table_number', type: 'VARCHAR(12)', constraints: 'NOT NULL', description: 'Nomor meja makan foodcourt' },
      { name: 'order_type', type: 'ENUM', constraints: 'NOT NULL', description: 'Dine-In, Takeaway, atau Pesan Antar Fakultas' },
      { name: 'order_status', type: 'ENUM', constraints: 'INDEXED NOT NULL', description: 'menunggu | dimasak | siap_saji | selesai' },
      { name: 'grand_total', type: 'INTEGER', constraints: 'NOT NULL', description: 'Total tagihan bersih setelah diskon' },
      { name: 'created_at', type: 'TIMESTAMPTZ', constraints: 'DEFAULT NOW()', description: 'Waktu pesanan masuk real-time' },
    ],
  },
  {
    table_name: 'order_items',
    domain_group: 'Transaksi Real-Time',
    description: 'Rincian item pesanan lintas stan (multi-tenant split order) yang mendistribusikan pesanan ke dapur masing-masing stan.',
    primary_key: 'id (UUID)',
    foreign_keys: ['order_id -> orders.id', 'menu_id -> menus.id', 'tenant_id -> tenants.id'],
    realtime_enabled: true,
    columns: [
      { name: 'id', type: 'UUID', constraints: 'PRIMARY KEY', description: 'ID baris item pesanan' },
      { name: 'order_id', type: 'UUID', constraints: 'FOREIGN KEY CASCADE', description: 'Relasi ke header orders' },
      { name: 'menu_id', type: 'UUID', constraints: 'FOREIGN KEY', description: 'Relasi ke item menu' },
      { name: 'tenant_id', type: 'UUID', constraints: 'FOREIGN KEY INDEXED', description: 'Relasi ke stan untuk bagi hasil otomatis' },
      { name: 'quantity', type: 'INTEGER', constraints: 'NOT NULL CHECK (quantity > 0)', description: 'Jumlah porsi dipesan' },
      { name: 'unit_price', type: 'INTEGER', constraints: 'NOT NULL', description: 'Harga satuan saat transaksi' },
      { name: 'subtotal', type: 'INTEGER', constraints: 'NOT NULL', description: 'Total harga baris (quantity * unit_price)' },
      { name: 'notes', type: 'TEXT', constraints: 'NULLABLE', description: 'Catatan pedas / tanpa es / request khusus' },
    ],
  },
  {
    table_name: 'transactions',
    domain_group: 'Transaksi Real-Time',
    description: 'Jurnal pembayaran kasir real-time (Tunai, QRIS Kampus, Saldo KTM) beserta perhitungan otomatis komisi foodcourt.',
    primary_key: 'id (UUID)',
    foreign_keys: ['order_id -> orders.id'],
    realtime_enabled: true,
    columns: [
      { name: 'id', type: 'UUID', constraints: 'PRIMARY KEY', description: 'ID unik jurnal pembayaran' },
      { name: 'transaction_code', type: 'VARCHAR(32)', constraints: 'UNIQUE NOT NULL', description: 'Nomor referensi jurnal pembayaran (TRX-UNUGHA-XXX)' },
      { name: 'order_id', type: 'UUID', constraints: 'FOREIGN KEY UNIQUE', description: 'Relasi 1-to-1 ke pesanan' },
      { name: 'payment_method', type: 'ENUM', constraints: 'INDEXED NOT NULL', description: 'QRIS Kampus | Tunai | Saldo KTM UNUGHA' },
      { name: 'payment_status', type: 'ENUM', constraints: 'NOT NULL', description: 'lunas | menunggu_pembayaran | refund' },
      { name: 'grand_total', type: 'INTEGER', constraints: 'NOT NULL', description: 'Nominal pembayaran bersih (IDR)' },
      { name: 'amount_received', type: 'INTEGER', constraints: 'NOT NULL', description: 'Uang diterima kasir' },
      { name: 'change_amount', type: 'INTEGER', constraints: 'NOT NULL DEFAULT 0', description: 'Uang kembalian tunai' },
      { name: 'foodcourt_commission', type: 'INTEGER', constraints: 'NOT NULL', description: 'Komisi pengelola Foodcourt UNUGHA (10%)' },
      { name: 'tenant_net_total', type: 'INTEGER', constraints: 'NOT NULL', description: 'Hak bersih seluruh stan terkait (90%)' },
      { name: 'paid_at', type: 'TIMESTAMPTZ', constraints: 'INDEXED DEFAULT NOW()', description: 'Waktu lunas pembayaran' },
    ],
  },
  {
    table_name: 'daily_settlements',
    domain_group: 'Laporan & Settlement',
    description: 'Rekapitulasi tutup buku harian dan pencairan dana penjualan bersih ke masing-masing pemilik stan.',
    primary_key: 'id (UUID)',
    foreign_keys: ['tenant_id -> tenants.id'],
    realtime_enabled: false,
    columns: [
      { name: 'id', type: 'UUID', constraints: 'PRIMARY KEY', description: 'ID settlement harian' },
      { name: 'settlement_date', type: 'DATE', constraints: 'INDEXED NOT NULL', description: 'Tanggal buku laporan penjualan' },
      { name: 'tenant_id', type: 'UUID', constraints: 'FOREIGN KEY NOT NULL', description: 'Stan penerima pencairan dana' },
      { name: 'total_orders', type: 'INTEGER', constraints: 'NOT NULL', description: 'Jumlah nota pesanan stan pada hari tersebut' },
      { name: 'items_sold', type: 'INTEGER', constraints: 'NOT NULL', description: 'Total porsi menu terjual' },
      { name: 'gross_sales', type: 'INTEGER', constraints: 'NOT NULL', description: 'Omzet kotor stan sebelum komisi' },
      { name: 'commission_amount', type: 'INTEGER', constraints: 'NOT NULL', description: 'Potongan komisi pengelolaan foodcourt' },
      { name: 'net_payout', type: 'INTEGER', constraints: 'NOT NULL', description: 'Nominal bersih ditransfer ke mitra stan' },
      { name: 'status', type: 'ENUM', constraints: 'DEFAULT pending', description: 'pending | settled (sudah dicairkan)' },
    ],
  },
];

export const SQL_DDL_SCRIPT = `-- ============================================================================
-- SKEMA DATABASE POSTGRESQL / SUPABASE / CLOUDFLARE D1
-- KASIR FOODCOURT UNUGHA CILACAP (TERMINAL KASIR KAMPUS TERPADU)
-- Mencakup: Manajemen Tenant & Menu, Transaksi Real-Time, & Laporan Harian
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. TABEL TENANTS (STAN KULINER FOODCOURT UNUGHA)
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  owner_name VARCHAR(100) NOT NULL,
  booth_number VARCHAR(10) NOT NULL,
  specialty VARCHAR(120),
  commission_percent NUMERIC(5,2) NOT NULL DEFAULT 10.00,
  is_open BOOLEAN NOT NULL DEFAULT TRUE,
  phone VARCHAR(25),
  bank_account VARCHAR(80),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. TABEL MENUS (MANAJEMEN MENU & STOK HARIAN)
CREATE TABLE menus (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  sku VARCHAR(24) UNIQUE NOT NULL,
  name VARCHAR(120) NOT NULL,
  category VARCHAR(40) NOT NULL,
  price INTEGER NOT NULL CHECK (price >= 0),
  cost_price INTEGER NOT NULL DEFAULT 0,
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  is_available BOOLEAN NOT NULL DEFAULT TRUE,
  prep_time_minutes INTEGER NOT NULL DEFAULT 8,
  description TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_menus_tenant_category ON menus(tenant_id, category);

-- 3. TABEL ORDERS (ANTREAN PESANAN REAL-TIME)
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number VARCHAR(32) UNIQUE NOT NULL,
  queue_number VARCHAR(10) NOT NULL,
  customer_name VARCHAR(80) NOT NULL,
  student_nim VARCHAR(24),
  table_number VARCHAR(12) NOT NULL,
  order_type VARCHAR(30) NOT NULL,
  order_status VARCHAR(20) NOT NULL DEFAULT 'menunggu',
  source VARCHAR(30) NOT NULL DEFAULT 'POS Kasir',
  subtotal INTEGER NOT NULL,
  discount_amount INTEGER NOT NULL DEFAULT 0,
  voucher_code VARCHAR(24),
  tax_amount INTEGER NOT NULL DEFAULT 0,
  grand_total INTEGER NOT NULL,
  cashier_id VARCHAR(36) NOT NULL,
  cashier_name VARCHAR(80) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_orders_status_created ON orders(order_status, created_at DESC);

-- 4. TABEL ORDER_ITEMS (SPLIT ITEM LINTAS STAN)
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  menu_id UUID NOT NULL REFERENCES menus(id),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  menu_name VARCHAR(120) NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price INTEGER NOT NULL,
  subtotal INTEGER NOT NULL,
  notes TEXT
);

CREATE INDEX idx_order_items_tenant ON order_items(tenant_id, order_id);

-- 5. TABEL TRANSACTIONS (JURNAL PEMBAYARAN KASIR REAL-TIME)
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transaction_code VARCHAR(32) UNIQUE NOT NULL,
  order_id UUID UNIQUE NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  order_number VARCHAR(32) NOT NULL,
  customer_name VARCHAR(80) NOT NULL,
  payment_method VARCHAR(30) NOT NULL,
  payment_status VARCHAR(24) NOT NULL DEFAULT 'lunas',
  subtotal INTEGER NOT NULL,
  discount_amount INTEGER NOT NULL DEFAULT 0,
  grand_total INTEGER NOT NULL,
  amount_received INTEGER NOT NULL,
  change_amount INTEGER NOT NULL DEFAULT 0,
  foodcourt_commission INTEGER NOT NULL,
  tenant_net_total INTEGER NOT NULL,
  cashier_name VARCHAR(80) NOT NULL,
  paid_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_transactions_paid_at ON transactions(paid_at DESC);

-- 6. TABEL DAILY_SETTLEMENTS (LAPORAN PENJUALAN & BAGI HASIL HARIAN)
CREATE TABLE daily_settlements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  settlement_date DATE NOT NULL,
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  total_orders INTEGER NOT NULL DEFAULT 0,
  items_sold INTEGER NOT NULL DEFAULT 0,
  gross_sales INTEGER NOT NULL DEFAULT 0,
  commission_percent NUMERIC(5,2) NOT NULL DEFAULT 10.00,
  commission_amount INTEGER NOT NULL DEFAULT 0,
  net_payout INTEGER NOT NULL DEFAULT 0,
  status VARCHAR(20) NOT NULL DEFAULT 'settled',
  settled_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  verified_by VARCHAR(80) NOT NULL,
  UNIQUE(settlement_date, tenant_id)
);
`;
