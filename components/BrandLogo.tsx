import Link from 'next/link';

type BrandLogoProps = {
  href?: string;
  mode?: 'full' | 'compact';
  className?: string;
};

function LogoMonogram({ compact = false }: { compact?: boolean }) {
  const size = compact ? 'h-12 w-12 sm:h-14 sm:w-14' : 'h-16 w-16 sm:h-24 sm:w-24';
  const serifSize = compact ? 'text-4xl sm:text-5xl' : 'text-6xl sm:text-8xl';
  const strokeSize = compact ? 'text-4xl sm:text-5xl' : 'text-6xl sm:text-8xl';

  return (
    <span
      className={`relative isolate flex ${size} items-center justify-center overflow-hidden rounded-full border border-[#D8BE93] bg-[#111111] shadow-[0_12px_28px_rgba(76,60,38,0.14)]`}
      aria-hidden="true"
    >
      <span className={`absolute -translate-x-[0.18em] -translate-y-[0.02em] font-serif ${serifSize} leading-none text-[#D6B166]`}>
        J
      </span>
      <span className={`absolute translate-x-[0.16em] translate-y-[0.02em] font-serif ${strokeSize} leading-none text-[#D6B166]`}>
        S
      </span>
    </span>
  );
}

function BrandWordmark({ compact = false }: { compact?: boolean }) {
  return (
    <span className="flex min-w-0 flex-col">
      <span className={`${compact ? 'text-[9px] tracking-[0.28em] sm:text-[10px] sm:tracking-[0.42em]' : 'text-[10px] tracking-[0.22em] sm:text-xs sm:tracking-[0.48em]'} font-semibold uppercase text-[#A78652]`}>
        JoJo Scentsation
      </span>
      <span className={`${compact ? 'text-[9px] tracking-[0.22em] sm:text-[10px] sm:tracking-[0.34em]' : 'mt-1 text-[10px] tracking-[0.18em] sm:text-xs sm:tracking-[0.42em]'} uppercase text-[#8A7B67]`}>
        Perfume Boutique
      </span>
    </span>
  );
}

export default function BrandLogo({ href = '/', mode = 'full', className = '' }: BrandLogoProps) {
  const compact = mode === 'compact';

  return (
    <Link href={href} className={`flex items-center gap-3 ${className}`}>
      <LogoMonogram compact={compact} />
      <BrandWordmark compact={compact} />
    </Link>
  );
}
