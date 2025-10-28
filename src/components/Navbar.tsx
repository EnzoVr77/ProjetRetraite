export default function Navbar() {
  return (
      <nav className="bg-white shadow-md w-full rounded-b-[2rem]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Accueil */}
          <a href="/" className="text-blue-900 font-bold text-xl">
            Accueil
          </a>

          {/* Ma retraite */}
          <a href="/" className="hidden md:flex text-gray-700 font-medium text-lg">
            Ma retraite
          </a>

          {/* Profil */}
          <a href="/profil" className="text-gray-700 font-medium text-lg">
            Profil
          </a>
        </div>
      </nav>
  );
}