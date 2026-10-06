import React, { useState } from 'react';
import { Receipt, ArrowRight, Plus } from 'lucide-react';
import { OrderStatus } from '../../types';
import { useFoodcourtStore } from '../../stores/useFoodcourtStore';
import { formatRupiah, formatTimeShort } from '../../utils/formatters';
import { EmptyState } from '../../components/common/EmptyState';

const STATUS_FILTERS: { id: 'ALL' | OrderStatus; label: string }[] = [
  { id: 'ALL', label: 'Semua Pesanan' },
  { id: 'menunggu', label: 'Menunggu Dapur' },
  { id: 'dimasak', label: 'Sedang Dimasak' },
  { id: 'siap_saji', label: 'Siap Diambil / Saji' },
  { id: 'selesai', label: 'Selesai' },
];

export const LiveOrderQueueFeature: React.FC = () => {
  const orders = useFoodcourtStore((s) => s.orders);
  const tenants = useFoodcourtStore((s) => s.tenants);
  const updateOrderStatus = useFoodcourtStore((s) => s.updateOrderStatus);
  const simulateIncomingQrisOrder = useFoodcourtStore(
    (s) => s.simulateIncomingQrisOrder
  );
  const inspectOrderReceipt = useFoodcourtStore((s) => s.inspectOrderReceipt);

  const [statusFilter, setStatusFilter] = useState<'ALL' | OrderStatus>('ALL');
  const [tenantFilter, setTenantFilter] = useState<string>('ALL');

  const filteredOrders = orders.filter((o) => {
    const matchStatus =
      statusFilter === 'ALL' || o.order_status === statusFilter;
    const matchTenant =
      tenantFilter === 'ALL' ||
      o.items.some((item) => item.tenant_id === tenantFilter);
    return matchStatus && matchTenant;
  });

  const getNextStatusAction = (
    current: OrderStatus
  ): { next: OrderStatus; label: string } | null => {
    if (current === 'menunggu') {
      return { next: 'dimasak', label: 'Mulai Masak di Stan' };
    }
    if (current === 'dimasak') {
      return { next: 'siap_saji', label: 'Tandai Siap Saji' };
    }
    if (current === 'siap_saji') {
      return { next: 'selesai', label: 'Serahkan ke Pelanggan' };
    }
    return null;
  };

  const getStatusLabel = (status: OrderStatus): string => {
    switch (status) {
      case 'menunggu':
        return 'Menunggu Dapur';
      case 'dimasak':
        return 'Sedang Dimasak';
      case 'siap_saji':
        return 'Siap Disajikan';
      case 'selesai':
        return 'Selesai Diserahkan';
      case 'dibatalkan':
        return 'Dibatalkan';
    }
  };

  return (
    <section className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 font-display">
            Antrean &amp; Distribusi Dapur Real-Time
          </h1>
          <p className="text-sm text-slate-600 mt-0.5">
            Monitor pesanan masuk dari POS Kasir Sentral maupun QRIS Meja
            Mandiri yang terdistribusi otomatis ke masing-masing stan.
          </p>
        </div>

        <button
          type="button"
          onClick={() => simulateIncomingQrisOrder()}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-white bg-emerald-800 rounded-lg hover:bg-emerald-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Simulasi Pesanan QRIS Masuk</span>
        </button>
      </div>

      {/* Filter Controls */}
      <div className="p-4 bg-white border border-slate-200 rounded-xl flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg overflow-x-auto">
          {STATUS_FILTERS.map((st) => {
            const count =
              st.id === 'ALL'
                ? orders.length
                : orders.filter((o) => o.order_status === st.id).length;
            const active = statusFilter === st.id;
            return (
              <button
                key={st.id}
                type="button"
                onClick={() => setStatusFilter(st.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  active
                    ? 'bg-white text-slate-900 font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {st.label} ({count})
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <label
            htmlFor="queue-tenant-filter"
            className="text-xs font-medium text-slate-500 whitespace-nowrap"
          >
            Layar Dapur Stan:
          </label>
          <select
            id="queue-tenant-filter"
            value={tenantFilter}
            onChange={(e) => setTenantFilter(e.target.value)}
            className="px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-emerald-700"
          >
            <option value="ALL">Semua Dapur Stan (Sentral)</option>
            {tenants.map((t) => (
              <option key={t.id} value={t.id}>
                Dapur Stan {t.booth_number} — {t.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders Grid */}
      {filteredOrders.length === 0 ? (
        <EmptyState
          title="Tidak Ada Antrean Pesanan"
          description="Belum ada pesanan dengan status atau filter stan yang dipilih."
          actionLabel="Tampilkan Semua Antrean"
          onAction={() => {
            setStatusFilter('ALL');
            setTenantFilter('ALL');
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredOrders.map((order) => {
            const nextAction = getNextStatusAction(order.order_status);

            return (
              <div
                key={order.id}
                className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between gap-4"
              >
                <div>
                  {/* Order Top Header */}
                  <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold font-mono-tabular text-slate-900">
                          {order.queue_number}
                        </span>
                        <span className="text-xs text-slate-400">·</span>
                        <span className="text-sm font-semibold text-slate-900">
                          {order.customer_name}
                        </span>
                      </div>
                      <div className="mt-0.5 text-xs text-slate-500 font-mono-tabular">
                        {order.table_number} · {order.order_type} ·{' '}
                        {formatTimeShort(order.created_at)} · {order.source}
                      </div>
                    </div>

                    <span
                      className={`text-xs font-semibold whitespace-nowrap ${
                        order.order_status === 'menunggu'
                          ? 'text-amber-700'
                          : order.order_status === 'dimasak'
                          ? 'text-blue-700'
                          : order.order_status === 'siap_saji'
                          ? 'text-emerald-700'
                          : 'text-slate-500'
                      }`}
                    >
                      {getStatusLabel(order.order_status)}
                    </span>
                  </div>

                  {/* Items List */}
                  <div className="py-3 divide-y divide-slate-100 flex flex-col gap-2.5">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="pt-2.5 first:pt-0 flex items-start justify-between gap-2 text-xs"
                      >
                        <div>
                          <div className="font-semibold text-slate-900">
                            <span className="font-mono-tabular">
                              {item.quantity}x
                            </span>{' '}
                            {item.menu_name}
                          </div>
                          <div className="text-slate-500 mt-0.5">
                            Stan {item.booth_number} ({item.tenant_name})
                            {item.notes ? ` · Catatan: ${item.notes}` : ''}
                          </div>
                        </div>
                        <span className="font-mono-tabular font-medium text-slate-800 shrink-0">
                          {formatRupiah(item.subtotal)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer & Status Progression Action */}
                <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-xs text-slate-500 block">
                      Total Nota Lunas
                    </span>
                    <span className="text-sm font-bold font-mono-tabular text-slate-900">
                      {formatRupiah(order.grand_total)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => inspectOrderReceipt(order.id)}
                      aria-label={`Lihat struk ${order.order_number}`}
                      className="p-2 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                    >
                      <Receipt className="w-4 h-4" />
                    </button>

                    {nextAction && (
                      <button
                        type="button"
                        onClick={() =>
                          updateOrderStatus(order.id, nextAction.next)
                        }
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-800 rounded-lg hover:bg-emerald-900 transition-colors whitespace-nowrap cursor-pointer"
                      >
                        <span>{nextAction.label}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
