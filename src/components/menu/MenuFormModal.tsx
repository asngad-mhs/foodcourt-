import React, { useState, useEffect } from 'react';
import { MenuCategory, MenuItem, Tenant } from '../../types';
import { Modal } from '../common/Modal';

interface MenuFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  tenants: Tenant[];
  editingMenu: MenuItem | null;
  onSubmit: (
    data: Omit<MenuItem, 'id'>,
    editingId?: string
  ) => void;
}

const CATEGORIES: MenuCategory[] = [
  'Makanan Berat',
  'Mie & Bakso',
  'Minuman Kampus',
  'Camilan & Gorengan',
  'Paket Mahasiswa',
];

const THEME_PRESETS = [
  { key: 'ayam_geprek', label: 'Tema Ayam Geprek Sambal Korek' },
  { key: 'mie_ayam_bakso', label: 'Tema Mie Ayam & Bakso' },
  { key: 'soto_lamongan', label: 'Tema Soto Ayam Lamongan' },
  { key: 'kopi_gula_aren', label: 'Tema Es Kopi Susu Gula Aren' },
  { key: 'nasi_pecel_mendoan', label: 'Tema Nasi Pecel Kesugihan' },
  { key: 'paket_hemat_skripsi', label: 'Tema Paket Hemat Skripsi' },
  { key: 'seblak_prasmanan', label: 'Tema Seblak Kuah Pedas' },
  { key: 'tempe_mendoan_hangat', label: 'Tema Mendoan & Gorengan' },
  { key: 'nasi_goreng_kampus', label: 'Tema Nasi Goreng Kampus' },
  { key: 'matcha_latte_dingin', label: 'Tema Ice Matcha Latte' },
];

export const MenuFormModal: React.FC<MenuFormModalProps> = ({
  isOpen,
  onClose,
  tenants,
  editingMenu,
  onSubmit,
}) => {
  const [tenantId, setTenantId] = useState<string>(tenants[0]?.id || 'tnt-01');
  const [sku, setSku] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [category, setCategory] = useState<MenuCategory>('Makanan Berat');
  const [price, setPrice] = useState<number>(12000);
  const [costPrice, setCostPrice] = useState<number>(7000);
  const [stock, setStock] = useState<number>(30);
  const [prepTime, setPrepTime] = useState<number>(6);
  const [description, setDescription] = useState<string>('');
  const [imageKey, setImageKey] = useState<string>('ayam_geprek');
  const [isAvailable, setIsAvailable] = useState<boolean>(true);

  useEffect(() => {
    if (editingMenu) {
      setTenantId(editingMenu.tenant_id);
      setSku(editingMenu.sku);
      setName(editingMenu.name);
      setCategory(editingMenu.category);
      setPrice(editingMenu.price);
      setCostPrice(editingMenu.cost_price);
      setStock(editingMenu.stock);
      setPrepTime(editingMenu.prep_time_minutes);
      setDescription(editingMenu.description);
      setImageKey(editingMenu.image_key);
      setIsAvailable(editingMenu.is_available);
    } else {
      setTenantId(tenants[0]?.id || 'tnt-01');
      setSku(`MNU-${Math.floor(100 + Math.random() * 899)}`);
      setName('');
      setCategory('Makanan Berat');
      setPrice(13000);
      setCostPrice(7500);
      setStock(35);
      setPrepTime(6);
      setDescription('Sajian segar higienis khas Foodcourt Kampus UNUGHA Cilacap.');
      setImageKey('ayam_geprek');
      setIsAvailable(true);
    }
  }, [editingMenu, tenants, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !sku.trim()) return;

    onSubmit(
      {
        tenant_id: tenantId,
        sku: sku.trim().toUpperCase(),
        name: name.trim(),
        category,
        price: Number(price) || 0,
        cost_price: Number(costPrice) || 0,
        stock: Number(stock) || 0,
        prep_time_minutes: Number(prepTime) || 5,
        description: description.trim(),
        image_key: imageKey,
        is_available: isAvailable,
      },
      editingMenu?.id
    );
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingMenu ? 'Edit Data Menu Kuliner' : 'Tambah Menu Baru ke Stan'}
      subtitle="Data tersimpan langsung ke tabel relasional menus di database Foodcourt UNUGHA"
      maxWidthClass="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label
              htmlFor="menu-form-tenant"
              className="block font-medium text-slate-700 mb-1"
            >
              Stan Pemilik Menu
            </label>
            <select
              id="menu-form-tenant"
              value={tenantId}
              onChange={(e) => setTenantId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-emerald-700"
            >
              {tenants.map((t) => (
                <option key={t.id} value={t.id}>
                  Stan {t.booth_number} — {t.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="menu-form-sku"
              className="block font-medium text-slate-700 mb-1"
            >
              Kode SKU Kasir
            </label>
            <input
              id="menu-form-sku"
              type="text"
              required
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              placeholder="GPR-009"
              className="w-full px-3 py-2 font-mono-tabular bg-slate-50 border border-slate-200 rounded-lg text-slate-900 uppercase focus:outline-none focus:border-emerald-700"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="menu-form-name"
            className="block font-medium text-slate-700 mb-1"
          >
            Nama Lengkap Menu Makanan / Minuman
          </label>
          <input
            id="menu-form-name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Contoh: Ayam Bakar Madu Sambal Lalapan + Nasi"
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-emerald-700"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label
              htmlFor="menu-form-category"
              className="block font-medium text-slate-700 mb-1"
            >
              Kategori Katalog
            </label>
            <select
              id="menu-form-category"
              value={category}
              onChange={(e) => setCategory(e.target.value as MenuCategory)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-emerald-700"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="menu-form-image"
              className="block font-medium text-slate-700 mb-1"
            >
              Tema Visual Sajian
            </label>
            <select
              id="menu-form-image"
              value={imageKey}
              onChange={(e) => setImageKey(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-emerald-700"
            >
              {THEME_PRESETS.map((preset) => (
                <option key={preset.key} value={preset.key}>
                  {preset.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div>
            <label
              htmlFor="menu-form-cost"
              className="block font-medium text-slate-700 mb-1"
            >
              HPP / Modal (Rp)
            </label>
            <input
              id="menu-form-cost"
              type="number"
              min={0}
              step={500}
              required
              value={costPrice}
              onChange={(e) => setCostPrice(Number(e.target.value))}
              className="w-full px-3 py-2 font-mono-tabular bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-emerald-700"
            />
          </div>

          <div>
            <label
              htmlFor="menu-form-price"
              className="block font-medium text-slate-700 mb-1"
            >
              Harga Jual (Rp)
            </label>
            <input
              id="menu-form-price"
              type="number"
              min={500}
              step={500}
              required
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full px-3 py-2 font-mono-tabular bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-emerald-700"
            />
          </div>

          <div>
            <label
              htmlFor="menu-form-stock"
              className="block font-medium text-slate-700 mb-1"
            >
              Stok Porsi
            </label>
            <input
              id="menu-form-stock"
              type="number"
              min={0}
              required
              value={stock}
              onChange={(e) => setStock(Number(e.target.value))}
              className="w-full px-3 py-2 font-mono-tabular bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-emerald-700"
            />
          </div>

          <div>
            <label
              htmlFor="menu-form-prep"
              className="block font-medium text-slate-700 mb-1"
            >
              Waktu Saji (Mnt)
            </label>
            <input
              id="menu-form-prep"
              type="number"
              min={1}
              required
              value={prepTime}
              onChange={(e) => setPrepTime(Number(e.target.value))}
              className="w-full px-3 py-2 font-mono-tabular bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-emerald-700"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="menu-form-desc"
            className="block font-medium text-slate-700 mb-1"
          >
            Deskripsi Komposisi Menu
          </label>
          <textarea
            id="menu-form-desc"
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-emerald-700"
          />
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
          >
            Batal
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-xs font-semibold text-white bg-emerald-800 rounded-lg hover:bg-emerald-900 transition-colors cursor-pointer"
          >
            {editingMenu ? 'Simpan Perubahan Menu' : 'Simpan Menu Baru'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
