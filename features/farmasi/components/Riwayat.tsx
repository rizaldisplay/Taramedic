'use client';

import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Eye, 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight 
} from 'lucide-react';

// --- Types & Interfaces ---
export interface RiwayatPelayananItem {
  no: number;
  tanggal: string;
  waktu: string;
  noResep: string;
  dokter: string;
  isKunjunganSaatIni?: boolean;
  totalItem: string;
  detailItem: string;
  status: 'Selesai Diserahkan' | 'Dalam Proses' | 'Dibatalkan';
  dilayaniOleh: string;
  jabatanApoteker: string;
}

interface RiwayatComponentProps {
  data?: RiwayatPelayananItem[];
  onLihatDetail?: (item: RiwayatPelayananItem) => void;
}

export default function RiwayatComponent({
  data,
  onLihatDetail,
}: RiwayatComponentProps) {
  // Data default acuan dari gambar
  const defaultRiwayatList: RiwayatPelayananItem[] = [
    {
      no: 1,
      tanggal: '16/08/2026',
      waktu: '08:43 WIB',
      noResep: 'Resep #RSP/20260816/00045',
      dokter: 'dr. Bima, Sp.A',
      isKunjunganSaatIni: true,
      totalItem: '3 item',
      detailItem: '(2 Non-Racikan, 1 Racikan)',
      status: 'Selesai Diserahkan',
      dilayaniOleh: 'Siti Rahma, A.Md.Kep',
      jabatanApoteker: 'Apoteker',
    },
    {
      no: 2,
      tanggal: '02/08/2026',
      waktu: '10:12 WIB',
      noResep: 'Resep #RSP/20260802/00028',
      dokter: 'dr. Bima, Sp.A',
      isKunjunganSaatIni: false,
      totalItem: '2 item',
      detailItem: '(2 Non-Racikan)',
      status: 'Selesai Diserahkan',
      dilayaniOleh: 'Aldi Pratama, S.Farm',
      jabatanApoteker: 'Apoteker',
    },
    {
      no: 3,
      tanggal: '18/07/2026',
      waktu: '09:55 WIB',
      noResep: 'Resep #RSP/20260718/00019',
      dokter: 'dr. Bima, Sp.A',
      isKunjunganSaatIni: false,
      totalItem: '4 item',
      detailItem: '(3 Non-Racikan, 1 Racikan)',
      status: 'Selesai Diserahkan',
      dilayaniOleh: 'Siti Rahma, A.Md.Kep',
      jabatanApoteker: 'Apoteker',
    },
    {
      no: 4,
      tanggal: '05/07/2026',
      waktu: '11:20 WIB',
      noResep: 'Resep #RSP/20260705/00010',
      dokter: 'dr. Bima, Sp.A',
      isKunjunganSaatIni: false,
      totalItem: '1 item',
      detailItem: '(1 Non-Racikan)',
      status: 'Selesai Diserahkan',
      dilayaniOleh: 'Aldi Pratama, S.Farm',
      jabatanApoteker: 'Apoteker',
    },
    {
      no: 5,
      tanggal: '21/06/2026',
      waktu: '09:30 WIB',
      noResep: 'Resep #RSP/20260621/00007',
      dokter: 'dr. Bima, Sp.A',
      isKunjunganSaatIni: false,
      totalItem: '2 item',
      detailItem: '(2 Non-Racikan)',
      status: 'Selesai Diserahkan',
      dilayaniOleh: 'Siti Rahma, A.Md.Kep',
      jabatanApoteker: 'Apoteker',
    },
  ];

  const riwayatItems = data || defaultRiwayatList;

  // Pagination State
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(5);

  return (
    <div className="w-full max-w-5xl bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col gap-5 font-sans">
      
      {/* Section Header */}
      <div className="flex flex-col gap-1 border-b border-slate-100 pb-3">
        <h3 className="font-bold text-slate-800 text-xs tracking-wider uppercase flex items-center gap-2">
          RIWAYAT PELAYANAN FARMASI
        </h3>
        <p className="text-xs text-slate-500 font-medium">
          Riwayat obat yang pernah diberikan kepada pasien pada kunjungan ini.
        </p>
      </div>

      {/* Tabel Riwayat Pelayanan */}
      <div className="overflow-x-auto rounded-xl border border-slate-200/80">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50/80 text-slate-600 font-semibold border-b border-slate-200/80">
            <tr>
              <th className="p-3.5 w-10 text-center">No.</th>
              <th className="p-3.5">Tanggal & Waktu</th>
              <th className="p-3.5">Resep</th>
              <th className="p-3.5">Jumlah Item</th>
              <th className="p-3.5 text-center">Status</th>
              <th className="p-3.5">Dilayani oleh</th>
              <th className="p-3.5 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {riwayatItems.map((item) => (
              <tr key={item.no} className="hover:bg-slate-50/50 transition-colors">
                
                {/* No. */}
                <td className="p-3.5 font-semibold text-slate-800 text-center">{item.no}</td>

                {/* Tanggal & Waktu */}
                <td className="p-3.5">
                  <div className="flex flex-col gap-0.5">
                    <span className="font-bold text-slate-800">{item.tanggal}</span>
                    <span className="text-[11px] text-slate-400 font-medium">{item.waktu}</span>
                  </div>
                </td>

                {/* Resep + Badge Kunjungan Saat Ini */}
                <td className="p-3.5">
                  <div className="flex flex-col gap-1 items-start">
                    <span className="font-bold text-slate-800">{item.noResep}</span>
                    {item.isKunjunganSaatIni && (
                      <span className="bg-blue-50 text-blue-600 border border-blue-100 px-2 py-0.5 rounded-md text-[10px] font-bold">
                        Kunjungan Saat Ini
                      </span>
                    )}
                    <span className="text-[11px] text-slate-500 font-medium">{item.dokter}</span>
                  </div>
                </td>

                {/* Jumlah Item */}
                <td className="p-3.5">
                  <div className="flex flex-col gap-0.5">
                    <span className="font-bold text-slate-800">{item.totalItem}</span>
                    <span className="text-[11px] text-slate-400">{item.detailItem}</span>
                  </div>
                </td>

                {/* Status Badge */}
                <td className="p-3.5 text-center">
                  <span className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full text-[10px] font-semibold inline-flex items-center gap-1 border border-emerald-200/60 whitespace-nowrap">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Selesai Diserahkan
                  </span>
                </td>

                {/* Dilayani Oleh */}
                <td className="p-3.5">
                  <div className="flex flex-col gap-0.5">
                    <span className="font-bold text-slate-800">{item.dilayaniOleh}</span>
                    <span className="text-[11px] text-slate-400 font-medium">{item.jabatanApoteker}</span>
                  </div>
                </td>

                {/* Aksi Button */}
                <td className="p-3.5 text-center">
                  <button
                    type="button"
                    onClick={() => onLihatDetail && onLihatDetail(item)}
                    className="px-3 py-1.5 border border-slate-200 bg-white hover:bg-slate-50 text-blue-600 hover:text-blue-700 font-semibold text-xs rounded-lg transition-colors inline-flex items-center gap-1.5 shadow-2xs cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Lihat Detail</span>
                  </button>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 text-xs text-slate-500">
        
        {/* Info Total Data */}
        <span className="font-medium">
          Menampilkan 1 - 5 dari 12 riwayat
        </span>

        {/* Control Pagination */}
        <div className="flex items-center gap-4">
          
          {/* Numbers Navigation */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Page Buttons */}
            <button
              type="button"
              className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-2xs"
            >
              1
            </button>
            <button
              type="button"
              className="w-7 h-7 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center justify-center transition-colors cursor-pointer"
            >
              2
            </button>
            <button
              type="button"
              className="w-7 h-7 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center justify-center transition-colors cursor-pointer"
            >
              3
            </button>

            <button
              type="button"
              className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            >
              <ChevronsRight className="w-4 h-4" />
            </button>
          </div>

          {/* Select Items Per Page */}
          <div className="flex items-center gap-1.5">
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="p-1.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 outline-none focus:border-blue-500 bg-white cursor-pointer"
            >
              <option value={5}>5 / halaman</option>
              <option value={10}>10 / halaman</option>
              <option value={20}>20 / halaman</option>
            </select>
          </div>

        </div>

      </div>

    </div>
  );
}