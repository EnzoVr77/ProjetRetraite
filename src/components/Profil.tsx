export default function Profil() {
    const user = {
        nom: "Dupont",
        prenom: "Jean",
        email: "jean.dupont@example.com",
        dateNaissance: "15/06/1964",
        statut: "Retraité",
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-10 flex flex-col items-center">
            <h1 className="text-4xl font-extrabold text-blue-900 mb-10 text-center">
                👤 Mon Profil
            </h1>

            <div className="bg-white shadow-2xl rounded-[2rem] p-10 w-full max-w-4xl space-y-8">
                {/* Informations personnelles */}
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 shadow-inner space-y-4">
                    <h2 className="text-2xl font-semibold text-gray-800">Informations personnelles</h2>
                    <p><strong>Nom :</strong> {user.nom}</p>
                    <p><strong>Prénom :</strong> {user.prenom}</p>
                    <p><strong>Email :</strong> {user.email}</p>
                    <p><strong>Date de naissance :</strong> {user.dateNaissance}</p>
                    <p><strong>Statut :</strong> {user.statut}</p>
                </div>

                {/* Paramètres / actions */}
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-inner space-y-4">
                    <h2 className="text-2xl font-semibold text-gray-800">Paramètres</h2>
                    <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition">
                        Modifier mes informations
                    </button>
                </div>
            </div>
        </div>
    );
}