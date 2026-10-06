import React from 'react';
import { useFoodcourtStore } from '../stores/useFoodcourtStore';
import { KasirPage } from '../pages/KasirPage';
import { OrderQueuePage } from '../pages/OrderQueuePage';
import { MenuManagementPage } from '../pages/MenuManagementPage';
import { LaporanPage } from '../pages/LaporanPage';
import { TenantPage } from '../pages/TenantPage';
import { DatabaseSchemaPage } from '../pages/DatabaseSchemaPage';

export const AppRouter: React.FC = () => {
  const activeTab = useFoodcourtStore((s) => s.activeTab);

  switch (activeTab) {
    case 'kasir':
      return <KasirPage />;
    case 'antrean':
      return <OrderQueuePage />;
    case 'menu':
      return <MenuManagementPage />;
    case 'laporan':
      return <LaporanPage />;
    case 'tenant':
      return <TenantPage />;
    case 'database':
      return <DatabaseSchemaPage />;
    default:
      return <KasirPage />;
  }
};
