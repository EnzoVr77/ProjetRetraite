import { Link } from "react-router-dom";

export default function Navbar() {
    return (
        <nav className="bg-white shadow-md rounded-b-3xl px-8 py-4">
            <div className="flex items-center justify-between">
                {/* Logo + Accueil */}
                <div className="flex items-center space-x-8">
                    {/* Logo */}
                    <div className="flex items-center space-x-2 select-none">
                        <div className="bg-gray-900 text-white font-extrabold text-2xl w-10 h-10 flex items-center justify-center rounded-lg shadow-sm">
                            R
                        </div>
                        <span className="font-bold text-lg text-gray-800 tracking-tight">
                            Retraite+
                        </span>
                    </div>

                    {/* Accueil */}
                    <Link
                        to="/"
                        className="text-gray-800 text-sm font-semibold hover:text-purple-600 transition-colors"
                    >
                        Accueil
                    </Link>

                    {/* MaRetraite */}
                    <Link
                        to="/ma-retraite"
                        className="text-gray-800 text-sm font-semibold hover:text-purple-600 transition-colors"
                    >
                        Ma Retraite
                    </Link>
                </div>

                {/* Profil */}
                <Link
                    to="/profil"
                    className="text-gray-800 text-sm font-semibold border px-4 py-2 rounded-lg hover:text-purple-600 hover:border-purple-600 transition-all"
                >
                    Profil
                </Link>
            </div>
        </nav>
    );
}