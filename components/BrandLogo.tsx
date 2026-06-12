import Link from 'next/link';

type BrandLogoProps = {
  href?: string;
  mode?: 'full' | 'compact';
  className?: string;
};

function LogoMonogram({ compact = false }: { compact?: boolean }) {
  const outerSize = compact ? 'h-10 w-10' : 'h-12 w-12';
  const letterSize = compact ? 'text-[22px]' : 'text-[27px]';

  return (
    <span
      className={`relative isolate flex ${outerSize} flex-shrink-0 items-center justify-center rounded-full bg-surface border border-gold/50 shadow-sm`}
      aria-hidden="true"
    >
      {/* J — anchored left */}
      <span
        className={`absolute font-serif ${letterSize} leading-none select-none`}
        style={{ color: '#C9A85C', transform: 'translateX(-0.28em) translateY(0.04em)' }}
      >
        J
      </span>
      {/* S — anchored right, slightly dimmer for depth */}
      <span
        className={`absolute font-serif ${letterSize} leading-none select-none`}
        style={{ color: 'rgba(201,168,92,0.72)', transform: 'translateX(0.22em) translateY(-0.04em)' }}
      >
        S
      </span>
    </span>
  );
}

function BrandWordmark({ compact = false }: { compact?: boolean }) {
  return (
    <span className="flex min-w-0 flex-col leading-none">
      <span
        className={`font-sans font-semibold uppercase ${compact ? 'text-[9px]' : 'text-[10px]'}`}
        style={{ letterSpacing: '0.38em', color: '#C9A85C' }}
      >
        Jojo Scentsation
      </span>
      <span
        className={`font-sans uppercase mt-[3px] ${compact ? 'text-[7px]' : 'text-[8px]'}`}
        style={{ letterSpacing: '0.30em', color: 'rgba(201,168,92,0.42)' }}
      >
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
