'use client';

import { useRef } from 'react';
import { Provider } from 'react-redux';
import { makeStore, AppStore } from '@/store';

export function Providers({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<AppStore | null>(null);

  // eslint-disable-next-line react-hooks/refs
  if (!storeRef.current) {
    // Inisialisasi instance Redux store pertama kali
    storeRef.current = makeStore();
  }

  // eslint-disable-next-line react-hooks/refs
  return <Provider store={storeRef.current}>{children}</Provider>;
}