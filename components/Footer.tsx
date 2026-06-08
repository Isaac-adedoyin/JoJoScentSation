export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white px-6 py-8 text-sm text-gray-600">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <span>© {new Date().getFullYear()} JoJoScentSation</span>
        <span>Built for elegant fragrance retail and inventory tracking.</span>
      </div>
    </footer>
  );
}
