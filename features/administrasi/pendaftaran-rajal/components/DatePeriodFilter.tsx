import { useCallback, useState } from 'react';
import {
  CalendarDays,
  Check,
  ChevronDown,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { standardizeUiLabel } from '@/lib/ui-copy';
export type ListPeriodPreset = 'all' | 'today' | 'last7' | 'last30' | 'custom';

export function DatePeriodFilter({
  preset,
  onPresetChange,
  ariaLabel = 'Periode kunjungan',
  testIdPrefix = 'list-period',
  includeAll = false,
  presetTestId,
  variant = 'select',
  selectedLabel,
  optionTestIdPrefix,
}: {
  preset: ListPeriodPreset;
  onPresetChange: (preset: ListPeriodPreset) => void;
  ariaLabel?: string;
  testIdPrefix?: string;
  includeAll?: boolean;
  presetTestId?: string;
  variant?: 'select' | 'dropdown';
  selectedLabel?: string;
  optionTestIdPrefix?: string | ((preset: ListPeriodPreset) => string);
}) {
  const options: Array<{ value: ListPeriodPreset; label: string }> = [
    ...(includeAll ? [{ value: 'all' as const, label: 'Semua tanggal' }] : []),
    { value: 'today', label: 'Hari ini' },
    { value: 'last7', label: '7 hari terakhir' },
    { value: 'last30', label: '30 hari terakhir' },
    { value: 'custom', label: 'Rentang khusus' },
  ];
  const normalizedOptions = options.map(option => ({ ...option, label: standardizeUiLabel(option.label) }));
  const normalizedAriaLabel = standardizeUiLabel(ariaLabel);
  const activeLabel = selectedLabel ?? normalizedOptions.find(option => option.value === preset)?.label ?? 'Rentang Khusus';

  if (variant === 'dropdown') {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="flex items-center gap-3 px-3 py-2 min-w-[200px] bg-white border border-slate-200 rounded-xl shadow-sm hover:bg-slate-50 transition-colors focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 text-left group"
            aria-label={`${normalizedAriaLabel}, ${activeLabel}`}
            data-testid={presetTestId ?? `${testIdPrefix}-preset`}
          >
            <div className="flex items-center justify-center p-1.5 bg-cyan-50 rounded-lg text-cyan-600 group-hover:bg-cyan-100 transition-colors">
              <CalendarDays size={18} aria-hidden="true" strokeWidth={2.5} />
            </div>
            
            <span className="flex flex-col flex-1">
              <small className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-0.5">
                {normalizedAriaLabel}
              </small>
              <strong title={activeLabel} className="block text-sm font-bold text-slate-900 truncate">
                {activeLabel}
              </strong>
            </span>
            
            <ChevronDown className="text-slate-400 ml-2" size={16} aria-hidden="true" strokeWidth={2.5} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          sideOffset={5}
          className="w-56 bg-white p-1.5 border border-slate-200 rounded-xl shadow-lg"
          aria-label={normalizedAriaLabel}
        >
          {normalizedOptions.map(option => (
            <DropdownMenuItem
              key={option.value}
              className="flex items-center justify-between px-3 py-2.5 text-sm text-slate-700 font-medium cursor-pointer rounded-lg outline-none focus:bg-slate-100 focus:text-slate-900 data-[active=true]:bg-cyan-50 data-[active=true]:text-cyan-700 transition-colors"
              data-active={preset === option.value}
              data-testid={typeof optionTestIdPrefix === 'function'
                ? optionTestIdPrefix(option.value)
                : optionTestIdPrefix
                  ? `${optionTestIdPrefix}-${option.value}`
                  : `${testIdPrefix}-period-${option.value}`}
              onSelect={() => onPresetChange(option.value)}
            >
              <span>{option.label}</span>
              {preset === option.value && <Check size={16} className="text-cyan-600" strokeWidth={2.5} aria-hidden="true" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <label className="flex items-center gap-3 px-3 py-2 min-w-[200px] bg-white border border-slate-200 rounded-xl shadow-sm hover:bg-slate-50 transition-colors focus-within:ring-1 focus-within:ring-cyan-500 focus-within:border-cyan-500 cursor-pointer group">
      <div className="flex items-center justify-center p-1.5 bg-cyan-50 rounded-lg text-cyan-600 group-hover:bg-cyan-100 transition-colors">
        <CalendarDays size={18} aria-hidden="true" strokeWidth={2.5} />
      </div>
      
      <span className="flex flex-col flex-1 relative">
        <small className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-0.5">
          {normalizedAriaLabel}
        </small>
        <div className="relative flex items-center">
          <select
            value={preset}
            onChange={event => onPresetChange(event.target.value as ListPeriodPreset)}
            aria-label={normalizedAriaLabel}
            data-testid={presetTestId ?? `${testIdPrefix}-preset`}
            className="block w-full appearance-none bg-transparent text-sm font-bold text-slate-900 cursor-pointer outline-none border-none p-0 focus:ring-0 z-10"
          >
            {options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
          {/* Chevron kustom pengganti default panah select */}
          <ChevronDown className="absolute right-0 text-slate-400 pointer-events-none z-0" size={16} aria-hidden="true" strokeWidth={2.5} />
        </div>
      </span>
    </label>
  );
}