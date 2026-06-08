export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#040406] px-6 py-14 text-sm text-slate-400">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.5fr_1fr_1fr]">
        <div className="space-y-4">
          <p className="text-xl font-semibold uppercase tracking-[0.32em] text-white">JOJOSCENTSATION</p>
          <p className="max-w-md leading-7 text-slate-400">
            A futuristic fragrance boutique blending premium scent stories with elegant retail experiences.
          </p>
          <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Follow us</p>
          <div className="flex items-center gap-4 text-slate-300">
            <a href="#" className="transition hover:text-accent-300">Instagram</a>
            <a href="#" className="transition hover:text-accent-300">TikTok</a>
            <a href="#" className="transition hover:text-accent-300">LinkedIn</a>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Explore</p>
          <ul className="space-y-2 text-slate-300">
            <li>Shop</li>
            <li>New Arrivals</li>
            <li>Testimonials</li>
          </ul>
        </div>

        <div className="space-y-3">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Contact</p>
          <p className="leading-7 text-slate-300">hello@jojoscentstation.com</p>
          <p className="leading-7 text-slate-300">+234 800 000 0000</p>
          <p className="leading-7 text-slate-500">© {new Date().getFullYear()} JoJoScentSation</p>
        </div>
      </div>
    </footer>
  );
}
