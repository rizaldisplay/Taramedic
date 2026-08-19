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
import MorseFallScale from "@/features/pemeriksaan/perawat/components/RisikoJatuh";
import MiniNutritionalAssessment from "@/features/pemeriksaan/perawat/components/SkriningGizi";
import SkriningNyeri from "@/features/pemeriksaan/perawat/components/SkriningNyeri";
import SkriningTB from "@/features/pemeriksaan/perawat/components/SkriningTB";
import SidebarCatatan from '@/features/pemeriksaan/perawat/components/SidebarCatatan';
import FooterTombol from "@/features/pemeriksaan/perawat/components/FooterTombol";

export default function RisikoSkriningPage() {
  const [internalNote, setInternalNote] = useState('');

  return (
    <>
      <div className="min-h-screen bg-gray-50/60 p-4 md:p-6 pb-24 md:pb-28 font-sans text-gray-800">
        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT COLUMN: SKRINING FORMS (8 / 12 COLS) */}
          <div className="lg:col-span-8 space-y-4">
            {/* 1. Morse Fall Scale */}
            <MorseFallScale />

            {/* 2. Mini Nutritional Assessment */}
            <MiniNutritionalAssessment />

            {/* 3. Skrining Nyeri */}
            <SkriningNyeri />

            {/* 4. Skrining TB */}
            <SkriningTB />
          </div>

          {/* RIGHT COLUMN: Sidebar Patient & Visit Info (4 Cols) */}
          <SidebarCatatan internalNote={internalNote} setInternalNote={setInternalNote} />
        </div>

      </div>

      {/* Footer Buttons */}
       <FooterTombol />
    </>
  );
}