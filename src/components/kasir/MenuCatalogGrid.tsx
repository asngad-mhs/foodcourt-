import React, { useState } from 'react';
import { Search, Plus, Utensils } from 'lucide-react';
import { MenuCategory, MenuItem } from '../../types';
import { useFoodcourtStore } from '../../stores/useFoodcourtStore';
import { formatRupiah } from '../../utils/formatters';
import { MENU_VISUAL_THEMES } from '../../assets/menuImages';
import { EmptyState } from '../common/EmptyState';

interface MenuCatalogGridProps {
  searchInputRef?: React.RefObject<HTMLInputElement | null>;
}

const CATEGORIES: ('Semua' | MenuCategory)[] = [
  'Semua',
  'Makanan Berat',
  'Mie & Bakso',
  'Minuman Kampus',
  'Camilan & Gorengan',
  'Paket Mahasiswa',
];

export const MenuCatalogGrid: React.FC<MenuCatalogGridProps> = ({
  searchInputRef,
}) => {
  const menus = useFoodcourtStore((s) => s.menus);
  const tenants = useFoodcourtStore((s) => s.tenants);
  const cart = useFoodcourtStore((s) => s.cart);
  const addToCart = useFoodcourtStore((s) => s.addToCart);

  const [selectedTenantId, setSelectedTenantId] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] =
    useState<'Semua' | MenuCategory>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredMenus = menus.filter((menu) => {
    const matchTenant =
      selectedTenantId === 'ALL' || menu.tenant_id === selectedTenantId;
    const matchCategory =
      selectedCategory === 'Semua' || menu.category === selectedCategory;
    const q = searchQuery.trim().toLowerCase();
    const tenantObj = tenants.find((t) => t.id === menu.tenant_id);
    const matchSearch =
      !q ||
      menu.name.toLowerCase().includes(q) ||
      menu.sku.toLowerCase().includes(q) ||
      (tenantObj?.name.toLowerCase().includes(q) ?? false);
    return matchTenant && matchCategory && matchSearch;
  });

  const getCartQty = (menuId: string): number => {
    const found = cart.find((c) => c.menu.id === menuId);
    return found ? found.quantity : 0;
  };

  const renderMenuVisual = (menu: MenuItem) => {
    const theme = MENU_VISUAL_THEMES[menu.image_key] || {
      bgClass: 'from-slate-800 via-slate-900 to-slate-950',
      accentColor: '#10b981',
      codeLabel: menu.sku,
      emojiIcon: '🍽️',
    };

    return (
      <div
        className={`relative h-32 w-full overflow-hidden bg-gradient-to-br ${theme.bgClass} flex flex-col justify-between p-3.5 text-white select-none`}
      >
        <div className="flex items-center justify-between text-xs text-white/75 font-mono-tabular">
          <span>{menu.sku}</span>
          <span>{menu.prep_time_minutes} mnt saji</span>
        </div>
        <div className="flex items-center gap-2.5 my-auto">
          <span className="text-2xl drop-shadow-sm">{theme.emojiIcon}</span>
          <div>
            <div className="text-xs font-bold tracking-wider text-white/95 font-mono-tabular truncate">
              {theme.codeLabel}
            </div>
            <div className="text-[11px] text-white/70">
              Stan {tenants.find((t) => t.id === menu.tenant_id)?.booth_number || 'A-00'}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between text-xs text-white/85 font-mono-tabular">
          <span>{menu.category}</span>
          <span>Stok: {menu.stock} porsi</span>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Filter & Search Bar */}
      <div className="p-4 bg-white border border-slate-200 rounded-xl flex flex-col gap-3.5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama menu, kode SKU (GPR-001), atau nama stan... (F2)"
              aria-label="Cari menu atau SKU"
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-700 focus:bg-white transition-colors"
            />
          </div>

          {/* Tenant Dropdown Selector */}
          <div className="flex items-center gap-2 shrink-0">
            <label
              htmlFor="pos-tenant-filter"
              className="text-xs font-medium text-slate-500 whitespace-nowrap"
            >
              Filter Stan:
            </label>
            <select
              id="pos-tenant-filter"
              value={selectedTenantId}
              onChange={(e) => setSelectedTenantId(e.target.value)}
              className="px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-emerald-700"
            >
              <option value="ALL">Semua Stan Foodcourt (6 Stan)</option>
              {tenants.map((t) => (
                <option key={t.id} value={t.id}>
                  Stan {t.booth_number} — {t.name} {!t.is_open ? '(Tutup)' : ''}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Interactive Category Tabs */}
        <div
          role="tablist"
          aria-label="Filter kategori menu"
          className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg overflow-x-auto"
        >
          {CATEGORIES.map((category) => {
            const active = selectedCategory === category;
            return (
              <button
                key={category}
                role="tab"
                aria-selected={active}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  active
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>

      {/* Menu Grid */}
      {filteredMenus.length === 0 ? (
        <EmptyState
          title="Menu Tidak Ditemukan"
          description="Tidak ada sajian yang cocok dengan kata kunci atau filter stan yang dipilih."
          actionLabel="Reset Filter Pencarian"
          onAction={() => {
            setSelectedTenantId('ALL');
            setSelectedCategory('Semua');
            setSearchQuery('');
          }}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredMenus.map((menu) => {
            const tenant = tenants.find((t) => t.id === menu.tenant_id);
            const isOut =
              !menu.is_available || menu.stock <= 0 || (tenant && !tenant.is_open);
            const inCartQty = getCartQty(menu.id);

            return (
              <div
                key={menu.id}
                className={`group bg-white border rounded-xl overflow-hidden flex flex-col justify-between transition-colors ${
                  inCartQty > 0
                    ? 'border-emerald-700'
                    : 'border-slate-200 hover:border-slate-300'
                } ${isOut ? 'opacity-60' : ''}`}
              >
                <div>
                  {renderMenuVisual(menu)}

                  <div className="p-4">
                    <h3 className="text-base font-semibold text-slate-900 leading-snug">
                      {menu.name}
                    </h3>

                    <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500 flex-wrap">
                      <span>Stan {tenant?.booth_number || 'A-00'}</span>
                      <span aria-hidden="true">·</span>
                      <span className="truncate max-w-[160px]">
                        {tenant?.name || 'Mitra UNUGHA'}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>
                        {tenant && !tenant.is_open
                          ? 'Stan Tutup'
                          : menu.stock <= 0
                          ? 'Stok Habis'
                          : menu.stock <= 8
                          ? `Sisa ${menu.stock} porsi`
                          : 'Tersedia'}
                      </span>
                    </div>

                    <p className="mt-2 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {menu.description}
                    </p>
                  </div>
                </div>

                <div className="px-4 py-3 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between gap-2">
                  <div className="font-mono-tabular text-sm font-semibold text-slate-900">
                    {formatRupiah(menu.price)}
                  </div>

                  <button
                    type="button"
                    disabled={Boolean(isOut)}
                    onClick={() => addToCart(menu)}
                    aria-label={`Tambah ${menu.name} ke pesanan`}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                      isOut
                        ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                        : inCartQty > 0
                        ? 'bg-emerald-800 text-white hover:bg-emerald-900 cursor-pointer'
                        : 'bg-slate-900 text-white hover:bg-slate-800 cursor-pointer'
                    }`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>
                      {isOut
                        ? 'Tidak Tersedia'
                        : inCartQty > 0
                        ? `Tambah (${inCartQty})`
                        : 'Pilih Menu'}
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
