export default function Footer() {
  return (
    <footer id="contact" className="border-t border-[#E8DDCB] bg-[#FBF8F2] px-6 py-14 text-sm text-[#61584D]">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.5fr_1fr_1fr]">
        <div className="space-y-4">
          <p className="text-xl font-semibold uppercase tracking-[0.32em] text-[#2D2D2D]">JOJOSCENTSATION</p>
          <p className="max-w-md leading-7 text-[#61584D]">
            A refined perfume boutique blending elevated scent stories with warm, polished retail experiences.
          </p>
          <p className="text-sm uppercase tracking-[0.35em] text-[#8A7B67]">Follow us</p>
          <div className="flex items-center gap-4 text-[#61584D]">
            <a href="#" className="transition hover:text-[#B99867]">Instagram</a>
            <a href="#" className="transition hover:text-[#B99867]">TikTok</a>
            <a href="#" className="transition hover:text-[#B99867]">LinkedIn</a>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-sm uppercase tracking-[0.3em] text-[#8A7B67]">Explore</p>
          <ul className="space-y-2 text-[#61584D]">
            <li>Shop</li>
            <li>New Arrivals</li>
            <li>Testimonials</li>
          </ul>
        </div>

        <div className="space-y-3">
          <p className="text-sm uppercase tracking-[0.3em] text-[#8A7B67]">Contact</p>
          <p className="leading-7 text-[#61584D]">hello@jojoscentstation.com</p>
          <p className="leading-7 text-[#61584D]">+234 800 000 0000</p>
          <p className="leading-7 text-[#8A7B67]">© {new Date().getFullYear()} JoJoScentSation</p>
        </div>
      </div>
    </footer>
  );
}
