import React, { useState, ChangeEvent } from 'react';
import { MessageSquare, Clock, Activity } from 'lucide-react';

interface ChiefComplaintData {
  complaint: string;
  duration: string;
  painScale: number;
}

export const ChiefComplaintForm: React.FC = () => {
  const [formData, setFormData] = useState<ChiefComplaintData>({
    complaint: 'Demam sejak 2 hari, badan terasa lemas.',
    duration: '2 hari',
    painScale: 2,
  });

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSliderChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, painScale: Number(e.target.value) }));
  };

  // Helper untuk mendapatkan kategori deskripsi nyeri berdasarkan skala NRS
  const getPainCategory = (scale: number): { label: string; color: string } => {
    if (scale === 0) return { label: 'Tidak Nyeri', color: 'text-gray-500 bg-gray-100 border-gray-200' };
    if (scale <= 3) return { label: 'Ringan', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    if (scale <= 6) return { label: 'Sedang', color: 'text-amber-700 bg-amber-50 border-amber-200' };
    if (scale <= 9) return { label: 'Berat', color: 'text-orange-700 bg-orange-50 border-orange-200' };
    return { label: 'Sangat Berat', color: 'text-rose-700 bg-rose-50 border-rose-200' };
  };

  const painCategory = getPainCategory(formData.painScale);

  return (
    <div className="w-full max-w-5xl p-6 bg-white rounded-xl border border-gray-200 shadow-sm font-sans">
      {/* Header Bagian */}
      <div className="flex items-center gap-3 mb-5">
        <span className="flex items-center justify-center w-6 h-6 rounded-md bg-cyan-600 text-white font-bold text-xs">
          B
        </span>
        <h2 className="text-sm font-bold tracking-wider text-gray-800 uppercase">
          Keluhan Utama
        </h2>
      </div>

      <div className="flex flex-col gap-5">
        {/* Input Keluhan Utama & Lama Keluhan */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* TextArea Keluhan Utama (3/4 lebar) */}
          <div className="md:col-span-3 flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-600 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-cyan-500" />
              Keluhan Utama
            </label>
            <textarea
              name="complaint"
              rows={2}
              value={formData.complaint}
              onChange={handleInputChange}
              placeholder="Masukkan keluhan utama pasien..."
              className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 resize-none transition-all"
            />
          </div>

          {/* Input Lama Keluhan (1/4 lebar) */}
          <div className="md:col-span-1 flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-600 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-cyan-500" />
              Lama Keluhan
            </label>
            <input
              type="text"
              name="duration"
              value={formData.duration}
              onChange={handleInputChange}
              placeholder="Contoh: 2 hari"
              className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
            />
          </div>
        </div>

        {/* Input Skala Nyeri (NRS 0-10) */}
        <div className="flex flex-col gap-2 pt-2 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-gray-600 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-cyan-500" />
              Skala Nyeri (NRS 0–10)
            </label>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 bg-gray-50/70 p-4 rounded-xl border border-gray-100">
            {/* Slider Range */}
            <div className="w-full flex-1 flex flex-col gap-1">
              <input
                type="range"
                min="0"
                max="10"
                step="1"
                value={formData.painScale}
                onChange={handleSliderChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-cyan-600"
              />
              
              {/* Mark Teks Skala 0, 2, 4, 6, 8, 10 */}
              <div className="flex justify-between text-[11px] font-semibold text-gray-400 px-1 mt-1">
                <span>0</span>
                <span>2</span>
                <span>4</span>
                <span>6</span>
                <span>8</span>
                <span>10</span>
              </div>
            </div>

            {/* Indicator BoxNilai & Kategori */}
            <div className="flex items-center gap-2 min-w-[130px] justify-end">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-200 bg-white font-bold text-gray-800 text-base shadow-sm">
                {formData.painScale}
              </div>
              <span
                className={`text-xs px-2.5 py-1.5 rounded-md font-semibold border ${painCategory.color}`}
              >
                {painCategory.label}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChiefComplaintForm;