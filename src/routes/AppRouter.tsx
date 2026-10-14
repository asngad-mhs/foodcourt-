import React from 'react';
import { useFoodcourtStore } from '../stores/useFoodcourtStore';
import { DashboardPage } from '../pages/DashboardPage';
import { KasirPage } from '../pages/KasirPage';
import { OrderQueuePage } from '../pages/OrderQueuePage';
import { MenuManagementPage } from '../pages/MenuManagementPage';
import { LaporanPage } from '../pages/LaporanPage';
import { TenantPage } from '../pages/TenantPage';
import { DatabaseSchemaPage } from '../pages/DatabaseSchemaPage';
import { PresentationPage } from '../pages/PresentationPage';

export const AppRouter: React.FC = () => {
  const activeTab = useFoodcourtStore((s) => s.activeTab);

  switch (activeTab) {
    case 'dashboard':
      return <DashboardPage />;
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
    case 'presentasi':
      return <PresentationPage />;
    default:
      return <DashboardPage />;
  }
};
