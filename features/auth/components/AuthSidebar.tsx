'use client';

import React from 'react';
import { HeartHandshake, Users, ClipboardPlus, Cloud, ShieldCheck } from 'lucide-react';

const AuthSidebar: React.FC = () => {
  return (
    <div className="hidden lg:flex lg:w-1/2 bg-cyan-600 p-12 text-white flex-col justify-between">
      <div>
        {/* Logo Section */}
        <div className="flex items-center gap-3 mb-12">
          <img
            src="/logo/04%20Taramedic%20Logo%20-%20Full%20Putih%20Horizontal.png"
            alt="Logo Taramedic"
            className="h-25 w-auto object-contain"
          />
        </div>

        {/* Hero Text */}
        <div className="space-y-4 mb-16">
          <p className="text-xs font-semibold uppercase tracking-widest opacity-80">
            Sistem Informasi Manajemen Klinik
          </p>
          <h2 className="text-4xl font-extrabold tracking-tight leading-tight">
            Pelayanan Kesehatan Lebih Mudah, <br />
            <span className="text-blue-200">Lebih Terpercaya</span>
          </h2>
          <p className="text-lg opacity-90 max-w-lg leading-relaxed">
            Solusi digital untuk pengelolaan klinik yang modern, efisien dan terintegrasi dengan ekosistem kesehatan nasional.
          </p>
        </div>

        {/* Feature List */}
        <div className="grid grid-cols-3 gap-6">
          <FeatureCard
            icon={Users}
            title="Manajemen Pasien Terpadu"
            desc="Data pasien aman dan terorganisir"
          />
          <FeatureCard
            icon={ClipboardPlus}
            title="Layanan Medis Komprehensif"
            desc="Rawat jalan, rawat inap, dan IGD terintegrasi"
          />
          <FeatureCard
            icon={Cloud}
            title="Terhubung dengan Satu Sehat & BPJS"
            desc="Integrasi data kesehatan secara nasional"
          />
        </div>
      </div>

      {/* Security Badge */}
      <div className="flex items-center gap-4 p-5 rounded-2xl bg-cyan-500/30 border border-cyan-400/30 mt-12 backdrop-blur-sm">
        <ShieldCheck className="w-10 h-10 text-white flex-shrink-0" strokeWidth={1.5} />
        <div>
          <h4 className="font-semibold text-lg">Keamanan Data Terjamin</h4>
          <p className="text-sm opacity-80">
            Standar ISO Kesehatan & Kepatuhan Regulasi Kementerian Kesehatan RI
          </p>
        </div>
      </div>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  desc: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, desc }) => (
  <div className="flex flex-col items-start gap-3">
    <div className="p-3 rounded-full bg-cyan-500/30 border border-cyan-400/30">
      <Icon className="w-6 h-6 text-white" strokeWidth={2} />
    </div>
    <div>
      <h4 className="font-semibold text-sm mb-1">{title}</h4>
      <p className="text-xs opacity-80 leading-relaxed">{desc}</p>
    </div>
  </div>
);

export default AuthSidebar;