import React from 'react';
import { Calendar, ArrowRight } from 'lucide-react';

type Schedule = {
  id?: string | number;
  patientName: string;
  poli: string;
  doctorName: string;
  time?: string;
  date?: string;
};

type PatientScheduleSectionProps = {
  todayDate?: string;
  todaySchedules?: Schedule[];
  upcomingSchedules?: Schedule[];
  onSeeAllClick?: () => void;
};

export const PatientScheduleSection = ({
  todayDate = '2026-11-05',
  todaySchedules = [],
  upcomingSchedules = [],
  onSeeAllClick,
}: PatientScheduleSectionProps) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-800">Jadwal Pasien</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Jadwal hari ini dan kunjungan hingga 12 bulan ke depan.
          </p>
        </div>
        <button
          type="button"
          onClick={onSeeAllClick}
          className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-sm self-start sm:self-auto cursor-pointer"
        >
          <span>Lihat Semua Jadwal</span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
        </button>
      </div>

      {/* Grid Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1: Jadwal Hari Ini */}
        <div className="border border-sky-200 rounded-xl p-4 bg-sky-50/20 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-sky-100">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-sky-100 text-sky-600 rounded-lg">
                  <Calendar className="w-4 h-4" />
                </div>
                <span className="text-sm font-semibold text-slate-800">
                  Jadwal Hari Ini - <span className="font-mono text-slate-600">{todayDate}</span>
                </span>
              </div>
              <span className="text-xs font-medium text-sky-700 bg-sky-100/80 px-2.5 py-0.5 rounded-full">
                <strong className="font-bold">{todaySchedules.length}</strong> jadwal
              </span>
            </div>

            {/* List / Empty State */}
            <div className="mt-3">
              {todaySchedules.length > 0 ? (
                <div className="space-y-2">
                  {todaySchedules.map((item, index) => (
                    <div
                      key={item.id || index}
                      className="p-3 bg-white border border-sky-100 rounded-lg shadow-sm text-xs flex justify-between items-center"
                    >
                      <div>
                        <p className="font-semibold text-slate-800">{item.patientName}</p>
                        <p className="text-slate-500">{item.poli} • {item.doctorName}</p>
                      </div>
                      <span className="font-mono bg-sky-50 text-sky-700 px-2 py-1 rounded border border-sky-200 font-medium">
                        {item.time}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-slate-50/80 rounded-lg p-4 text-center">
                  <p className="text-xs text-slate-500">Belum ada jadwal kunjungan hari ini.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Card 2: Jadwal Mendatang */}
        <div className="border border-purple-200 rounded-xl p-4 bg-purple-50/20 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-purple-100">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-purple-100 text-purple-600 rounded-lg">
                  <Calendar className="w-4 h-4" />
                </div>
                <span className="text-sm font-semibold text-slate-800">
                  Jadwal Mendatang
                </span>
              </div>
              <span className="text-xs font-medium text-purple-700 bg-purple-100/80 px-2.5 py-0.5 rounded-full">
                <strong className="font-bold">{upcomingSchedules.length}</strong> jadwal
              </span>
            </div>

            {/* List / Empty State */}
            <div className="mt-3">
              {upcomingSchedules.length > 0 ? (
                <div className="space-y-2">
                  {upcomingSchedules.map((item, index) => (
                    <div
                      key={item.id || index}
                      className="p-3 bg-white border border-purple-100 rounded-lg shadow-sm text-xs flex justify-between items-center"
                    >
                      <div>
                        <p className="font-semibold text-slate-800">{item.patientName}</p>
                        <p className="text-slate-500">{item.poli} • {item.doctorName}</p>
                      </div>
                      <span className="font-mono bg-purple-50 text-purple-700 px-2 py-1 rounded border border-purple-200 font-medium">
                        {item.date}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-purple-50/40 rounded-lg p-4 text-center">
                  <p className="text-xs text-slate-500">Belum ada jadwal kunjungan mendatang.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};