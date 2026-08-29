"use client";

import React, { useState } from "react";

import { Check, ShieldCheck, User } from "lucide-react";

interface OptionProps {
  id: "penjamin" | "pasien";
  title: string;
  description: string;
  icon: React.ReactNode;
  selected: boolean;
  disabled?: boolean;
  onClick: () => void;
}

function PaymentOptionCard({
  title,
  description,
  icon,
  selected,
  disabled,
  onClick,
}: OptionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`w-full text-left p-4 rounded-xl border transition-all flex items-start justify-between gap-3 ${
        selected
          ? "border-blue-600 bg-blue-50/40 shadow-sm"
          : "border-slate-200 bg-slate-50/50 opacity-60 cursor-not-allowed"
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`p-2.5 rounded-lg border ${
            selected
              ? "bg-white border-blue-200 text-blue-600"
              : "bg-white border-slate-200 text-slate-400"
          }`}
        >
          {icon}
        </div>
        <div className="space-y-0.5 mt-0.5">
          <h4
            className={`text-[13px] font-bold ${
              selected ? "text-slate-800" : "text-slate-500"
            }`}
          >
            {title}
          </h4>
          <p className="text-xs text-slate-500">{description}</p>
        </div>
      </div>

      {selected && (
        <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 mt-1">
          <Check className="w-3.5 h-3.5 stroke-[3]" />
        </div>
      )}
    </button>
  );
}

export default function MetodePembayaran() {
  const [selectedMethod, setSelectedMethod] = useState<"penjamin" | "pasien">(
    "penjamin"
  );

  return (
    <div className="w-full bg-white border border-slate-200 rounded-xl overflow-hidden font-sans">
      {/* Header Section */}
      <div className="px-5 pt-5 pb-4 border-b border-slate-100">
        <h3 className="text-[13px] font-bold text-slate-800 tracking-wide uppercase">
          METODE PEMBAYARAN
        </h3>
      </div>

      {/* Options List */}
      <div className="p-5 flex flex-col gap-3">
        {/* Opsi 1: Penjamin / BPJS */}
        <PaymentOptionCard
          id="penjamin"
          title="Penjamin / BPJS"
          description="Transaksi ditanggung penuh oleh penjamin."
          icon={<ShieldCheck className="w-5 h-5" />}
          selected={selectedMethod === "penjamin"}
          onClick={() => setSelectedMethod("penjamin")}
        />

        {/* Opsi 2: Pembayaran Pasien */}
        <PaymentOptionCard
          id="pasien"
          title="Pembayaran Pasien"
          description="Tidak ada tanggungan pasien."
          icon={<User className="w-5 h-5" />}
          selected={selectedMethod === "pasien"}
          disabled={true}
          onClick={() => setSelectedMethod("pasien")}
        />
      </div>
    </div>
  );
}