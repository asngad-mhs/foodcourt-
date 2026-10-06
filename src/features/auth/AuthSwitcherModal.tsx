import React from 'react';
import { RotateCcw } from 'lucide-react';
import { useFoodcourtStore } from '../../stores/useFoodcourtStore';
import { Modal } from '../../components/common/Modal';

interface AuthSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthSwitcherModal: React.FC<AuthSwitcherModalProps> = ({
  isOpen,
  onClose,
}) => {
  const users = useFoodcourtStore((s) => s.users);
  const currentUser = useFoodcourtStore((s) => s.currentUser);
  const switchUser = useFoodcourtStore((s) => s.switchUser);
  const resetDemoDatabase = useFoodcourtStore((s) => s.resetDemoDatabase);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Sesi Kasir & Hak Akses Operasional"
      subtitle="Pilih petugas kasir aktif untuk pencatatan di jurnal transaksi Foodcourt UNUGHA"
    >
      <div className="flex flex-col gap-4 text-xs">
        <div className="flex flex-col gap-2">
          {users.map((user) => {
            const isSelected = user.id === currentUser.id;
            return (
              <button
                key={user.id}
                type="button"
                onClick={() => {
                  switchUser(user.id);
                  onClose();
                }}
                className={`p-3.5 rounded-lg border text-left transition-colors flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? 'border-emerald-700 bg-emerald-50/60'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="font-semibold text-slate-900 text-sm">
                    {user.full_name}
                  </div>
                  <div className="text-slate-500 mt-0.5 font-mono-tabular">
                    @{user.username} · Shift: {user.shift}
                  </div>
                </div>
                <span className="font-medium text-emerald-800">
                  {isSelected ? 'Aktif' : 'Pilih'}
                </span>
              </button>
            );
          })}
        </div>

        <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
          <div className="text-slate-500">
            Ingin mengembalikan stok &amp; transaksi ke data sampel awal?
          </div>
          <button
            type="button"
            onClick={() => {
              resetDemoDatabase();
              onClose();
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100 transition-colors whitespace-nowrap cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Data Demo</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};
