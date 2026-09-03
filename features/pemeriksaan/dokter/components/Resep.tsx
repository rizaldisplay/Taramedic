'use client';

import React, { useState } from 'react';
import { 
  Plus, 
  Pill, 
  Pencil, 
  Trash2, 
  FlaskConical, 
  Info 
} from 'lucide-react';

import ModalObatRacikan from '@/features/pemeriksaan/dokter/components/ModalTambatObatRacikan';
import ModalObatNonRacikan from '@/features/pemeriksaan/dokter/components/ModalTambahObatNonRacikan';

interface NonRacikanItem {
  id: number;
  nama: string;
  bentuk: string;
  kfa: string;
  jenis: string;
  dosis: string;
  frekuensi: string;
  rute: string;
  jumlah: string;
  aturanPakai: string;
  status: string;
}

interface KomposisiBahan {
  id: number;
  nama: string;
  bentuk: string;
  kfa: string;
  kekuatan: string;
  jumlahTiapBahan: string;
  satuan: string;
}

interface RacikanItem {
  id: number;
  nama: string;
  bentuk: string;
  jumlah: string;
  dosis: string;
  frekuensi: string;
  rute: string;
  aturanPakai: string;
  status: string;
  komposisi: KomposisiBahan[];
}

export default function ResepElektronikComponent() {

  const [isModalRacikanOpen, setIsModalRacikanOpen] = useState(false);
  const [isModalNonRacikanOpen, setIsModalNonRacikanOpen] = useState(false);

  const [nonRacikan, setNonRacikan] = useState<NonRacikanItem[]>([
    {
      id: 1,
      nama: 'Paracetamol 500 mg',
      bentuk: 'Tablet',
      kfa: '010482',
      jenis: 'Generik',
      dosis: '500 mg',
      frekuensi: '3 x sehari',
      rute: 'Oral',
      jumlah: '10 tablet',
      aturanPakai: 'Sesudah makan',
      status: 'Draft',
    },
    {
      id: 2,
      nama: 'Cetirizine 10 mg',
      bentuk: 'Tablet',
      kfa: '010517',
      jenis: 'Generik',
      dosis: '10 mg',
      frekuensi: '1 x sehari',
      rute: 'Oral',
      jumlah: '5 tablet',
      aturanPakai: 'Malam hari',
      status: 'Draft',
    },
  ]);

  const [racikan, setRacikan] = useState<RacikanItem[]>([
    {
      id: 1,
      nama: 'Racikan 1 — Puyer',
      bentuk: 'Puyer',
      jumlah: '10 bungkus',
      dosis: '1 bungkus',
      frekuensi: '3 x sehari',
      rute: 'Oral',
      aturanPakai: 'Sesudah makan',
      status: 'Draft',
      komposisi: [
        { id: 1, nama: 'Paracetamol', bentuk: 'Tablet', kfa: '010482', kekuatan: '500 mg', jumlahTiapBahan: '1', satuan: 'tablet' },
        { id: 2, nama: 'CTM (Chlorpheniramine maleate)', bentuk: 'Tablet', kfa: '010517', kekuatan: '4 mg', jumlahTiapBahan: '1', satuan: 'tablet' },
        { id: 3, nama: 'Dextromethorphan HBr', bentuk: 'Tablet', kfa: '010999', kekuatan: '10 mg', jumlahTiapBahan: '1', satuan: 'tablet' },
      ],
    },
  ]);

  return (
    <div className="w-full bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      
      {/* Header Resep Elektronik */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
        <div>
          <h2 className="text-[13px] font-bold text-slate-800 uppercase tracking-wide">
            RESEP ELEKTRONIK
          </h2>
          <p className="text-[11px] text-gray-400 mt-0.5">
            Buat dan kelola resep pasien sesuai resep dokter. Resep akan terkirim ke farmasi untuk verifikasi.
          </p>
        </div>

        <div className="flex items-center gap-4 text-right self-start sm:self-auto">
          <div>
            <p className="text-[10px] text-gray-400 font-medium">No. Resep (akan dibuat otomatis)</p>
            <p className="text-xs font-bold text-gray-700">-</p>
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-medium">Status Resep</p>
            <span className="bg-amber-50 text-amber-600 border border-amber-200/60 text-[10px] px-2 py-0.5 rounded font-semibold">
              Draft
            </span>
          </div>
        </div>
      </div>

      {/* Detail Informasi Dokter & Poliklinik */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 py-3 px-4 bg-slate-50/70 rounded-lg border border-gray-100 my-4 text-[11px]">
        <div>
          <span className="text-gray-400 block text-[10px]">Sumber Resep</span>
          <span className="font-semibold text-gray-800">E-Resep Dokter</span>
        </div>
        <div>
          <span className="text-gray-400 block text-[10px]">Tanggal Resep</span>
          <span className="font-semibold text-gray-800">16/08/2026</span>
        </div>
        <div>
          <span className="text-gray-400 block text-[10px]">Waktu Resep</span>
          <span className="font-semibold text-gray-800">08:18 WIB</span>
        </div>
        <div>
          <span className="text-gray-400 block text-[10px]">Dokter Penulis Resep</span>
          <span className="font-semibold text-gray-800">dr. Bima, Sp.A</span>
          <span className="text-[9px] text-gray-400 block">SIP: 0123456789101112</span>
        </div>
        <div>
          <span className="text-gray-400 block text-[10px]">Poli</span>
          <span className="font-semibold text-gray-800">Poli Anak</span>
        </div>
        <div>
          <span className="text-gray-400 block text-[10px]">No. Antrean</span>
          <span className="font-semibold text-gray-800">A013</span>
        </div>
      </div>


      {/* SECTION A: NON-RACIKAN */}
      <div className="flex flex-col gap-3 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-5 h-5 bg-cyan-600 text-white rounded text-xs font-bold shadow-sm">
              A
            </div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              NON-RACIKAN
            </h3>
            <span className="bg-cyan-50 text-cyan-600 text-[10px] px-2 py-0.5 rounded-full font-semibold border border-cyan-100">
              {nonRacikan.length} item
            </span>
          </div>

          <button 
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-cyan-200 bg-white text-cyan-600 text-xs font-semibold hover:bg-cyan-50 transition-all cursor-pointer shadow-2xs"
            onClick={() => setIsModalNonRacikanOpen(true)}
          >
            <Plus size={14} />
            <span>Tambah Obat</span>
          </button>
        </div>

        {/* Tabel Obat Non-Racikan */}
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-gray-200 text-[11px] text-gray-500 font-semibold">
                <th className="p-2.5 w-10 text-center">No.</th>
                <th className="p-2.5">Obat <span className="text-[9px] font-normal text-gray-400">(Bentuk Sediaan &bull; KFA &bull; Generik/Brand)</span></th>
                <th className="p-2.5 w-28">Dosis <span className="text-[9px] font-normal text-gray-400">(Kekuatan)</span></th>
                <th className="p-2.5 w-28">Frekuensi</th>
                <th className="p-2.5 w-20">Rute</th>
                <th className="p-2.5 w-28">Jumlah <span className="text-[9px] font-normal text-gray-400">(Satuan)</span></th>
                <th className="p-2.5">Aturan Pakai</th>
                <th className="p-2.5 w-20">Status</th>
                <th className="p-2.5 w-16 text-center"></th>
              </tr>
            </thead>
            <tbody className="text-[12px] divide-y divide-gray-100">
              {nonRacikan.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-2.5 text-center text-gray-500 font-medium">{item.id}</td>
                  <td className="p-2.5">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-cyan-50 text-cyan-600 rounded-md">
                        <Pill size={14} />
                      </div>
                      <div>
                        <p className="font-bold text-gray-800 text-[12px]">{item.nama}</p>
                        <p className="text-[10px] text-gray-400">
                          {item.bentuk} &bull; {item.kfa} &bull; {item.jenis}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-2.5 text-gray-700 font-medium">{item.dosis}</td>
                  <td className="p-2.5 text-gray-700 font-medium">{item.frekuensi}</td>
                  <td className="p-2.5 text-gray-700 font-medium">{item.rute}</td>
                  <td className="p-2.5 text-gray-700 font-medium">{item.jumlah}</td>
                  <td className="p-2.5 text-gray-700 font-medium">{item.aturanPakai}</td>
                  <td className="p-2.5">
                    <span className="bg-sky-50 text-sky-600 border border-sky-100 text-[10px] px-2 py-0.5 rounded font-semibold">
                      {item.status}
                    </span>
                  </td>
                  <td className="p-2.5 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button type="button" className="text-gray-400 hover:text-cyan-600 cursor-pointer p-0.5">
                        <Pencil size={13} />
                      </button>
                      <button type="button" className="text-gray-400 hover:text-red-600 cursor-pointer p-0.5">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>


      {/* SECTION B: RACIKAN */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-5 h-5 bg-cyan-600 text-white rounded text-xs font-bold shadow-sm">
              B
            </div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              RACIKAN
            </h3>
            <span className="bg-cyan-50 text-cyan-600 text-[10px] px-2 py-0.5 rounded-full font-semibold border border-cyan-100">
              {racikan.length} item
            </span>
          </div>

          <button 
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-cyan-200 bg-white text-cyan-600 text-xs font-semibold hover:bg-cyan-50 transition-all cursor-pointer shadow-2xs"
            onClick={() => setIsModalRacikanOpen(true)}
          >
            <Plus size={14} />
            <span>Tambah Racikan</span>
          </button>
        </div>

        {/* Card List Racikan */}
        {racikan.map((item) => (
          <div key={item.id} className="border border-gray-200 rounded-lg p-4 bg-white flex flex-col gap-3">
            
            {/* Header Card Racikan */}
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-purple-50 text-purple-600 rounded-lg mt-0.5">
                  {/* Fallback Icon Mortar/Lumping Racikan */}
                  <FlaskConical size={16} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 text-[13px]">{item.nama}</h4>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Bentuk: <span className="font-medium text-gray-700">{item.bentuk}</span> &bull; 
                    Jumlah: <span className="font-medium text-gray-700">{item.jumlah}</span> &bull; 
                    Dosis: <span className="font-medium text-gray-700">{item.dosis}</span> &bull; 
                    Frekuensi: <span className="font-medium text-gray-700">{item.frekuensi}</span> &bull; 
                    Rute: <span className="font-medium text-gray-700">{item.rute}</span>
                  </p>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Aturan Pakai: <span className="font-medium text-gray-700">{item.aturanPakai}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="bg-sky-50 text-sky-600 border border-sky-100 text-[10px] px-2 py-0.5 rounded font-semibold">
                  {item.status}
                </span>
                <button type="button" className="text-gray-400 hover:text-cyan-600 cursor-pointer p-1">
                  <Pencil size={14} />
                </button>
                <button type="button" className="text-gray-400 hover:text-red-600 cursor-pointer p-1">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            {/* Sub-Tabel Komposisi Bahan Racikan */}
            <div className="mt-1">
              <p className="text-[11px] font-semibold text-gray-600 mb-2">
                Komposisi ({item.komposisi.length} bahan)
              </p>
              
              <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/70 border-b border-gray-200 text-[10px] text-gray-500 font-semibold">
                      <th className="p-2 w-10 text-center">No.</th>
                      <th className="p-2">Nama Bahan <span className="text-[9px] font-normal text-gray-400">(Bentuk Sediaan &bull; KFA)</span></th>
                      <th className="p-2 w-32">Kekuatan</th>
                      <th className="p-2 w-36">Jumlah Tiap Bahan</th>
                      <th className="p-2 w-28">Satuan</th>
                    </tr>
                  </thead>
                  <tbody className="text-[11px] divide-y divide-gray-100">
                    {item.komposisi.map((bahan, idx) => (
                      <tr key={bahan.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-2 text-center text-gray-500 font-medium">{idx + 1}</td>
                        <td className="p-2">
                          <p className="font-semibold text-gray-800">{bahan.nama}</p>
                          <p className="text-[9px] text-gray-400">{bahan.bentuk} &bull; {bahan.kfa}</p>
                        </td>
                        <td className="p-2 text-gray-700 font-medium">{bahan.kekuatan}</td>
                        <td className="p-2 text-gray-700 font-medium">{bahan.jumlahTiapBahan}</td>
                        <td className="p-2 text-gray-700 font-medium">{bahan.satuan}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* Footer Note Kemenkes SATUSEHAT */}
      <div className="flex items-center justify-center gap-1.5 mt-6 text-[11px] text-gray-400 font-medium">
        <Info size={13} className="text-gray-400" />
        <span>Resep dibuat sesuai standar peresepan Kemenkes & SATUSEHAT (MedicationRequest).</span>
      </div>

      {/** Modal Obat Racikan */}
      <ModalObatRacikan isOpen={isModalRacikanOpen} onClose={() => setIsModalRacikanOpen(false)} />

      {/** Modal Obat Non Racikan */}
      <ModalObatNonRacikan isOpen={isModalNonRacikanOpen} onClose={() => setIsModalNonRacikanOpen(false)} />
    </div>
  );
}