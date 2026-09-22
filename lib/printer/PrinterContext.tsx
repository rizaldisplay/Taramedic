// PrinterContext.tsx
'use client';
import { createContext, useContext, ReactNode } from 'react';
import { useReceiptPrinter, UseReceiptPrinterResult } from '@/hooks/useReceiptPrinter';
import type { InstitutionConfig } from '@/types/printer';

const PrinterContext = createContext<UseReceiptPrinterResult | null>(null);

export function PrinterProvider({
  config,
  children,
}: {
  config: InstitutionConfig;
  children: ReactNode;
}) {
  const printer = useReceiptPrinter(config);
  return <PrinterContext.Provider value={printer}>{children}</PrinterContext.Provider>;
}

export function usePrinter() {
  const ctx = useContext(PrinterContext);
  if (!ctx) throw new Error('usePrinter must be used inside <PrinterProvider>');
  return ctx;
}