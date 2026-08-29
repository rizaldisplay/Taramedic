"use client";

import React, { useState } from "react";
import { X, Calendar, Plus, Upload, Info } from "lucide-react";

interface ModalAjukanKoreksiProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: () => void;
}

export default function ModalAjukanKoreksi({
  isOpen,
  onClose,
  onSubmit,
}: ModalAjukanKoreksiProps) {
  const [deskripsi, setDeskripsi] = useState("");
  const [tipeKoreksi, setTipeKoreksi] = useState<"item" | "total">("item");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn font-sans">
      
      {/* Modal Container */}
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-100 max-h-[90vh] flex flex-col">
        
        {/* =========================================
            1. HEADER MODAL
        ========================================= */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div>
            <h3 className="text-base font-bold text-slate-800">
              Ajukan Koreksi Billing
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Ajukan koreksi jika terdapat kesalahan pada item layanan/obat, tarif, atau data penjamin.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* =========================================
            2. BODY MODAL (SCROLLABLE)
        ========================================= */}
        <div className="p-6 overflow-y-auto space-y-6 text-[12px] flex-1">
          
          {/* SECTION 1: ALASAN KOREKSI */}
          <div className="space-y-3">
            <h4 className="font-bold text-blue-600 text-[12px] tracking-wide uppercase">
              1. ALASAN KOREKSI
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Pilih Alasan */}
              <div className="space-y-1">
                <label className="text-slate-700 font-medium">
                  Pilih alasan koreksi <span className="text-red-500">*</span>
                </label>
                <select className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
                  <option value="">Pilih alasan koreksi</option>
                  <option value="kesalahan_tarif">Kesalahan Tarif / Harga</option>
                  <option value="kesalahan_qty">Kesalahan Jumlah (Qty)</option>
                  <option value="item_ganda">Item Duplikat / Ganda</option>
                  <option value="penjamin_salah">Perubahan Data Penjamin</option>
                </select>
              </div>

              {/* Tanggal Pengajuan */}
              <div className="space-y-1">
                <label className="text-slate-700 font-medium">
                  Tanggal Pengajuan <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    defaultValue="16/08/2026"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none"
                    readOnly
                  />
                  <Calendar className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Deskripsi Koreksi */}
              <div className="space-y-1 md:col-span-1">
                <label className="text-slate-700 font-medium">
                  Deskripsi Koreksi <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <textarea
                    rows={3}
                    maxLength={1000}
                    value={deskripsi}
                    onChange={(e) => setDeskripsi(e.target.value)}
                    placeholder="Jelaskan secara detail kesalahan dan koreksi yang diharapkan"
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
                  />
                  <span className="absolute bottom-2 right-2 text-[10px] text-slate-400">
                    {deskripsi.length} / 1000
                  </span>
                </div>
              </div>

              {/* Prioritas */}
              <div className="space-y-1 md:col-span-1">
                <label className="text-slate-700 font-medium">Prioritas</label>
                <select className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
                  <option value="normal">Normal</option>
                  <option value="tinggi">Tinggi (Urgent)</option>
                </select>
              </div>
            </div>
          </div>

          {/* SECTION 2: ITEM YANG DIKOREKSI */}
          <div className="space-y-3">
            <h4 className="font-bold text-blue-600 text-[12px] tracking-wide uppercase">
              2. ITEM YANG DIKOREKSI
            </h4>

            {/* Radio Options */}
            <div className="flex items-center gap-6 text-slate-700 font-medium">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="tipeKoreksi"
                  checked={tipeKoreksi === "item"}
                  onChange={() => setTipeKoreksi("item")}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span>Koreksi Per Item</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="tipeKoreksi"
                  checked={tipeKoreksi === "total"}
                  onChange={() => setTipeKoreksi("total")}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span>Koreksi Total Tagihan</span>
              </label>
            </div>

            {/* Item Table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-[11px] text-left border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
                  <tr>
                    <th className="py-2.5 px-3 text-center w-8">Pilih</th>
                    <th className="py-2.5 px-2">Kategori</th>
                    <th className="py-2.5 px-2">Item</th>
                    <th className="py-2.5 px-2">Kode</th>
                    <th className="py-2.5 px-2 text-center">Qty</th>
                    <th className="py-2.5 px-2 text-right">Tarif (Rp)</th>
                    <th className="py-2.5 px-2 text-right">Total (Rp)</th>
                    <th className="py-2.5 px-3">Koreksi Yang Diminta</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {/* Row 1 */}
                  <tr>
                    <td className="py-2.5 px-3 text-center">
                      <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500" />
                    </td>
                    <td className="py-2.5 px-2">
                      <span className="bg-blue-50 text-blue-600 font-medium px-2 py-0.5 rounded text-[10px]">
                        Layanan
                      </span>
                    </td>
                    <td className="py-2.5 px-2 font-medium text-slate-800">
                      Konsultasi dokter spesialis anak
                    </td>
                    <td className="py-2.5 px-2 text-slate-500">89.7</td>
                    <td className="py-2.5 px-2 text-center">1</td>
                    <td className="py-2.5 px-2 text-right">80.000</td>
                    <td className="py-2.5 px-2 text-right font-medium">80.000</td>
                    <td className="py-2.5 px-3">
                      <select className="w-full p-1 bg-white border border-slate-200 rounded text-[11px] text-slate-700">
                        <option value="">Pilih koreksi</option>
                        <option value="hapus">Hapus Item</option>
                        <option value="ubah_qty">Ubah Qty</option>
                        <option value="ubah_harga">Ubah Harga</option>
                      </select>
                    </td>
                  </tr>

                  {/* Row 2 */}
                  <tr>
                    <td className="py-2.5 px-3 text-center">
                      <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500" />
                    </td>
                    <td className="py-2.5 px-2">
                      <span className="bg-blue-50 text-blue-600 font-medium px-2 py-0.5 rounded text-[10px]">
                        Layanan
                      </span>
                    </td>
                    <td className="py-2.5 px-2 font-medium text-slate-800">
                      Edukasi pasien (medikamentosa & non medikamentosa)
                    </td>
                    <td className="py-2.5 px-2 text-slate-500">87.44</td>
                    <td className="py-2.5 px-2 text-center">1</td>
                    <td className="py-2.5 px-2 text-right">25.000</td>
                    <td className="py-2.5 px-2 text-right font-medium">25.000</td>
                    <td className="py-2.5 px-3">
                      <select className="w-full p-1 bg-white border border-slate-200 rounded text-[11px] text-slate-700">
                        <option value="">Pilih koreksi</option>
                        <option value="hapus">Hapus Item</option>
                        <option value="ubah_qty">Ubah Qty</option>
                        <option value="ubah_harga">Ubah Harga</option>
                      </select>
                    </td>
                  </tr>

                  {/* Row 3 */}
                  <tr>
                    <td className="py-2.5 px-3 text-center">
                      <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500" />
                    </td>
                    <td className="py-2.5 px-2">
                      <span className="bg-sky-50 text-sky-600 font-medium px-2 py-0.5 rounded text-[10px]">
                        Obat
                      </span>
                    </td>
                    <td className="py-2.5 px-2 font-medium text-slate-800">
                      Paracetamol 500 mg
                    </td>
                    <td className="py-2.5 px-2 text-slate-500">-</td>
                    <td className="py-2.5 px-2 text-center">10</td>
                    <td className="py-2.5 px-2 text-right">500</td>
                    <td className="py-2.5 px-2 text-right font-medium">5.000</td>
                    <td className="py-2.5 px-3">
                      <select className="w-full p-1 bg-white border border-slate-200 rounded text-[11px] text-slate-700">
                        <option value="">Pilih koreksi</option>
                        <option value="hapus">Hapus Item</option>
                        <option value="ubah_qty">Ubah Qty</option>
                        <option value="ubah_harga">Ubah Harga</option>
                      </select>
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Add Item Button */}
              <div className="p-2 bg-slate-50/50 border-t border-slate-100">
                <button className="flex items-center gap-1.5 text-blue-600 font-semibold hover:text-blue-700 transition-colors text-[11px]">
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Item Lain (Jika Diperlukan)</span>
                </button>
              </div>
            </div>
          </div>

          {/* SECTION 3: LAMPIRAN DOKUMEN (OPSIONAL) */}
          <div className="space-y-2">
            <h4 className="font-bold text-blue-600 text-[12px] tracking-wide uppercase">
              3. LAMPIRAN DOKUMEN (OPSIONAL)
            </h4>
            <p className="text-slate-500 text-[11px]">
              Lampirkan dokumen pendukung seperti resep, catatan dokter, atau bukti lainnya.
            </p>

            <div className="border border-dashed border-slate-200 rounded-xl p-3 flex items-center justify-between">
              <button className="flex items-center gap-2 text-blue-600 font-medium hover:text-blue-700 transition-colors">
                <Upload className="w-4 h-4" />
                <span>Upload Dokumen</span>
              </button>
              <div className="text-[11px] text-slate-400">
                Format: PDF, JPG, PNG (Maks. 5MB)
              </div>
              <div className="text-[11px] text-slate-400">
                0 file dipilih
              </div>
            </div>
          </div>

          {/* SATUSEHAT Compliance Note Banner */}
          <div className="bg-blue-50/60 border border-blue-100 rounded-xl p-3 flex items-start gap-2.5 text-slate-600 text-[11px]">
            <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <span>
              Pengajuan koreksi akan diverifikasi oleh petugas verifikator. Pastikan data yang diajukan sesuai dengan peraturan Kemenkes (Permenkes No. 24 Tahun 2022) dan ketentuan SATUSEHAT.
            </span>
          </div>

        </div>

        {/* =========================================
            3. FOOTER MODAL (ACTION BUTTONS)
        ========================================= */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 font-medium hover:bg-slate-100 transition-colors text-[12px]"
          >
            Batal
          </button>
          <button
            onClick={onSubmit}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm transition-all text-[12px]"
          >
            Ajukan Koreksi
          </button>
        </div>

      </div>
    </div>
  );
}