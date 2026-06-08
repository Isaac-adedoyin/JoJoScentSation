import Link from 'next/link';

type BrandLogoProps = {
  href?: string;
  mode?: 'full' | 'compact';
  className?: string;
};

function LogoMonogram({ compact = false }: { compact?: boolean }) {
  const size = compact ? 'h-14 w-14' : 'h-24 w-24';
  const serifSize = compact ? 'text-5xl' : 'text-8xl';
  const strokeSize = compact ? 'text-5xl' : 'text-8xl';

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
    <span className="flex flex-col">
      <span className={`${compact ? 'text-[10px]' : 'text-xs'} font-semibold uppercase tracking-[0.48em] text-[#A78652]`}>
        JoJo Scentsation
      </span>
      <span className={`${compact ? 'text-[10px]' : 'text-xs'} mt-1 uppercase tracking-[0.42em] text-[#8A7B67]`}>
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
