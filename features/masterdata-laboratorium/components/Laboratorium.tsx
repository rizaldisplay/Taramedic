'use client';

import React, { useMemo, useRef, useState } from 'react';
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  EyeOff,
  FileSpreadsheet,
  Pencil,
  Plus,
  Ruler,
  Search,
  Upload,
  X,
} from 'lucide-react';

export type LabMasterTabKey =
  | 'item'
  | 'paket'
  | 'kategori'
  | 'spesimen'
  | 'loinc';

export type LabItemStatusKey = 'aktif' | 'nonaktif';
export type LabResultTypeKey =
  | 'Teks · Deskriptif'
  | 'Numerik · Kuantitatif'
  | 'Kualitatif · Reaktif/Non-reaktif';

export interface LabReferenceRange {
  id: string;
  kelompok: string;
  nilaiNormal: string;
  satuan: string;
  nilaiKritis?: string;
}

export interface LabExaminationItem {
  id: string;
  kodeInternal: string;
  namaPemeriksaan: string;
  deskripsi: string;
  kategori: string;
  spesimen: string;
  jenisHasil: LabResultTypeKey;
  metode: string;
  waktuPenyelesaianMenit: number;
  tampilDiPermintaanDokter: boolean;
  status: LabItemStatusKey;
  loincCode?: string;
  loincDisplay?: string;
  loincStatus: 'perlu_ditinjau' | 'terpetakan_lokal';
  rentangRujukan: LabReferenceRange[];
}

export interface LabPackageItem {
  id: string;
  kodePaket: string;
  namaPaket: string;
  deskripsi: string;
  jumlahParameter: number;
  daftarKodeItem: string[];
  estimasiMenit: number;
  status: LabItemStatusKey;
}

export interface LabCategoryMaster {
  id: string;
  kode: string;
  nama: string;
  deskripsi: string;
  jumlahItem: number;
  status: LabItemStatusKey;
}

export interface LabSpecimenMaster {
  id: string;
  kode: string;
  nama: string;
  tabungWadah: string;
  volumeMinimal: string;
  status: LabItemStatusKey;
}

const INITIAL_LAB_ITEMS: LabExaminationItem[] = [
  {
    id: 'lab-1',
    kodeInternal: 'FEK-RUT',
    namaPemeriksaan: 'Feses Rutin',
    deskripsi: 'Pemeriksaan makroskopis dan mikroskopis feses.',
    kategori: 'Feses',
    spesimen: 'Feses',
    jenisHasil: 'Teks · Deskriptif',
    metode: 'Makroskopis dan mikroskopis',
    waktuPenyelesaianMenit: 120,
    tampilDiPermintaanDokter: true,
    status: 'aktif',
    loincCode: '14723-1',
    loincDisplay: 'Microscopic observation in Stool',
    loincStatus: 'perlu_ditinjau',
    rentangRujukan: [
      {
        id: 'rr-1',
        kelompok: 'Semua Usia',
        nilaiNormal: 'Warna coklat, konsistensi lunak, leukosit 0–2/LPB',
        satuan: 'Deskriptif',
      },
    ],
  },
  {
    id: 'lab-2',
    kodeInternal: 'HEM-DL',
    namaPemeriksaan: 'Darah Lengkap (CBC)',
    deskripsi:
      'Pemeriksaan hitung sel darah lengkap meliputi hemoglobin, leukosit, trombosit, hematokrit, dan indeks eritrosit.',
    kategori: 'Hematologi',
    spesimen: 'Darah EDTA',
    jenisHasil: 'Numerik · Kuantitatif',
    metode: 'Automated Hematology Analyzer',
    waktuPenyelesaianMenit: 45,
    tampilDiPermintaanDokter: true,
    status: 'aktif',
    loincCode: '58410-2',
    loincDisplay: 'CBC panel - Blood by Automated count',
    loincStatus: 'perlu_ditinjau',
    rentangRujukan: [
      {
        id: 'rr-2',
        kelompok: 'Dewasa',
        nilaiNormal: 'Sesuai sub-parameter CBC',
        satuan: 'Panel',
      },
    ],
  },
  {
    id: 'lab-3',
    kodeInternal: 'HEM-HCT',
    namaPemeriksaan: 'Hematokrit',
    deskripsi: 'Persentase volume sel darah merah terhadap volume darah total.',
    kategori: 'Hematologi',
    spesimen: 'Darah EDTA',
    jenisHasil: 'Numerik · Kuantitatif',
    metode: 'Automated Impedance / Mikrohematokrit',
    waktuPenyelesaianMenit: 45,
    tampilDiPermintaanDokter: true,
    status: 'aktif',
    loincCode: '4544-3',
    loincDisplay: 'Hematocrit [Volume Fraction] of Blood',
    loincStatus: 'perlu_ditinjau',
    rentangRujukan: [
      {
        id: 'rr-3a',
        kelompok: 'Laki-laki Dewasa',
        nilaiNormal: '40.0 – 50.0',
        satuan: '%',
        nilaiKritis: '< 20.0 atau > 60.0',
      },
      {
        id: 'rr-3b',
        kelompok: 'Perempuan Dewasa',
        nilaiNormal: '36.0 – 46.0',
        satuan: '%',
        nilaiKritis: '< 20.0 atau > 60.0',
      },
    ],
  },
  {
    id: 'lab-4',
    kodeInternal: 'HEM-HB',
    namaPemeriksaan: 'Hemoglobin',
    deskripsi: 'Pengukuran kadar hemoglobin dalam darah vena atau kapiler.',
    kategori: 'Hematologi',
    spesimen: 'Darah EDTA',
    jenisHasil: 'Numerik · Kuantitatif',
    metode: 'SLS-Hemoglobin / Fotometri',
    waktuPenyelesaianMenit: 45,
    tampilDiPermintaanDokter: true,
    status: 'aktif',
    loincCode: '718-7',
    loincDisplay: 'Hemoglobin [Mass/volume] in Blood',
    loincStatus: 'perlu_ditinjau',
    rentangRujukan: [
      {
        id: 'rr-4a',
        kelompok: 'Laki-laki Dewasa',
        nilaiNormal: '13.2 – 17.3',
        satuan: 'g/dL',
        nilaiKritis: '< 7.0 atau > 20.0',
      },
      {
        id: 'rr-4b',
        kelompok: 'Perempuan Dewasa',
        nilaiNormal: '11.7 – 15.5',
        satuan: 'g/dL',
        nilaiKritis: '< 7.0 atau > 20.0',
      },
    ],
  },
  {
    id: 'lab-5',
    kodeInternal: 'HEM-ESR',
    namaPemeriksaan: 'Laju Endap Darah (LED)',
    deskripsi: 'Pengukuran kecepatan pengendapan eritrosit dalam satu jam.',
    kategori: 'Hematologi',
    spesimen: 'Darah untuk LED',
    jenisHasil: 'Numerik · Kuantitatif',
    metode: 'Westergren',
    waktuPenyelesaianMenit: 75,
    tampilDiPermintaanDokter: true,
    status: 'aktif',
    loincCode: '4537-7',
    loincDisplay: 'Erythrocyte sedimentation rate by Westergren method',
    loincStatus: 'perlu_ditinjau',
    rentangRujukan: [
      {
        id: 'rr-5a',
        kelompok: 'Laki-laki Dewasa',
        nilaiNormal: '0 – 15',
        satuan: 'mm/jam',
      },
      {
        id: 'rr-5b',
        kelompok: 'Perempuan Dewasa',
        nilaiNormal: '0 – 20',
        satuan: 'mm/jam',
      },
    ],
  },
  {
    id: 'lab-6',
    kodeInternal: 'HEM-WBC',
    namaPemeriksaan: 'Leukosit',
    deskripsi: 'Hitung jumlah total sel darah putih per mikroliter darah.',
    kategori: 'Hematologi',
    spesimen: 'Darah EDTA',
    jenisHasil: 'Numerik · Kuantitatif',
    metode: 'Flow Cytometry / Impedance',
    waktuPenyelesaianMenit: 45,
    tampilDiPermintaanDokter: true,
    status: 'aktif',
    loincCode: '6690-2',
    loincDisplay: 'Leukocytes [#/volume] in Blood',
    loincStatus: 'perlu_ditinjau',
    rentangRujukan: [
      {
        id: 'rr-6',
        kelompok: 'Dewasa',
        nilaiNormal: '4.0 – 10.5',
        satuan: '10³/µL',
        nilaiKritis: '< 2.0 atau > 30.0',
      },
    ],
  },
  {
    id: 'lab-7',
    kodeInternal: 'HEM-PLT',
    namaPemeriksaan: 'Trombosit',
    deskripsi: 'Hitung jumlah keping darah (platelet) untuk evaluasi hemostasis.',
    kategori: 'Hematologi',
    spesimen: 'Darah EDTA',
    jenisHasil: 'Numerik · Kuantitatif',
    metode: 'Automated Impedance',
    waktuPenyelesaianMenit: 45,
    tampilDiPermintaanDokter: true,
    status: 'aktif',
    loincCode: '777-3',
    loincDisplay: 'Platelets [#/volume] in Blood',
    loincStatus: 'perlu_ditinjau',
    rentangRujukan: [
      {
        id: 'rr-7',
        kelompok: 'Dewasa',
        nilaiNormal: '150 – 450',
        satuan: '10³/µL',
        nilaiKritis: '< 50 atau > 1.000',
      },
    ],
  },
  {
    id: 'lab-8',
    kodeInternal: 'IMU-ANTI-HCV',
    namaPemeriksaan: 'Anti-HCV',
    deskripsi: 'Skrining antibodi terhadap virus Hepatitis C dalam serum.',
    kategori: 'Imunologi dan Serologi',
    spesimen: 'Serum',
    jenisHasil: 'Kualitatif · Reaktif/Non-reaktif',
    metode: 'Immunochromatography / CLIA',
    waktuPenyelesaianMenit: 90,
    tampilDiPermintaanDokter: true,
    status: 'aktif',
    loincCode: '16128-1',
    loincDisplay: 'Hepatitis C virus Ab [Presence] in Serum',
    loincStatus: 'perlu_ditinjau',
    rentangRujukan: [
      {
        id: 'rr-8',
        kelompok: 'Semua Usia',
        nilaiNormal: 'Non-reaktif',
        satuan: 'Kualitatif',
      },
    ],
  },
  {
    id: 'lab-9',
    kodeInternal: 'IMU-HBSAG',
    namaPemeriksaan: 'HBsAg',
    deskripsi: 'Deteksi antigen permukaan virus Hepatitis B dalam serum.',
    kategori: 'Imunologi dan Serologi',
    spesimen: 'Serum',
    jenisHasil: 'Kualitatif · Reaktif/Non-reaktif',
    metode: 'Immunochromatography / CLIA',
    waktuPenyelesaianMenit: 90,
    tampilDiPermintaanDokter: true,
    status: 'aktif',
    loincCode: '5196-1',
    loincDisplay: 'Hepatitis B virus surface Ag [Presence] in Serum',
    loincStatus: 'perlu_ditinjau',
    rentangRujukan: [
      {
        id: 'rr-9',
        kelompok: 'Semua Usia',
        nilaiNormal: 'Non-reaktif',
        satuan: 'Kualitatif',
      },
    ],
  },
  {
    id: 'lab-10',
    kodeInternal: 'IMU-HIV',
    namaPemeriksaan: 'HIV 1/2 Ag/Ab (Skrining)',
    deskripsi:
      'Skrining kombinasi antigen p24 HIV-1 dan antibodi HIV-1/HIV-2.',
    kategori: 'Imunologi dan Serologi',
    spesimen: 'Serum',
    jenisHasil: 'Kualitatif · Reaktif/Non-reaktif',
    metode: 'Rapid / Chemiluminescence Immunoassay',
    waktuPenyelesaianMenit: 90,
    tampilDiPermintaanDokter: true,
    status: 'aktif',
    loincCode: '56888-1',
    loincDisplay: 'HIV 1+2 Ab+HIV1 p24 Ag [Presence] in Serum or Plasma',
    loincStatus: 'perlu_ditinjau',
    rentangRujukan: [
      {
        id: 'rr-10',
        kelompok: 'Semua Usia',
        nilaiNormal: 'Non-reaktif',
        satuan: 'Kualitatif',
      },
    ],
  },
  ...[
    {
      kode: 'IMU-WIDAL',
      nama: 'Widal Slide',
      desk: 'Uji aglutinasi antibodi Salmonella typhi dan paratyphi.',
      kat: 'Imunologi dan Serologi',
      spes: 'Serum',
      jenis: 'Kualitatif · Reaktif/Non-reaktif' as LabResultTypeKey,
      metode: 'Slide Agglutination',
      menit: 60,
      loinc: '20462-8',
      normal: 'Negatif (< 1/80)',
      satuan: 'Titer',
    },
    {
      kode: 'IMU-NS1',
      nama: 'Dengue NS1 Antigen',
      desk: 'Deteksi dini antigen non-struktural virus Dengue fase akut.',
      kat: 'Imunologi dan Serologi',
      spes: 'Serum',
      jenis: 'Kualitatif · Reaktif/Non-reaktif' as LabResultTypeKey,
      metode: 'Immunochromatography',
      menit: 45,
      loinc: '75377-2',
      normal: 'Negatif',
      satuan: 'Kualitatif',
    },
    {
      kode: 'KIM-GDS',
      nama: 'Glukosa Darah Sewaktu (GDS)',
      desk: 'Pengukuran kadar glukosa darah tanpa puasa.',
      kat: 'Kimia Klinik',
      spes: 'Serum',
      jenis: 'Numerik · Kuantitatif' as LabResultTypeKey,
      metode: 'Hexokinase / GOD-PAP',
      menit: 45,
      loinc: '2345-7',
      normal: '70 – 140',
      satuan: 'mg/dL',
    },
    {
      kode: 'KIM-GDP',
      nama: 'Glukosa Darah Puasa (GDP)',
      desk: 'Pengukuran kadar glukosa darah setelah puasa minimal 8 jam.',
      kat: 'Kimia Klinik',
      spes: 'Serum',
      jenis: 'Numerik · Kuantitatif' as LabResultTypeKey,
      metode: 'Hexokinase / GOD-PAP',
      menit: 45,
      loinc: '1558-6',
      normal: '70 – 99',
      satuan: 'mg/dL',
    },
    {
      kode: 'KIM-GD2PP',
      nama: 'Glukosa 2 Jam PP',
      desk: 'Pengukuran kadar glukosa darah 2 jam setelah makan.',
      kat: 'Kimia Klinik',
      spes: 'Serum',
      jenis: 'Numerik · Kuantitatif' as LabResultTypeKey,
      metode: 'Hexokinase / GOD-PAP',
      menit: 45,
      loinc: '1521-4',
      normal: '< 140',
      satuan: 'mg/dL',
    },
    {
      kode: 'KIM-HBA1C',
      nama: 'HbA1c',
      desk: 'Evaluasi rata-rata kontrol glikemik dalam 2–3 bulan terakhir.',
      kat: 'Kimia Klinik',
      spes: 'Darah EDTA',
      jenis: 'Numerik · Kuantitatif' as LabResultTypeKey,
      metode: 'HPLC / Boronate Affinity',
      menit: 90,
      loinc: '4548-4',
      normal: '< 5.7',
      satuan: '%',
    },
    {
      kode: 'KIM-CHOL',
      nama: 'Kolesterol Total',
      desk: 'Pengukuran kadar kolesterol total dalam serum.',
      kat: 'Kimia Klinik',
      spes: 'Serum',
      jenis: 'Numerik · Kuantitatif' as LabResultTypeKey,
      metode: 'CHOD-PAP Enzymatic',
      menit: 60,
      loinc: '2093-3',
      normal: '< 200',
      satuan: 'mg/dL',
    },
    {
      kode: 'KIM-HDL',
      nama: 'Kolesterol HDL',
      desk: 'Pengukuran fraksi lipoprotein densitas tinggi.',
      kat: 'Kimia Klinik',
      spes: 'Serum',
      jenis: 'Numerik · Kuantitatif' as LabResultTypeKey,
      metode: 'Direct Enzymatic',
      menit: 60,
      loinc: '2085-9',
      normal: '> 40',
      satuan: 'mg/dL',
    },
    {
      kode: 'KIM-LDL',
      nama: 'Kolesterol LDL',
      desk: 'Pengukuran fraksi lipoprotein densitas rendah.',
      kat: 'Kimia Klinik',
      spes: 'Serum',
      jenis: 'Numerik · Kuantitatif' as LabResultTypeKey,
      metode: 'Direct Enzymatic',
      menit: 60,
      loinc: '18262-6',
      normal: '< 100',
      satuan: 'mg/dL',
    },
    {
      kode: 'KIM-TG',
      nama: 'Trigliserida',
      desk: 'Pengukuran kadar trigliserida puasa dalam serum.',
      kat: 'Kimia Klinik',
      spes: 'Serum',
      jenis: 'Numerik · Kuantitatif' as LabResultTypeKey,
      metode: 'GPO-PAP Enzymatic',
      menit: 60,
      loinc: '2571-8',
      normal: '< 150',
      satuan: 'mg/dL',
    },
    {
      kode: 'KIM-URIC',
      nama: 'Asam Urat',
      desk: 'Pengukuran kadar asam urat dalam serum.',
      kat: 'Kimia Klinik',
      spes: 'Serum',
      jenis: 'Numerik · Kuantitatif' as LabResultTypeKey,
      metode: 'Uricase-PAP',
      menit: 60,
      loinc: '3084-1',
      normal: '3.4 – 7.0',
      satuan: 'mg/dL',
    },
    {
      kode: 'KIM-UREUM',
      nama: 'Ureum',
      desk: 'Evaluasi fungsi ekskresi nitrogen ginjal.',
      kat: 'Kimia Klinik',
      spes: 'Serum',
      jenis: 'Numerik · Kuantitatif' as LabResultTypeKey,
      metode: 'Urease-GLDH',
      menit: 60,
      loinc: '3094-0',
      normal: '15 – 40',
      satuan: 'mg/dL',
    },
    {
      kode: 'KIM-CREAT',
      nama: 'Kreatinin',
      desk: 'Pengukuran kreatinin serum untuk estimasi laju filtrasi glomerulus.',
      kat: 'Kimia Klinik',
      spes: 'Serum',
      jenis: 'Numerik · Kuantitatif' as LabResultTypeKey,
      metode: 'Jaffe Kinetic / Enzymatic',
      menit: 60,
      loinc: '2160-0',
      normal: '0.6 – 1.3',
      satuan: 'mg/dL',
    },
    {
      kode: 'KIM-SGOT',
      nama: 'SGOT (AST)',
      desk: 'Pengukuran aktivitas enzim Aspartate Aminotransferase.',
      kat: 'Kimia Klinik',
      spes: 'Serum',
      jenis: 'Numerik · Kuantitatif' as LabResultTypeKey,
      metode: 'IFCC Kinetic UV',
      menit: 60,
      loinc: '1920-8',
      normal: '< 35',
      satuan: 'U/L',
    },
    {
      kode: 'KIM-SGPT',
      nama: 'SGPT (ALT)',
      desk: 'Pengukuran aktivitas enzim Alanine Aminotransferase.',
      kat: 'Kimia Klinik',
      spes: 'Serum',
      jenis: 'Numerik · Kuantitatif' as LabResultTypeKey,
      metode: 'IFCC Kinetic UV',
      menit: 60,
      loinc: '1742-6',
      normal: '< 41',
      satuan: 'U/L',
    },
    {
      kode: 'KIM-BIL-TOT',
      nama: 'Bilirubin Total',
      desk: 'Pengukuran kadar bilirubin total dalam serum.',
      kat: 'Kimia Klinik',
      spes: 'Serum',
      jenis: 'Numerik · Kuantitatif' as LabResultTypeKey,
      metode: 'DCA / DPD',
      menit: 60,
      loinc: '1975-2',
      normal: '0.2 – 1.2',
      satuan: 'mg/dL',
    },
    {
      kode: 'URI-RUT',
      nama: 'Urin Lengkap (Urinalisis)',
      desk: 'Pemeriksaan fisik, kimia carik celup, dan sedimen mikroskopis urin.',
      kat: 'Urinalisis',
      spes: 'Urin Sewaktu',
      jenis: 'Teks · Deskriptif' as LabResultTypeKey,
      metode: 'Dipstick & Mikroskopis Sedimen',
      menit: 60,
      loinc: '24356-8',
      normal: 'Kuning jernih, pH 5.0–7.5, protein & glukosa negatif',
      satuan: 'Panel',
    },
    {
      kode: 'URI-HCG',
      nama: 'Tes Kehamilan (hCG Urin)',
      desk: 'Deteksi kualitatif hormon beta-hCG dalam sampel urin.',
      kat: 'Urinalisis',
      spes: 'Urin Sewaktu',
      jenis: 'Kualitatif · Reaktif/Non-reaktif' as LabResultTypeKey,
      metode: 'Immunochromatography',
      menit: 30,
      loinc: '2106-3',
      normal: 'Negatif',
      satuan: 'Kualitatif',
    },
    {
      kode: 'HEM-GOLDA',
      nama: 'Golongan Darah ABO & Rhesus',
      desk: 'Penentuan golongan darah sistem ABO dan faktor Rhesus.',
      kat: 'Hematologi',
      spes: 'Darah EDTA',
      jenis: 'Teks · Deskriptif' as LabResultTypeKey,
      metode: 'Forward Grouping Slide / Gel',
      menit: 30,
      loinc: '882-1',
      normal: 'A / B / AB / O; Rh Positif / Negatif',
      satuan: 'Golongan',
    },
    {
      kode: 'HEM-RET',
      nama: 'Hitung Retikulosit',
      desk: 'Evaluasi aktivitas eritropoiesis sumsum tulang.',
      kat: 'Hematologi',
      spes: 'Darah EDTA',
      jenis: 'Numerik · Kuantitatif' as LabResultTypeKey,
      metode: 'Supravital Staining / Flow Cytometry',
      menit: 60,
      loinc: '17849-1',
      normal: '0.5 – 2.0',
      satuan: '%',
    },
    {
      kode: 'MIK-BTA',
      nama: 'BTA Sputum (Mikroskopis)',
      desk: 'Pewarnaan Ziehl-Neelsen untuk identifikasi Basil Tahan Asam.',
      kat: 'Mikrobiologi',
      spes: 'Sputum',
      jenis: 'Teks · Deskriptif' as LabResultTypeKey,
      metode: 'Pewarnaan Ziehl-Neelsen',
      menit: 180,
      loinc: '11545-1',
      normal: 'Negatif',
      satuan: 'Skala IUATLD',
    },
  ].map((item, idx) => ({
    id: `lab-${idx + 11}`,
    kodeInternal: item.kode,
    namaPemeriksaan: item.nama,
    deskripsi: item.desk,
    kategori: item.kat,
    spesimen: item.spes,
    jenisHasil: item.jenis,
    metode: item.metode,
    waktuPenyelesaianMenit: item.menit,
    tampilDiPermintaanDokter: true,
    status: 'aktif' as LabItemStatusKey,
    loincCode: item.loinc,
    loincDisplay: item.nama,
    loincStatus: 'perlu_ditinjau' as const,
    rentangRujukan: [
      {
        id: `rr-${idx + 11}`,
        kelompok: 'Dewasa',
        nilaiNormal: item.normal,
        satuan: item.satuan,
      },
    ],
  })),
];

const INITIAL_LAB_PACKAGES: LabPackageItem[] = [
  {
    id: 'pkt-1',
    kodePaket: 'PKT-MCU-DASAR',
    namaPaket: 'Paket Medical Check Up Dasar',
    deskripsi: 'Skrining hematologi rutin, glukosa puasa, dan urinalisis.',
    jumlahParameter: 3,
    daftarKodeItem: ['HEM-DL', 'KIM-GDP', 'URI-RUT'],
    estimasiMenit: 60,
    status: 'aktif',
  },
  {
    id: 'pkt-2',
    kodePaket: 'PKT-PROFIL-LIPID',
    namaPaket: 'Paket Profil Lipid Lengkap',
    deskripsi: 'Evaluasi risiko kardiovaskular dan metabolisme lemak.',
    jumlahParameter: 4,
    daftarKodeItem: ['KIM-CHOL', 'KIM-HDL', 'KIM-LDL', 'KIM-TG'],
    estimasiMenit: 60,
    status: 'aktif',
  },
  {
    id: 'pkt-3',
    kodePaket: 'PKT-FUNGSI-HATI',
    namaPaket: 'Paket Fungsi Hati (LFT)',
    deskripsi: 'Skrining fungsi hepatobilier dan enzim transaminase.',
    jumlahParameter: 3,
    daftarKodeItem: ['KIM-SGOT', 'KIM-SGPT', 'KIM-BIL-TOT'],
    estimasiMenit: 60,
    status: 'aktif',
  },
  {
    id: 'pkt-4',
    kodePaket: 'PKT-FUNGSI-GINJAL',
    namaPaket: 'Paket Fungsi Ginjal (RFT)',
    deskripsi: 'Evaluasi fungsi filtrasi ginjal dan kadar asam urat.',
    jumlahParameter: 3,
    daftarKodeItem: ['KIM-UREUM', 'KIM-CREAT', 'KIM-URIC'],
    estimasiMenit: 60,
    status: 'aktif',
  },
  {
    id: 'pkt-5',
    kodePaket: 'PKT-ANC-TM1',
    namaPaket: 'Paket Antenatal Care (ANC) Trimester 1',
    deskripsi: 'Panel skrining ibu hamil kunjungan awal sesuai standar ANC.',
    jumlahParameter: 5,
    daftarKodeItem: ['HEM-HB', 'HEM-GOLDA', 'IMU-HBSAG', 'IMU-HIV', 'URI-RUT'],
    estimasiMenit: 90,
    status: 'aktif',
  },
  {
    id: 'pkt-6',
    kodePaket: 'PKT-DEMAM-AKUT',
    namaPaket: 'Paket Evaluasi Demam Akut',
    deskripsi: 'Panel diagnostik demam hari ke-1 hingga ke-5.',
    jumlahParameter: 3,
    daftarKodeItem: ['HEM-DL', 'IMU-NS1', 'IMU-WIDAL'],
    estimasiMenit: 60,
    status: 'aktif',
  },
];

const INITIAL_LAB_CATEGORIES: LabCategoryMaster[] = [
  {
    id: 'cat-1',
    kode: 'CAT-HEM',
    nama: 'Hematologi',
    deskripsi: 'Pemeriksaan sel darah, hemoglobin, koagulasi, dan golongan darah.',
    jumlahItem: 8,
    status: 'aktif',
  },
  {
    id: 'cat-2',
    kode: 'CAT-KIM',
    nama: 'Kimia Klinik',
    deskripsi: 'Pemeriksaan metabolik, glukosa, lipid, fungsi hati, dan ginjal.',
    jumlahItem: 14,
    status: 'aktif',
  },
  {
    id: 'cat-3',
    kode: 'CAT-IMU',
    nama: 'Imunologi dan Serologi',
    deskripsi: 'Pemeriksaan antigen, antibodi infeksi, dan penanda serologis.',
    jumlahItem: 5,
    status: 'aktif',
  },
  {
    id: 'cat-4',
    kode: 'CAT-URI',
    nama: 'Urinalisis',
    deskripsi: 'Pemeriksaan makroskopis, kimia carik celup, dan sedimen urin.',
    jumlahItem: 2,
    status: 'aktif',
  },
  {
    id: 'cat-5',
    kode: 'CAT-FEK',
    nama: 'Feses',
    deskripsi: 'Pemeriksaan makroskopis dan mikroskopis tinja.',
    jumlahItem: 1,
    status: 'aktif',
  },
  {
    id: 'cat-6',
    kode: 'CAT-MIK',
    nama: 'Mikrobiologi',
    deskripsi: 'Pewarnaan bakteriologis dan identifikasi mikroorganisme.',
    jumlahItem: 1,
    status: 'aktif',
  },
];

const INITIAL_LAB_SPECIMENS: LabSpecimenMaster[] = [
  {
    id: 'spc-1',
    kode: 'SPC-EDTA',
    nama: 'Darah EDTA',
    tabungWadah: 'Tabung tutup ungu (K2/K3 EDTA)',
    volumeMinimal: '3 mL',
    status: 'aktif',
  },
  {
    id: 'spc-2',
    kode: 'SPC-SERUM',
    nama: 'Serum',
    tabungWadah: 'Tabung tutup merah / kuning (SST)',
    volumeMinimal: '3 mL',
    status: 'aktif',
  },
  {
    id: 'spc-3',
    kode: 'SPC-LED',
    nama: 'Darah untuk LED',
    tabungWadah: 'Tabung tutup hitam (Natrium Sitrat 3.8%)',
    volumeMinimal: '2 mL',
    status: 'aktif',
  },
  {
    id: 'spc-4',
    kode: 'SPC-URIN',
    nama: 'Urin Sewaktu',
    tabungWadah: 'Pot urin steril tutup ulir',
    volumeMinimal: '15 mL',
    status: 'aktif',
  },
  {
    id: 'spc-5',
    kode: 'SPC-FESES',
    nama: 'Feses',
    tabungWadah: 'Pot feses bersih bermulut lebar dengan sendok',
    volumeMinimal: '5 gram',
    status: 'aktif',
  },
  {
    id: 'spc-6',
    kode: 'SPC-SPUTUM',
    nama: 'Sputum',
    tabungWadah: 'Pot dahak steril transparan',
    volumeMinimal: '3 mL',
    status: 'aktif',
  },
];

export default function MasterPemeriksaanLaboratorium({
  initialItems = INITIAL_LAB_ITEMS,
  onSaveItem,
}: {
  initialItems?: LabExaminationItem[];
  onSaveItem?: (item: LabExaminationItem) => void;
}) {
  const [activeTab, setActiveTab] = useState<LabMasterTabKey>('item');
  const [items, setItems] = useState<LabExaminationItem[]>(initialItems);
  const [packages] = useState<LabPackageItem[]>(INITIAL_LAB_PACKAGES);
  const [categories] = useState<LabCategoryMaster[]>(INITIAL_LAB_CATEGORIES);
  const [specimens] = useState<LabSpecimenMaster[]>(INITIAL_LAB_SPECIMENS);

  const [selectedItemId, setSelectedItemId] = useState<string>(
    initialItems[0]?.id ?? '',
  );

  // Filter, Pencarian & Pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | LabItemStatusKey>(
    'ALL',
  );
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<LabExaminationItem | null>(
    null,
  );
  const [refRangeItem, setRefRangeItem] = useState<LabExaminationItem | null>(
    null,
  );

  // Form Tambah Item Baru
  const [newKode, setNewKode] = useState('');
  const [newNama, setNewNama] = useState('');
  const [newDeskripsi, setNewDeskripsi] = useState('');
  const [newKategori, setNewKategori] = useState('Hematologi');
  const [newSpesimen, setNewSpesimen] = useState('Darah EDTA');
  const [newJenisHasil, setNewJenisHasil] = useState<LabResultTypeKey>(
    'Numerik · Kuantitatif',
  );
  const [newMetode, setNewMetode] = useState('Automated Analyzer');
  const [newWaktuMenit, setNewWaktuMenit] = useState<number>(60);
  const [newTampilDokter, setNewTampilDokter] = useState<boolean>(true);

  // Form Tambah Rentang Rujukan di dalam Modal
  const [newRangeKelompok, setNewRangeKelompok] = useState('Dewasa');
  const [newRangeNormal, setNewRangeNormal] = useState('');
  const [newRangeSatuan, setNewRangeSatuan] = useState('');
  const [newRangeKritis, setNewRangeKritis] = useState('');

  const importInputRef = useRef<HTMLInputElement | null>(null);

  // KPI Header Stats
  const kpiStats = useMemo(() => {
    const activeItemsCount = items.filter((i) => i.status === 'aktif').length;
    const unreviewedMappingCount = items.filter(
      (i) => i.loincStatus === 'perlu_ditinjau',
    ).length;
    return {
      pemeriksaanAktif: activeItemsCount,
      paketPemeriksaan: packages.length,
      pemetaanPerluDitinjau: unreviewedMappingCount,
    };
  }, [items, packages.length]);

  // Opsi unik kategori dari data item
  const categoryOptions = useMemo(() => {
    return Array.from(new Set(items.map((item) => item.kategori)));
  }, [items]);

  // Filter Item Pemeriksaan
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (statusFilter !== 'ALL' && item.status !== statusFilter) {
        return false;
      }
      if (categoryFilter !== 'ALL' && item.kategori !== categoryFilter) {
        return false;
      }
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const match =
          item.kodeInternal.toLowerCase().includes(q) ||
          item.namaPemeriksaan.toLowerCase().includes(q) ||
          item.kategori.toLowerCase().includes(q) ||
          item.spesimen.toLowerCase().includes(q) ||
          (item.loincCode ?? '').toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [items, statusFilter, categoryFilter, searchQuery]);

  // Pagination Item Pemeriksaan
  const totalFiltered = filteredItems.length;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / pageSize));
  const safePage = Math.min(currentPage, totalPages);

  const paginatedItems = useMemo(() => {
    const startIdx = (safePage - 1) * pageSize;
    return filteredItems.slice(startIdx, startIdx + pageSize);
  }, [filteredItems, safePage, pageSize]);

  const startNumber = totalFiltered === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const endNumber = Math.min(safePage * pageSize, totalFiltered);

  // Item terpilih untuk panel DETAIL ITEM kanan
  const selectedItem = useMemo(() => {
    return (
      items.find((i) => i.id === selectedItemId) ??
      filteredItems[0] ??
      items[0] ??
      null
    );
  }, [items, selectedItemId, filteredItems]);

  const handleToggleItemStatus = (target: LabExaminationItem) => {
    const nextStatus: LabItemStatusKey =
      target.status === 'aktif' ? 'nonaktif' : 'aktif';
    const updated: LabExaminationItem = { ...target, status: nextStatus };

    setItems((prev) =>
      prev.map((item) => (item.id === target.id ? updated : item)),
    );
    onSaveItem?.(updated);
  };

  const handleToggleLoincStatus = (target: LabExaminationItem) => {
    const nextLoincStatus =
      target.loincStatus === 'perlu_ditinjau'
        ? 'terpetakan_lokal'
        : 'perlu_ditinjau';
    const updated: LabExaminationItem = {
      ...target,
      loincStatus: nextLoincStatus,
    };

    setItems((prev) =>
      prev.map((item) => (item.id === target.id ? updated : item)),
    );
    onSaveItem?.(updated);
  };

  const handleOpenAddModal = () => {
    setNewKode('');
    setNewNama('');
    setNewDeskripsi('');
    setNewKategori('Hematologi');
    setNewSpesimen('Darah EDTA');
    setNewJenisHasil('Numerik · Kuantitatif');
    setNewMetode('Automated Analyzer');
    setNewWaktuMenit(60);
    setNewTampilDokter(true);
    setIsAddModalOpen(true);
  };

  const handleCreateItemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKode.trim() || !newNama.trim()) return;

    const created: LabExaminationItem = {
      id: `lab-${Date.now()}`,
      kodeInternal: newKode.trim().toUpperCase().replace(/\s+/g, '-'),
      namaPemeriksaan: newNama.trim(),
      deskripsi:
        newDeskripsi.trim() ||
        `Pemeriksaan laboratorium ${newNama.trim()}.`,
      kategori: newKategori,
      spesimen: newSpesimen,
      jenisHasil: newJenisHasil,
      metode: newMetode.trim() || 'Standar Laboratorium',
      waktuPenyelesaianMenit: Math.max(5, Number(newWaktuMenit) || 60),
      tampilDiPermintaanDokter: newTampilDokter,
      status: 'aktif',
      loincStatus: 'perlu_ditinjau',
      rentangRujukan: [],
    };

    setItems((prev) => [created, ...prev]);
    setSelectedItemId(created.id);
    onSaveItem?.(created);
    setIsAddModalOpen(false);
    setCurrentPage(1);
  };

  // CSV Template & Ekspor Item
  const handleDownloadCsv = (onlyTemplate: boolean) => {
    const header =
      'kode_internal,nama_pemeriksaan,kategori,spesimen,jenis_hasil,metode,waktu_menit,permintaan_dokter,status';
    const rows = onlyTemplate
      ? [
          'FEK-RUT,Feses Rutin,Feses,Feses,Teks · Deskriptif,Makroskopis dan mikroskopis,120,Tampil,aktif',
        ]
      : filteredItems.map(
          (item) =>
            `${item.kodeInternal},"${item.namaPemeriksaan.replace(
              /"/g,
              '""',
            )}",${item.kategori},${item.spesimen},"${item.jenisHasil}","${
              item.metode
            }",${item.waktuPenyelesaianMenit},${
              item.tampilDiPermintaanDokter ? 'Tampil' : 'Sembunyi'
            },${item.status}`,
        );

    const blob = new Blob([[header, ...rows].join('\n')], {
      type: 'text/csv;charset=utf-8;',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = onlyTemplate
      ? 'template-item-laboratorium.csv'
      : 'katalog-pemeriksaan-laboratorium.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  // CSV Impor Item
  const handleImportCsv = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== 'string') return;
      const lines = reader.result
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter(Boolean);

      if (lines.length <= 1) return;

      const imported: LabExaminationItem[] = lines.slice(1).map((line, idx) => {
        const cols = line
          .split(',')
          .map((c) => c.replace(/^"|"$/g, '').trim());
        return {
          id: `lab-imp-${Date.now()}-${idx}`,
          kodeInternal: (cols[0] || `LAB-IMP-${idx + 1}`).toUpperCase(),
          namaPemeriksaan: cols[1] || 'Item Pemeriksaan Baru',
          deskripsi: `Pemeriksaan ${cols[1] || 'Item Pemeriksaan Baru'}.`,
          kategori: cols[2] || 'Kimia Klinik',
          spesimen: cols[3] || 'Serum',
          jenisHasil:
            (cols[4] as LabResultTypeKey) || 'Numerik · Kuantitatif',
          metode: cols[5] || 'Automated Analyzer',
          waktuPenyelesaianMenit: Number(cols[6]) || 60,
          tampilDiPermintaanDokter: cols[7]?.toLowerCase() !== 'sembunyi',
          status:
            cols[8]?.toLowerCase() === 'nonaktif' ? 'nonaktif' : 'aktif',
          loincStatus: 'perlu_ditinjau',
          rentangRujukan: [],
        };
      });

      setItems((prev) => [...imported, ...prev]);
      if (imported[0]) setSelectedItemId(imported[0].id);
      setCurrentPage(1);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="w-full h-full font-sans text-slate-700">
      {/* =====================================================================
          KARTU UTAMA MASTER PEMERIKSAAN LABORATORIUM
         ===================================================================== */}
      <section className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_2px_rgba(15,23,42,0.03)] overflow-hidden">
        {/* -------------------------------------------------------------------
            1. HEADER, 3 KARTU KPI RINGKAS & 5 TAB NAVIGASI
           ------------------------------------------------------------------- */}
        <div className="px-6 pt-5 space-y-4">
          {/* Top Title & Right Unit Pill */}
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                MASTER DATA LABORATORIUM
              </p>
              <h1 className="text-lg sm:text-xl font-extrabold text-[#0f3d56] mt-0.5">
                Master Pemeriksaan Laboratorium
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Kelola katalog unit, paket, kategori, spesimen, dan pemetaan
                lokal secara terlacak.
              </p>
            </div>

            <span className="inline-flex items-center px-3.5 py-2 rounded-lg border border-slate-200 bg-slate-50/70 text-xs font-semibold text-slate-600">
              Laboratorium
            </span>
          </div>

          {/* 3 Kartu KPI Horizontal */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="min-w-[175px] rounded-lg border border-slate-200/90 bg-slate-50/40 px-4 py-2.5 flex items-center justify-between gap-4">
              <span className="text-xs text-slate-500">Pemeriksaan aktif</span>
              <span className="text-base font-extrabold text-[#0f3d56] tabular-nums">
                {kpiStats.pemeriksaanAktif}
              </span>
            </div>

            <div className="min-w-[175px] rounded-lg border border-slate-200/90 bg-slate-50/40 px-4 py-2.5 flex items-center justify-between gap-4">
              <span className="text-xs text-slate-500">Paket pemeriksaan</span>
              <span className="text-base font-extrabold text-[#0f3d56] tabular-nums">
                {kpiStats.paketPemeriksaan}
              </span>
            </div>

            <div className="min-w-[205px] rounded-lg border border-slate-200/90 bg-slate-50/40 px-4 py-2.5 flex items-center justify-between gap-4">
              <span className="text-xs text-slate-500">
                Pemetaan perlu ditinjau
              </span>
              <span className="text-base font-extrabold text-[#0f3d56] tabular-nums">
                {kpiStats.pemetaanPerluDitinjau}
              </span>
            </div>
          </div>

          {/* 5 Tab Navigasi */}
          <nav
            aria-label="Submenu Master Laboratorium"
            className="flex items-center gap-6 overflow-x-auto border-b border-slate-200/80 pt-1"
          >
            {(
              [
                { key: 'item', label: 'Item pemeriksaan' },
                { key: 'paket', label: 'Paket pemeriksaan' },
                { key: 'kategori', label: 'Kategori' },
                { key: 'spesimen', label: 'Spesimen' },
                { key: 'loinc', label: 'Pemetaan LOINC' },
              ] as const
            ).map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab.key);
                    setSearchQuery('');
                    setStatusFilter('ALL');
                    setCategoryFilter('ALL');
                    setCurrentPage(1);
                  }}
                  className={`pb-3 text-xs sm:text-[13px] whitespace-nowrap border-b-2 transition-colors cursor-pointer ${
                    isActive
                      ? 'border-[#008ba6] text-[#008ba6] font-bold'
                      : 'border-transparent text-slate-500 font-semibold hover:text-slate-800'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* -------------------------------------------------------------------
            2. KONTEN TAB AKTIF
           ------------------------------------------------------------------- */}
        {activeTab === 'item' && (
          <>
            {/* Toolbar Aksi & Bar Pencarian / Filter */}
            <div className="px-6 py-4 space-y-3.5">
              {/* Baris Tombol Kanan: Template, Ekspor Item, Impor Item, + Tambah item */}
              <div className="flex flex-wrap items-center justify-end gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => handleDownloadCsv(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 font-semibold text-[#0f3d56] transition-colors cursor-pointer"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-slate-500" />
                  <span>Template</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDownloadCsv(false)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 font-semibold text-[#0f3d56] transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-slate-500" />
                  <span>Ekspor Item</span>
                </button>

                <input
                  ref={importInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleImportCsv}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => importInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 font-semibold text-[#0f3d56] transition-colors cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5 text-slate-500" />
                  <span>Impor Item</span>
                </button>

                <button
                  type="button"
                  onClick={handleOpenAddModal}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#009bb8] hover:bg-[#00859e] active:bg-[#007389] text-white font-semibold shadow-2xs transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah item</span>
                </button>
              </div>

              {/* Baris Search + Filter Status + Filter Kategori */}
              <div className="flex flex-wrap items-center gap-3 text-xs">
                <div className="relative flex-1 min-w-[260px]">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="Cari nama atau kode pemeriksaan"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-[#009bb8] focus:ring-2 focus:ring-[#009bb8]/15"
                  />
                </div>

                {/* Status */}
                <div className="flex items-center gap-2">
                  <label
                    htmlFor="filter-lab-status"
                    className="text-xs font-semibold text-slate-500"
                  >
                    Status
                  </label>
                  <div className="relative">
                    <select
                      id="filter-lab-status"
                      value={statusFilter}
                      onChange={(e) => {
                        setStatusFilter(
                          e.target.value as 'ALL' | LabItemStatusKey,
                        );
                        setCurrentPage(1);
                      }}
                      className="appearance-none bg-white border border-slate-200 rounded-lg pl-3 pr-8 py-2.5 text-xs font-semibold text-[#0f3d56] focus:outline-none focus:border-[#009bb8] cursor-pointer"
                    >
                      <option value="ALL">Semua status</option>
                      <option value="aktif">Aktif</option>
                      <option value="nonaktif">Nonaktif</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Kategori */}
                <div className="flex items-center gap-2">
                  <label
                    htmlFor="filter-lab-kategori"
                    className="text-xs font-semibold text-slate-500"
                  >
                    Kategori
                  </label>
                  <div className="relative">
                    <select
                      id="filter-lab-kategori"
                      value={categoryFilter}
                      onChange={(e) => {
                        setCategoryFilter(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="appearance-none bg-white border border-slate-200 rounded-lg pl-3 pr-8 py-2.5 text-xs font-semibold text-[#0f3d56] focus:outline-none focus:border-[#009bb8] cursor-pointer"
                    >
                      <option value="ALL">Semua kategori</option>
                      {categoryOptions.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* Split Grid: Tabel Item (Kiri) + Detail Item (Kanan) */}
            <div className="border-t border-slate-200/80 grid grid-cols-1 xl:grid-cols-[1fr_365px]">
              {/* KOLOM KIRI: TABEL ITEM PEMERIKSAAN */}
              <div className="flex flex-col justify-between min-w-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[740px]">
                    <thead className="bg-slate-50/70 border-b border-slate-200/80 text-[11px] font-bold text-slate-500">
                      <tr>
                        <th className="pl-6 pr-3 py-3.5">Kode internal</th>
                        <th className="px-3 py-3.5">Nama pemeriksaan</th>
                        <th className="px-3 py-3.5">Kategori</th>
                        <th className="px-3 py-3.5">Spesimen</th>
                        <th className="px-3 py-3.5">Permintaan Dokter</th>
                        <th className="pl-3 pr-5 py-3.5">Status</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-200/70 text-xs">
                      {paginatedItems.length === 0 ? (
                        <tr>
                          <td
                            colSpan={6}
                            className="py-12 px-6 text-center text-slate-400"
                          >
                            Tidak ada item pemeriksaan laboratorium yang sesuai
                            filter.
                          </td>
                        </tr>
                      ) : (
                        paginatedItems.map((item) => {
                          const isSelected = selectedItem?.id === item.id;

                          return (
                            <tr
                              key={item.id}
                              onClick={() => setSelectedItemId(item.id)}
                              className={`transition-colors cursor-pointer ${
                                isSelected
                                  ? 'bg-[#edf7fc] border-l-[3px] border-l-[#008ba6]'
                                  : 'hover:bg-slate-50/80 bg-white'
                              }`}
                            >
                              {/* Kode internal */}
                              <td className="pl-6 pr-3 py-4 align-middle font-mono text-xs font-extrabold text-[#008ba6] whitespace-nowrap">
                                {item.kodeInternal}
                              </td>

                              {/* Nama pemeriksaan */}
                              <td className="px-3 py-4 align-middle font-bold text-[#0f3d56]">
                                {item.namaPemeriksaan}
                              </td>

                              {/* Kategori */}
                              <td className="px-3 py-4 align-middle text-slate-600 whitespace-nowrap">
                                {item.kategori}
                              </td>

                              {/* Spesimen */}
                              <td className="px-3 py-4 align-middle text-slate-600 whitespace-nowrap">
                                {item.spesimen}
                              </td>

                              {/* Permintaan Dokter */}
                              <td className="px-3 py-4 align-middle whitespace-nowrap">
                                {item.tampilDiPermintaanDokter ? (
                                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/70 text-[11px] font-semibold text-emerald-700">
                                    Tampil
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-[11px] font-semibold text-slate-500">
                                    Sembunyi
                                  </span>
                                )}
                              </td>

                              {/* Status */}
                              <td className="pl-3 pr-5 py-4 align-middle whitespace-nowrap">
                                {item.status === 'aktif' ? (
                                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/70 text-[11px] font-semibold text-emerald-700">
                                    Aktif
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-[11px] font-semibold text-slate-500">
                                    Nonaktif
                                  </span>
                                )}
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Footer Pagination Tabel */}
                <div className="px-6 py-4 border-t border-slate-200/70 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
                  {/* Kiri: Tampilkan [10 Baris] */}
                  <div className="flex items-center gap-2">
                    <label htmlFor="per-halaman-lab">Tampilkan</label>
                    <div className="relative">
                      <select
                        id="per-halaman-lab"
                        value={pageSize}
                        onChange={(e) => {
                          setPageSize(Number(e.target.value));
                          setCurrentPage(1);
                        }}
                        className="appearance-none bg-white border border-slate-200 rounded-lg pl-3 pr-7 py-1.5 text-xs font-semibold text-[#0f3d56] focus:outline-none focus:border-[#009bb8] cursor-pointer"
                      >
                        <option value={10}>10 Baris</option>
                        <option value={20}>20 Baris</option>
                        <option value={50}>50 Baris</option>
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  {/* Tengah: 1–10 dari 31 */}
                  <div className="tabular-nums">
                    <strong className="font-semibold text-slate-700">
                      {startNumber}–{endNumber}
                    </strong>{' '}
                    dari{' '}
                    <strong className="font-semibold text-slate-700">
                      {totalFiltered}
                    </strong>
                  </div>

                  {/* Kanan: [<] [1] [2] [3] [4] [>] */}
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={safePage <= 1}
                      aria-label="Halaman sebelumnya"
                      className="w-8 h-8 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center text-slate-500 cursor-pointer"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>

                    {Array.from({ length: totalPages }, (_, idx) => idx + 1).map(
                      (page) => {
                        const isCurrent = page === safePage;
                        return (
                          <button
                            key={page}
                            type="button"
                            onClick={() => setCurrentPage(page)}
                            className={`w-8 h-8 rounded-lg border text-xs font-bold transition-colors cursor-pointer ${
                              isCurrent
                                ? 'bg-[#009bb8] border-[#009bb8] text-white'
                                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            {page}
                          </button>
                        );
                      },
                    )}

                    <button
                      type="button"
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={safePage >= totalPages}
                      aria-label="Halaman berikutnya"
                      className="w-8 h-8 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center text-slate-500 cursor-pointer"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* KOLOM KANAN: PANEL DETAIL ITEM */}
              <aside className="border-t xl:border-t-0 xl:border-l border-slate-200/80 p-5 flex flex-col justify-between bg-white">
                {!selectedItem ? (
                  <div className="py-16 text-center text-xs text-slate-400">
                    Pilih item pemeriksaan pada tabel untuk melihat detail.
                  </div>
                ) : (
                  <>
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        DETAIL ITEM
                      </p>

                      <h2 className="text-base sm:text-lg font-extrabold text-[#0f3d56] mt-1.5 leading-snug">
                        {selectedItem.namaPemeriksaan}
                      </h2>

                      <p className="font-mono text-xs font-extrabold text-[#008ba6] mt-1">
                        {selectedItem.kodeInternal}
                      </p>

                      <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                        {selectedItem.deskripsi}
                      </p>

                      {/* Daftar Atribut Key-Value Terpisah Garis Tipis */}
                      <dl className="mt-4 divide-y divide-slate-200/70 border-t border-b border-slate-200/70 text-xs">
                        <div className="py-3">
                          <dt className="text-[11px] text-slate-400">
                            Kategori
                          </dt>
                          <dd className="font-bold text-[#0f3d56] mt-0.5">
                            {selectedItem.kategori}
                          </dd>
                        </div>

                        <div className="py-3">
                          <dt className="text-[11px] text-slate-400">
                            Spesimen
                          </dt>
                          <dd className="font-bold text-[#0f3d56] mt-0.5">
                            {selectedItem.spesimen}
                          </dd>
                        </div>

                        <div className="py-3">
                          <dt className="text-[11px] text-slate-400">
                            Jenis hasil
                          </dt>
                          <dd className="font-bold text-[#0f3d56] mt-0.5">
                            {selectedItem.jenisHasil}
                          </dd>
                        </div>

                        <div className="py-3">
                          <dt className="text-[11px] text-slate-400">Metode</dt>
                          <dd className="font-bold text-[#0f3d56] mt-0.5">
                            {selectedItem.metode}
                          </dd>
                        </div>

                        <div className="py-3">
                          <dt className="text-[11px] text-slate-400">
                            Waktu penyelesaian
                          </dt>
                          <dd className="font-bold text-[#0f3d56] mt-0.5 tabular-nums">
                            {selectedItem.waktuPenyelesaianMenit} menit
                          </dd>
                        </div>

                        <div className="py-3">
                          <dt className="text-[11px] text-slate-400">
                            Permintaan Dokter
                          </dt>
                          <dd className="font-bold text-[#0f3d56] mt-0.5">
                            {selectedItem.tampilDiPermintaanDokter
                              ? 'Ditampilkan'
                              : 'Disembunyikan'}
                          </dd>
                        </div>
                      </dl>
                    </div>

                    {/* 3 Tombol Aksi Bawah: Rentang rujukan, Ubah item, Nonaktifkan */}
                    <div className="pt-5 flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setRefRangeItem(selectedItem)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-[#0f3d56] transition-colors cursor-pointer"
                      >
                        <span>Rentang rujukan</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setEditingItem(selectedItem)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-[#0f3d56] transition-colors cursor-pointer"
                      >
                        <Pencil className="w-3.5 h-3.5 text-slate-500" />
                        <span>Ubah item</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleToggleItemStatus(selectedItem)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-[#0f3d56] transition-colors cursor-pointer"
                      >
                        {selectedItem.status === 'aktif' ? (
                          <>
                            <EyeOff className="w-3.5 h-3.5 text-slate-500" />
                            <span>Nonaktifkan</span>
                          </>
                        ) : (
                          <>
                            <Eye className="w-3.5 h-3.5 text-[#008ba6]" />
                            <span>Aktifkan</span>
                          </>
                        )}
                      </button>
                    </div>
                  </>
                )}
              </aside>
            </div>
          </>
        )}

        {/* TAB 2: PAKET PEMERIKSAAN */}
        {activeTab === 'paket' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[760px]">
              <thead className="bg-slate-50/70 border-b border-slate-200/80 text-[11px] font-bold text-slate-500">
                <tr>
                  <th className="pl-6 pr-3 py-3.5">Kode paket</th>
                  <th className="px-3 py-3.5">Nama paket pemeriksaan</th>
                  <th className="px-3 py-3.5">Komponen parameter</th>
                  <th className="px-3 py-3.5">Estimasi waktu</th>
                  <th className="pl-3 pr-6 py-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/70 text-xs">
                {packages.map((pkg) => (
                  <tr key={pkg.id} className="hover:bg-slate-50/70">
                    <td className="pl-6 pr-3 py-4 font-mono font-extrabold text-[#008ba6] whitespace-nowrap">
                      {pkg.kodePaket}
                    </td>
                    <td className="px-3 py-4">
                      <p className="font-bold text-[#0f3d56]">
                        {pkg.namaPaket}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {pkg.deskripsi}
                      </p>
                    </td>
                    <td className="px-3 py-4 text-slate-600">
                      <span className="font-bold text-[#0f3d56]">
                        {pkg.jumlahParameter} item:
                      </span>{' '}
                      <span className="font-mono text-[11px]">
                        {pkg.daftarKodeItem.join(', ')}
                      </span>
                    </td>
                    <td className="px-3 py-4 text-slate-600 tabular-nums whitespace-nowrap">
                      {pkg.estimasiMenit} menit
                    </td>
                    <td className="pl-3 pr-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/70 text-[11px] font-semibold text-emerald-700">
                        Aktif
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 3: KATEGORI */}
        {activeTab === 'kategori' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[680px]">
              <thead className="bg-slate-50/70 border-b border-slate-200/80 text-[11px] font-bold text-slate-500">
                <tr>
                  <th className="pl-6 pr-3 py-3.5">Kode kategori</th>
                  <th className="px-3 py-3.5">Nama kategori</th>
                  <th className="px-3 py-3.5">Deskripsi</th>
                  <th className="px-3 py-3.5">Jumlah item</th>
                  <th className="pl-3 pr-6 py-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/70 text-xs">
                {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-slate-50/70">
                    <td className="pl-6 pr-3 py-4 font-mono font-extrabold text-[#008ba6] whitespace-nowrap">
                      {cat.kode}
                    </td>
                    <td className="px-3 py-4 font-bold text-[#0f3d56] whitespace-nowrap">
                      {cat.nama}
                    </td>
                    <td className="px-3 py-4 text-slate-500">
                      {cat.deskripsi}
                    </td>
                    <td className="px-3 py-4 font-bold text-[#0f3d56] tabular-nums whitespace-nowrap">
                      {cat.jumlahItem} pemeriksaan
                    </td>
                    <td className="pl-3 pr-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/70 text-[11px] font-semibold text-emerald-700">
                        Aktif
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 4: SPESIMEN */}
        {activeTab === 'spesimen' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[680px]">
              <thead className="bg-slate-50/70 border-b border-slate-200/80 text-[11px] font-bold text-slate-500">
                <tr>
                  <th className="pl-6 pr-3 py-3.5">Kode spesimen</th>
                  <th className="px-3 py-3.5">Jenis spesimen</th>
                  <th className="px-3 py-3.5">Tabung / wadah koleksi</th>
                  <th className="px-3 py-3.5">Volume minimal</th>
                  <th className="pl-3 pr-6 py-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/70 text-xs">
                {specimens.map((spc) => (
                  <tr key={spc.id} className="hover:bg-slate-50/70">
                    <td className="pl-6 pr-3 py-4 font-mono font-extrabold text-[#008ba6] whitespace-nowrap">
                      {spc.kode}
                    </td>
                    <td className="px-3 py-4 font-bold text-[#0f3d56] whitespace-nowrap">
                      {spc.nama}
                    </td>
                    <td className="px-3 py-4 text-slate-600">
                      {spc.tabungWadah}
                    </td>
                    <td className="px-3 py-4 font-semibold text-slate-600 whitespace-nowrap">
                      {spc.volumeMinimal}
                    </td>
                    <td className="pl-3 pr-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/70 text-[11px] font-semibold text-emerald-700">
                        Aktif
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 5: PEMETAAN LOINC */}
        {activeTab === 'loinc' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[780px]">
              <thead className="bg-slate-50/70 border-b border-slate-200/80 text-[11px] font-bold text-slate-500">
                <tr>
                  <th className="pl-6 pr-3 py-3.5">Kode internal</th>
                  <th className="px-3 py-3.5">Nama pemeriksaan</th>
                  <th className="px-3 py-3.5">Kode LOINC</th>
                  <th className="px-3 py-3.5">Terminologi LOINC</th>
                  <th className="px-3 py-3.5">Status pemetaan</th>
                  <th className="pl-3 pr-6 py-3.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/70 text-xs">
                {items.slice(0, 12).map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70">
                    <td className="pl-6 pr-3 py-4 font-mono font-extrabold text-[#008ba6] whitespace-nowrap">
                      {item.kodeInternal}
                    </td>
                    <td className="px-3 py-4 font-bold text-[#0f3d56]">
                      {item.namaPemeriksaan}
                    </td>
                    <td className="px-3 py-4 font-mono font-semibold text-slate-700 whitespace-nowrap">
                      {item.loincCode || 'Belum diisi'}
                    </td>
                    <td className="px-3 py-4 text-slate-500">
                      {item.loincDisplay || '-'}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      {item.loincStatus === 'perlu_ditinjau' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200/80 text-[11px] font-semibold text-amber-700">
                          Perlu ditinjau
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-[11px] font-semibold text-emerald-700">
                          Terpetakan lokal
                        </span>
                      )}
                    </td>
                    <td className="pl-3 pr-6 py-4 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleToggleLoincStatus(item)}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-[#0f3d56] cursor-pointer"
                      >
                        {item.loincStatus === 'perlu_ditinjau'
                          ? 'Validasi Lokal'
                          : 'Tandai Tinjau'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* =====================================================================
          3. MODAL RENTANG RUJUKAN PEMERIKSAAN
         ===================================================================== */}
      {refRangeItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-[1px] flex items-center justify-center p-4">
          <div className="w-full max-w-xl rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#e6f6f9] text-[#008ba6] flex items-center justify-center">
                  <Ruler className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[11px] font-mono font-bold text-[#008ba6]">
                    {refRangeItem.kodeInternal}
                  </p>
                  <h3 className="text-base font-extrabold text-[#0f3d56]">
                    Rentang Rujukan · {refRangeItem.namaPemeriksaan}
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setRefRangeItem(null)}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              {refRangeItem.rentangRujukan.length === 0 ? (
                <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-4 text-center text-slate-400">
                  Belum ada nilai rentang rujukan yang dikonfigurasi.
                </div>
              ) : (
                <div className="border border-slate-200/80 rounded-xl overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-500">
                      <tr>
                        <th className="px-3.5 py-2.5">Kelompok</th>
                        <th className="px-3.5 py-2.5">Nilai Rujukan</th>
                        <th className="px-3.5 py-2.5">Satuan</th>
                        <th className="px-3.5 py-2.5">Nilai Kritis</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200/70">
                      {refRangeItem.rentangRujukan.map((rr) => (
                        <tr key={rr.id}>
                          <td className="px-3.5 py-2.5 font-bold text-[#0f3d56]">
                            {rr.kelompok}
                          </td>
                          <td className="px-3.5 py-2.5 text-slate-700">
                            {rr.nilaiNormal}
                          </td>
                          <td className="px-3.5 py-2.5 text-slate-500">
                            {rr.satuan}
                          </td>
                          <td className="px-3.5 py-2.5 text-rose-600 font-medium">
                            {rr.nilaiKritis || '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Form Tambah Baris Rentang Rujukan */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newRangeNormal.trim()) return;
                  const nextRange: LabReferenceRange = {
                    id: `rr-${Date.now()}`,
                    kelompok: newRangeKelompok.trim() || 'Dewasa',
                    nilaiNormal: newRangeNormal.trim(),
                    satuan: newRangeSatuan.trim() || '-',
                    nilaiKritis: newRangeKritis.trim() || undefined,
                  };
                  const updated: LabExaminationItem = {
                    ...refRangeItem,
                    rentangRujukan: [...refRangeItem.rentangRujukan, nextRange],
                  };
                  setItems((prev) =>
                    prev.map((i) => (i.id === updated.id ? updated : i)),
                  );
                  setRefRangeItem(updated);
                  onSaveItem?.(updated);
                  setNewRangeNormal('');
                  setNewRangeSatuan('');
                  setNewRangeKritis('');
                }}
                className="pt-3 border-t border-slate-100 space-y-3"
              >
                <p className="font-bold text-[#0f3d56]">
                  Tambah Baris Rentang Rujukan
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <input
                    type="text"
                    value={newRangeKelompok}
                    onChange={(e) => setNewRangeKelompok(e.target.value)}
                    placeholder="Kelompok (Dewasa)"
                    className="border border-slate-200 rounded-lg px-2.5 py-2 text-xs text-slate-700 focus:outline-none focus:border-[#009bb8]"
                  />
                  <input
                    type="text"
                    required
                    value={newRangeNormal}
                    onChange={(e) => setNewRangeNormal(e.target.value)}
                    placeholder="Nilai normal"
                    className="border border-slate-200 rounded-lg px-2.5 py-2 text-xs text-slate-700 focus:outline-none focus:border-[#009bb8]"
                  />
                  <input
                    type="text"
                    value={newRangeSatuan}
                    onChange={(e) => setNewRangeSatuan(e.target.value)}
                    placeholder="Satuan (g/dL)"
                    className="border border-slate-200 rounded-lg px-2.5 py-2 text-xs text-slate-700 focus:outline-none focus:border-[#009bb8]"
                  />
                  <input
                    type="text"
                    value={newRangeKritis}
                    onChange={(e) => setNewRangeKritis(e.target.value)}
                    placeholder="Kritis (opsional)"
                    className="border border-slate-200 rounded-lg px-2.5 py-2 text-xs text-slate-700 focus:outline-none focus:border-[#009bb8]"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setRefRangeItem(null)}
                    className="px-4 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 font-semibold text-slate-600 cursor-pointer"
                  >
                    Tutup
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-[#009bb8] hover:bg-[#00859e] text-white font-semibold cursor-pointer"
                  >
                    Tambah Rujukan
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          4. MODAL TAMBAH ITEM PEMERIKSAAN
         ===================================================================== */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-[1px] flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#008ba6]">
                  MASTER DATA LABORATORIUM
                </p>
                <h3 className="text-base font-extrabold text-[#0f3d56]">
                  Tambah Item Pemeriksaan
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={handleCreateItemSubmit}
              className="p-5 space-y-3.5 text-xs"
            >
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Kode Internal <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newKode}
                    onChange={(e) => setNewKode(e.target.value)}
                    placeholder="KIM-CRP"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono uppercase text-slate-700 focus:outline-none focus:border-[#009bb8]"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">
                    Nama Pemeriksaan <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newNama}
                    onChange={(e) => setNewNama(e.target.value)}
                    placeholder="Contoh: C-Reactive Protein (CRP) Kuantitatif"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-[#009bb8]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Kategori
                  </label>
                  <select
                    value={newKategori}
                    onChange={(e) => setNewKategori(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#009bb8]"
                  >
                    <option value="Hematologi">Hematologi</option>
                    <option value="Kimia Klinik">Kimia Klinik</option>
                    <option value="Imunologi dan Serologi">
                      Imunologi dan Serologi
                    </option>
                    <option value="Urinalisis">Urinalisis</option>
                    <option value="Feses">Feses</option>
                    <option value="Mikrobiologi">Mikrobiologi</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Spesimen
                  </label>
                  <select
                    value={newSpesimen}
                    onChange={(e) => setNewSpesimen(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#009bb8]"
                  >
                    <option value="Darah EDTA">Darah EDTA</option>
                    <option value="Serum">Serum</option>
                    <option value="Darah untuk LED">Darah untuk LED</option>
                    <option value="Urin Sewaktu">Urin Sewaktu</option>
                    <option value="Feses">Feses</option>
                    <option value="Sputum">Sputum</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Jenis Hasil
                  </label>
                  <select
                    value={newJenisHasil}
                    onChange={(e) =>
                      setNewJenisHasil(e.target.value as LabResultTypeKey)
                    }
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#009bb8]"
                  >
                    <option value="Numerik · Kuantitatif">
                      Numerik · Kuantitatif
                    </option>
                    <option value="Teks · Deskriptif">Teks · Deskriptif</option>
                    <option value="Kualitatif · Reaktif/Non-reaktif">
                      Kualitatif · Reaktif/Non-reaktif
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Metode
                  </label>
                  <input
                    type="text"
                    value={newMetode}
                    onChange={(e) => setNewMetode(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-[#009bb8]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Waktu (Menit)
                  </label>
                  <input
                    type="number"
                    min={5}
                    value={newWaktuMenit}
                    onChange={(e) =>
                      setNewWaktuMenit(Math.max(5, Number(e.target.value) || 60))
                    }
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 tabular-nums focus:outline-none focus:border-[#009bb8]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Deskripsi Pemeriksaan
                </label>
                <textarea
                  rows={2}
                  value={newDeskripsi}
                  onChange={(e) => setNewDeskripsi(e.target.value)}
                  placeholder="Deskripsi singkat parameter pemeriksaan..."
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-[#009bb8]"
                />
              </div>

              <label className="inline-flex items-center gap-2 text-xs font-semibold text-[#0f3d56] cursor-pointer">
                <input
                  type="checkbox"
                  checked={newTampilDokter}
                  onChange={(e) => setNewTampilDokter(e.target.checked)}
                  className="rounded border-slate-300 text-[#009bb8] focus:ring-[#009bb8]"
                />
                <span>Tampilkan pada formulir Permintaan Dokter</span>
              </label>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 font-semibold text-slate-600 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#009bb8] hover:bg-[#00859e] text-white font-semibold cursor-pointer"
                >
                  Simpan Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          5. MODAL UBAH ITEM PEMERIKSAAN
         ===================================================================== */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-[1px] flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-mono font-bold text-[#008ba6]">
                  {editingItem.kodeInternal}
                </p>
                <h3 className="text-base font-extrabold text-[#0f3d56]">
                  Ubah Item Pemeriksaan
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setItems((prev) =>
                  prev.map((item) =>
                    item.id === editingItem.id ? editingItem : item,
                  ),
                );
                onSaveItem?.(editingItem);
                setEditingItem(null);
              }}
              className="p-5 space-y-3.5 text-xs"
            >
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Nama Pemeriksaan
                </label>
                <input
                  type="text"
                  required
                  value={editingItem.namaPemeriksaan}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      namaPemeriksaan: e.target.value,
                    })
                  }
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-[#009bb8]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Kategori
                  </label>
                  <input
                    type="text"
                    required
                    value={editingItem.kategori}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        kategori: e.target.value,
                      })
                    }
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-[#009bb8]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Spesimen
                  </label>
                  <input
                    type="text"
                    required
                    value={editingItem.spesimen}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        spesimen: e.target.value,
                      })
                    }
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-[#009bb8]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Jenis Hasil
                  </label>
                  <select
                    value={editingItem.jenisHasil}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        jenisHasil: e.target.value as LabResultTypeKey,
                      })
                    }
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#009bb8]"
                  >
                    <option value="Teks · Deskriptif">Teks · Deskriptif</option>
                    <option value="Numerik · Kuantitatif">
                      Numerik · Kuantitatif
                    </option>
                    <option value="Kualitatif · Reaktif/Non-reaktif">
                      Kualitatif · Reaktif/Non-reaktif
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Metode
                  </label>
                  <input
                    type="text"
                    value={editingItem.metode}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        metode: e.target.value,
                      })
                    }
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-[#009bb8]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Waktu (Menit)
                  </label>
                  <input
                    type="number"
                    min={5}
                    value={editingItem.waktuPenyelesaianMenit}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        waktuPenyelesaianMenit: Math.max(
                          5,
                          Number(e.target.value) || 60,
                        ),
                      })
                    }
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 tabular-nums focus:outline-none focus:border-[#009bb8]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Deskripsi
                </label>
                <textarea
                  rows={2}
                  value={editingItem.deskripsi}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      deskripsi: e.target.value,
                    })
                  }
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-[#009bb8]"
                />
              </div>

              <label className="inline-flex items-center gap-2 text-xs font-semibold text-[#0f3d56] cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingItem.tampilDiPermintaanDokter}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      tampilDiPermintaanDokter: e.target.checked,
                    })
                  }
                  className="rounded border-slate-300 text-[#009bb8] focus:ring-[#009bb8]"
                />
                <span>Ditampilkan pada formulir Permintaan Dokter</span>
              </label>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 font-semibold text-slate-600 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#009bb8] hover:bg-[#00859e] text-white font-semibold cursor-pointer"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}