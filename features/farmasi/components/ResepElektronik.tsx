import React from 'react';
import { 
  FileText, 
  Pill, 
  Eye, 
  ChevronDown, 
  FlaskConical,
  Clock,
  Save,
  ArrowRight
} from 'lucide-react';

// --- Types ---
// Struktur data yang bersih untuk mempermudah integrasi API nantinya
interface Medicine {
  id: string;
  name: string;
  type: string;
  kfa: string;
  isGeneric: boolean;
  dosis: string;
  frekuensi: string;
  rute: string;
  jumlah: string;
  aturanPakai: string;
  status: 'Menunggu' | 'Selesai';
}

interface Racikan {
  id: string;
  name: string;
  bentuk: string;
  jumlah: string;
  dosis: string;
  frekuensi: string;
  rute: string;
  aturanPakai: string;
  komposisiCount: number;
  status: 'Menunggu Peracikan' | 'Selesai';
}

export default function ResepElektronikComponent() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl font-sans">
      
      {/* 1. Header Card Resep Elektronik */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex justify-between items-start">
        <div className="flex gap-4">
          <div className="bg-blue-50 p-3 rounded-lg h-fit">
            <FileText className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-sm font-bold text-blue-600 tracking-wide uppercase">Resep Elektronik</h2>
            
            <div className="flex items-center gap-3">
              <span className="text-gray-500 font-medium">Resep</span>
              <span className="text-lg font-bold text-gray-800">RX-20260816-013</span>
              <span className="bg-orange-50 text-orange-600 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 border border-orange-100">
                <Clock className="w-3 h-3" />
                Menunggu Verifikasi
              </span>
            </div>
            
            <div className="flex items-center text-sm text-gray-500 gap-2 mt-1">
              <span>dr. Bima, Sp.A</span>
              <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
              <span>Poli Anak</span>
              <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
              <span>16 Agustus 2026</span>
              <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
              <span>08:18 WIB</span>
            </div>
          </div>
        </div>

        {/* Statistik Resep */}
        <div className="flex border border-gray-200 rounded-lg divide-x divide-gray-200">
          <div className="px-4 py-2 flex flex-col items-center">
            <span className="text-xs text-gray-500 mb-1">Total Resep</span>
            <span className="font-bold text-gray-800">3 <span className="text-sm font-normal text-gray-500">Item</span></span>
          </div>
          <div className="px-4 py-2 flex flex-col items-center">
            <span className="text-xs text-gray-500 mb-1">Non-Racikan</span>
            <span className="font-bold text-gray-800">2 <span className="text-sm font-normal text-gray-500">Item</span></span>
          </div>
          <div className="px-4 py-2 flex flex-col items-center">
            <span className="text-xs text-gray-500 mb-1">Racikan</span>
            <span className="font-bold text-gray-800">1 <span className="text-sm font-normal text-gray-500">Item</span></span>
          </div>
        </div>
      </div>

      {/* 2. Navigation Tabs */}
      <div className="flex gap-2">
        <button className="bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-medium">
          Semua (3)
        </button>
        <button className="bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 px-5 py-2 rounded-full text-sm font-medium transition-colors">
          Non-Racikan (2)
        </button>
        <button className="bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 px-5 py-2 rounded-full text-sm font-medium transition-colors">
          Racikan (1)
        </button>
      </div>

      {/* 3. Section A: Non-Racikan */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">A</div>
          <h3 className="font-bold text-gray-800 text-sm tracking-wide">NON-RACIKAN</h3>
          <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-semibold">2 Item</span>
        </div>

        {/* Item Non-Racikan 1 */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex flex-col gap-4 relative">
          <div className="absolute left-5 top-5 font-medium text-gray-400">1</div>
          <div className="ml-8 grid grid-cols-12 gap-4">
            
            <div className="col-span-3 flex gap-3">
              <div className="bg-blue-50 p-2 rounded-full h-fit">
                <Pill className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-bold text-gray-800">Paracetamol 500 mg</h4>
                <div className="text-xs text-gray-500 mt-1 flex items-center gap-1.5">
                  <span>Tablet</span>
                  <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                  <span>KFA: 010482</span>
                  <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                  <span>Generik</span>
                </div>
              </div>
            </div>

            <div className="col-span-8 grid grid-cols-5 gap-4">
              <div>
                <span className="text-xs text-gray-500 block mb-1">Dosis</span>
                <span className="text-sm font-medium text-gray-800">500 mg</span>
              </div>
              <div>
                <span className="text-xs text-gray-500 block mb-1">Frekuensi</span>
                <span className="text-sm font-medium text-gray-800">3 x sehari</span>
              </div>
              <div>
                <span className="text-xs text-gray-500 block mb-1">Rute</span>
                <span className="text-sm font-medium text-gray-800">Oral</span>
              </div>
              <div>
                <span className="text-xs text-gray-500 block mb-1">Jumlah</span>
                <span className="text-sm font-medium text-gray-800">10 tablet</span>
              </div>
              <div>
                <span className="text-xs text-gray-500 block mb-1">Aturan Pakai</span>
                <span className="text-sm font-medium text-gray-800">Sesudah makan</span>
              </div>
            </div>

            <div className="col-span-1 flex flex-col items-end justify-start">
              <span className="text-xs text-gray-500 block mb-1 text-right">Status</span>
              <span className="bg-orange-50 text-orange-600 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 border border-orange-100">
                <Clock className="w-3 h-3" />
                Menunggu
              </span>
            </div>
          </div>
          
          <div className="ml-8 border-t border-gray-100 pt-3 mt-1 flex justify-between items-center">
            <div className="text-xs text-gray-500 flex items-center gap-2">
              <span className="border border-gray-200 rounded px-2 py-1 bg-gray-50">Sumber: E-Resep Dokter</span>
            </div>
            <button className="text-blue-600 text-sm font-medium flex items-center gap-2 hover:text-blue-700 transition-colors">
              <Eye className="w-4 h-4" />
              Lihat Detail
            </button>
          </div>
        </div>

        {/* Item Non-Racikan 2 */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex flex-col gap-4 relative">
          <div className="absolute left-5 top-5 font-medium text-gray-400">2</div>
          <div className="ml-8 grid grid-cols-12 gap-4">
            
            <div className="col-span-3 flex gap-3">
              <div className="bg-blue-50 p-2 rounded-full h-fit">
                <Pill className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-bold text-gray-800">Cetirizine 10 mg</h4>
                <div className="text-xs text-gray-500 mt-1 flex items-center gap-1.5">
                  <span>Tablet</span>
                  <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                  <span>KFA: 010517</span>
                  <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                  <span>Generik</span>
                </div>
              </div>
            </div>

            <div className="col-span-8 grid grid-cols-5 gap-4">
              <div>
                <span className="text-xs text-gray-500 block mb-1">Dosis</span>
                <span className="text-sm font-medium text-gray-800">10 mg</span>
              </div>
              <div>
                <span className="text-xs text-gray-500 block mb-1">Frekuensi</span>
                <span className="text-sm font-medium text-gray-800">1 x sehari</span>
              </div>
              <div>
                <span className="text-xs text-gray-500 block mb-1">Rute</span>
                <span className="text-sm font-medium text-gray-800">Oral</span>
              </div>
              <div>
                <span className="text-xs text-gray-500 block mb-1">Jumlah</span>
                <span className="text-sm font-medium text-gray-800">5 tablet</span>
              </div>
              <div>
                <span className="text-xs text-gray-500 block mb-1">Aturan Pakai</span>
                <span className="text-sm font-medium text-gray-800">Malam hari</span>
              </div>
            </div>

            <div className="col-span-1 flex flex-col items-end justify-start">
              <span className="text-xs text-gray-500 block mb-1 text-right">Status</span>
              <span className="bg-orange-50 text-orange-600 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 border border-orange-100">
                <Clock className="w-3 h-3" />
                Menunggu
              </span>
            </div>
          </div>
          
          <div className="ml-8 border-t border-gray-100 pt-3 mt-1 flex justify-between items-center">
            <div className="text-xs text-gray-500 flex items-center gap-2">
              <span className="border border-gray-200 rounded px-2 py-1 bg-gray-50">Sumber: E-Resep Dokter</span>
            </div>
            <button className="text-blue-600 text-sm font-medium flex items-center gap-2 hover:text-blue-700 transition-colors">
              <Eye className="w-4 h-4" />
              Lihat Detail
            </button>
          </div>
        </div>
      </div>

      {/* 4. Section B: Racikan */}
      <div className="flex flex-col gap-4 mt-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">B</div>
          <h3 className="font-bold text-gray-800 text-sm tracking-wide">RACIKAN</h3>
          <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-semibold">1 Item</span>
        </div>

        {/* Item Racikan */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <div className="flex gap-4">
              <div className="bg-blue-50 p-3 rounded-full h-fit">
                <FlaskConical className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex flex-col gap-2">
                <h4 className="font-bold text-gray-800 text-base">Racikan 1 — Puyer</h4>
                <div className="flex items-center text-sm text-gray-600 gap-2">
                  <span>Bentuk: <strong>Puyer</strong></span>
                  <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                  <span>Jumlah: <strong>10 bungkus</strong></span>
                </div>
                <div className="flex items-center text-sm text-gray-600 gap-2">
                  <span>Dosis: <strong>1 bungkus</strong></span>
                  <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                  <span>Frekuensi: <strong>3 x sehari</strong></span>
                  <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                  <span>Rute: <strong>Oral</strong></span>
                </div>
                <div className="text-sm text-gray-600">
                  Aturan Pakai: <strong>Sesudah makan</strong>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-end gap-3">
               <span className="bg-purple-50 text-purple-600 px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 border border-purple-100">
                <Clock className="w-3.5 h-3.5" />
                Menunggu Peracikan
              </span>
            </div>
          </div>

          <div className="ml-16 mr-2 border border-gray-200 rounded-lg p-3 bg-gray-50 flex justify-between items-center cursor-pointer hover:bg-gray-100 transition-colors">
             <span className="text-sm font-medium text-gray-700">Komposisi (3 bahan)</span>
             <div className="flex items-center gap-2 text-blue-600 text-sm font-medium">
               Lihat Komposisi
               <ChevronDown className="w-4 h-4" />
             </div>
          </div>

          <div className="ml-16 border-t border-gray-100 pt-3 mt-1 flex justify-between items-center">
            <div className="text-xs text-gray-500 flex items-center gap-2">
              <span className="border border-gray-200 rounded px-2 py-1 bg-gray-50">Sumber: E-Resep Dokter</span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Bottom Actions */}
      <div className="flex justify-between items-center bg-white border border-gray-200 rounded-xl p-4 shadow-sm mt-4">
        <button className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors">
          <Save className="w-4 h-4" />
          Simpan Draft
        </button>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
          Lanjutkan ke Verifikasi
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}