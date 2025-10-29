import { useNavigate } from "react-router-dom";

export default function Profil() {
    const navigate = useNavigate();

    const user = {
        nom: "Dupont",
        prenom: "Jean",
        email: "jean.dupont@example.com",
        dateNaissance: "15/06/1964",
        statut: "Retraité",
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 pt-24 p-6 flex flex-col items-center">
            <h1 className="text-4xl font-extrabold text-blue-900 mb-10 text-center">
                👤 Mon Profil
            </h1>

            <div className="bg-white shadow-2xl rounded-[2rem] p-10 w-full max-w-4xl space-y-10">

                {/* Informations personnelles */}
                <section className="bg-gray-50 border border-gray-200 rounded-xl p-6 shadow-inner space-y-4">
                    <h2 className="text-2xl font-semibold text-gray-800 text-center">Informations personnelles</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        <p><strong>Nom :</strong> {user.nom}</p>
                        <p><strong>Prénom :</strong> {user.prenom}</p>
                        <p><strong>Email :</strong> {user.email}</p>
                        <p><strong>Date de naissance :</strong> {user.dateNaissance}</p>
                        <p><strong>Statut :</strong> {user.statut}</p>
                    </div>
                </section>

                {/* Paramètres / actions */}
                <section className="bg-white border border-gray-200 rounded-xl p-6 shadow-inner space-y-4">
                    <h2 className="text-2xl font-semibold text-gray-800 text-center">Paramètres</h2>
                    <button
                        onClick={() => navigate("/mes-informations")}
                        className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition"
                    >
                        Modifier mes informations
                    </button>
                </section>
            </div>
        </div>
    );
}