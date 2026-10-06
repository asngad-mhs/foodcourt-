import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useFoodcourtStore } from '../../stores/useFoodcourtStore';
import { formatRupiah } from '../../utils/formatters';
import { Modal } from '../../components/common/Modal';

export const TenantDirectorySection: React.FC = () => {
  const tenants = useFoodcourtStore((s) => s.tenants);
  const menus = useFoodcourtStore((s) => s.menus);
  const orders = useFoodcourtStore((s) => s.orders);
  const toggleTenantOpen = useFoodcourtStore((s) => s.toggleTenantOpen);
  const addTenant = useFoodcourtStore((s) => s.addTenant);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [name, setName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [boothNumber, setBoothNumber] = useState('A-07');
  const [specialty, setSpecialty] = useState('');
  const [phone, setPhone] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [commission, setCommission] = useState(10);

  const handleCreateTenant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !ownerName.trim()) return;

    addTenant({
      code: `TN-UNUGHA-0${tenants.length + 1}`,
      name: name.trim(),
      owner_name: ownerName.trim(),
      booth_number: boothNumber.trim(),
      specialty: specialty.trim() || 'Kuliner Kampus UNUGHA',
      commission_percent: Number(commission) || 10,
      is_open: true,
      phone: phone.trim() || '0812-0000-0000',
      bank_account: bankAccount.trim() || 'BSI 7100-0000-00',
    });

    setName('');
    setOwnerName('');
    setSpecialty('');
    setIsAddOpen(false);
  };

  return (
    <section className="flex flex-col gap-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 font-display">
            Direktori Mitra Stan Foodcourt UNUGHA
          </h1>
          <p className="text-sm text-slate-600 mt-0.5">
            Manajemen operasional kavling stan UMKM, status buka/tutup kasir,
            dan rekening pencairan bagi hasil harian.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-white bg-emerald-800 rounded-lg hover:bg-emerald-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Registrasi Stan Baru</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {tenants.map((tenant) => {
          const tenantMenus = menus.filter((m) => m.tenant_id === tenant.id);
          let tenantRevenue = 0;
          let portionsSold = 0;

          orders.forEach((o) => {
            if (o.order_status === 'dibatalkan') return;
            o.items
              .filter((i) => i.tenant_id === tenant.id)
              .forEach((item) => {
                tenantRevenue += item.subtotal;
                portionsSold += item.quantity;
              });
          });

          return (
            <div
              key={tenant.id}
              className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between gap-4"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-base font-semibold text-slate-900">
                      {tenant.name}
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5 font-mono-tabular">
                      Kavling {tenant.booth_number} · {tenant.code} · Komisi{' '}
                      {tenant.commission_percent}%
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleTenantOpen(tenant.id)}
                    className={`px-3 py-1 text-xs font-semibold rounded-md border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      tenant.is_open
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                        : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    {tenant.is_open ? 'Stan Buka' : 'Stan Tutup'}
                  </button>
                </div>

                <p className="mt-3 text-xs text-slate-600 leading-relaxed">
                  {tenant.specialty}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col gap-1 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Pemilik Mitra:</span>
                    <span className="font-medium text-slate-900">
                      {tenant.owner_name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Kontak WhatsApp:</span>
                    <span className="font-mono-tabular">{tenant.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Rekening Settlement:</span>
                    <span className="font-mono-tabular font-medium text-slate-800">
                      {tenant.bank_account}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs font-mono-tabular">
                <span className="text-slate-600">
                  {tenantMenus.length} menu aktif · {portionsSold} terjual
                </span>
                <span className="font-semibold text-emerald-800">
                  Omzet: {formatRupiah(tenantRevenue)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Registrasi Mitra Stan Baru — Foodcourt UNUGHA"
        subtitle="Menambahkan entitas baru ke tabel relasional tenants"
      >
        <form onSubmit={handleCreateTenant} className="flex flex-col gap-3.5 text-xs">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label
                htmlFor="tenant-booth"
                className="block font-medium text-slate-700 mb-1"
              >
                Nomor Kavling
              </label>
              <input
                id="tenant-booth"
                type="text"
                required
                value={boothNumber}
                onChange={(e) => setBoothNumber(e.target.value)}
                className="w-full px-3 py-2 font-mono-tabular bg-slate-50 border border-slate-200 rounded-lg"
              />
            </div>
            <div className="col-span-2">
              <label
                htmlFor="tenant-name"
                className="block font-medium text-slate-700 mb-1"
              >
                Nama Stan Kuliner
              </label>
              <input
                id="tenant-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Cth: Penyetan & Lele Kremes Kampus"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="tenant-owner"
                className="block font-medium text-slate-700 mb-1"
              >
                Nama Pemilik UMKM
              </label>
              <input
                id="tenant-owner"
                type="text"
                required
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                placeholder="Bpk. Slamet Riyadi"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
              />
            </div>
            <div>
              <label
                htmlFor="tenant-phone"
                className="block font-medium text-slate-700 mb-1"
              >
                No. HP / WhatsApp
              </label>
              <input
                id="tenant-phone"
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0812-xxxx-xxxx"
                className="w-full px-3 py-2 font-mono-tabular bg-slate-50 border border-slate-200 rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label
                htmlFor="tenant-bank"
                className="block font-medium text-slate-700 mb-1"
              >
                Rekening Bank Settlement
              </label>
              <input
                id="tenant-bank"
                type="text"
                value={bankAccount}
                onChange={(e) => setBankAccount(e.target.value)}
                placeholder="BSI 7129-3819-01"
                className="w-full px-3 py-2 font-mono-tabular bg-slate-50 border border-slate-200 rounded-lg"
              />
            </div>
            <div>
              <label
                htmlFor="tenant-comm"
                className="block font-medium text-slate-700 mb-1"
              >
                Komisi (%)
              </label>
              <input
                id="tenant-comm"
                type="number"
                min={0}
                max={50}
                value={commission}
                onChange={(e) => setCommission(Number(e.target.value))}
                className="w-full px-3 py-2 font-mono-tabular bg-slate-50 border border-slate-200 rounded-lg"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="tenant-spec"
              className="block font-medium text-slate-700 mb-1"
            >
              Spesialisasi Hidangan
            </label>
            <input
              id="tenant-spec"
              type="text"
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              placeholder="Lele Kremes, Bebek Goreng & Tahu Tempe"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setIsAddOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-emerald-800 rounded-lg hover:bg-emerald-900 cursor-pointer"
            >
              Simpan Mitra Stan
            </button>
          </div>
        </form>
      </Modal>
    </section>
  );
};
