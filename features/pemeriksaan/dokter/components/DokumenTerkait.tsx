import React from 'react';
import { FileText, Download, Folder } from 'lucide-react';

interface DocumentItem {
  id: string;
  name: string;
  type: 'PDF' | null;
  date: string | null;
  time: string | null;
}

const documents: DocumentItem[] = [
  {
    id: '1',
    name: 'Hasil Skrining Perawat',
    type: 'PDF',
    date: '16/08/2026',
    time: '08:25',
  },
  {
    id: '2',
    name: 'Formulir Anamnesis Perawat',
    type: 'PDF',
    date: '16/08/2026',
    time: '08:25',
  },
  {
    id: '3',
    name: 'Surat Rujukan (jika ada)',
    type: null,
    date: null,
    time: null,
  },
];

export default function DokumenTerkait() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 w-full font-sans flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-4">
        <FileText className="w-5 h-5 text-cyan-600" />
        <h2 className="text-sm font-bold text-cyan-600 tracking-wide uppercase">
          Dokumen Terkait
        </h2>
      </div>

      {/* List Dokumen */}
      <div className="flex flex-col mb-5">
        {documents.map((doc) => (
          <div 
            key={doc.id} 
            className="grid grid-cols-[1fr_40px_75px_40px_24px] gap-3 items-center py-2.5 border-b border-gray-100 last:border-0"
          >
            {/* Nama Dokumen */}
            <p className="text-sm font-medium text-gray-800 truncate pr-2">
              {doc.name}
            </p>

            {/* Label Format */}
            <div className="flex justify-center">
              {doc.type ? (
                <span className="bg-cyan-50 text-cyan-600 text-[10px] font-bold px-2 py-0.5 rounded">
                  {doc.type}
                </span>
              ) : (
                <span className="text-gray-400 text-sm font-medium">-</span>
              )}
            </div>

            {/* Tanggal */}
            <div className="text-xs font-medium text-gray-500 text-right">
              {doc.date || '-'}
            </div>

            {/* Waktu */}
            <div className="text-xs font-medium text-gray-500 text-right">
              {doc.time || '-'}
            </div>

            {/* Tombol Download */}
            <button 
              className="flex justify-end text-cyan-600 hover:text-cyan-800 transition-colors"
              title={`Unduh ${doc.name}`}
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Footer Action */}
      <div className="mt-auto pt-1">
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm text-cyan-600 font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all w-max">
          <Folder className="w-4 h-4" />
          Lihat Semua Dokumen
        </button>
      </div>
    </div>
  );
}