'use client';

interface IllustrationProps {
  type: 'clinic' | 'lock' | 'padlock' | 'envelope' | 'shield';
  className?: string;
}

export function ClinicIllustration({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 320 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Sky */}
      <rect width="320" height="200" fill="#EFF6FF" rx="16" />
      {/* Clouds */}
      <ellipse cx="60" cy="40" rx="30" ry="16" fill="white" opacity="0.9" />
      <ellipse cx="80" cy="35" rx="24" ry="14" fill="white" opacity="0.9" />
      <ellipse cx="45" cy="38" rx="20" ry="12" fill="white" opacity="0.9" />
      <ellipse cx="240" cy="45" rx="28" ry="15" fill="white" opacity="0.9" />
      <ellipse cx="260" cy="40" rx="22" ry="13" fill="white" opacity="0.9" />
      <ellipse cx="225" cy="43" rx="18" ry="11" fill="white" opacity="0.9" />
      {/* Main building */}
      <rect x="90" y="75" width="140" height="110" fill="white" rx="4" />
      <rect x="90" y="75" width="140" height="110" stroke="#BFDBFE" strokeWidth="2" rx="4" />
      {/* Roof */}
      <path d="M82 78 L160 38 L238 78 Z" fill="#2563EB" />
      {/* Cross on roof */}
      <rect x="154" y="45" width="12" height="28" fill="white" rx="2" />
      <rect x="147" y="52" width="26" height="12" fill="white" rx="2" />
      {/* Windows */}
      <rect x="108" y="90" width="28" height="24" fill="#DBEAFE" rx="3" />
      <rect x="108" y="90" width="28" height="24" stroke="#93C5FD" strokeWidth="1.5" rx="3" />
      <rect x="184" y="90" width="28" height="24" fill="#DBEAFE" rx="3" />
      <rect x="184" y="90" width="28" height="24" stroke="#93C5FD" strokeWidth="1.5" rx="3" />
      {/* Window cross bars */}
      <line x1="122" y1="90" x2="122" y2="114" stroke="#93C5FD" strokeWidth="1" />
      <line x1="108" y1="102" x2="136" y2="102" stroke="#93C5FD" strokeWidth="1" />
      <line x1="198" y1="90" x2="198" y2="114" stroke="#93C5FD" strokeWidth="1" />
      <line x1="184" y1="102" x2="212" y2="102" stroke="#93C5FD" strokeWidth="1" />
      {/* Door */}
      <rect x="143" y="130" width="34" height="55" fill="#DBEAFE" rx="3" />
      <rect x="143" y="130" width="34" height="55" stroke="#93C5FD" strokeWidth="1.5" rx="3" />
      <circle cx="173" cy="158" r="2.5" fill="#2563EB" />
      {/* Sign */}
      <rect x="116" y="120" width="88" height="10" fill="#EFF6FF" rx="2" />
      <rect x="116" y="120" width="88" height="10" stroke="#BFDBFE" strokeWidth="1" rx="2" />
      {/* Trees left */}
      <rect x="52" y="140" width="8" height="45" fill="#6B7280" rx="2" />
      <ellipse cx="56" cy="130" rx="22" ry="30" fill="#34D399" />
      <ellipse cx="56" cy="115" rx="16" ry="22" fill="#10B981" />
      {/* Trees right */}
      <rect x="262" y="145" width="8" height="40" fill="#6B7280" rx="2" />
      <ellipse cx="266" cy="135" rx="20" ry="28" fill="#34D399" />
      <ellipse cx="266" cy="120" rx="14" ry="20" fill="#10B981" />
      {/* Small tree right near building */}
      <rect x="240" y="158" width="6" height="27" fill="#6B7280" rx="2" />
      <ellipse cx="243" cy="150" rx="14" ry="18" fill="#34D399" />
      {/* Ground */}
      <rect x="0" y="182" width="320" height="18" fill="#DBEAFE" rx="0" />
      <rect x="0" y="186" width="320" height="14" fill="#BFDBFE" rx="0" />
      {/* Path to door */}
      <rect x="148" y="182" width="24" height="4" fill="#93C5FD" />
      {/* Small bushes */}
      <ellipse cx="100" cy="183" rx="14" ry="8" fill="#6EE7B7" />
      <ellipse cx="220" cy="183" rx="14" ry="8" fill="#6EE7B7" />
    </svg>
  );
}

export function LockIllustration({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Background circle */}
      <circle cx="60" cy="60" r="56" fill="#EFF6FF" />
      {/* Lock body */}
      <rect x="28" y="52" width="64" height="50" fill="#2563EB" rx="10" />
      {/* Lock shackle */}
      <path d="M42 52V38C42 28.6 50 22 60 22C70 22 78 28.6 78 38V52" stroke="#1D4ED8" strokeWidth="8" strokeLinecap="round" fill="none" />
      {/* Keyhole */}
      <circle cx="60" cy="72" r="8" fill="white" opacity="0.9" />
      <rect x="56.5" y="72" width="7" height="14" fill="white" opacity="0.9" rx="2" />
      {/* Sparkles */}
      <circle cx="22" cy="30" r="3" fill="#60A5FA" opacity="0.8" />
      <circle cx="98" cy="25" r="2" fill="#93C5FD" opacity="0.8" />
      <circle cx="105" cy="50" r="2.5" fill="#BFDBFE" opacity="0.9" />
      <circle cx="15" cy="60" r="2" fill="#60A5FA" opacity="0.7" />
      {/* Stars */}
      <path d="M15 28 L16.5 24 L18 28 L22 29.5 L18 31 L16.5 35 L15 31 L11 29.5 Z" fill="#3B82F6" opacity="0.6" />
      <path d="M97 45 L98 42.5 L99 45 L101.5 46 L99 47 L98 49.5 L97 47 L94.5 46 Z" fill="#60A5FA" opacity="0.7" />
    </svg>
  );
}

export function PadlockIllustration({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Glow */}
      <circle cx="70" cy="75" r="50" fill="#DBEAFE" opacity="0.5" />
      {/* Lock body */}
      <rect x="30" y="62" width="80" height="62" fill="#2563EB" rx="12" />
      <rect x="30" y="62" width="80" height="62" stroke="#1D4ED8" strokeWidth="2" rx="12" />
      {/* Shackle */}
      <path d="M47 62V44C47 33.5 56.5 26 70 26C83.5 26 93 33.5 93 44V62" stroke="#1D4ED8" strokeWidth="10" strokeLinecap="round" fill="none" />
      <path d="M47 62V44C47 33.5 56.5 26 70 26C83.5 26 93 33.5 93 44V62" stroke="#3B82F6" strokeWidth="6" strokeLinecap="round" fill="none" />
      {/* Keyhole */}
      <circle cx="70" cy="87" r="9" fill="white" opacity="0.92" />
      <rect x="66" y="87" width="8" height="16" fill="white" opacity="0.92" rx="2" />
      {/* Stars around */}
      <path d="M18 50 L19.8 45 L21.6 50 L27 51.8 L21.6 53.6 L19.8 58.6 L18 53.6 L12.6 51.8 Z" fill="#60A5FA" opacity="0.8" />
      <path d="M115 32 L116.4 28 L117.8 32 L122 33.4 L117.8 34.8 L116.4 38.8 L115 34.8 L110.8 33.4 Z" fill="#3B82F6" opacity="0.7" />
      <circle cx="22" cy="100" r="4" fill="#93C5FD" opacity="0.7" />
      <circle cx="118" cy="70" r="3" fill="#BFDBFE" opacity="0.9" />
      <circle cx="110" cy="110" r="3" fill="#60A5FA" opacity="0.6" />
      {/* Small dots */}
      <circle cx="30" cy="28" r="2" fill="#93C5FD" opacity="0.8" />
      <circle cx="115" cy="100" r="2.5" fill="#60A5FA" opacity="0.7" />
    </svg>
  );
}

export function EnvelopeIllustration({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 140 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Phone body */}
      <rect x="10" y="15" width="72" height="95" fill="#1E3A5F" rx="10" />
      <rect x="14" y="22" width="64" height="78" fill="#DBEAFE" rx="6" />
      {/* Phone speaker */}
      <rect x="30" y="18" width="32" height="4" fill="#2563EB" rx="2" />
      {/* Phone home button area */}
      <rect x="24" y="103" width="44" height="4" fill="#2563EB" rx="2" />
      {/* Screen content: simple grid */}
      <rect x="20" y="30" width="52" height="6" fill="#93C5FD" rx="2" opacity="0.7" />
      <rect x="20" y="42" width="36" height="4" fill="#BFDBFE" rx="2" opacity="0.7" />
      <rect x="20" y="52" width="44" height="4" fill="#BFDBFE" rx="2" opacity="0.7" />
      {/* Envelope */}
      <rect x="78" y="28" width="54" height="38" fill="#2563EB" rx="6" />
      <path d="M78 34 L105 52 L132 34" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* Flying envelope lines */}
      <path d="M98 20 Q108 14 118 20" stroke="#60A5FA" strokeWidth="2" fill="none" strokeDasharray="3 2" />
      <path d="M102 12 Q112 6 122 12" stroke="#93C5FD" strokeWidth="1.5" fill="none" strokeDasharray="3 2" />
      {/* Stars */}
      <circle cx="72" cy="18" r="3" fill="#BFDBFE" opacity="0.9" />
      <circle cx="136" cy="22" r="2.5" fill="#60A5FA" opacity="0.8" />
      <path d="M132 62 L133.5 58 L135 62 L139 63.5 L135 65 L133.5 69 L132 65 L128 63.5 Z" fill="#3B82F6" opacity="0.7" />
    </svg>
  );
}

export default function MedicalIllustration({ type, className }: IllustrationProps) {
  switch (type) {
    case 'clinic': return <ClinicIllustration className={className} />;
    case 'lock': return <LockIllustration className={className} />;
    case 'padlock': return <PadlockIllustration className={className} />;
    case 'envelope': return <EnvelopeIllustration className={className} />;
    default: return <LockIllustration className={className} />;
  }
}
