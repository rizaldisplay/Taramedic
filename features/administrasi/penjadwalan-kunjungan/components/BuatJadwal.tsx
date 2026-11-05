import React, { useState } from 'react';
import { CalendarPlus, Plus } from 'lucide-react';

type Option = { id: string | number; nama: string };
type SlotOption = { id: string | number; label: string };

export const CreateVisitScheduleSection = ({
  onSave,
  poliOptions = [],
  layananOptions = [],
  slotDokterOptions = [],
}: {
  onSave?: (schedule: {
    pasien: string;
    poliId: string;
    layananId: string;
    slotId: string;
  }) => void;
  poliOptions?: Option[];
  layananOptions?: Option[];
  slotDokterOptions?: SlotOption[];
}) => {
  const [pasienQuery, setPasienQuery] = useState('');
  const [selectedPoli, setSelectedPoli] = useState('');
  const [selectedLayanan, setSelectedLayanan] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (onSave) {
      onSave({
        pasien: pasienQuery,
        poliId: selectedPoli,
        layananId: selectedLayanan,
        slotId: selectedSlot,
      });
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
      {/* Header Card */}
      <div className="flex items-center gap-2 pb-1">
        <div className="p-1.5 bg-cyan-50 text-cyan-600 rounded-lg">
          <CalendarPlus className="w-4 h-4" />
        </div>
        <h2 className="text-sm font-bold text-slate-800">Buat Jadwal Kunjungan</h2>
      </div>

      {/* Form Area */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Grid Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
          {/* Field: Pasien */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              Pasien
            </label>
            <input
              type="text"
              placeholder="Cari nama, No. RM, atau NIK"
              value={pasienQuery}
              onChange={(e) => setPasienQuery(e.target.value)}
              className="w-full px-3 py-2 text-xs text-slate-700 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all placeholder:text-slate-400"
            />
            <p className="text-[11px] text-slate-400 leading-tight">
              Hasil hanya menampilkan nama dan No. RM; data klinis tidak dibuka.
            </p>
          </div>

          {/* Field: Poli */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              Poli
            </label>
            <select
              value={selectedPoli}
              onChange={(e) => setSelectedPoli(e.target.value)}
              className="w-full px-3 py-2 text-xs text-slate-700 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all cursor-pointer"
            >
              <option value="">Pilih Poli</option>
              {poliOptions.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.nama}
                </option>
              ))}
            </select>
          </div>

          {/* Field: Layanan */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              Layanan
            </label>
            <select
              value={selectedLayanan}
              onChange={(e) => setSelectedLayanan(e.target.value)}
              className="w-full px-3 py-2 text-xs text-slate-700 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all cursor-pointer"
            >
              <option value="">Pilih Layanan</option>
              {layananOptions.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.nama}
                </option>
              ))}
            </select>
          </div>

          {/* Field: Dokter & Waktu */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              Dokter & Waktu
            </label>
            <select
              value={selectedSlot}
              onChange={(e) => setSelectedSlot(e.target.value)}
              className="w-full px-3 py-2 text-xs text-slate-700 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all cursor-pointer"
            >
              <option value="">Pilih Slot Tersedia</option>
              {slotDokterOptions.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Footer Guidance & Submit Button */}
        <div className="space-y-3 pt-1">
          <p className="text-xs text-slate-500">
            Pilih pasien, poli dan layanan untuk melihat slot dokter.
          </p>

          <button
            type="submit"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-sky-400 hover:bg-sky-500 active:bg-sky-600 rounded-lg transition-colors shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Simpan Jadwal</span>
          </button>
        </div>
      </form>
    </div>
  );
};