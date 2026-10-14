import { create } from 'zustand';
import {
  NavigationTab,
  User,
  Tenant,
  MenuItem,
  Order,
  OrderItem,
  Transaction,
  DailySettlement,
  CartItem,
  OrderType,
  OrderStatus,
  PaymentMethod,
  ReceiptPaperSize,
} from '../types';
import {
  SEED_USERS,
  SEED_TENANTS,
  SEED_MENUS,
  buildInitialOrdersAndTransactions,
  broadcastDatabaseSync,
} from '../services/foodcourtApi';
import { getTodayDateString } from '../utils/formatters';

const STORAGE_KEY = 'unugha_foodcourt_pos_db_v1';

interface PersistedDatabaseState {
  users: User[];
  tenants: Tenant[];
  menus: MenuItem[];
  orders: Order[];
  transactions: Transaction[];
  settlements: DailySettlement[];
}

function loadDatabaseFromStorage(): PersistedDatabaseState {
  if (typeof window === 'undefined') {
    const seeded = buildInitialOrdersAndTransactions();
    return {
      users: SEED_USERS,
      tenants: SEED_TENANTS,
      menus: SEED_MENUS,
      ...seeded,
    };
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as PersistedDatabaseState;
      if (parsed.tenants?.length && parsed.menus?.length) {
        return parsed;
      }
    }
  } catch {
    // fallback
  }

  const seeded = buildInitialOrdersAndTransactions();
  const initial: PersistedDatabaseState = {
    users: SEED_USERS,
    tenants: SEED_TENANTS,
    menus: SEED_MENUS,
    ...seeded,
  };

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
  } catch {
    // ignore quota
  }
  return initial;
}

function saveDatabaseToStorage(state: PersistedDatabaseState): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore quota
  }
}

export interface FoodcourtStoreState {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;

  currentUser: User;
  users: User[];
  switchUser: (userId: string) => void;

  tenants: Tenant[];
  menus: MenuItem[];
  orders: Order[];
  transactions: Transaction[];
  settlements: DailySettlement[];
  lastRealtimeEvent: string | null;

  cart: CartItem[];
  orderType: OrderType;
  tableNumber: string;
  customerName: string;
  studentNim: string;
  paymentMethod: PaymentMethod;
  voucherCode: string;
  discountPercent: number;
  customDiscountNominal: number;
  taxRate: number;
  cashReceived: number;
  paymentReference: string;
  receiptPaperSize: ReceiptPaperSize;
  activeReceiptOrder: Order | null;
  activeReceiptTransaction: Transaction | null;

  addToCart: (menu: MenuItem) => void;
  updateCartQuantity: (menuId: string, delta: number) => void;
  updateCartNotes: (menuId: string, notes: string) => void;
  removeFromCart: (menuId: string) => void;
  clearCart: () => void;
  setOrderType: (type: OrderType) => void;
  setTableNumber: (table: string) => void;
  setCustomerName: (name: string) => void;
  setStudentNim: (nim: string) => void;
  setPaymentMethod: (method: PaymentMethod) => void;
  setVoucherCode: (code: string) => void;
  setDiscountPercent: (percent: number) => void;
  setCustomDiscountNominal: (amount: number) => void;
  setTaxRate: (rate: number) => void;
  setPaymentReference: (ref: string) => void;
  setReceiptPaperSize: (size: ReceiptPaperSize) => void;
  setCashReceived: (amount: number) => void;
  closeReceiptModal: () => void;
  inspectOrderReceipt: (orderId: string) => void;

  processCheckout: () => { order: Order; transaction: Transaction } | null;
  simulateIncomingQrisOrder: () => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;

  addMenuItem: (item: Omit<MenuItem, 'id'>) => void;
  updateMenuItem: (id: string, updates: Partial<MenuItem>) => void;
  deleteMenuItem: (id: string) => void;
  toggleMenuAvailability: (id: string) => void;
  adjustMenuStock: (id: string, delta: number) => void;

  addTenant: (tenant: Omit<Tenant, 'id'>) => void;
  updateTenant: (id: string, updates: Partial<Tenant>) => void;
  toggleTenantOpen: (id: string) => void;

  settleTenantDailyRevenue: (dateStr: string) => number;
  reloadFromStorage: (eventLabel?: string) => void;
  resetDemoDatabase: () => void;
}

const initialDb = loadDatabaseFromStorage();

export const useFoodcourtStore = create<FoodcourtStoreState>((set, get) => ({
  activeTab: 'dashboard',
  setActiveTab: (tab) => set({ activeTab: tab }),

  currentUser: initialDb.users[0],
  users: initialDb.users,
  switchUser: (userId) => {
    const found = get().users.find((u) => u.id === userId);
    if (found) set({ currentUser: found });
  },

  tenants: initialDb.tenants,
  menus: initialDb.menus,
  orders: initialDb.orders,
  transactions: initialDb.transactions,
  settlements: initialDb.settlements,
  lastRealtimeEvent: 'Database Siap & Tersinkronisasi',

  cart: [],
  orderType: 'Dine-In',
  tableNumber: 'Meja 07',
  customerName: '',
  studentNim: '',
  paymentMethod: 'Cash',
  voucherCode: '',
  discountPercent: 0,
  customDiscountNominal: 0,
  taxRate: 0,
  cashReceived: 0,
  paymentReference: '',
  receiptPaperSize: '58mm',
  activeReceiptOrder: null,
  activeReceiptTransaction: null,

  addToCart: (menu) => {
    if (!menu.is_available || menu.stock <= 0) return;
    const state = get();
    const tenant = state.tenants.find((t) => t.id === menu.tenant_id);
    if (tenant && !tenant.is_open) return;

    const existingIndex = state.cart.findIndex((c) => c.menu.id === menu.id);
    if (existingIndex > -1) {
      const currentQty = state.cart[existingIndex].quantity;
      if (currentQty >= menu.stock) return;
      const updated = [...state.cart];
      updated[existingIndex] = {
        ...updated[existingIndex],
        quantity: currentQty + 1,
      };
      set({ cart: updated });
    } else {
      set({
        cart: [
          ...state.cart,
          {
            menu,
            tenant_name: tenant?.name || 'Stan UNUGHA',
            booth_number: tenant?.booth_number || 'A-00',
            quantity: 1,
            notes: '',
          },
        ],
      });
    }
  },

  updateCartQuantity: (menuId, delta) => {
    const state = get();
    const updated = state.cart
      .map((item) => {
        if (item.menu.id !== menuId) return item;
        const nextQty = item.quantity + delta;
        if (nextQty <= 0) return null;
        if (nextQty > item.menu.stock) return item;
        return { ...item, quantity: nextQty };
      })
      .filter(Boolean) as CartItem[];
    set({ cart: updated });
  },

  updateCartNotes: (menuId, notes) => {
    set({
      cart: get().cart.map((item) =>
        item.menu.id === menuId ? { ...item, notes } : item
      ),
    });
  },

  removeFromCart: (menuId) => {
    set({ cart: get().cart.filter((item) => item.menu.id !== menuId) });
  },

  clearCart: () =>
    set({
      cart: [],
      voucherCode: '',
      discountPercent: 0,
      customDiscountNominal: 0,
      taxRate: 0,
      cashReceived: 0,
      paymentReference: '',
    }),

  setOrderType: (orderType) =>
    set({
      orderType,
      tableNumber: orderType === 'Takeaway' ? 'Takeaway' : 'Meja 07',
    }),
  setTableNumber: (tableNumber) => set({ tableNumber }),
  setCustomerName: (customerName) => set({ customerName }),
  setStudentNim: (studentNim) => set({ studentNim }),
  setPaymentMethod: (paymentMethod) =>
    set({
      paymentMethod,
      cashReceived: 0,
    }),
  setVoucherCode: (voucherCode) => set({ voucherCode: voucherCode.toUpperCase() }),
  setDiscountPercent: (discountPercent) =>
    set({
      discountPercent,
      customDiscountNominal: 0,
    }),
  setCustomDiscountNominal: (customDiscountNominal) =>
    set({
      customDiscountNominal,
      discountPercent: 0,
    }),
  setTaxRate: (taxRate) => set({ taxRate }),
  setPaymentReference: (paymentReference) => set({ paymentReference }),
  setReceiptPaperSize: (receiptPaperSize) => set({ receiptPaperSize }),
  setCashReceived: (cashReceived) => set({ cashReceived }),
  closeReceiptModal: () =>
    set({ activeReceiptOrder: null, activeReceiptTransaction: null }),

  inspectOrderReceipt: (orderId) => {
    const state = get();
    const order = state.orders.find((o) => o.id === orderId) || null;
    const transaction =
      state.transactions.find((t) => t.order_id === orderId) || null;
    if (order && transaction) {
      set({
        activeReceiptOrder: order,
        activeReceiptTransaction: transaction,
      });
    }
  },

  processCheckout: () => {
    const state = get();
    if (state.cart.length === 0) return null;

    const subtotal = state.cart.reduce(
      (sum, item) => sum + item.menu.price * item.quantity,
      0
    );

    let discountAmount = 0;
    const cleanVoucher = state.voucherCode.trim().toUpperCase();
    if (state.customDiscountNominal > 0) {
      discountAmount = Math.min(subtotal, state.customDiscountNominal);
    } else if (state.discountPercent > 0) {
      discountAmount = Math.round(subtotal * (state.discountPercent / 100));
    } else if (cleanVoucher === 'MAHASISWA10') {
      discountAmount = Math.round(subtotal * 0.1);
    } else if (cleanVoucher === 'JUMATBERKAH') {
      discountAmount = Math.min(5000, subtotal);
    }

    const subtotalAfterDiscount = Math.max(0, subtotal - discountAmount);
    const taxAmount =
      state.taxRate > 0
        ? Math.round(subtotalAfterDiscount * (state.taxRate / 100))
        : 0;
    const grandTotal = subtotalAfterDiscount + taxAmount;

    const isCash = state.paymentMethod === 'Cash';
    const amountReceived = isCash
      ? Math.max(grandTotal, state.cashReceived > 0 ? state.cashReceived : grandTotal)
      : grandTotal;
    const changeAmount = isCash
      ? Math.max(0, amountReceived - grandTotal)
      : 0;

    const nowIso = new Date().toISOString();
    const dateCompact = nowIso.slice(0, 10).replace(/-/g, '');
    const seqNum = String(state.orders.length + 1).padStart(3, '0');
    const orderId = `ord-${Date.now()}`;
    const invoiceNumber = `INV/UNUGHA/${dateCompact}/${seqNum}`;
    const orderNumber = `ORD-${dateCompact}-${seqNum}`;
    const queueNumber = `A-${seqNum}`;
    const customerLabel =
      state.customerName.trim() || 'Pelanggan Umum / Mahasiswa';

    const orderItems: OrderItem[] = state.cart.map((c, idx) => ({
      id: `${orderId}-item-${idx + 1}`,
      order_id: orderId,
      menu_id: c.menu.id,
      menu_name: c.menu.name,
      menu_sku: c.menu.sku,
      tenant_id: c.menu.tenant_id,
      tenant_name: c.tenant_name,
      booth_number: c.booth_number,
      quantity: c.quantity,
      unit_price: c.menu.price,
      subtotal: c.menu.price * c.quantity,
      notes: c.notes.trim() || undefined,
    }));

    const newOrder: Order = {
      id: orderId,
      invoice_number: invoiceNumber,
      order_number: orderNumber,
      queue_number: queueNumber,
      customer_name: customerLabel,
      student_nim: state.studentNim.trim() || undefined,
      table_number: state.tableNumber || 'Meja 01',
      order_type: state.orderType,
      order_status: 'menunggu',
      source: 'POS Kasir',
      created_at: nowIso,
      updated_at: nowIso,
      cashier_id: state.currentUser.id,
      cashier_name: state.currentUser.full_name,
      items: orderItems,
      subtotal,
      discount_percent: state.discountPercent,
      discount_amount: discountAmount,
      voucher_code:
        discountAmount > 0
          ? cleanVoucher ||
            (state.customDiscountNominal > 0
              ? `Potongan Rp ${state.customDiscountNominal.toLocaleString('id-ID')}`
              : `${state.discountPercent}%`)
          : undefined,
      tax_rate: state.taxRate,
      tax_amount: taxAmount,
      grand_total: grandTotal,
    };

    const foodcourtCommission = Math.round(grandTotal * 0.1);
    const tenantNetTotal = grandTotal - foodcourtCommission;

    let fallbackRef = 'CASH-DRAWER';
    if (state.paymentMethod === 'QRIS') {
      fallbackRef = `QRIS-UNUGHA-${Math.floor(100000 + Math.random() * 900000)}`;
    } else if (
      state.paymentMethod === 'Transfer' ||
      state.paymentMethod === 'Transfer Bank'
    ) {
      fallbackRef = `TRF-BSI-${Math.floor(100000 + Math.random() * 900000)}`;
    } else if (state.paymentMethod === 'E-Wallet') {
      fallbackRef = `EWL-${Math.floor(100000 + Math.random() * 900000)}`;
    } else if (state.paymentMethod === 'KTM UNUGHA') {
      fallbackRef = `KTM-${state.studentNim.trim() || 'UNUGHA'}`;
    }

    const finalPaymentRef = state.paymentReference.trim() || fallbackRef;

    const newTransaction: Transaction = {
      id: `trx-${Date.now()}`,
      invoice_number: invoiceNumber,
      transaction_code: `TRX-UNUGHA-${dateCompact.slice(2)}-${seqNum}`,
      order_id: orderId,
      order_number: orderNumber,
      customer_name: customerLabel,
      payment_method: state.paymentMethod,
      payment_status: 'lunas',
      subtotal,
      discount_amount: discountAmount,
      tax_amount: taxAmount,
      grand_total: grandTotal,
      amount_received: amountReceived,
      change_amount: changeAmount,
      foodcourt_commission: foodcourtCommission,
      tenant_net_total: tenantNetTotal,
      paid_at: nowIso,
      cashier_name: state.currentUser.full_name,
      payment_reference: finalPaymentRef,
    };

    const updatedMenus = state.menus.map((m) => {
      const cartEntry = state.cart.find((c) => c.menu.id === m.id);
      if (!cartEntry) return m;
      const nextStock = Math.max(0, m.stock - cartEntry.quantity);
      return {
        ...m,
        stock: nextStock,
        is_available: nextStock > 0 ? m.is_available : false,
      };
    });

    const nextOrders = [newOrder, ...state.orders];
    const nextTransactions = [newTransaction, ...state.transactions];

    saveDatabaseToStorage({
      users: state.users,
      tenants: state.tenants,
      menus: updatedMenus,
      orders: nextOrders,
      transactions: nextTransactions,
      settlements: state.settlements,
    });

    broadcastDatabaseSync(`Transaksi Baru ${newTransaction.transaction_code}`);

    set({
      menus: updatedMenus,
      orders: nextOrders,
      transactions: nextTransactions,
      cart: [],
      customerName: '',
      studentNim: '',
      voucherCode: '',
      discountPercent: 0,
      customDiscountNominal: 0,
      taxRate: 0,
      cashReceived: 0,
      paymentReference: '',
      activeReceiptOrder: newOrder,
      activeReceiptTransaction: newTransaction,
      lastRealtimeEvent: `Invoice ${newTransaction.invoice_number} (${newOrder.queue_number}) Lunas`,
    });

    return { order: newOrder, transaction: newTransaction };
  },

  simulateIncomingQrisOrder: () => {
    const state = get();
    const availableMenus = state.menus.filter(
      (m) => m.is_available && m.stock > 1
    );
    const chosenMenus =
      availableMenus.length >= 2
        ? [
            availableMenus[Math.floor(Math.random() * availableMenus.length)],
            availableMenus[Math.floor(Math.random() * availableMenus.length)],
          ]
        : state.menus.slice(0, 2);

    const uniqueMenus = Array.from(new Set(chosenMenus));
    const sampleStudents = [
      { name: 'Fajar Ramadhan (FTI)', nim: '230510081', table: 'Meja 14' },
      { name: 'Aisyah Zahra (FKIP)', nim: '240201032', table: 'Meja 06' },
      { name: 'Dimas Wahyu (FEBI)', nim: '220102055', table: 'Meja 11' },
      { name: 'Rina Kartika (FKI)', nim: '230401019', table: 'Meja 03' },
      { name: 'Ilham Maulana (FT)', nim: '210603044', table: 'Meja 18' },
    ];
    const student =
      sampleStudents[Math.floor(Math.random() * sampleStudents.length)];

    const nowIso = new Date().toISOString();
    const dateCompact = nowIso.slice(0, 10).replace(/-/g, '');
    const seqNum = String(state.orders.length + 1).padStart(3, '0');
    const orderId = `ord-qris-${Date.now()}`;
    const invoiceNumber = `INV/UNUGHA/${dateCompact}/${seqNum}`;
    const orderNumber = `ORD-${dateCompact}-${seqNum}`;
    const queueNumber = `A-${seqNum}`;

    const orderItems: OrderItem[] = uniqueMenus.map((m, idx) => {
      const tenant = state.tenants.find((t) => t.id === m.tenant_id);
      return {
        id: `${orderId}-i-${idx}`,
        order_id: orderId,
        menu_id: m.id,
        menu_name: m.name,
        menu_sku: m.sku,
        tenant_id: m.tenant_id,
        tenant_name: tenant?.name || 'Stan UNUGHA',
        booth_number: tenant?.booth_number || 'A-01',
        quantity: 1,
        unit_price: m.price,
        subtotal: m.price,
        notes: 'Pesanan QRIS Meja Mandiri',
      };
    });

    const subtotal = orderItems.reduce((acc, i) => acc + i.subtotal, 0);
    const newOrder: Order = {
      id: orderId,
      invoice_number: invoiceNumber,
      order_number: orderNumber,
      queue_number: queueNumber,
      customer_name: student.name,
      student_nim: student.nim,
      table_number: student.table,
      order_type: 'Dine-In',
      order_status: 'menunggu',
      source: 'QRIS Meja Mandiri',
      created_at: nowIso,
      updated_at: nowIso,
      cashier_id: state.currentUser.id,
      cashier_name: 'Sistem QRIS Otomatis',
      items: orderItems,
      subtotal,
      discount_percent: 0,
      discount_amount: 0,
      tax_rate: 0,
      tax_amount: 0,
      grand_total: subtotal,
    };

    const commission = Math.round(subtotal * 0.1);
    const newTransaction: Transaction = {
      id: `trx-qris-${Date.now()}`,
      invoice_number: invoiceNumber,
      transaction_code: `TRX-UNUGHA-${dateCompact.slice(2)}-${seqNum}`,
      order_id: orderId,
      order_number: orderNumber,
      customer_name: student.name,
      payment_method: 'QRIS',
      payment_status: 'lunas',
      subtotal,
      discount_amount: 0,
      tax_amount: 0,
      grand_total: subtotal,
      amount_received: subtotal,
      change_amount: 0,
      foodcourt_commission: commission,
      tenant_net_total: subtotal - commission,
      paid_at: nowIso,
      cashier_name: 'Gateway QRIS UNUGHA',
      payment_reference: `QRIS-AUTO-${Math.floor(100000 + Math.random() * 900000)}`,
    };

    const updatedMenus = state.menus.map((m) => {
      const used = orderItems.find((oi) => oi.menu_id === m.id);
      if (!used) return m;
      return { ...m, stock: Math.max(0, m.stock - used.quantity) };
    });

    const nextOrders = [newOrder, ...state.orders];
    const nextTransactions = [newTransaction, ...state.transactions];

    saveDatabaseToStorage({
      users: state.users,
      tenants: state.tenants,
      menus: updatedMenus,
      orders: nextOrders,
      transactions: nextTransactions,
      settlements: state.settlements,
    });

    broadcastDatabaseSync(`QRIS Masuk ${queueNumber}`);

    set({
      menus: updatedMenus,
      orders: nextOrders,
      transactions: nextTransactions,
      lastRealtimeEvent: `Pesanan QRIS Mandiri ${queueNumber} (${student.table}) Masuk`,
    });

    return newOrder;
  },

  updateOrderStatus: (orderId, status) => {
    const state = get();
    const nowIso = new Date().toISOString();
    const nextOrders = state.orders.map((o) =>
      o.id === orderId ? { ...o, order_status: status, updated_at: nowIso } : o
    );

    saveDatabaseToStorage({
      users: state.users,
      tenants: state.tenants,
      menus: state.menus,
      orders: nextOrders,
      transactions: state.transactions,
      settlements: state.settlements,
    });

    broadcastDatabaseSync(`Update Status Pesanan ${orderId}`);
    set({
      orders: nextOrders,
      lastRealtimeEvent: `Status pesanan diperbarui ke "${status.replace('_', ' ')}"`,
    });
  },

  addMenuItem: (item) => {
    const state = get();
    const newMenu: MenuItem = {
      ...item,
      id: `mnu-${Date.now()}`,
    };
    const nextMenus = [newMenu, ...state.menus];
    saveDatabaseToStorage({
      users: state.users,
      tenants: state.tenants,
      menus: nextMenus,
      orders: state.orders,
      transactions: state.transactions,
      settlements: state.settlements,
    });
    broadcastDatabaseSync(`Tambah Menu ${newMenu.name}`);
    set({
      menus: nextMenus,
      lastRealtimeEvent: `Menu "${newMenu.name}" ditambahkan ke database`,
    });
  },

  updateMenuItem: (id, updates) => {
    const state = get();
    const nextMenus = state.menus.map((m) =>
      m.id === id ? { ...m, ...updates } : m
    );
    saveDatabaseToStorage({
      users: state.users,
      tenants: state.tenants,
      menus: nextMenus,
      orders: state.orders,
      transactions: state.transactions,
      settlements: state.settlements,
    });
    broadcastDatabaseSync(`Update Menu ${id}`);
    set({
      menus: nextMenus,
      lastRealtimeEvent: `Data menu berhasil diperbarui`,
    });
  },

  deleteMenuItem: (id) => {
    const state = get();
    const nextMenus = state.menus.filter((m) => m.id !== id);
    const nextCart = state.cart.filter((c) => c.menu.id !== id);
    saveDatabaseToStorage({
      users: state.users,
      tenants: state.tenants,
      menus: nextMenus,
      orders: state.orders,
      transactions: state.transactions,
      settlements: state.settlements,
    });
    broadcastDatabaseSync(`Hapus Menu ${id}`);
    set({
      menus: nextMenus,
      cart: nextCart,
      lastRealtimeEvent: `Item menu dihapus dari katalog`,
    });
  },

  toggleMenuAvailability: (id) => {
    const state = get();
    const nextMenus = state.menus.map((m) =>
      m.id === id ? { ...m, is_available: !m.is_available } : m
    );
    saveDatabaseToStorage({
      users: state.users,
      tenants: state.tenants,
      menus: nextMenus,
      orders: state.orders,
      transactions: state.transactions,
      settlements: state.settlements,
    });
    broadcastDatabaseSync(`Toggle Menu ${id}`);
    set({ menus: nextMenus });
  },

  adjustMenuStock: (id, delta) => {
    const state = get();
    const nextMenus = state.menus.map((m) => {
      if (m.id !== id) return m;
      const nextStock = Math.max(0, m.stock + delta);
      return {
        ...m,
        stock: nextStock,
        is_available: nextStock > 0 ? m.is_available : false,
      };
    });
    saveDatabaseToStorage({
      users: state.users,
      tenants: state.tenants,
      menus: nextMenus,
      orders: state.orders,
      transactions: state.transactions,
      settlements: state.settlements,
    });
    broadcastDatabaseSync(`Stok Menu ${id}`);
    set({ menus: nextMenus });
  },

  addTenant: (tenantData) => {
    const state = get();
    const newTenant: Tenant = {
      ...tenantData,
      id: `tnt-${Date.now()}`,
    };
    const nextTenants = [...state.tenants, newTenant];
    saveDatabaseToStorage({
      users: state.users,
      tenants: nextTenants,
      menus: state.menus,
      orders: state.orders,
      transactions: state.transactions,
      settlements: state.settlements,
    });
    broadcastDatabaseSync(`Tambah Stan ${newTenant.name}`);
    set({
      tenants: nextTenants,
      lastRealtimeEvent: `Stan baru "${newTenant.name}" terdaftar`,
    });
  },

  updateTenant: (id, updates) => {
    const state = get();
    const nextTenants = state.tenants.map((t) =>
      t.id === id ? { ...t, ...updates } : t
    );
    saveDatabaseToStorage({
      users: state.users,
      tenants: nextTenants,
      menus: state.menus,
      orders: state.orders,
      transactions: state.transactions,
      settlements: state.settlements,
    });
    broadcastDatabaseSync(`Update Stan ${id}`);
    set({ tenants: nextTenants });
  },

  toggleTenantOpen: (id) => {
    const state = get();
    const nextTenants = state.tenants.map((t) =>
      t.id === id ? { ...t, is_open: !t.is_open } : t
    );
    saveDatabaseToStorage({
      users: state.users,
      tenants: nextTenants,
      menus: state.menus,
      orders: state.orders,
      transactions: state.transactions,
      settlements: state.settlements,
    });
    broadcastDatabaseSync(`Status Buka/Tutup Stan ${id}`);
    set({ tenants: nextTenants });
  },

  settleTenantDailyRevenue: (dateStr) => {
    const state = get();
    const targetDate = dateStr || getTodayDateString();
    const dayOrders = state.orders.filter(
      (o) =>
        o.order_status !== 'dibatalkan' &&
        o.created_at.slice(0, 10) === targetDate
    );

    const newSettlements: DailySettlement[] = [];

    state.tenants.forEach((tenant) => {
      let totalOrders = 0;
      let itemsSold = 0;
      let grossSales = 0;

      dayOrders.forEach((ord) => {
        const tenantItems = ord.items.filter((i) => i.tenant_id === tenant.id);
        if (tenantItems.length > 0) {
          totalOrders += 1;
          tenantItems.forEach((ti) => {
            itemsSold += ti.quantity;
            grossSales += ti.subtotal;
          });
        }
      });

      if (grossSales > 0) {
        const commissionAmount = Math.round(
          (grossSales * tenant.commission_percent) / 100
        );
        const netPayout = grossSales - commissionAmount;

        newSettlements.push({
          id: `stl-${targetDate}-${tenant.id}`,
          settlement_date: targetDate,
          tenant_id: tenant.id,
          tenant_name: tenant.name,
          booth_number: tenant.booth_number,
          total_orders: totalOrders,
          items_sold: itemsSold,
          gross_sales: grossSales,
          commission_percent: tenant.commission_percent,
          commission_amount: commissionAmount,
          net_payout: netPayout,
          status: 'settled',
          settled_at: new Date().toISOString(),
          verified_by: state.currentUser.full_name,
        });
      }
    });

    const filteredExisting = state.settlements.filter(
      (s) => s.settlement_date !== targetDate
    );
    const nextSettlements = [...newSettlements, ...filteredExisting];

    saveDatabaseToStorage({
      users: state.users,
      tenants: state.tenants,
      menus: state.menus,
      orders: state.orders,
      transactions: state.transactions,
      settlements: nextSettlements,
    });

    broadcastDatabaseSync(`Tutup Buku Settlement ${targetDate}`);
    set({
      settlements: nextSettlements,
      lastRealtimeEvent: `Tutup buku harian (${newSettlements.length} stan) berhasil disimpan ke tabel daily_settlements`,
    });

    return newSettlements.length;
  },

  reloadFromStorage: (eventLabel) => {
    const fresh = loadDatabaseFromStorage();
    set({
      users: fresh.users,
      tenants: fresh.tenants,
      menus: fresh.menus,
      orders: fresh.orders,
      transactions: fresh.transactions,
      settlements: fresh.settlements,
      lastRealtimeEvent: eventLabel || 'Sinkronisasi Real-Time Diterima',
    });
  },

  resetDemoDatabase: () => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(STORAGE_KEY);
    }
    const fresh = loadDatabaseFromStorage();
    set({
      users: fresh.users,
      tenants: fresh.tenants,
      menus: fresh.menus,
      orders: fresh.orders,
      transactions: fresh.transactions,
      settlements: fresh.settlements,
      cart: [],
      lastRealtimeEvent: 'Database di-reset ke data awal Foodcourt UNUGHA',
    });
  },
}));
