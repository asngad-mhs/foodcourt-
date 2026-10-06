import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { MenuCategory, MenuItem } from '../../types';
import { useFoodcourtStore } from '../../stores/useFoodcourtStore';
import { MenuTable } from '../../components/menu/MenuTable';
import { MenuFormModal } from '../../components/menu/MenuFormModal';
import { EmptyState } from '../../components/common/EmptyState';

export const MenuManagementFeature: React.FC = () => {
  const menus = useFoodcourtStore((s) => s.menus);
  const tenants = useFoodcourtStore((s) => s.tenants);
  const addMenuItem = useFoodcourtStore((s) => s.addMenuItem);
  const updateMenuItem = useFoodcourtStore((s) => s.updateMenuItem);
  const deleteMenuItem = useFoodcourtStore((s) => s.deleteMenuItem);
  const toggleMenuAvailability = useFoodcourtStore(
    (s) => s.toggleMenuAvailability
  );
  const adjustMenuStock = useFoodcourtStore((s) => s.adjustMenuStock);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTenantId, setSelectedTenantId] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | MenuCategory>(
    'ALL'
  );
  const [onlyLowStock, setOnlyLowStock] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMenu, setEditingMenu] = useState<MenuItem | null>(null);

  const filteredMenus = menus.filter((m) => {
    const matchTenant =
      selectedTenantId === 'ALL' || m.tenant_id === selectedTenantId;
    const matchCat =
      selectedCategory === 'ALL' || m.category === selectedCategory;
    const matchLowStock = !onlyLowStock || m.stock <= 10;
    const q = searchQuery.trim().toLowerCase();
    const matchSearch =
      !q ||
      m.name.toLowerCase().includes(q) ||
      m.sku.toLowerCase().includes(q);
    return matchTenant && matchCat && matchLowStock && matchSearch;
  });

  const lowStockCount = menus.filter((m) => m.stock <= 10).length;

  const handleOpenCreate = () => {
    setEditingMenu(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (menu: MenuItem) => {
    setEditingMenu(menu);
    setIsModalOpen(true);
  };

  const handleSaveMenu = (
    data: Omit<MenuItem, 'id'>,
    editingId?: string
  ) => {
    if (editingId) {
      updateMenuItem(editingId, data);
    } else {
      addMenuItem(data);
    }
  };

  return (
    <section className="flex flex-col gap-5">
      {/* Header & Primary Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 font-display">
            Manajemen Menu &amp; Stok Harian Stan
          </h1>
          <p className="text-sm text-slate-600 mt-0.5">
            Kelola katalog harga mahasiswa, HPP, dan ketersediaan porsi secara
            real-time untuk seluruh stan Foodcourt UNUGHA.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-white bg-emerald-800 rounded-lg hover:bg-emerald-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Menu Baru</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="p-4 bg-white border border-slate-200 rounded-xl flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama menu atau SKU..."
            aria-label="Cari menu di tabel manajemen"
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-emerald-700 focus:bg-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <select
            aria-label="Filter Stan"
            value={selectedTenantId}
            onChange={(e) => setSelectedTenantId(e.target.value)}
            className="px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-emerald-700"
          >
            <option value="ALL">Semua Stan (6 Stan)</option>
            {tenants.map((t) => (
              <option key={t.id} value={t.id}>
                Stan {t.booth_number} — {t.name}
              </option>
            ))}
          </select>

          <select
            aria-label="Filter Kategori"
            value={selectedCategory}
            onChange={(e) =>
              setSelectedCategory(e.target.value as 'ALL' | MenuCategory)
            }
            className="px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-emerald-700"
          >
            <option value="ALL">Semua Kategori</option>
            <option value="Makanan Berat">Makanan Berat</option>
            <option value="Mie & Bakso">Mie &amp; Bakso</option>
            <option value="Minuman Kampus">Minuman Kampus</option>
            <option value="Camilan & Gorengan">Camilan &amp; Gorengan</option>
            <option value="Paket Mahasiswa">Paket Mahasiswa</option>
          </select>

          <button
            type="button"
            onClick={() => setOnlyLowStock((prev) => !prev)}
            className={`px-3 py-2 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap cursor-pointer ${
              onlyLowStock
                ? 'bg-amber-50 text-amber-900 border-amber-300 font-semibold'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            Stok Menipis &le; 10 ({lowStockCount})
          </button>
        </div>
      </div>

      {/* Menu Table */}
      {filteredMenus.length === 0 ? (
        <EmptyState
          title="Data Menu Kosong"
          description="Tidak ada menu yang sesuai dengan filter pencarian Anda."
          actionLabel="Tampilkan Semua Menu"
          onAction={() => {
            setSearchQuery('');
            setSelectedTenantId('ALL');
            setSelectedCategory('ALL');
            setOnlyLowStock(false);
          }}
        />
      ) : (
        <MenuTable
          menus={filteredMenus}
          tenants={tenants}
          onEdit={handleOpenEdit}
          onDelete={deleteMenuItem}
          onToggleAvailable={toggleMenuAvailability}
          onAdjustStock={adjustMenuStock}
        />
      )}

      <MenuFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        tenants={tenants}
        editingMenu={editingMenu}
        onSubmit={handleSaveMenu}
      />
    </section>
  );
};
