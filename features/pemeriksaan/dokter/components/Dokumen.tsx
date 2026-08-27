'use client';

import React, { useState } from 'react';
import {
  FileText,
  Search,
  Filter,
  Plus,
  Eye,
  Download,
  MoreVertical,
  Printer,
  ShieldCheck,
  Info,
  ExternalLink,
  FlaskConical,
  ImageIcon,
} from 'lucide-react';

// ---------- Types & Interfaces ----------
type DocumentSource = 'Dokter' | 'Perawat' | 'Laboratorium' | 'Radiologi' | 'Lainnya';
type TabFilter = 'Semua Dokumen' | 'Dibuat oleh Saya' | 'Dibuat oleh Perawat' | 'Dibuat oleh Farmasi' | 'Dibuat oleh Lainnya';

interface DocumentItem {
  id: string;
  name: string;
  jenis: string; // Ringkasan Medis, Formulir Klinis, Catatan Perkembangan, Hasil Penunjang, Resep, Edukasi, Persetujuan
  createdBy: string;
  createdAt: string;
  createdTime: string;
  source: DocumentSource;
  iconType?: 'pdf' | 'lab' | 'image';
}

interface DocumentHistoryItem {
  id: string;
  date: string;
  time: string;
  role: string;
  action: string;
}

// ---------- Mock Data Berdasarkan UI Taramedic ----------
const initialDocuments: DocumentItem[] = [
  {
    id: '1',
    name: 'Ringkasan Kunjungan (Encounter Summary)',
    jenis: 'Ringkasan Medis',
    createdBy: 'dr. Bima, Sp.A',
    createdAt: '16/08/2026',
    createdTime: '08:55 WIB',
    source: 'Dokter',
    iconType: 'pdf',
  },
  {
    id: '2',
    name: 'Lembar Anamnesis',
    jenis: 'Formulir Klinis',
    createdBy: 'Siti Rahma, A.Md.Kep',
    createdAt: '16/08/2026',
    createdTime: '08:20 WIB',
    source: 'Perawat',
    iconType: 'pdf',
  },
  {
    id: '3',
    name: 'Hasil Pemeriksaan Fisik',
    jenis: 'Formulir Klinis',
    createdBy: 'dr. Bima, Sp.A',
    createdAt: '16/08/2026',
    createdTime: '08:45 WIB',
    source: 'Dokter',
    iconType: 'pdf',
  },
  {
    id: '4',
    name: 'CPPT (Catatan Perkembangan Pasien Terintegrasi)',
    jenis: 'Catatan Perkembangan',
    createdBy: 'dr. Bima, Sp.A',
    createdAt: '16/08/2026',
    createdTime: '09:10 WIB',
    source: 'Dokter',
    iconType: 'pdf',
  },
  {
    id: '5',
    name: 'Hasil Laboratorium (Darah Lengkap)',
    jenis: 'Hasil Penunjang',
    createdBy: 'Laboratorium Klinik',
    createdAt: '16/08/2026',
    createdTime: '08:30 WIB',
    source: 'Laboratorium',
    iconType: 'lab',
  },
  {
    id: '6',
    name: 'Hasil Radiologi (Thorax AP/PA)',
    jenis: 'Hasil Penunjang',
    createdBy: 'Radiologi',
    createdAt: '16/08/2026',
    createdTime: '09:00 WIB',
    source: 'Radiologi',
    iconType: 'image',
  },
  {
    id: '7',
    name: 'Resep Elektronik',
    jenis: 'Resep',
    createdBy: 'dr. Bima, Sp.A',
    createdAt: '16/08/2026',
    createdTime: '09:15 WIB',
    source: 'Dokter',
    iconType: 'pdf',
  },
  {
    id: '8',
    name: 'Lembar Edukasi Pasien',
    jenis: 'Edukasi',
    createdBy: 'dr. Bima, Sp.A',
    createdAt: '16/08/2026',
    createdTime: '09:20 WIB',
    source: 'Dokter',
    iconType: 'pdf',
  },
  {
    id: '9',
    name: 'Foto Dokumen Tanda Tangan Persetujuan Tindakan',
    jenis: 'Persetujuan',
    createdBy: 'Siti Rahma, A.Md.Kep',
    createdAt: '16/08/2026',
    createdTime: '09:25 WIB',
    source: 'Perawat',
    iconType: 'image',
  },
];

const documentHistory: DocumentHistoryItem[] = [
  { id: '1', date: '16/08/2026', time: '09:25', role: 'Perawat', action: 'Unggah dokumen Persetujuan Tindakan' },
  { id: '2', date: '16/08/2026', time: '09:20', role: 'Dokter', action: 'Buat Lembar Edukasi' },
  { id: '3', date: '16/08/2026', time: '09:15', role: 'Dokter', action: 'Buat Resep Elektronik' },
];

export default function DocumentTabContent() {
  const [documents] = useState<DocumentItem[]>(initialDocuments);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<TabFilter>('Semua Dokumen');
  const [internalNoteDraft, setInternalNoteDraft] = useState('');

  // Helper badge warna sumber dokumen
  const getSourceBadgeStyle = (source: DocumentSource) => {
    switch (source) {
      case 'Dokter':
        return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'Perawat':
        return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'Laboratorium':
        return 'bg-purple-50 text-purple-600 border-purple-100';
      case 'Radiologi':
        return 'bg-amber-50 text-amber-600 border-amber-100';
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  // Helper ikon dokumen
  const renderDocIcon = (type?: string) => {
    if (type === 'lab') return <FlaskConical size={15} className="text-purple-600 shrink-0" />;
    if (type === 'image') return <ImageIcon size={15} className="text-amber-600 shrink-0" />;
    return <FileText size={15} className="text-red-500 shrink-0" />;
  };

  // Filter Dokumen
  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          doc.jenis.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;

    if (activeTab === 'Dibuat oleh Saya') return doc.source === 'Dokter';
    if (activeTab === 'Dibuat oleh Perawat') return doc.source === 'Perawat';
    if (activeTab === 'Dibuat oleh Lainnya') return doc.source === 'Laboratorium' || doc.source === 'Radiologi';
    
    return true;
  });

  return (
    <div className="w-full bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      
      {/* Header Utama Tab */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
        <div>
          <h2 className="text-[13px] font-bold text-slate-800 uppercase tracking-wide">
            DOKUMEN
          </h2>
          <p className="text-[11px] text-gray-400 mt-0.5">
            Kelola dan lihat seluruh dokumen klinis pasien sesuai regulasi Kemenkes dan integrasi SATUSEHAT.
          </p>
        </div>

        {/* Action Header (Search, Filter, Unggah) */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Search Box */}
          <div className="relative w-48 sm:w-56">
            <input
              type="text"
              placeholder="Cari dokumen..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-3 pr-8 py-1.5 text-xs bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <Search className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>

          <button
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            <Filter className="w-3.5 h-3.5 text-gray-400" />
            <span>Filter</span>
          </button>

          <button
            type="button"
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Unggah Dokumen</span>
          </button>
        </div>
      </div>

      {/* Sub-Tabs Navigasi Creator */}
      <div className="flex items-center gap-6 border-b border-gray-200 mt-4 overflow-x-auto text-xs">
        {(['Semua Dokumen', 'Dibuat oleh Saya', 'Dibuat oleh Perawat', 'Dibuat oleh Farmasi', 'Dibuat oleh Lainnya'] as TabFilter[]).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`pb-2.5 px-0.5 font-bold transition-colors whitespace-nowrap cursor-pointer border-b-2 ${
              activeTab === tab
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tabel Dokumen Klinis */}
      <div className="mt-4">
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-gray-200 text-[11px] text-gray-500 font-semibold">
                <th className="p-3">Nama Dokumen</th>
                <th className="p-3 w-40">Jenis Dokumen</th>
                <th className="p-3 w-44">Dibuat Oleh</th>
                <th className="p-3 w-36">Tanggal Dibuat</th>
                <th className="p-3 w-28">Sumber</th>
                <th className="p-3 w-28 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-[12px] divide-y divide-gray-100">
              {filteredDocuments.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50/50 transition-colors">
                  {/* Nama Dokumen */}
                  <td className="p-3 font-semibold text-gray-800">
                    <div className="flex items-center gap-2.5">
                      {renderDocIcon(doc.iconType)}
                      <span className="truncate max-w-[260px]" title={doc.name}>
                        {doc.name}
                      </span>
                    </div>
                  </td>

                  {/* Jenis Dokumen */}
                  <td className="p-3 text-gray-600 font-medium">
                    <span className="bg-slate-100 text-slate-700 text-[10px] px-2 py-0.5 rounded border border-slate-200 font-medium">
                      {doc.jenis}
                    </span>
                  </td>

                  {/* Dibuat Oleh */}
                  <td className="p-3 text-gray-700 font-medium">{doc.createdBy}</td>

                  {/* Tanggal & Waktu Dibuat */}
                  <td className="p-3 text-gray-600">
                    <p className="font-medium text-[11px]">{doc.createdAt}</p>
                    <p className="text-[10px] text-gray-400">{doc.createdTime}</p>
                  </td>

                  {/* Sumber Badge */}
                  <td className="p-3">
                    <span className={`text-[10px] px-2.5 py-0.5 rounded font-semibold border ${getSourceBadgeStyle(doc.source)}`}>
                      {doc.source}
                    </span>
                  </td>

                  {/* Aksi Button */}
                  <td className="p-3 text-center">
                    <div className="flex items-center justify-center gap-1.5 text-gray-400">
                      <button type="button" className="p-1 hover:text-blue-600 transition-colors cursor-pointer" title="Lihat Dokumen">
                        <Eye size={14} />
                      </button>
                      <button type="button" className="p-1 hover:text-blue-600 transition-colors cursor-pointer" title="Unduh Dokumen">
                        <Download size={14} />
                      </button>
                      <button type="button" className="p-1 hover:text-gray-600 transition-colors cursor-pointer">
                        <MoreVertical size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredDocuments.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-400 text-xs">
                    Tidak ada dokumen yang cocok dengan pencarian atau tab filter ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info & Pagination UI */}
        <div className="flex items-center justify-between mt-3 text-[11px] text-gray-400 font-medium">
          <span>Menampilkan 1 - {filteredDocuments.length} dari {filteredDocuments.length} dokumen</span>
          
          <div className="flex items-center gap-1 text-gray-600">
            <button type="button" disabled className="px-2 py-1 border border-gray-200 rounded text-gray-300 disabled:opacity-50">&laquo;</button>
            <button type="button" disabled className="px-2 py-1 border border-gray-200 rounded text-gray-300 disabled:opacity-50">&lt;</button>
            <span className="px-2.5 py-1 bg-blue-600 text-white rounded font-bold text-xs">1</span>
            <button type="button" disabled className="px-2 py-1 border border-gray-200 rounded text-gray-300 disabled:opacity-50">&gt;</button>
            <button type="button" disabled className="px-2 py-1 border border-gray-200 rounded text-gray-300 disabled:opacity-50">&raquo;</button>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Cetak Daftar & Compliance Footnote */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-4 mt-6 border-t border-gray-100">
        <button
          type="button"
          className="flex items-center gap-1.5 px-3.5 py-2 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
        >
          <Printer size={14} className="text-gray-500" />
          <span>Cetak Daftar Dokumen</span>
        </button>

        <div className="flex items-center gap-2 text-[11px] text-gray-400 font-medium">
          <ShieldCheck size={14} className="text-gray-400 shrink-0" />
          <span>
            Dokumen klinis tersimpan aman dan dapat diakses sesuai hak akses pengguna. Sesuai Permenkes No. 24 Tahun 2022 tentang Rekam Medis dan Permenkes No. 14 Tahun 2022 tentang SATUSEHAT.
          </span>
        </div>
      </div>

    </div>
  );
}

// ---------- Sub-Komponen Sidebar Kolom Kanan (Untuk di-import di Layout Utama EMR) ----------
export function SidebarDokumenKanan() {
  const [internalNoteDraft, setInternalNoteDraft] = useState('');

  return (
    <div className="space-y-4 w-full">
      {/* 1. Card Informasi Kunjungan */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 space-y-3">
        <div className="flex items-center gap-2 pb-2 border-b border-gray-100 text-blue-600 font-bold text-xs uppercase tracking-wider">
          <FileText className="w-4 h-4" />
          <span>INFORMASI KUNJUNGAN</span>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">No. Antrean</span>
            <span className="font-semibold text-gray-800">A013</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Waktu Daftar</span>
            <span className="font-semibold text-gray-800">08:05 WIB</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Poli</span>
            <span className="font-semibold text-gray-800">Poli Anak</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Dokter</span>
            <span className="font-semibold text-gray-800">dr. Bima, Sp.A</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Lokasi</span>
            <span className="font-semibold text-gray-800">Loket 1</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Penjamin</span>
            <span className="font-semibold text-gray-800">BPJS Kesehatan</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Status Terakhir</span>
            <span className="px-2 py-0.5 bg-blue-50 text-blue-600 font-semibold text-[10px] rounded border border-blue-100">
              Pemeriksaan Dokter
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Catatan Pendaftaran</span>
            <span className="font-semibold text-gray-800">Pasien datang sendiri</span>
          </div>
        </div>
      </div>

      {/* 2. Card Catatan Dokter (Internal) */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 space-y-3">
        <div className="flex items-center gap-2 pb-2 border-b border-gray-100 text-blue-600 font-bold text-xs uppercase tracking-wider">
          <FileText className="w-4 h-4" />
          <span>CATATAN DOKTER (Internal)</span>
        </div>

        <div className="space-y-1.5">
          <textarea
            value={internalNoteDraft}
            onChange={(e) => setInternalNoteDraft(e.target.value)}
            maxLength={500}
            placeholder="Tulis catatan resep (tidak tampil di farmasi)..."
            className="w-full h-20 p-2 text-xs bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
          />
          <div className="text-right text-[10px] text-gray-400">
            {internalNoteDraft.length}/500
          </div>
        </div>

        <button
          type="button"
          disabled={!internalNoteDraft.trim()}
          className="w-full flex items-center justify-center gap-1 py-1.5 px-3 border border-blue-200 text-blue-600 font-semibold text-xs rounded-lg hover:bg-blue-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Tambah Catatan</span>
        </button>
      </div>

      {/* 3. Card Riwayat Dokumen */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 space-y-3">
        <div className="flex items-center gap-2 pb-2 border-b border-gray-100 text-blue-600 font-bold text-xs uppercase tracking-wider">
          <FileText className="w-4 h-4" />
          <span>RIWAYAT DOKUMEN</span>
        </div>

        <div className="space-y-2.5 text-xs">
          {documentHistory.map((item) => (
            <div key={item.id} className="flex items-start justify-between text-[11px] border-b border-gray-50 pb-1.5 last:border-none">
              <span className="text-gray-400 font-medium shrink-0">{item.date} {item.time}</span>
              <span className="text-gray-600 font-medium text-right shrink-0 mx-2">{item.role}</span>
              <span className="text-gray-800 font-semibold text-right truncate">{item.action}</span>
            </div>
          ))}
        </div>

        <button type="button" className="w-full flex items-center justify-center gap-1 pt-1 text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer">
          <span>Lihat Semua Riwayat</span>
          <ExternalLink size={12} />
        </button>
      </div>
    </div>
  );
}