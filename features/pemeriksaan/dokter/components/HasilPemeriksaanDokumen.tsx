import React from "react";
import { Activity, FlaskConical, Scan, ChevronRight } from "lucide-react";

interface ExamItemProps {
  type: "lab" | "radiology";
  title: string;
  subtitle: string;
  date: string;
  isAvailable?: boolean;
  summary: React.ReactNode;
  onDetailClick?: () => void;
}

const ExamItem: React.FC<ExamItemProps> = ({
  type,
  title,
  subtitle,
  date,
  isAvailable = true,
  summary,
  onDetailClick,
}) => {
  const Icon = type === "lab" ? FlaskConical : Scan;

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4 transition-all hover:border-gray-300 md:flex-row md:items-center md:justify-between">
      {/* Left: Icon & Info */}
      <div className="flex items-start space-x-3.5 min-w-[240px]">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-sky-600 border border-sky-100">
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="font-bold text-gray-900 text-sm">{title}</h3>
            {isAvailable && (
              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-600 border border-emerald-100">
                Tersedia
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
          <p className="text-xs text-gray-400 mt-1">{date}</p>
        </div>
      </div>

      {/* Middle: Summary Data */}
      <div className="flex-1 border-t border-gray-100 pt-3 md:border-l md:border-t-0 md:pl-6 md:pt-0">
        {summary}
      </div>

      {/* Right: Action Button */}
      <div className="flex items-center justify-end md:pl-4">
        <button
          onClick={onDetailClick}
          className="flex items-center space-x-1.5 rounded-lg border border-sky-200 bg-white px-3.5 py-1.5 text-xs font-medium text-sky-600 hover:bg-sky-50 transition-colors"
        >
          <span>Lihat Hasil</span>
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};

export const ExamResultsSection: React.FC = () => {
  return (
    <div className="rounded-xl border border-sky-100 bg-sky-50/20 p-5">
      {/* Section Header */}
      <div className="mb-4 flex items-center space-x-2">
        <Activity className="h-5 w-5 text-sky-600" />
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wide text-sky-700">
            Hasil Pemeriksaan
          </h2>
          <p className="text-xs text-gray-500">
            Hasil pemeriksaan penunjang yang terintegrasi.
          </p>
        </div>
      </div>

      {/* Exam Items List */}
      <div className="flex flex-col space-y-3">
        {/* Laboratorium */}
        <ExamItem
          type="lab"
          title="Laboratorium"
          subtitle="Darah Lengkap"
          date="16/08/2026 08:30 WIB"
          summary={
            <div>
              <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-1">
                Ringkasan Hasil
              </span>
              <div className="flex flex-wrap items-center gap-x-3 text-xs text-gray-700">
                <span>
                  Hb <strong className="font-semibold text-gray-900">12.1 g/dL</strong>
                </span>
                <span className="text-gray-300">|</span>
                <span>
                  Leukosit <strong className="font-semibold text-gray-900">8.200 /μL</strong>
                </span>
                <span className="text-gray-300">|</span>
                <span>
                  Trombosit <strong className="font-semibold text-gray-900">250.000 /μL</strong>
                </span>
              </div>
              <button className="mt-1 text-xs text-sky-600 hover:underline">
                Lihat detail hasil
              </button>
            </div>
          }
        />

        {/* Radiologi */}
        <ExamItem
          type="radiology"
          title="Radiologi"
          subtitle="Thorax AP/PA"
          date="16/08/2026 09:00 WIB"
          summary={
            <div>
              <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-1">
                Kesimpulan
              </span>
              <p className="text-xs text-gray-800">
                Tidak tampak kelainan pada paru dan jantung.
              </p>
              <button className="mt-1 text-xs text-sky-600 hover:underline">
                Lihat detail hasil
              </button>
            </div>
          }
        />
      </div>
    </div>
  );
};

export default ExamResultsSection;