import React from 'react';
import {
  LayoutDashboard,
  Store,
  Clock,
  BookOpen,
  BarChart3,
  Building2,
  Database,
  Presentation,
  Plus,
  ChevronRight,
  X,
  ShoppingCart,
} from 'lucide-react';
import { NavigationTab } from '../../types';
import { useFoodcourtStore } from '../../stores/useFoodcourtStore';

interface SidebarProps {
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  onOpenAuthModal: () => void;
}

interface NavItemConfig {
  id: NavigationTab;
  label: string;
  sublabel: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  countKey?: 'cart' | 'pendingOrders';
  group: 'UTAMA' | 'OPERASIONAL' | 'MANAJEMEN' | 'LAPORAN & SISTEM';
}

const NAV_ITEMS: NavItemConfig[] = [
  // Group 0: Utama
  {
    id: 'dashboard',
    label: 'Dashboard Utama',
    sublabel: 'Pusat Kendali & Ringkasan',
    icon: LayoutDashboard,
    group: 'UTAMA',
  },

  // Group 1: Operasional
  {
    id: 'kasir',
    label: 'Kasir POS Sentral',
    sublabel: 'Katalog & Transaksi Nota',
    icon: ShoppingCart,
    countKey: 'cart',
    group: 'OPERASIONAL',
  },
  {
    id: 'antrean',
    label: 'Antrean Dapur (KDS)',
    sublabel: 'Layar Pesanan Stan Dapur',
    icon: Clock,
    countKey: 'pendingOrders',
    group: 'OPERASIONAL',
  },

  // Group 2: Manajemen
  {
    id: 'menu',
    label: 'Manajemen Menu',
    sublabel: 'Katalog & Kontrol Stok',
    icon: BookOpen,
    group: 'MANAJEMEN',
  },
  {
    id: 'tenant',
    label: 'Mitra Stan (Tenant)',
    sublabel: 'Kavling Stan & Rekening',
    icon: Building2,
    group: 'MANAJEMEN',
  },

  // Group 3: Laporan & Sistem
  {
    id: 'laporan',
    label: 'Laporan Penjualan',
    sublabel: 'Settlement 90:10 & Omzet',
    icon: BarChart3,
    group: 'LAPORAN & SISTEM',
  },
  {
    id: 'database',
    label: 'Skema Database',
    sublabel: 'Arsitektur Relasional ERD',
    icon: Database,
    group: 'LAPORAN & SISTEM',
  },
  {
    id: 'presentasi',
    label: 'Laporan PPT & Uji',
    sublabel: '15 Slide · RCA · Unit Test',
    icon: Presentation,
    badge: 'Slide 14',
    group: 'LAPORAN & SISTEM',
  },
];

export const Sidebar: React.FC<SidebarProps> = ({
  isOpenMobile = false,
  onCloseMobile,
  onOpenAuthModal,
}) => {
  const activeTab = useFoodcourtStore((s) => s.activeTab);
  const setActiveTab = useFoodcourtStore((s) => s.setActiveTab);
  const currentUser = useFoodcourtStore((s) => s.currentUser);
  const cart = useFoodcourtStore((s) => s.cart);
  const orders = useFoodcourtStore((s) => s.orders);
  const simulateIncomingQrisOrder = useFoodcourtStore(
    (s) => s.simulateIncomingQrisOrder
  );

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const pendingOrdersCount = orders.filter(
    (o) => o.order_status === 'menunggu' || o.order_status === 'dimasak'
  ).length;

  const handleSelectTab = (tab: NavigationTab) => {
    setActiveTab(tab);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  const groups: Array<'UTAMA' | 'OPERASIONAL' | 'MANAJEMEN' | 'LAPORAN & SISTEM'> = [
    'UTAMA',
    'OPERASIONAL',
    'MANAJEMEN',
    'LAPORAN & SISTEM',
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container (Fixed / Sticky on Left) */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 lg:z-30 h-screen w-72 bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-200 ease-in-out no-print ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Header / Brand Logo */}
        <div className="p-4 border-b border-slate-200 shrink-0">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => handleSelectTab('dashboard')}
              title="Kembali ke Dashboard Utama"
              className="flex items-center gap-3 text-left group cursor-pointer focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-700 to-emerald-900 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
                <Store className="w-5 h-5 text-emerald-100" />
              </div>
              <div className="flex flex-col">
                <span className="text-base font-bold text-slate-900 font-display tracking-tight leading-none group-hover:text-emerald-800 transition-colors">
                  Foodcourt UNUGHA
                </span>
                <span className="text-[11px] text-slate-500 font-medium mt-1 leading-none">
                  Sistem Kasir Sentral
                </span>
              </div>
            </button>

            {/* Mobile close button */}
            {onCloseMobile && (
              <button
                type="button"
                onClick={onCloseMobile}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 lg:hidden cursor-pointer"
                aria-label="Tutup Menu"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Status Online Pill */}
          <div className="mt-3.5 px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-lg flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              <span className="font-semibold text-emerald-900">
                POS Multi-Tenant
              </span>
            </div>
            <span className="text-emerald-700 font-mono-tabular">Live POS</span>
          </div>
        </div>

        {/* Vertical Navigation Links */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
          {groups.map((group) => {
            const items = NAV_ITEMS.filter((i) => i.group === group);
            return (
              <div key={group} className="space-y-1">
                <div className="px-3 text-[10px] font-bold tracking-wider uppercase text-slate-400 font-mono-tabular">
                  {group}
                </div>
                {items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;

                  let countBadge: number | null = null;
                  if (item.countKey === 'cart' && cartItemsCount > 0) {
                    countBadge = cartItemsCount;
                  } else if (
                    item.countKey === 'pendingOrders' &&
                    pendingOrdersCount > 0
                  ) {
                    countBadge = pendingOrdersCount;
                  }

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSelectTab(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all group cursor-pointer ${
                        isActive
                          ? 'bg-emerald-800 text-white shadow-xs font-semibold'
                          : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <Icon
                          className={`w-4 h-4 shrink-0 transition-colors ${
                            isActive
                              ? 'text-white'
                              : 'text-slate-400 group-hover:text-emerald-700'
                          }`}
                        />
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs truncate leading-tight">
                            {item.label}
                          </span>
                          <span
                            className={`text-[10px] truncate leading-tight mt-0.5 ${
                              isActive
                                ? 'text-emerald-200'
                                : 'text-slate-500'
                            }`}
                          >
                            {item.sublabel}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0 pl-2">
                        {countBadge !== null && (
                          <span
                            className={`px-2 py-0.5 text-[10px] font-mono-tabular font-bold rounded-full ${
                              isActive
                                ? 'bg-white text-emerald-900'
                                : item.countKey === 'cart'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {countBadge}
                          </span>
                        )}
                        {item.badge && (
                          <span
                            className={`px-1.5 py-0.5 text-[9px] font-bold rounded ${
                              isActive
                                ? 'bg-emerald-700 text-emerald-100'
                                : 'bg-purple-100 text-purple-700'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                        <ChevronRight
                          className={`w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity ${
                            isActive ? 'opacity-100 text-emerald-200' : 'text-slate-400'
                          }`}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            );
          })}

          {/* Quick Simulation Trigger */}
          <div className="pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => simulateIncomingQrisOrder()}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-900 hover:border-emerald-200 border border-slate-200 rounded-lg transition-all cursor-pointer shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5 text-emerald-700" />
              <span>+ Simulasi Pesanan QRIS</span>
            </button>
          </div>
        </div>

        {/* Bottom Section: Cashier User Profile & Switcher */}
        <div className="p-3 border-t border-slate-200 bg-slate-50/70 shrink-0">
          <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-white border border-slate-200 shadow-2xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs shrink-0">
                {currentUser.username.slice(0, 2).toUpperCase()}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-slate-900 truncate">
                  {currentUser.full_name}
                </span>
                <span className="text-[10px] text-slate-500 font-mono-tabular truncate capitalize">
                  {currentUser.role.replace('_', ' ')}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onOpenAuthModal}
              title="Ganti akun / shift kasir"
              className="px-2.5 py-1 text-[11px] font-semibold text-emerald-800 hover:text-emerald-950 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-md transition-colors cursor-pointer shrink-0"
            >
              Ganti
            </button>
          </div>

          <div className="mt-2 text-[10px] text-slate-400 text-center font-mono-tabular">
            UNUGHA Cilacap · Pos v1.0
          </div>
        </div>
      </aside>
    </>
  );
};
