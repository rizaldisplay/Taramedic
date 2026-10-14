/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { logoutUser } from "@/features/auth/authSlice";
import { AppDispatch } from "@/store";

import {
  ClipboardList,
  Users,
  Activity,
  FileText,
  Calculator,
  LayoutDashboard,
  Pill,
  Database,
  Settings,
  LogOut,
  X,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  UsersRound,
  Stethoscope,
  Tablets,
  User,
  ShieldCheck,
  MapPin,
} from "lucide-react";

interface SubNavItem {
  label: string;
  href: string;
}

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  href?: string;
  subItems?: SubNavItem[];
  onNavClick?: () => void;
  isCollapsed?: boolean;
  onExpandSidebar?: () => void; // Tambahan prop untuk mekar otomatis
}

const NavItem: React.FC<NavItemProps> = ({
  icon: Icon,
  label,
  href,
  subItems,
  onNavClick,
  isCollapsed = false,
  onExpandSidebar,
}) => {
  const pathname = usePathname();
  const hasSubItems = subItems && subItems.length > 0;

  const isParentActive = href ? pathname === href : false;
  const isChildActive = hasSubItems
    ? subItems.some(
        (sub) => pathname === sub.href || pathname.startsWith(`${sub.href}/`),
      )
    : false;

  const isActive = isParentActive || isChildActive;
  const [isOpen, setIsOpen] = useState(isChildActive);

  useEffect(() => {
    if (isChildActive) {
      setIsOpen(true);
    }
  }, [isChildActive]);

  useEffect(() => {
    if (isCollapsed) {
      setIsOpen(false);
    }
  }, [isCollapsed]);

  const handleParentClick = () => {
    if (hasSubItems) {
      if (isCollapsed) {
        if (onExpandSidebar) onExpandSidebar();
        setIsOpen(true);
      } else {
        setIsOpen(!isOpen);
      }
    } else if (onNavClick) {
      onNavClick();
    }
  };

  const ParentContent = (
    <div
      onClick={handleParentClick}
      title={isCollapsed ? label : undefined}
      className={`flex items-center justify-between px-4 py-2.5 rounded-lg cursor-pointer transition-colors mx-2 ${
        isActive
          ? "bg-cyan-50 text-cyan-700 font-medium"
          : "text-slate-600 hover:bg-slate-50"
      } ${isCollapsed ? "justify-center px-0" : ""}`}
    >
      <div
        className={`flex items-center ${isCollapsed ? "justify-center w-full" : ""}`}
      >
        <Icon
          className={`w-5 h-5 shrink-0 ${isActive ? "text-cyan-600" : "text-slate-400"} ${!isCollapsed ? "mr-3" : ""}`}
        />
        {/* Mengganti truncate dengan whitespace-normal dan leading-tight */}
        {!isCollapsed && (
          <span className="text-sm whitespace-normal leading-tight pr-2">
            {label}
          </span>
        )}
      </div>

      {hasSubItems && !isCollapsed && (
        <ChevronDown
          className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${isOpen ? "rotate-180" : ""}`}
        />
      )}
    </div>
  );

  return (
    <div className="flex flex-col mb-1">
      {!hasSubItems && href ? (
        <Link href={href} passHref>
          {ParentContent}
        </Link>
      ) : (
        ParentContent
      )}

      {/* Sub-menu di-render jika tidak collapse dan sedang open */}
      {hasSubItems && !isCollapsed && (
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            isOpen ? "max-h-[1000px] opacity-100 mt-1" : "max-h-0 opacity-0"
          }`}
        >
          {/* Container Submenu dengan relative untuk menahan posisi elemen di dalamnya */}
          <div className="flex flex-col gap-1 mx-2 relative mb-2">
            {/* Opsional: Garis vertikal tipis (Tree-line) untuk mempertegas hierarki */}
            <div
              className="absolute top-2 bottom-4 w-px bg-slate-200 pointer-events-none"
              style={{ left: "26px" }}
              aria-hidden="true"
            />

            {subItems.map((sub, index) => {
              const isSubActive =
                pathname === sub.href || pathname.startsWith(`${sub.href}/`);

              return (
                <Link key={index} href={sub.href} passHref>
                  <div
                    onClick={onNavClick}
                    /* pl-[48px] memastikan teks submenu lurus sempurna dengan teks parent */
                    /* bg-transparent digunakan agar background hover tidak menutupi garis vertikal */
                    className={`relative flex items-start pl-[48px] pr-4 py-2 rounded-lg cursor-pointer transition-colors group ${
                      isSubActive
                        ? "text-cyan-700 font-medium"
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                    }`}
                  >
                    {/* Background aktif khusus agar tidak menimpa tree-line */}
                    {isSubActive && (
                      <div className="absolute inset-0 bg-cyan-50/70 rounded-lg pointer-events-none" />
                    )}

                    {/* Dot Indikator - Berada tepat di tengah garis vertikal & ikon parent */}
                    <div
                      className={`absolute top-[14px] w-1.5 h-1.5 rounded-full z-10 transition-all duration-200 ${
                        isSubActive
                          ? "bg-cyan-500 ring-4 ring-cyan-100"
                          : "bg-slate-300 ring-4 ring-white group-hover:ring-slate-50 group-hover:bg-slate-400"
                      }`}
                      style={{ left: "23px" }}
                    />

                    <span className="relative z-10 text-sm whitespace-normal leading-tight break-words flex-1 mt-0.5">
                      {sub.label}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen = false,
  onClose,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      router.push("/login");
    } catch (error) {
      console.error("Gagal melakukan logout:", error);
      router.push("/login");
    }
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleExpandSidebar = () => {
    setIsCollapsed(false);
  };

  return (
    <>
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden transition-opacity"
        />
      )}

      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          bg-white border-r border-slate-200 
          flex flex-col justify-between flex-shrink-0 min-h-screen
          transform transition-all duration-300 ease-in-out
          ${isOpen ? "translate-x-0 w-64" : "-translate-x-full lg:translate-x-0"}
          ${isCollapsed ? "lg:w-20" : "lg:w-64"}
        `}
      >
        <button
          onClick={toggleSidebar}
          className="hidden lg:flex absolute -right-4 top-8 w-8 h-8 bg-white border border-slate-200 rounded-full items-center justify-center z-50 text-slate-500 hover:text-cyan-600 hover:border-cyan-200 shadow-sm transition-colors cursor-pointer"
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>

        <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar relative">
          <div
            className={`h-16 flex items-center border-b border-slate-100 sticky top-0 bg-white z-10 transition-all duration-300 ${isCollapsed ? "justify-center px-0" : "justify-between px-6"}`}
          >
            <Link
              href="/dashboard"
              className={`flex items-center ${isCollapsed ? "justify-center w-full" : "justify-start w-full"}`}
            >
              {isCollapsed ? (
                <img
                  src="/logo/05%20Taramedic%20Logo%20-%20Biru%20Full%20Main%20Center.png"
                  alt="Logo Taramedic"
                  // h-10 atau h-12 biasanya ukuran paling ideal dan proporsional untuk sidebar w-20 (80px)
                  className="h-10 w-auto object-contain cursor-pointer transition-transform duration-300"
                />
              ) : (
                <img
                  src="/logo/06%20Taramedic%20Logo%20-%20Biru%20Full%20Horizontal.png"
                  alt="Logo Taramedic"
                  className="h-10 w-auto object-contain cursor-pointer transition-transform duration-300"
                />
              )}
            </Link>

            <button
              onClick={onClose}
              className={`lg:hidden text-slate-400 hover:text-slate-600 p-1 rounded-lg transition-colors ${isCollapsed ? "hidden" : "absolute right-4"}`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="p-4 space-y-1">
            {!isCollapsed && (
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2 px-3">
                Menu Utama
              </div>
            )}

            <NavItem
              icon={LayoutDashboard}
              label="Dashboard"
              href="/dashboard"
              onNavClick={onClose}
              isCollapsed={isCollapsed}
              onExpandSidebar={handleExpandSidebar}
            />
            <NavItem
              icon={Users}
              label="Pendaftaran"
              href="/pendaftaran"
              onNavClick={onClose}
              isCollapsed={isCollapsed}
              onExpandSidebar={handleExpandSidebar}
            />

            <NavItem
              icon={ClipboardList}
              label="Antrean"
              subItems={[
                { label: "Poli", href: "/antrean/poli" },
                { label: "Farmasi", href: "/antrean/farmasi" },
                { label: "Kasir", href: "/antrean/kasir" },
                { label: "Mesin Antrean", href: "/kiosq-pendaftaran" },
              ]}
              onNavClick={onClose}
              isCollapsed={isCollapsed}
              onExpandSidebar={handleExpandSidebar}
            />

            <NavItem
              icon={Activity}
              label="EMR"
              subItems={[
                { label: "Perawat", href: "/emr/perawat" },
                { label: "Dokter", href: "/emr/dokter" },
              ]}
              onNavClick={onClose}
              isCollapsed={isCollapsed}
              onExpandSidebar={handleExpandSidebar}
            />

            <NavItem
              icon={Pill}
              label="Farmasi"
              href="/farmasi"
              onNavClick={onClose}
              isCollapsed={isCollapsed}
              onExpandSidebar={handleExpandSidebar}
            />
            <NavItem
              icon={Calculator}
              label="Kasir"
              href="/kasir"
              onNavClick={onClose}
              isCollapsed={isCollapsed}
              onExpandSidebar={handleExpandSidebar}
            />
            <NavItem
              icon={FileText}
              label="Laporan"
              href="/laporan"
              onNavClick={onClose}
              isCollapsed={isCollapsed}
              onExpandSidebar={handleExpandSidebar}
            />

            {!isCollapsed ? (
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2 px-3 mt-6">
                Sistem
              </div>
            ) : (
              <div className="border-t border-slate-200 my-4 mx-2"></div>
            )}

            <NavItem
              icon={UsersRound}
              label="Master Klinis"
              subItems={[
                { label: "Diagnosis", href: "/masterdata/diagnosis" },
                {
                  label: "Kategori Diagnosis",
                  href: "/masterdata/kategori-diagnosis",
                },
                {
                  label: "Referensi Klinis",
                  href: "/masterdata/referensi-klinis",
                },
              ]}
              onNavClick={onClose}
              isCollapsed={isCollapsed}
              onExpandSidebar={handleExpandSidebar}
            />

            <NavItem
              icon={Stethoscope}
              label="Master Layanan & Tindakan"
              subItems={[
                { label: "Layanan", href: "/masterdata/layanan" },
                { label: "Tindakan & Prosedur", href: "/masterdata/tindakan" },
              ]}
              onNavClick={onClose}
              isCollapsed={isCollapsed}
              onExpandSidebar={handleExpandSidebar}
            />

            <NavItem
              icon={Tablets}
              label="Master Farmasi"
              subItems={[
                { label: "Produk Obat / KFA", href: "/masterdata/produk-obat" },
                { label: "Tarif Obat", href: "/masterdata/tarif-obat" },
                {
                  label: "Formularium & Restriksi",
                  href: "/masterdata/formularium",
                },
                { label: "Racikan", href: "/masterdata/racikan" },
                {
                  label: "Signa, Rute & Satuan",
                  href: "/masterdata/signa-rute-satuan",
                },
                { label: "Obat Khusus", href: "/masterdata/obat-khusus" },
              ]}
              onNavClick={onClose}
              isCollapsed={isCollapsed}
              onExpandSidebar={handleExpandSidebar}
            />

            <NavItem
              icon={MapPin}
              label="Master Organisasi"
              subItems={[
                { label: "Unit & Poli", href: "/masterdata/organisasi/unit-poli" },
                {
                  label: "Lokasi Pelayanan",
                  href: "/masterdata/organisasi/lokasi-pelayanan",
                },
                { label: "Loket / Counter", href: "/masterdata/organisasi/loket-counter" },
              ]}
              onNavClick={onClose}
              isCollapsed={isCollapsed}
              onExpandSidebar={handleExpandSidebar}
            />

            <NavItem
              icon={User}
              label="Master SDMK"
              href="/masterdata/sdmk"
              onNavClick={onClose}
              isCollapsed={isCollapsed}
              onExpandSidebar={handleExpandSidebar}
            />

            <NavItem
              icon={ShieldCheck}
              label="Pengguna & Hak Akses"
              href="/masterdata/pengguna-hak-akses"
              onNavClick={onClose}
              isCollapsed={isCollapsed}
              onExpandSidebar={handleExpandSidebar}
            />
            <NavItem
              icon={Settings}
              label="Settings"
              href="/settings"
              onNavClick={onClose}
              isCollapsed={isCollapsed}
              onExpandSidebar={handleExpandSidebar}
            />
          </nav>
        </div>

        <div className="pb-4 shrink-0 bg-white border-t border-slate-100 pt-3">
          <div className="mb-2">
            <div
              onClick={handleLogout}
              title={isCollapsed ? "Logout" : undefined}
              className={`flex items-center px-4 py-2.5 rounded-lg cursor-pointer transition-colors mx-2 text-slate-600 hover:bg-red-50 hover:text-red-600 group ${isCollapsed ? "justify-center px-0" : ""}`}
            >
              <LogOut
                className={`w-5 h-5 group-hover:text-red-500 text-slate-400 transition-colors shrink-0 ${!isCollapsed ? "mr-3" : ""}`}
              />
              {!isCollapsed && (
                <span className="text-sm font-medium">Logout</span>
              )}
            </div>
          </div>

          {!isCollapsed && (
            <div className="px-6 text-xs text-slate-400 transition-opacity duration-300">
              <p>© 2026 Taramedic</p>
              <p className="text-[10px]">v1.0.0</p>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
