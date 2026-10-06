export type NavigationTab =
  | 'kasir'
  | 'antrean'
  | 'menu'
  | 'laporan'
  | 'tenant'
  | 'database';

export type UserRole = 'kasir' | 'admin_foodcourt' | 'operator_tenant';

export interface User {
  id: string;
  username: string;
  full_name: string;
  role: UserRole;
  shift: 'Pagi (07:30 - 14:30)' | 'Siang (14:30 - 21:00)';
  active: boolean;
}

export type MenuCategory =
  | 'Makanan Berat'
  | 'Mie & Bakso'
  | 'Minuman Kampus'
  | 'Camilan & Gorengan'
  | 'Paket Mahasiswa';

export interface Tenant {
  id: string;
  code: string;
  name: string;
  owner_name: string;
  booth_number: string;
  specialty: string;
  commission_percent: number; // e.g. 10% for UNUGHA Foodcourt management
  is_open: boolean;
  phone: string;
  bank_account: string;
}

export interface MenuItem {
  id: string;
  tenant_id: string;
  sku: string;
  name: string;
  category: MenuCategory;
  price: number;
  cost_price: number;
  stock: number;
  is_available: boolean;
  prep_time_minutes: number;
  description: string;
  image_key: string;
}

export type OrderType = 'Dine-In' | 'Takeaway' | 'Pesan Antar Fakultas';

export type OrderStatus = 'menunggu' | 'dimasak' | 'siap_saji' | 'selesai' | 'dibatalkan';

export type PaymentMethod =
  | 'Cash'
  | 'QRIS'
  | 'Transfer'
  | 'Transfer Bank'
  | 'E-Wallet'
  | 'KTM UNUGHA';

export type PaymentStatus = 'lunas' | 'menunggu_pembayaran' | 'refund';

export type ReceiptPaperSize = '58mm' | '80mm';

export interface OrderItem {
  id: string;
  order_id: string;
  menu_id: string;
  menu_name: string;
  menu_sku: string;
  tenant_id: string;
  tenant_name: string;
  booth_number: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  notes?: string;
}

export interface Order {
  id: string;
  invoice_number: string;
  order_number: string;
  queue_number: string;
  customer_name: string;
  student_nim?: string;
  table_number: string;
  order_type: OrderType;
  order_status: OrderStatus;
  source: 'POS Kasir' | 'QRIS Meja Mandiri';
  created_at: string; // ISO timestamp
  updated_at: string;
  cashier_id: string;
  cashier_name: string;
  items: OrderItem[];
  subtotal: number;
  discount_percent: number;
  discount_amount: number;
  voucher_code?: string;
  tax_rate: number;
  tax_amount: number;
  grand_total: number;
}

export interface Transaction {
  id: string;
  invoice_number: string;
  transaction_code: string;
  order_id: string;
  order_number: string;
  customer_name: string;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  subtotal: number;
  discount_amount: number;
  tax_amount: number;
  grand_total: number;
  amount_received: number;
  change_amount: number;
  foodcourt_commission: number;
  tenant_net_total: number;
  paid_at: string; // ISO timestamp
  cashier_name: string;
  payment_reference?: string;
}

export interface DailySettlement {
  id: string;
  settlement_date: string; // YYYY-MM-DD
  tenant_id: string;
  tenant_name: string;
  booth_number: string;
  total_orders: number;
  items_sold: number;
  gross_sales: number;
  commission_percent: number;
  commission_amount: number;
  net_payout: number;
  status: 'settled' | 'pending';
  settled_at: string;
  verified_by: string;
}

export interface CartItem {
  menu: MenuItem;
  tenant_name: string;
  booth_number: string;
  quantity: number;
  notes: string;
}

export interface DatabaseColumnSpec {
  name: string;
  type: string;
  constraints: string;
  description: string;
}

export interface DatabaseTableSchema {
  table_name: string;
  domain_group: 'Master Data' | 'Transaksi Real-Time' | 'Laporan & Settlement';
  description: string;
  primary_key: string;
  foreign_keys: string[];
  realtime_enabled: boolean;
  columns: DatabaseColumnSpec[];
}
