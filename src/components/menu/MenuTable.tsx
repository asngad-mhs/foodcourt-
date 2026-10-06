import React from 'react';
import { Edit2, Trash2, Plus, Minus } from 'lucide-react';
import { MenuItem, Tenant } from '../../types';
import { formatRupiah } from '../../utils/formatters';

interface MenuTableProps {
  menus: MenuItem[];
  tenants: Tenant[];
  onEdit: (menu: MenuItem) => void;
  onDelete: (id: string) => void;
  onToggleAvailable: (id: string) => void;
  onAdjustStock: (id: string, delta: number) => void;
}

export const MenuTable: React.FC<MenuTableProps> = ({
  menus,
  tenants,
  onEdit,
  onDelete,
  onToggleAvailable,
  onAdjustStock,
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-600">
              <th className="py-3 px-4">SKU & Nama Menu</th>
              <th className="py-3 px-4">Stan Kuliner</th>
              <th className="py-3 px-4">Kategori</th>
              <th className="py-3 px-4 text-right">HPP / Modal</th>
              <th className="py-3 px-4 text-right">Harga Jual</th>
              <th className="py-3 px-4 text-right">Margin</th>
              <th className="py-3 px-4 text-center">Stok Harian</th>
              <th className="py-3 px-4 text-center">Status POS</th>
              <th className="py-3 px-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {menus.map((menu) => {
              const tenant = tenants.find((t) => t.id === menu.tenant_id);
              const margin = menu.price - menu.cost_price;

              return (
                <tr
                  key={menu.id}
                  className="hover:bg-slate-50/80 transition-colors"
                >
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-900 text-sm">
                      {menu.name}
                    </div>
                    <div className="text-slate-500 font-mono-tabular mt-0.5">
                      {menu.sku} · Estimasi {menu.prep_time_minutes} mnt
                    </div>
                  </td>

                  <td className="py-3 px-4 text-slate-700">
                    <div className="font-medium text-slate-900">
                      Stan {tenant?.booth_number || 'A-00'}
                    </div>
                    <div className="text-slate-500 truncate max-w-[180px]">
                      {tenant?.name || '-'}
                    </div>
                  </td>

                  <td className="py-3 px-4 text-slate-600">{menu.category}</td>

                  <td className="py-3 px-4 text-right font-mono-tabular text-slate-600">
                    {formatRupiah(menu.cost_price)}
                  </td>

                  <td className="py-3 px-4 text-right font-mono-tabular font-semibold text-slate-900">
                    {formatRupiah(menu.price)}
                  </td>

                  <td className="py-3 px-4 text-right font-mono-tabular text-emerald-700 font-medium">
                    +{formatRupiah(margin)}
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => onAdjustStock(menu.id, -5)}
                        aria-label={`Kurangi 5 stok ${menu.name}`}
                        className="p-1 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded transition-colors cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span
                        className={`w-12 text-center font-mono-tabular font-semibold ${
                          menu.stock <= 8
                            ? 'text-amber-700'
                            : 'text-slate-900'
                        }`}
                      >
                        {menu.stock}
                      </span>
                      <button
                        type="button"
                        onClick={() => onAdjustStock(menu.id, 5)}
                        aria-label={`Tambah 5 stok ${menu.name}`}
                        className="p-1 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded transition-colors cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </td>

                  <td className="py-3 px-4 text-center">
                    <button
                      type="button"
                      onClick={() => onToggleAvailable(menu.id)}
                      className={`px-2.5 py-1 text-xs font-medium rounded-md border transition-colors whitespace-nowrap cursor-pointer ${
                        menu.is_available && menu.stock > 0
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                          : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                      }`}
                    >
                      {menu.is_available && menu.stock > 0
                        ? 'Aktif Dijual'
                        : 'Nonaktif / Habis'}
                    </button>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <div className="inline-flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => onEdit(menu)}
                        aria-label={`Edit menu ${menu.name}`}
                        className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(menu.id)}
                        aria-label={`Hapus menu ${menu.name}`}
                        className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
