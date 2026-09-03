"use client";

import React, { useState } from "react";
import {
  ChevronLeft,
  RotateCcw,
  User,
  Phone,
  Clock,
  MapPin,
  CreditCard,
  FileText,
  Plus,
  ArrowRight,
  ChevronDown,
} from "lucide-react";

// Import Komponen Skrining
import CPPT from "@/features/pemeriksaan/perawat/components/CPPT";
import SidebarCatatan from '@/features/pemeriksaan/perawat/components/SidebarCatatan';
import FooterTombol from '@/features/pemeriksaan/perawat/components/FooterTombol';


export default function RisikoSkriningPage() {
  const [internalNote, setInternalNote] = useState('');

  return (
    <div className="min-h-screen bg-gray-50/60 p-4 md:p-6 pb-24 md:pb-28 font-sans text-gray-800">
      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT COLUMN: SKRINING FORMS (8 / 12 COLS) */}
          <div className="lg:col-span-9 flex flex-col gap-5">
            {/* CPPT FORM */}
            <CPPT />
          </div>

          {/* RIGHT COLUMN: SIDEBAR INFO & INTERNAL NOTES (4 / 12 COLS) */}
          <SidebarCatatan internalNote={internalNote} setInternalNote={setInternalNote} />
        </div>

      {/* Footer Buttons */}
      <FooterTombol />
    </div>
  );
}