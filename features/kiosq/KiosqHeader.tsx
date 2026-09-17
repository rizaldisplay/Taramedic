import React from "react";

import { PrinterStatusWidget } from "@/features/kiosq/PrinterStatusWidget";
const INSTITUTION_CONFIG = {
  institutionName: 'Klinik Taramedic',
  institutionAddress: 'Jl. Merdeka No. 10, Jakarta',
  institutionPhone: '031-1234567',
};

export const KiosqHeader = () => {
  return (
    <header className="w-full shrink-0 px-6 py-4 sm:px-10 sm:py-5 border-b border-slate-100 flex justify-between items-center bg-white select-none">
      {/* Brand Logo */}
      <div className="flex items-center gap-3">
        <img
          src="/logo/06%20Taramedic%20Logo%20-%20Biru%20Full%20Horizontal.png"
          alt="Logo Taramedic"
          className="h-8 sm:h-10 lg:h-12 w-auto object-contain cursor-pointer"
        />
      </div>

      {/* Label Kiosk */}
      <div className="flex items-center gap-2">
        <header className="flex w-full max-w-md items-center justify-between rounded-2xl bg-slate-900">
          <PrinterStatusWidget {...INSTITUTION_CONFIG} />
        </header>
      </div>
    </header>
  );
};
