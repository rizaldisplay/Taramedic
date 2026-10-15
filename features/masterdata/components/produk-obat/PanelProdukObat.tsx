'use client';
// Lokasi: src/features/masterdata/components/produk-obat/PanelProdukObat.tsx
// Panel kanan: detail produk terpilih, atau form tambah/ubah (bawaan).
import React from 'react';
import { useAppSelector } from '@/store/hooks';
import DetailProdukObat from './DetailProdukObat';
import FormProdukObat from './FormProdukObat';

export default function PanelProdukObat() {
  const panel = useAppSelector((s) => s.produkObat.panel);
  return panel === 'detail' ? <DetailProdukObat /> : <FormProdukObat />;
}
