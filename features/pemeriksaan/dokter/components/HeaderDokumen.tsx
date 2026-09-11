import React, { useState } from "react";
import { Search, Filter, Plus, ChevronDown } from "lucide-react";

interface SectionHeaderProps {
  title?: string;
  description?: string;
  onSearch?: (value: string) => void;
  onFilterClick?: () => void;
  onAddClick?: () => void;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title = "DOKUMEN & LAMPIRAN",
  description = "Kelola hasil pemeriksaan, persetujuan, dan dokumen eksternal yang relevan dengan kunjungan ini.",
  onSearch,
  onFilterClick,
  onAddClick,
}) => {
  const [searchValue, setSearchValue] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    if (onSearch) onSearch(e.target.value);
  };

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between py-4 px-6 bg-white border-b border-gray-100">
      {/* Title & Subtitle */}
      <div>
        <h1 className="text-lg font-bold uppercase tracking-wide text-gray-900">
          {title}
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">
          {description}
        </p>
      </div>

      {/* Actions: Search, Filter, & Add Button */}
      <div className="flex items-center space-x-3">
        {/* Search Bar */}
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchValue}
            onChange={handleSearchChange}
            placeholder="Cari dokumen..."
            className="w-full rounded-lg border border-gray-200 bg-gray-50/50 py-2 pl-9 pr-3 text-xs text-gray-800 placeholder-gray-400 transition-colors focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-sky-500"
          />
        </div>

        {/* Filter Button */}
        <button
          onClick={onFilterClick}
          className="flex items-center space-x-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <Filter className="h-4 w-4 text-gray-500" />
          <span>Filter</span>
        </button>

        {/* Action Button Dropdown */}
        <div className="relative inline-flex rounded-lg bg-sky-600 p-0.5 text-white hover:bg-sky-700 transition-colors">
          <button
            onClick={onAddClick}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium"
          >
            <Plus className="h-4 w-4" />
            <span>Tambah Lampiran</span>
          </button>
          <div className="w-[1px] bg-sky-500 my-1" />
          <button className="px-2 py-1.5 text-white hover:bg-sky-800/40 rounded-r-lg">
            <ChevronDown className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SectionHeader;