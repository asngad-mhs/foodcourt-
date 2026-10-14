import React from 'react';
import {
  Store,
  ShoppingCart,
  Clock,
  BarChart3,
  BookOpen,
  Building2,
  Database,
  Presentation,
  CheckCircle2,
  ArrowUpRight,
  TrendingUp,
  Users,
  UtensilsCrossed,
  Receipt,
  AlertCircle,
  Plus,
  CreditCard,
  Banknote,
  QrCode,
  Building,
  Sparkles,
  Calendar,
} from 'lucide-react';
import { useFoodcourtStore } from '../stores/useFoodcourtStore';
import {
  formatRupiah,
  formatDateId,
  formatTimeShort,
  getTodayDateString,
  isSameDay,
} from '../utils/formatters';

export const DashboardPage: React.FC = () => {
  const setActiveTab = useFoodcourtStore((s) => s.setActiveTab);
  const currentUser = useFoodcourtStore((s) => s.currentUser);
  const orders = useFoodcourtStore((s) => s.orders);
  const transactions = useFoodcourtStore((s) => s.transactions);
  const tenants = useFoodcourtStore((s) => s.tenants);
  const menus = useFoodcourtStore((s) => s.menus);
  const cart = useFoodcourtStore((s) => s.cart);
  const simulateIncomingQrisOrder = useFoodcourtStore(
    (s) => s.simulateIncomingQrisOrder
  );
  const inspectOrderReceipt = useFoodcourtStore((s) => s.inspectOrderReceipt);

  const todayStr = getTodayDateString();

  // Filter transactions and orders for today
  const todayTransactions = transactions.filter((t) =>
    isSameDay(t.paid_at, todayStr)
  );
  const todayOrders = orders.filter((o) =>
    isSameDay(o.created_at, todayStr) && o.order_status !== 'dibatalkan'
  );

  // Financial aggregates
  const todayRevenue = todayTransactions.reduce(
    (sum, t) => sum + t.grand_total,
    0
  );
  const todayTenantNet = todayTransactions.reduce(
    (sum, t) => sum + t.tenant_net_total,
    0
  );
  const todayCommission = todayTransactions.reduce(
    (sum, t) => sum + t.foodcourt_commission,
    0
  );

  // Active / Kitchen pending orders
  const activeKitchenOrders = orders.filter(
    (o) => o.order_status === 'menunggu' || o.order_status === 'dimasak'
  );
  const readyOrders = orders.filter((o) => o.order_status === 'siap_saji');
  const completedOrders = todayOrders.filter((o) => o.order_status === 'selesai');

  // Total portions sold
  const totalPortionsSold = todayOrders.reduce(
    (sum, o) => sum + o.items.reduce((iSum, item) => iSum + item.quantity, 0),
    0
  );

  // Open tenants count
  const openTenantsCount = tenants.filter((t) => t.is_open).length;

  // Top 5 menus today
  const menuCountMap = new Map<
    string,
    { name: string; booth: string; tenant: string; count: number; total: number }
  >();

  todayOrders.forEach((o) => {
    o.items.forEach((item) => {
      const prev = menuCountMap.get(item.menu_id);
      if (prev) {
        prev.count += item.quantity;
        prev.total += item.subtotal;
      } else {
        menuCountMap.set(item.menu_id, {
          name: item.menu_name,
          booth: item.booth_number,
          tenant: item.tenant_name,
          count: item.quantity,
          total: item.subtotal,
        });
      }
    });
  });

  const topSellingMenus = Array.from(menuCountMap.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Payment methods breakdown
  const paymentMethodCounts: Record<string, { count: number; nominal: number }> = {};
  todayTransactions.forEach((t) => {
    const method = t.payment_method;
    if (!paymentMethodCounts[method]) {
      paymentMethodCounts[method] = { count: 0, nominal: 0 };
    }
    paymentMethodCounts[method].count += 1;
    paymentMethodCounts[method].nominal += t.grand_total;
  });

  // Recent 5 orders
  const recentOrders = orders.slice(0, 5);

  return (
    <div className="flex flex-col gap-6">
      {/* 1. Hero / Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-900 via-emerald-800 to-slate-900 text-white p-6 sm:p-8 shadow-sm">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Sistem Kasir Sentral Foodcourt UNUGHA Cilacap</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-white">
              Selamat Bertugas, {currentUser.full_name}
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed">
              Pusat kendali transaksi sentral, antrean dapur multi-stan,
              katalog hidangan kampus, serta sistem pembagian bagi hasil (90%
              Mitra Stan : 10% Pengelola UNUGHA).
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-emerald-200/90 pt-1 font-mono-tabular">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {formatDateId(new Date().toISOString())}
              </span>
              <span>•</span>
              <span>Shift: {currentUser.shift}</span>
              <span>•</span>
              <span className="capitalize">Role: {currentUser.role.replace('_', ' ')}</span>
            </div>
          </div>

          {/* Quick Action CTA Buttons */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('kasir')}
              className="inline-flex items-center gap-2 px-5 py-3 text-xs font-bold text-slate-900 bg-emerald-300 hover:bg-emerald-200 rounded-xl transition-all shadow-sm hover:scale-[1.02] active:scale-[0.98] cursor-pointer whitespace-nowrap"
            >
              <ShoppingCart className="w-4 h-4 text-emerald-900" />
              <span>Buka Kasir POS</span>
              {cart.length > 0 && (
                <span className="px-2 py-0.5 text-[10px] bg-emerald-900 text-white rounded-full">
                  {cart.reduce((s, i) => s + i.quantity, 0)} item
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('antrean')}
              className="inline-flex items-center gap-2 px-4 py-3 text-xs font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-all cursor-pointer whitespace-nowrap"
            >
              <Clock className="w-4 h-4 text-amber-300" />
              <span>Antrean Dapur ({activeKitchenOrders.length})</span>
            </button>

            <button
              type="button"
              onClick={() => simulateIncomingQrisOrder()}
              title="Simulasi pesanan masuk otomatis dari scan QRIS meja mahasiswa"
              className="inline-flex items-center gap-1.5 px-3 py-3 text-xs font-semibold text-emerald-200 hover:text-white bg-emerald-950/40 hover:bg-emerald-950/70 border border-emerald-600/40 rounded-xl transition-all cursor-pointer whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5 text-emerald-300" />
              <span>Simulasi QRIS</span>
            </button>
          </div>
        </div>

        {/* Decorative background overlay */}
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 2. Key Metrics Grid (6 KPI Cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
        {/* Metric 1: Total Omzet Hari Ini */}
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Omzet Hari Ini</span>
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2">
            <span className="text-base sm:text-lg font-bold text-slate-900 font-mono-tabular block">
              {formatRupiah(todayRevenue)}
            </span>
            <span className="text-[11px] text-slate-500 font-mono-tabular">
              {todayTransactions.length} nota transaksi lunas
            </span>
          </div>
        </div>

        {/* Metric 2: Hak Bersih Stan 90% */}
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Hak Mitra Stan (90%)</span>
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-700">
              <Building2 className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2">
            <span className="text-base sm:text-lg font-bold text-blue-900 font-mono-tabular block">
              {formatRupiah(todayTenantNet)}
            </span>
            <span className="text-[11px] text-slate-500">
              Dana siap transfer pencairan
            </span>
          </div>
        </div>

        {/* Metric 3: Komisi Kampus 10% */}
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Komisi UNUGHA (10%)</span>
            <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-700">
              <Building className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2">
            <span className="text-base sm:text-lg font-bold text-indigo-900 font-mono-tabular block">
              {formatRupiah(todayCommission)}
            </span>
            <span className="text-[11px] text-slate-500">
              Kas operasional &amp; fasilitas
            </span>
          </div>
        </div>

        {/* Metric 4: Antrean Dapur Sedang Dimasak */}
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Antrean Dapur Aktif</span>
            <span className="p-1.5 rounded-lg bg-amber-50 text-amber-700">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2">
            <span className="text-base sm:text-lg font-bold text-amber-900 font-mono-tabular block">
              {activeKitchenOrders.length} Pesanan
            </span>
            <span className="text-[11px] text-slate-500">
              {readyOrders.length} siap diambil pelanggan
            </span>
          </div>
        </div>

        {/* Metric 5: Total Porsi Terjual */}
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Porsi Makanan &amp; Minuman</span>
            <span className="p-1.5 rounded-lg bg-purple-50 text-purple-700">
              <UtensilsCrossed className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2">
            <span className="text-base sm:text-lg font-bold text-purple-900 font-mono-tabular block">
              {totalPortionsSold} Porsi
            </span>
            <span className="text-[11px] text-slate-500">
              {completedOrders.length} nota selesai diserahkan
            </span>
          </div>
        </div>

        {/* Metric 6: Mitra Stan Beroperasi */}
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Stan Beroperasi</span>
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
              <Store className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2">
            <span className="text-base sm:text-lg font-bold text-slate-900 font-mono-tabular block">
              {openTenantsCount} / {tenants.length} Stan
            </span>
            <span className="text-[11px] text-emerald-800 font-semibold">
              Kantin Kampus Beroperasi
            </span>
          </div>
        </div>
      </div>

      {/* 3. Operational Grid (2 Columns: Recent Orders & Top Selling Menus) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 spans): Antrean Dapur & Transaksi Terkini */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card: Antrean Dapur Terkini */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Antrean Dapur Terkini (Kitchen Display Status)
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Monitor pesanan dari kasir sentral yang sedang diproses oleh
                  koki di masing-masing stan
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('antrean')}
                className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 inline-flex items-center gap-1 cursor-pointer"
              >
                <span>Buka Layar Dapur</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {recentOrders.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500">
                  Belum ada pesanan aktif saat ini.
                </div>
              ) : (
                recentOrders.map((order) => {
                  const isPending = order.order_status === 'menunggu';
                  const isCooking = order.order_status === 'dimasak';
                  const isReady = order.order_status === 'siap_saji';
                  const isCompleted = order.order_status === 'selesai';

                  let statusBadgeClass = 'bg-slate-100 text-slate-700';
                  let statusLabel = 'Menunggu Dapur';

                  if (isPending) {
                    statusBadgeClass = 'bg-rose-50 text-rose-800 border-rose-200';
                    statusLabel = 'Menunggu Dapur';
                  } else if (isCooking) {
                    statusBadgeClass = 'bg-amber-50 text-amber-900 border-amber-200';
                    statusLabel = 'Sedang Dimasak';
                  } else if (isReady) {
                    statusBadgeClass = 'bg-emerald-50 text-emerald-900 border-emerald-200';
                    statusLabel = 'Siap Diambil';
                  } else if (isCompleted) {
                    statusBadgeClass = 'bg-slate-100 text-slate-700 border-slate-200';
                    statusLabel = 'Selesai';
                  }

                  return (
                    <div
                      key={order.id}
                      className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/80 transition-colors text-xs"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex flex-col items-center justify-center shrink-0">
                          <span className="text-[9px] uppercase font-bold text-slate-500">
                            Antrean
                          </span>
                          <span className="text-sm font-black text-slate-900 font-mono-tabular">
                            {order.queue_number}
                          </span>
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900">
                              {order.customer_name}
                            </span>
                            <span className="text-slate-400">•</span>
                            <span className="text-slate-600 font-medium">
                              {order.table_number} ({order.order_type})
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5 font-mono-tabular">
                            {order.items.length} varian menu (
                            {order.items.map((i) => i.menu_name).join(', ')})
                          </p>
                          <div className="flex items-center gap-3 text-[10px] text-slate-400 mt-1 font-mono-tabular">
                            <span>Faktur: {order.invoice_number}</span>
                            <span>•</span>
                            <span>Waktu: {formatTimeShort(order.created_at)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                        <span
                          className={`px-2.5 py-1 text-[11px] font-semibold border rounded-lg ${statusBadgeClass}`}
                        >
                          {statusLabel}
                        </span>

                        <button
                          type="button"
                          onClick={() => inspectOrderReceipt(order.id)}
                          className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                          title="Lihat / Cetak Struk"
                        >
                          <Receipt className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Quick Jump Modules Navigation Hub */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
            <h2 className="text-sm font-bold text-slate-900 mb-1">
              Pusat Akses Cepat Seluruh Modul Sistem
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Pilih modul di bawah untuk langsung menuju halaman operasional
              terkait:
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setActiveTab('kasir')}
                className="p-3.5 bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-xl text-left transition-all group cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                  <ShoppingCart className="w-4 h-4" />
                </div>
                <div className="font-bold text-xs text-slate-900 group-hover:text-emerald-900">
                  Kasir POS
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Input pesanan, diskon &amp; nota
                </div>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('antrean')}
                className="p-3.5 bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-300 rounded-xl text-left transition-all group cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                  <Clock className="w-4 h-4" />
                </div>
                <div className="font-bold text-xs text-slate-900 group-hover:text-amber-900">
                  Antrean Dapur
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Monitor layar dapur 6 stan
                </div>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('menu')}
                className="p-3.5 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-xl text-left transition-all group cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div className="font-bold text-xs text-slate-900 group-hover:text-blue-900">
                  Manajemen Menu
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Katalog, foto &amp; kontrol stok
                </div>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('tenant')}
                className="p-3.5 bg-slate-50 hover:bg-purple-50 border border-slate-200 hover:border-purple-300 rounded-xl text-left transition-all group cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                  <Building2 className="w-4 h-4" />
                </div>
                <div className="font-bold text-xs text-slate-900 group-hover:text-purple-900">
                  Mitra Stan (Tenant)
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Kavling stan &amp; rekening pencairan
                </div>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('laporan')}
                className="p-3.5 bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-xl text-left transition-all group cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <div className="font-bold text-xs text-slate-900 group-hover:text-emerald-900">
                  Laporan &amp; Settlement
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Bagi hasil 90:10 &amp; ekspor CSV
                </div>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('presentasi')}
                className="p-3.5 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 rounded-xl text-left transition-all group cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-800 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                  <Presentation className="w-4 h-4" />
                </div>
                <div className="font-bold text-xs text-slate-900 group-hover:text-indigo-900">
                  Laporan PPT &amp; Uji
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  15 Slide, RCA &amp; Test Case 14
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column (1 span): Leaderboard Menu & Payment Breakdown */}
        <div className="space-y-6">
          {/* Card: Top Selling Menus Today */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Menu Terlaris Hari Ini
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Berdasarkan porsi terjual dari transaksi lunas
                </p>
              </div>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                Top 5
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {topSellingMenus.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-500">
                  Belum ada pesanan terjual hari ini.
                </div>
              ) : (
                topSellingMenus.map((item, idx) => (
                  <div
                    key={item.name}
                    className="p-3.5 flex items-center justify-between text-xs hover:bg-slate-50/80 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="w-6 h-6 rounded-md bg-slate-100 text-slate-600 font-bold font-mono-tabular text-[11px] flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <div className="min-w-0">
                        <div className="font-semibold text-slate-900 truncate">
                          {item.name}
                        </div>
                        <div className="text-[10px] text-slate-500 truncate">
                          Stan {item.booth} ({item.tenant})
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0 font-mono-tabular">
                      <span className="font-bold text-slate-900 block">
                        {item.count} porsi
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {formatRupiah(item.total)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Card: Payment Methods Breakdown */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
            <h2 className="text-sm font-bold text-slate-900 mb-1">
              Sebaran Metode Pembayaran
            </h2>
            <p className="text-xs text-slate-500 mb-3">
              Distribusi pembayaran tunai vs digital hari ini
            </p>

            <div className="space-y-2.5">
              {Object.keys(paymentMethodCounts).length === 0 ? (
                <div className="text-xs text-slate-500 text-center py-4">
                  Belum ada transaksi pembayaran.
                </div>
              ) : (
                Object.entries(paymentMethodCounts).map(([method, data]) => {
                  const percent =
                    todayRevenue > 0
                      ? Math.round((data.nominal / todayRevenue) * 100)
                      : 0;

                  let icon = <Banknote className="w-4 h-4 text-emerald-600" />;
                  if (method === 'QRIS') {
                    icon = <QrCode className="w-4 h-4 text-blue-600" />;
                  } else if (method === 'Transfer' || method === 'Transfer Bank') {
                    icon = <Building className="w-4 h-4 text-indigo-600" />;
                  } else if (method === 'E-Wallet') {
                    icon = <CreditCard className="w-4 h-4 text-purple-600" />;
                  }

                  return (
                    <div
                      key={method}
                      className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/50 flex flex-col gap-1.5 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 font-semibold text-slate-800">
                          {icon}
                          <span>{method}</span>
                        </div>
                        <span className="font-mono-tabular font-bold text-slate-900">
                          {formatRupiah(data.nominal)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono-tabular">
                        <span>{data.count} transaksi</span>
                        <span>{percent}% dari total omzet</span>
                      </div>

                      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-emerald-600 h-full rounded-full"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Card: Status 6 Mitra Stan */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-slate-900">
                Status 6 Mitra Stan
              </h2>
              <button
                type="button"
                onClick={() => setActiveTab('tenant')}
                className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 cursor-pointer"
              >
                Kelola Stan
              </button>
            </div>

            <div className="space-y-2">
              {tenants.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-50 text-xs"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className={`w-2 h-2 rounded-full shrink-0 ${
                        t.is_open ? 'bg-emerald-500' : 'bg-slate-300'
                      }`}
                    />
                    <div className="truncate">
                      <span className="font-semibold text-slate-900">
                        Stan {t.booth_number}
                      </span>
                      <span className="text-slate-500 ml-1.5 text-[11px]">
                        ({t.name})
                      </span>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                      t.is_open
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {t.is_open ? 'Buka' : 'Tutup'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
