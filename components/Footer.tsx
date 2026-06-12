import Link from 'next/link';
import BrandLogo from '@/components/BrandLogo';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer id="contact" className="border-t border-border-subtle bg-background px-6 py-16 text-sm">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.8fr_1fr_1fr]">

        {/* Brand column */}
        <div className="space-y-6">
          <BrandLogo mode="full" className="w-fit" />
          <p className="max-w-sm leading-7 text-[#4A4540]">
            A refined perfume boutique blending elevated scent stories with warm, polished retail experiences.
          </p>
          <div>
            <p className="text-[9px] uppercase tracking-[0.40em] text-[#3A3530] mb-3">Follow us</p>
            <div className="flex flex-wrap items-center gap-5">
              {[
                { label: 'Instagram', href: 'https://instagram.com' },
                { label: 'TikTok', href: 'https://tiktok.com' },
                { label: 'LinkedIn', href: 'https://linkedin.com' }
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] uppercase tracking-[0.28em] text-[#4A4540] transition hover:text-gold"
                >
                  {social.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Explore column */}
        <div className="space-y-4">
          <p className="text-[9px] uppercase tracking-[0.40em] text-[#3A3530]">Explore</p>
          <ul className="space-y-3">
            {[
              { label: 'Shop', href: '/products' },
              { label: 'New Arrivals', href: '/products' },
              { label: 'Testimonials', href: '/#testimonials' }
            ].map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-[11px] uppercase tracking-[0.22em] text-[#4A4540] transition hover:text-gold"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact column */}
        <div className="space-y-4">
          <p className="text-[9px] uppercase tracking-[0.40em] text-[#3A3530]">Contact</p>
          <div className="space-y-3">
            <a
              href="mailto:hello@jojoscentstation.com"
              className="block break-words text-[11px] text-[#4A4540] transition hover:text-gold"
            >
              hello@jojoscentstation.com
            </a>
            <a
              href="tel:+2348000000000"
              className="block text-[11px] text-[#4A4540] transition hover:text-gold"
            >
              +234 800 000 0000
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="mx-auto mt-14 max-w-7xl border-t border-[#141414] pt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[9px] uppercase tracking-[0.35em] text-[#2A2520]">
          © {year} JoJoScentSation. All rights reserved.
        </p>
        <div className="flex gap-5">
          {['Privacy Policy', 'Terms of Service'].map((label) => (
            <a key={label} href="#" className="text-[9px] uppercase tracking-[0.28em] text-[#2A2520] transition hover:text-gold">
              {label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
