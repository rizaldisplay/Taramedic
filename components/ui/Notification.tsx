// components/Notification.tsx
import React from 'react';
import { 
  X, 
  Smile, 
  Frown, 
  AlertCircle, 
  Info, 
  LucideIcon 
} from 'lucide-react';

export type NotificationType = 'default' | 'success' | 'error' | 'warning';

export interface NotificationProps {
  title?: string;
  description: string;
  type?: NotificationType;
  onClose?: () => void;
  className?: string;
}

const typeConfig: Record<NotificationType, { icon: LucideIcon; colorClass: string }> = {
  default: { icon: Info, colorClass: 'text-gray-500' },
  success: { icon: Smile, colorClass: 'text-green-600' },
  error: { icon: Frown, colorClass: 'text-red-600' },
  warning: { icon: AlertCircle, colorClass: 'text-orange-600' },
};

export default function Notification({
  title = 'Notification Title',
  description,
  type = 'default',
  onClose,
  className = '',
}: NotificationProps) {
  const { icon: IconComponent, colorClass } = typeConfig[type];
  const hasIcon = type !== 'default';

  return (
    <div 
      className={`w-80 shadow-2xl rounded-xl bg-white p-4 flex border border-gray-100 transition-all duration-300 transform translate-y-0 ${className}`}
    >
      {hasIcon && (
        <div className="pr-3 flex-shrink-0">
          <IconComponent className={`w-6 h-6 ${colorClass}`} />
        </div>
      )}

      <div className="w-full">
        <div className="text-sm pb-1 font-semibold text-gray-900 flex justify-between items-center">
          <span>{title}</span>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
            aria-label="Close notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="text-xs text-gray-600 tracking-tight leading-relaxed">
          {description}
        </div>
      </div>
    </div>
  );
}