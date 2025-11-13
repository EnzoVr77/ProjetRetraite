import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface User {
    nom?: string;
    prenom?: string;
    dateNaissance?: string;
    statut?: string;
    handicape?: boolean;
}

export default function Profil() {
    const navigate = useNavigate();
    const [user, setUser] = useState<User>({});

    useEffect(() => {
        const data = localStorage.getItem("mesInfos");
        if (data) {
            const parsed = JSON.parse(data);
            setUser({
                nom: parsed.nom || "",
                prenom: parsed.prenom || "",
                dateNaissance: parsed.dateNaissance || "",
                statut: "Retraité", // par défaut si tu veux
                handicape: parsed.handicape || false,
            });
        }
    }, []);

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
                        <p><strong>Date de naissance :</strong> {user.dateNaissance}</p>
                        <p><strong>Statut :</strong> {user.statut}</p>
                        {user.handicape && <p><strong>Handicap :</strong> Travailleur handicapé ✅</p>}
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