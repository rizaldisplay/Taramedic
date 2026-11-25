import type { ReactNode } from 'react';
import DashboardLayoutComponent from '@/components/layouts/DashboardLayout';

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <DashboardLayoutComponent>{children}</DashboardLayoutComponent>;
}