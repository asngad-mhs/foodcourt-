import { useEffect } from 'react';
import { realtimeChannel } from '../services/foodcourtApi';
import { useFoodcourtStore } from '../stores/useFoodcourtStore';

export function useRealtimeSync(): void {
  const reloadFromStorage = useFoodcourtStore((s) => s.reloadFromStorage);

  useEffect(() => {
    if (!realtimeChannel) return;

    const handleMessage = (event: MessageEvent) => {
      if (event.data && typeof event.data.type === 'string') {
        reloadFromStorage(event.data.type);
      }
    };

    realtimeChannel.addEventListener('message', handleMessage);

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'unugha_foodcourt_pos_db_v1') {
        reloadFromStorage('Pembaruan Lintas Tab');
      }
    };

    window.addEventListener('storage', handleStorage);

    return () => {
      if (realtimeChannel) {
        realtimeChannel.removeEventListener('message', handleMessage);
      }
      window.removeEventListener('storage', handleStorage);
    };
  }, [reloadFromStorage]);
}
