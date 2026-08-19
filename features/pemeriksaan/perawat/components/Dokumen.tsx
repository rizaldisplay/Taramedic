'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  UploadCloud,
  FilePlus,
  Search,
  Filter,
  Download,
  Eye,
  Trash2,
  ChevronLeft,
  ChevronRight,
  FileText,
  User,
  Clock,
  Calendar,
  MapPin,
  ShieldCheck,
  Info,
  Plus,
  Save,
  Send,
  FileImage,
} from 'lucide-react';

// ---------- Types ----------
type DocumentCategory = 'Hasil Lab' | 'Foto Klinis' | 'Skrining' | 'Administrasi' | 'Rujukan';

interface DocumentItem {
  id: string;
  name: string;
  type: 'pdf' | 'image';
  category: DocumentCategory;
  uploadedBy: string;
  uploadedAt: string;
  size: string;
  url?: string; // URL dokumen di server (untuk dokumen yang sudah tersimpan/lama)
  file?: File; // File asli (untuk dokumen yang baru diunggah pada sesi ini)
  objectUrl?: string; // Blob URL sementara dari `file`, untuk pratinjau/unduh sebelum tersimpan di server
}

interface InternalNote {
  id: string;
  text: string;
  at: string;
}

interface DocumentTabContentProps {
  // Aksi-aksi ini sengaja dibuat sebagai callback opsional: komponen ini hanya
  // bertanggung jawab atas state daftar dokumen & catatan di sisi klien,
  // sedangkan pembuatan dokumen baru / penyimpanan / pengiriman ke server
  // adalah tanggung jawab komponen induk (butuh koneksi API).
  onCreateDocument?: () => void;
  onSaveDraft?: (documents: DocumentItem[], notes: InternalNote[]) => void;
  onSubmitToDoctor?: (documents: DocumentItem[], notes: InternalNote[]) => void;
}

// ---------- Konstanta & helper ----------
const CATEGORY_STYLES: Record<DocumentCategory, string> = {
  'Hasil Lab': 'bg-blue-100 text-blue-600',
  'Foto Klinis': 'bg-emerald-100 text-emerald-600',
  Skrining: 'bg-purple-100 text-purple-600',
  Administrasi: 'bg-amber-100 text-amber-600',
  Rujukan: 'bg-sky-100 text-sky-600',
};
const ALL_CATEGORIES = Object.keys(CATEGORY_STYLES) as DocumentCategory[];

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB, sesuai keterangan di dropzone
const ACCEPTED_MIME_TYPES = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
const ACCEPTED_EXTENSIONS = ['.pdf', '.jpg', '.jpeg', '.png'];
const PAGE_SIZE = 5;

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDateID(date: Date): string {
  const datePart = date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  const timePart = date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  return `${datePart} - ${timePart} WIB`;
}

function makeId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function getDocLink(doc: DocumentItem): string | undefined {
  return doc.url ?? doc.objectUrl;
}

// Data Mockup — dokumen "lama" yang datang dari server (tidak punya file/objectUrl,
// jadi tombol Lihat/Download-nya hanya bisa bekerja kalau field `url` sungguhan diisi
// oleh backend; di sini sengaja dikosongkan untuk mensimulasikan data contoh).
const initialDocuments: DocumentItem[] = [
  {
    id: '1',
    name: 'Hasil_Lab_Darah_Rizka_12052024.pdf',
    type: 'pdf',
    category: 'Hasil Lab',
    uploadedBy: 'Admin Perawat',
    uploadedAt: '12 Mei 2024 - 08:30 WIB',
    size: '245 KB',
  },
  {
    id: '2',
    name: 'Foto_Luka_Abdomen_12052024.jpg',
    type: 'image',
    category: 'Foto Klinis',
    uploadedBy: 'Admin Perawat',
    uploadedAt: '12 Mei 2024 - 08:31 WIB',
    size: '1.2 MB',
  },
  {
    id: '3',
    name: 'Hasil_Skrining_Gizi_12052024.pdf',
    type: 'pdf',
    category: 'Skrining',
    uploadedBy: 'Admin Perawat',
    uploadedAt: '12 Mei 2024 - 08:32 WIB',
    size: '180 KB',
  },
  {
    id: '4',
    name: 'Form_Inform_Consent_12052024.pdf',
    type: 'pdf',
    category: 'Administrasi',
    uploadedBy: 'Admin Perawat',
    uploadedAt: '12 Mei 2024 - 08:33 WIB',
    size: '320 KB',
  },
  {
    id: '5',
    name: 'Surat_Rujukan_12052024.pdf',
    type: 'pdf',
    category: 'Rujukan',
    uploadedBy: 'Admin Perawat',
    uploadedAt: '12 Mei 2024 - 08:34 WIB',
    size: '210 KB',
  },
];

export default function DocumentTabContent({
  onCreateDocument,
  onSaveDraft,
  onSubmitToDoctor,
}: DocumentTabContentProps) {
  const [documents, setDocuments] = useState<DocumentItem[]>(initialDocuments);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'Semua Kategori' | DocumentCategory>('Semua Kategori');
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const [internalNotes, setInternalNotes] = useState<InternalNote[]>([]);
  const [internalNoteDraft, setInternalNoteDraft] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const createdUrlsRef = useRef<string[]>([]);

  // Bersihkan semua blob URL yang pernah dibuat saat komponen unmount,
  // supaya tidak membocorkan memori.
  useEffect(() => {
    return () => {
      createdUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Semua Kategori' || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.max(1, Math.ceil(filteredDocuments.length / PAGE_SIZE));

  // Jaga-jaga: kalau dokumen di halaman terakhir dihapus sehingga totalPages
  // berkurang, currentPage otomatis disesuaikan supaya tidak "nyasar" ke halaman kosong.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentPage((p) => Math.min(p, totalPages));
  }, [totalPages]);

  const paginatedDocuments = filteredDocuments.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );
  const rangeStart = filteredDocuments.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(currentPage * PAGE_SIZE, filteredDocuments.length);

  // ---------- Upload ----------
  const handleFilesAdded = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;

    const accepted: DocumentItem[] = [];
    const rejected: string[] = [];

    Array.from(fileList).forEach((file) => {
      const isAcceptedType =
        ACCEPTED_MIME_TYPES.includes(file.type) ||
        ACCEPTED_EXTENSIONS.some((ext) => file.name.toLowerCase().endsWith(ext));

      if (!isAcceptedType) {
        rejected.push(`${file.name} (format tidak didukung)`);
        return;
      }
      if (file.size > MAX_FILE_SIZE_BYTES) {
        rejected.push(`${file.name} (ukuran melebihi 10 MB)`);
        return;
      }

      const isImage = file.type.startsWith('image/') || /\.(jpe?g|png)$/i.test(file.name);
      const objectUrl = URL.createObjectURL(file);
      createdUrlsRef.current.push(objectUrl);

      accepted.push({
        id: makeId(),
        name: file.name,
        type: isImage ? 'image' : 'pdf',
        // Kategori default ditebak dari jenis file; idealnya user bisa
        // mengubahnya nanti, tapi pemilihan kategori manual di luar cakupan ini.
        category: isImage ? 'Foto Klinis' : 'Administrasi',
        uploadedBy: 'Anda',
        uploadedAt: formatDateID(new Date()),
        size: formatFileSize(file.size),
        file,
        objectUrl,
      });
    });

    if (accepted.length > 0) {
      setDocuments((prev) => [...accepted, ...prev]);
      setCurrentPage(1);
    }
    setNotice(rejected.length > 0 ? `Gagal mengunggah: ${rejected.join(', ')}` : null);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFilesAdded(e.target.files);
    e.target.value = ''; // supaya file yang sama bisa dipilih ulang kalau perlu
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFilesAdded(e.dataTransfer.files);
  };

  // ---------- Aksi per dokumen ----------
  const handleDeleteDocument = (id: string) => {
    setDocuments((prev) => {
      const target = prev.find((d) => d.id === id);
      if (target?.objectUrl) {
        URL.revokeObjectURL(target.objectUrl);
        createdUrlsRef.current = createdUrlsRef.current.filter((u) => u !== target.objectUrl);
      }
      return prev.filter((d) => d.id !== id);
    });
  };

  const handleViewDocument = (doc: DocumentItem) => {
    const link = getDocLink(doc);
    if (link) {
      window.open(link, '_blank', 'noopener,noreferrer');
    } else {
      setNotice(`Pratinjau untuk "${doc.name}" tidak tersedia (dokumen contoh, belum terhubung ke server).`);
    }
  };

  const handleDownloadDocument = (doc: DocumentItem) => {
    const link = getDocLink(doc);
    if (link) {
      const anchor = document.createElement('a');
      anchor.href = link;
      anchor.download = doc.name;
      anchor.click();
    } else {
      setNotice(`Unduhan untuk "${doc.name}" tidak tersedia (dokumen contoh, belum terhubung ke server).`);
    }
  };

  // ---------- Catatan internal ----------
  const handleAddInternalNote = () => {
    const text = internalNoteDraft.trim();
    if (!text) return;
    setInternalNotes((prev) => [{ id: makeId(), text, at: formatDateID(new Date()) }, ...prev]);
    setInternalNoteDraft('');
  };

  const handleRemoveInternalNote = (id: string) => {
    setInternalNotes((prev) => prev.filter((n) => n.id !== id));
  };

  const canSubmit = documents.length > 0;

  return (
    <div className="w-full bg-slate-50/50 p-6 space-y-6 text-slate-800">
      {/* Grid Container (Kiri: Area Dokumen, Kanan: Sidebar Info Kunjungan) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* KOLOM KIRI: Upload & Table Dokumen */}
        <div className="lg:col-span-3 space-y-6">

          {/* Section: Dokumen Kunjungan & Upload Dropzone */}
          <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="font-bold text-slate-900 text-base">Dokumen Kunjungan</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Kelola dan unggah dokumen terkait pemeriksaan pasien pada kunjungan ini.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onCreateDocument?.()}
                className="flex items-center justify-center gap-1.5 px-3.5 py-2 bg-white text-blue-600 hover:bg-blue-50/50 font-semibold text-xs rounded-lg border border-blue-200 transition-colors"
              >
                <FilePlus className="w-4 h-4" />
                Buat Dokumen Baru
              </button>
            </div>

            {/* Dropzone Area */}
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center transition-colors cursor-pointer group ${
                isDragging ? 'border-blue-500 bg-blue-50/60' : 'border-slate-200 hover:border-blue-400/60 bg-slate-50/30'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                onChange={handleFileInputChange}
                className="hidden"
              />
              <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <UploadCloud className="w-6 h-6" />
              </div>
              <p className="text-xs font-bold text-slate-800">Seret & lepas file di sini</p>
              <p className="text-[11px] text-slate-400 my-2">atau</p>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation(); // hindari trigger ganda karena parent div juga punya onClick
                  fileInputRef.current?.click();
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg shadow-xs transition-colors mb-3"
              >
                Pilih File untuk Diunggah
              </button>
              <p className="text-[10px] text-slate-400">
                Format yang didukung: PDF, JPG, JPEG, PNG (Maks. 10 MB per file)
              </p>
            </div>

            {notice && (
              <p className="text-[11px] text-red-500">{notice}</p>
            )}
          </div>

          {/* Section: Daftar Dokumen */}
          <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs space-y-4">
            {/* Table Controls (Title, Search, Filter) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h3 className="font-bold text-slate-900 text-sm">
                Daftar Dokumen ({filteredDocuments.length})
              </h3>

              <div className="flex items-center gap-2">
                {/* Search Input */}
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Cari dokumen..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                {/* Filter Button + Dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowFilterMenu((v) => !v)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-medium rounded-lg transition-colors"
                  >
                    <Filter className="w-3.5 h-3.5 text-slate-500" />
                    {selectedCategory === 'Semua Kategori' ? 'Filter' : selectedCategory}
                  </button>

                  {showFilterMenu && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setShowFilterMenu(false)} />
                      <div className="absolute right-0 mt-1.5 w-44 bg-white border border-slate-200 rounded-lg shadow-lg z-50 py-1 text-xs">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedCategory('Semua Kategori');
                            setShowFilterMenu(false);
                            setCurrentPage(1);
                          }}
                          className={`w-full text-left px-3 py-1.5 hover:bg-slate-50 ${
                            selectedCategory === 'Semua Kategori' ? 'text-blue-600 font-semibold' : 'text-slate-600'
                          }`}
                        >
                          Semua Kategori
                        </button>
                        {ALL_CATEGORIES.map((cat) => (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => {
                              setSelectedCategory(cat);
                              setShowFilterMenu(false);
                              setCurrentPage(1);
                            }}
                            className={`w-full text-left px-3 py-1.5 hover:bg-slate-50 ${
                              selectedCategory === cat ? 'text-blue-600 font-semibold' : 'text-slate-600'
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Table List */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-medium">
                    <th className="pb-3 font-medium">Nama Dokumen</th>
                    <th className="pb-3 font-medium">Kategori</th>
                    <th className="pb-3 font-medium">Diunggah Oleh</th>
                    <th className="pb-3 font-medium">Tanggal Unggah</th>
                    <th className="pb-3 font-medium">Ukuran</th>
                    <th className="pb-3 font-medium text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedDocuments.map((doc) => (
                    <tr key={doc.id} className="hover:bg-slate-50/60 transition-colors">
                      {/* Nama Dokumen */}
                      <td className="py-3.5 pr-3 font-medium text-slate-800">
                        <div className="flex items-center gap-2.5">
                          {doc.type === 'pdf' ? (
                            <FileText className="w-4 h-4 text-red-500 shrink-0" />
                          ) : (
                            <FileImage className="w-4 h-4 text-emerald-500 shrink-0" />
                          )}
                          <span className="truncate max-w-[200px]" title={doc.name}>
                            {doc.name}
                          </span>
                        </div>
                      </td>

                      {/* Kategori Badge */}
                      <td className="py-3.5 px-2">
                        <span className={`inline-block px-2.5 py-0.5 font-semibold text-[11px] rounded-md ${CATEGORY_STYLES[doc.category]}`}>
                          {doc.category}
                        </span>
                      </td>

                      {/* Diunggah Oleh */}
                      <td className="py-3.5 px-2 text-slate-600">{doc.uploadedBy}</td>

                      {/* Tanggal Unggah */}
                      <td className="py-3.5 px-2 text-slate-600">{doc.uploadedAt}</td>

                      {/* Ukuran File */}
                      <td className="py-3.5 px-2 text-slate-600">{doc.size}</td>

                      {/* Action Buttons */}
                      <td className="py-3.5 pl-2 text-center">
                        <div className="flex items-center justify-center gap-2 text-slate-500">
                          <button
                            type="button"
                            onClick={() => handleDownloadDocument(doc)}
                            className="p-1 hover:text-blue-600 transition-colors"
                            title="Download"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleViewDocument(doc)}
                            className="p-1 hover:text-blue-600 transition-colors"
                            title="Lihat"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteDocument(doc.id)}
                            className="p-1 hover:text-red-600 transition-colors"
                            title="Hapus"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-red-400 hover:text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {paginatedDocuments.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400 text-xs">
                        {documents.length === 0
                          ? 'Belum ada dokumen. Unggah dokumen pertama pada bagian di atas.'
                          : 'Tidak ada dokumen yang cocok dengan pencarian/filter.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs text-slate-500">
              <div>
                Menampilkan {rangeStart} - {rangeEnd} dari {filteredDocuments.length} dokumen
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className={`p-1.5 border rounded-lg transition-colors ${
                    currentPage <= 1
                      ? 'border-slate-200 text-slate-300 cursor-not-allowed'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <span className="w-7 h-7 bg-blue-600 text-white font-semibold rounded-lg flex items-center justify-center">
                  {currentPage}
                </span>
                <button
                  type="button"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className={`p-1.5 border rounded-lg transition-colors ${
                    currentPage >= totalPages
                      ? 'border-slate-200 text-slate-300 cursor-not-allowed'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* KOLOM KANAN: Informasi Kunjungan & Catatan Internal */}
        <div className="space-y-4">

          {/* Card Informasi Kunjungan */}
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-4 space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-blue-600 font-bold text-xs uppercase tracking-wider">
              <FileText className="w-4 h-4" />
              Informasi Kunjungan
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" /> No. Antrean
                </span>
                <span className="font-semibold text-slate-800">A013</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> Waktu Daftar
                </span>
                <span className="font-semibold text-slate-800">08:05 WIB</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" /> Poli
                </span>
                <span className="font-semibold text-slate-800">Poli Anak</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" /> Dokter
                </span>
                <span className="font-semibold text-slate-800">dr. Bima, Sp.A</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" /> Lokasi
                </span>
                <span className="font-semibold text-slate-800">Loket 1</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" /> Penjamin
                </span>
                <span className="font-semibold text-slate-800">BPJS Kesehatan</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5" /> Status Terakhir
                </span>
                <span className="px-2 py-0.5 bg-blue-50 text-blue-600 font-medium text-[11px] rounded-md">
                  Pemeriksaan Perawat
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" /> Catatan Pendaftaran
                </span>
                <span className="font-semibold text-slate-800">Pasien datang sendiri</span>
              </div>
            </div>
          </div>

          {/* Card Catatan Internal */}
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-4 space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-blue-600 font-bold text-xs uppercase tracking-wider">
              <FileText className="w-4 h-4" />
              Catatan Internal
            </div>

            {internalNotes.length > 0 && (
              <ul className="space-y-2 max-h-32 overflow-y-auto pr-1">
                {internalNotes.map((n) => (
                  <li key={n.id} className="flex items-start justify-between gap-2 bg-slate-50 rounded-lg p-2 text-[11px]">
                    <div>
                      <p className="text-slate-700 whitespace-pre-wrap break-words">{n.text}</p>
                      <p className="text-slate-400 mt-0.5">{n.at}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveInternalNote(n.id)}
                      className="text-slate-300 hover:text-red-500 transition-colors shrink-0"
                      title="Hapus catatan"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <div className="space-y-2">
              <textarea
                value={internalNoteDraft}
                onChange={(e) => setInternalNoteDraft(e.target.value)}
                maxLength={500}
                placeholder="Tulis catatan internal (tidak tampil di resume medis)"
                className="w-full h-24 p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
              />
              <div className="text-right text-[10px] text-slate-400">
                {internalNoteDraft.length}/500
              </div>
            </div>

            <button
              type="button"
              onClick={handleAddInternalNote}
              disabled={!internalNoteDraft.trim()}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 border border-blue-200 text-blue-600 font-semibold text-xs rounded-lg hover:bg-blue-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white"
            >
              <Plus className="w-3.5 h-3.5" />
              Tambah Catatan
            </button>
          </div>

        </div>
      </div>

      {/* Footer Bottom Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200/80">
        <button
          type="button"
          onClick={() => onSaveDraft?.(documents, internalNotes)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl shadow-xs transition-colors"
        >
          <Save className="w-4 h-4" />
          Simpan Draft
        </button>

        <div className="w-full sm:w-auto flex flex-col items-end gap-1">
          <button
            type="button"
            disabled={!canSubmit}
            title={!canSubmit ? 'Unggah minimal satu dokumen sebelum mengirim ke dokter' : undefined}
            onClick={() => canSubmit && onSubmitToDoctor?.(documents, internalNotes)}
            className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 font-semibold text-xs rounded-xl shadow-xs transition-colors ${
              canSubmit
                ? 'bg-slate-500 hover:bg-slate-600 text-white'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            Selesaikan & Kirim ke Dokter
            <Send className="w-4 h-4" />
          </button>
          <span className={`text-[10px] ${canSubmit ? 'text-slate-400' : 'text-amber-600 font-medium'}`}>
            {canSubmit
              ? 'Pastikan data sudah lengkap sebelum dikirim ke dokter.'
              : 'Unggah minimal satu dokumen sebelum mengirim ke dokter.'}
          </span>
        </div>
      </div>
    </div>
  );
}
