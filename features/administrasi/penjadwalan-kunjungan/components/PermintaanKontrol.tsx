import React from 'react';
import { ClipboardList, ArrowRight } from 'lucide-react';

type ControlRequest = {
  id: string | number;
  patientName: string;
  mrn?: string;
  doctorName: string;
  poli: string;
  recommendedDate: string;
  notes?: string;
};

type DoctorControlRequestSectionProps = {
  requests?: ControlRequest[];
  onSelectRequest?: (request: ControlRequest) => void;
};

export const DoctorControlRequestSection = ({
  requests = [], // Format data: [{ id, patientName, mrn, doctorName, poli, recommendedDate, notes }]
  onSelectRequest,
}: DoctorControlRequestSectionProps) => {
  const pendingCount = requests.length;

  return (
    <div className="bg-amber-50/30 rounded-xl border border-amber-200/80 p-5 shadow-sm space-y-4">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div className="flex items-start gap-3">
          {/* Icon Box */}
          <div className="p-2 bg-amber-100 text-amber-600 rounded-lg shrink-0 mt-0.5">
            <ClipboardList className="w-5 h-5" />
          </div>

          <div>
            <h2 className="text-sm font-bold text-slate-800">
              Permintaan Kontrol dari Dokter
            </h2>
            <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
              Pilih permintaan untuk mengisi pasien, Poli, layanan, tanggal, dan slot tetap dikonfirmasi petugas sebelum jadwal kunjungan disimpan.
            </p>
          </div>
        </div>

        {/* Counter Badge */}
        <div className="self-start shrink-0">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100/80 text-amber-700 border border-amber-200">
            {pendingCount} menunggu
          </span>
        </div>
      </div>

      {/* Content Area (List / Empty State) */}
      <div>
        {pendingCount > 0 ? (
          <div className="space-y-2.5">
            {requests.map((item) => (
              <div
                key={item.id}
                className="p-3.5 bg-white border border-amber-200/60 rounded-xl shadow-sm hover:border-amber-400 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800">{item.patientName}</span>
                    <span className="text-slate-400 font-mono">RM: {item.mrn || '-'}</span>
                  </div>
                  <p className="text-slate-600">
                    <span className="font-medium text-slate-700">Dr. {item.doctorName}</span> • {item.poli}
                  </p>
                  {item.notes && (
                    <p className="text-slate-500 italic bg-amber-50/50 p-1.5 rounded border border-amber-100">
                      "{item.notes}"
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                  <div className="text-right text-xs">
                    <span className="text-slate-400 block text-[11px]">Rencana Kontrol</span>
                    <span className="font-semibold text-amber-700 font-mono">{item.recommendedDate}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onSelectRequest && onSelectRequest(item)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-amber-800 bg-amber-100 hover:bg-amber-200 rounded-lg transition-colors cursor-pointer"
                  >
                    <span>Pilih</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State sesuai Screenshot */
          <div className="bg-white/60 border border-dashed border-amber-200 rounded-lg p-4 text-center">
            <p className="text-xs text-slate-500">
              Tidak ada permintaan penjadwalan yang menunggu.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};