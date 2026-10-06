import React, { useState } from 'react';
import { Copy, Check, Database } from 'lucide-react';
import { useFoodcourtStore } from '../../stores/useFoodcourtStore';
import {
  FOODCOURT_DATABASE_SCHEMAS,
  SQL_DDL_SCRIPT,
  formatRupiah,
} from '../../utils/formatters';

export const DatabaseSchemaExplorer: React.FC = () => {
  const tenants = useFoodcourtStore((s) => s.tenants);
  const menus = useFoodcourtStore((s) => s.menus);
  const orders = useFoodcourtStore((s) => s.orders);
  const transactions = useFoodcourtStore((s) => s.transactions);
  const settlements = useFoodcourtStore((s) => s.settlements);

  const [selectedTable, setSelectedTable] = useState<string>('transactions');
  const [viewMode, setViewMode] = useState<'SCHEMA' | 'LIVE_DATA' | 'SQL_DDL'>(
    'SCHEMA'
  );
  const [copiedSql, setCopiedSql] = useState(false);

  const orderItemsCount = orders.reduce((acc, o) => acc + o.items.length, 0);

  const tableCounts: Record<string, number> = {
    tenants: tenants.length,
    menus: menus.length,
    orders: orders.length,
    order_items: orderItemsCount,
    transactions: transactions.length,
    daily_settlements: settlements.length,
  };

  const activeSchema =
    FOODCOURT_DATABASE_SCHEMAS.find((s) => s.table_name === selectedTable) ||
    FOODCOURT_DATABASE_SCHEMAS[0];

  const handleCopySql = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(SQL_DDL_SCRIPT);
      setCopiedSql(true);
      setTimeout(() => setCopiedSql(false), 3000);
    }
  };

  const renderLiveTableRows = () => {
    if (selectedTable === 'tenants') {
      return (
        <table className="w-full text-left border-collapse text-xs font-mono-tabular">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-slate-600">
              <th className="py-2.5 px-3">id</th>
              <th className="py-2.5 px-3">code</th>
              <th className="py-2.5 px-3">booth_number</th>
              <th className="py-2.5 px-3">name</th>
              <th className="py-2.5 px-3">owner_name</th>
              <th className="py-2.5 px-3 text-right">commission_percent</th>
              <th className="py-2.5 px-3">is_open</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {tenants.map((t) => (
              <tr key={t.id}>
                <td className="py-2 px-3 text-slate-500">{t.id}</td>
                <td className="py-2 px-3 font-semibold">{t.code}</td>
                <td className="py-2 px-3">{t.booth_number}</td>
                <td className="py-2 px-3 font-sans font-medium text-slate-900">
                  {t.name}
                </td>
                <td className="py-2 px-3 font-sans">{t.owner_name}</td>
                <td className="py-2 px-3 text-right">{t.commission_percent}%</td>
                <td className="py-2 px-3">{String(t.is_open)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    if (selectedTable === 'menus') {
      return (
        <table className="w-full text-left border-collapse text-xs font-mono-tabular">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-slate-600">
              <th className="py-2.5 px-3">id</th>
              <th className="py-2.5 px-3">tenant_id</th>
              <th className="py-2.5 px-3">sku</th>
              <th className="py-2.5 px-3">name</th>
              <th className="py-2.5 px-3 text-right">price</th>
              <th className="py-2.5 px-3 text-right">stock</th>
              <th className="py-2.5 px-3">is_available</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {menus.map((m) => (
              <tr key={m.id}>
                <td className="py-2 px-3 text-slate-500">{m.id}</td>
                <td className="py-2 px-3 text-emerald-800">{m.tenant_id}</td>
                <td className="py-2 px-3 font-semibold">{m.sku}</td>
                <td className="py-2 px-3 font-sans font-medium text-slate-900">
                  {m.name}
                </td>
                <td className="py-2 px-3 text-right">{formatRupiah(m.price)}</td>
                <td className="py-2 px-3 text-right">{m.stock}</td>
                <td className="py-2 px-3">{String(m.is_available)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    if (selectedTable === 'orders') {
      return (
        <table className="w-full text-left border-collapse text-xs font-mono-tabular">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-slate-600">
              <th className="py-2.5 px-3">order_number</th>
              <th className="py-2.5 px-3">queue_number</th>
              <th className="py-2.5 px-3">customer_name</th>
              <th className="py-2.5 px-3">order_status</th>
              <th className="py-2.5 px-3">source</th>
              <th className="py-2.5 px-3 text-right">grand_total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {orders.map((o) => (
              <tr key={o.id}>
                <td className="py-2 px-3 font-semibold">{o.order_number}</td>
                <td className="py-2 px-3 text-emerald-800 font-bold">
                  {o.queue_number}
                </td>
                <td className="py-2 px-3 font-sans text-slate-900">
                  {o.customer_name}
                </td>
                <td className="py-2 px-3">{o.order_status}</td>
                <td className="py-2 px-3">{o.source}</td>
                <td className="py-2 px-3 text-right">
                  {formatRupiah(o.grand_total)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    if (selectedTable === 'order_items') {
      const allItems = orders.flatMap((o) => o.items);
      return (
        <table className="w-full text-left border-collapse text-xs font-mono-tabular">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-slate-600">
              <th className="py-2.5 px-3">id</th>
              <th className="py-2.5 px-3">order_id</th>
              <th className="py-2.5 px-3">tenant_id</th>
              <th className="py-2.5 px-3">menu_name</th>
              <th className="py-2.5 px-3 text-right">quantity</th>
              <th className="py-2.5 px-3 text-right">subtotal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {allItems.map((item) => (
              <tr key={item.id}>
                <td className="py-2 px-3 text-slate-500">{item.id}</td>
                <td className="py-2 px-3">{item.order_id}</td>
                <td className="py-2 px-3 text-emerald-800">{item.tenant_id}</td>
                <td className="py-2 px-3 font-sans text-slate-900">
                  {item.menu_name}
                </td>
                <td className="py-2 px-3 text-right">{item.quantity}</td>
                <td className="py-2 px-3 text-right">
                  {formatRupiah(item.subtotal)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    if (selectedTable === 'daily_settlements') {
      return (
        <table className="w-full text-left border-collapse text-xs font-mono-tabular">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-slate-600">
              <th className="py-2.5 px-3">settlement_date</th>
              <th className="py-2.5 px-3">booth_number</th>
              <th className="py-2.5 px-3">tenant_name</th>
              <th className="py-2.5 px-3 text-right">gross_sales</th>
              <th className="py-2.5 px-3 text-right">commission_amount</th>
              <th className="py-2.5 px-3 text-right">net_payout</th>
              <th className="py-2.5 px-3">status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {settlements.map((s) => (
              <tr key={s.id}>
                <td className="py-2 px-3">{s.settlement_date}</td>
                <td className="py-2 px-3 font-semibold">{s.booth_number}</td>
                <td className="py-2 px-3 font-sans text-slate-900">
                  {s.tenant_name}
                </td>
                <td className="py-2 px-3 text-right">
                  {formatRupiah(s.gross_sales)}
                </td>
                <td className="py-2 px-3 text-right">
                  {formatRupiah(s.commission_amount)}
                </td>
                <td className="py-2 px-3 text-right font-semibold text-emerald-800">
                  {formatRupiah(s.net_payout)}
                </td>
                <td className="py-2 px-3">{s.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    return (
      <table className="w-full text-left border-collapse text-xs font-mono-tabular">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50 text-slate-600">
            <th className="py-2.5 px-3">transaction_code</th>
            <th className="py-2.5 px-3">order_number</th>
            <th className="py-2.5 px-3">payment_method</th>
            <th className="py-2.5 px-3 text-right">grand_total</th>
            <th className="py-2.5 px-3 text-right">foodcourt_commission</th>
            <th className="py-2.5 px-3 text-right">tenant_net_total</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {transactions.map((t) => (
            <tr key={t.id}>
              <td className="py-2 px-3 font-semibold">{t.transaction_code}</td>
              <td className="py-2 px-3">{t.order_number}</td>
              <td className="py-2 px-3">{t.payment_method}</td>
              <td className="py-2 px-3 text-right font-semibold">
                {formatRupiah(t.grand_total)}
              </td>
              <td className="py-2 px-3 text-right">
                {formatRupiah(t.foodcourt_commission)}
              </td>
              <td className="py-2 px-3 text-right text-emerald-800 font-semibold">
                {formatRupiah(t.tenant_net_total)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <section className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 font-display">
            Arsitektur &amp; Struktur Database Kasir Foodcourt UNUGHA
          </h1>
          <p className="text-sm text-slate-600 mt-0.5">
            Dokumentasi relasi tabel (ERD), publikasi transaksi real-time,
            perhitungan bagi hasil multi-tenant, serta inspeksi baris data
            langsung.
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-lg self-start">
          <button
            type="button"
            onClick={() => setViewMode('SCHEMA')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              viewMode === 'SCHEMA'
                ? 'bg-white text-slate-900 font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Struktur Kolom &amp; Relasi
          </button>
          <button
            type="button"
            onClick={() => setViewMode('LIVE_DATA')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              viewMode === 'LIVE_DATA'
                ? 'bg-white text-slate-900 font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Inspeksi Isi Tabel Live
          </button>
          <button
            type="button"
            onClick={() => setViewMode('SQL_DDL')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              viewMode === 'SQL_DDL'
                ? 'bg-white text-slate-900 font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Script SQL (PostgreSQL / D1)
          </button>
        </div>
      </div>

      {/* Table Selector Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {FOODCOURT_DATABASE_SCHEMAS.map((schema) => {
          const isSelected = selectedTable === schema.table_name;
          const rowCount = tableCounts[schema.table_name] ?? 0;

          return (
            <button
              key={schema.table_name}
              type="button"
              onClick={() => setSelectedTable(schema.table_name)}
              className={`p-3.5 rounded-xl border text-left transition-colors cursor-pointer ${
                isSelected
                  ? 'bg-emerald-900 text-white border-emerald-900'
                  : 'bg-white text-slate-900 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between gap-1">
                <Database
                  className={`w-3.5 h-3.5 ${
                    isSelected ? 'text-emerald-300' : 'text-slate-400'
                  }`}
                />
                <span
                  className={`text-xs font-mono-tabular ${
                    isSelected ? 'text-emerald-200' : 'text-slate-500'
                  }`}
                >
                  {rowCount} baris
                </span>
              </div>
              <p className="mt-2 font-mono-tabular text-xs font-semibold truncate">
                {schema.table_name}
              </p>
              <p
                className={`mt-0.5 text-[11px] truncate ${
                  isSelected ? 'text-emerald-100/90' : 'text-slate-500'
                }`}
              >
                {schema.domain_group}
              </p>
            </button>
          );
        })}
      </div>

      {/* Main Content Panel */}
      {viewMode === 'SCHEMA' && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-semibold text-slate-900 font-mono-tabular">
                TABEL: public.{activeSchema.table_name}
              </h2>
              <p className="text-xs text-slate-600 mt-0.5">
                {activeSchema.description}
              </p>
            </div>
            <div className="text-xs font-mono-tabular text-slate-500 shrink-0">
              PK: {activeSchema.primary_key} · Realtime:{' '}
              {activeSchema.realtime_enabled ? 'AKTIF (Broadcast)' : 'Standar'}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 font-semibold text-slate-600">
                  <th className="py-3 px-5">Nama Kolom</th>
                  <th className="py-3 px-5">Tipe Data SQL</th>
                  <th className="py-3 px-5">Indeks &amp; Constraint</th>
                  <th className="py-3 px-5">Fungsi Bisnis Foodcourt UNUGHA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {activeSchema.columns.map((col) => (
                  <tr key={col.name} className="hover:bg-slate-50/70">
                    <td className="py-3 px-5 font-mono-tabular font-semibold text-slate-900">
                      {col.name}
                    </td>
                    <td className="py-3 px-5 font-mono-tabular text-emerald-800">
                      {col.type}
                    </td>
                    <td className="py-3 px-5 font-mono-tabular text-slate-600">
                      {col.constraints}
                    </td>
                    <td className="py-3 px-5 text-slate-700">
                      {col.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {viewMode === 'LIVE_DATA' && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-900 font-mono-tabular">
                ISI RECORD REAL-TIME: public.{selectedTable}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Menampilkan state aktual database yang berubah seketika saat
                kasir melakukan transaksi atau manajemen stok.
              </p>
            </div>
          </div>
          <div className="overflow-x-auto">{renderLiveTableRows()}</div>
        </div>
      )}

      {viewMode === 'SQL_DDL' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden text-slate-100">
          <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between">
            <span className="text-xs font-mono-tabular text-slate-300">
              schema_foodcourt_unugha.sql — PostgreSQL / Supabase / Cloudflare D1
            </span>
            <button
              type="button"
              onClick={handleCopySql}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-600 rounded-md transition-colors cursor-pointer"
            >
              {copiedSql ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Tersalin ke Clipboard</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Salin Script SQL</span>
                </>
              )}
            </button>
          </div>
          <pre className="p-5 text-xs font-mono-tabular text-emerald-100/90 overflow-x-auto leading-relaxed">
            {SQL_DDL_SCRIPT}
          </pre>
        </div>
      )}
    </section>
  );
};
