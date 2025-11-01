import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Save } from "lucide-react";

interface Enfant {
    prenom: string;
    nom: string;
    dateNaissance: string;
    adopte: boolean;
    ageAdoption?: number;
}

type Onglet = "infos" | "enfants" | "carriere";

export default function MesInformations() {
    const [ongletActif, setOngletActif] = useState<Onglet>("infos");

    // 🧍 Infos perso
    const [sexe, setSexe] = useState("Femme");
    const [dateNaissance, setDateNaissance] = useState("1960-08-08");

    // 👶 Enfants
    const [enfants, setEnfants] = useState<Enfant[]>([]);
    const [nouvelEnfant, setNouvelEnfant] = useState<Enfant>({
        prenom: "",
        nom: "",
        dateNaissance: "",
        adopte: false,
        ageAdoption: undefined,
    });

    // 💾 Charger depuis le localStorage au démarrage
    useEffect(() => {
        const data = localStorage.getItem("mesInfos");
        if (data) {
            const { sexe, dateNaissance, enfants } = JSON.parse(data);
            if (sexe) setSexe(sexe);
            if (dateNaissance) setDateNaissance(dateNaissance);
            if (enfants) setEnfants(enfants);
        }
    }, []);

    // ➕ Ajouter / modifier enfant
    const ajouterEnfant = () => {
        if (!nouvelEnfant.prenom || !nouvelEnfant.nom || !nouvelEnfant.dateNaissance) return;
        setEnfants([...enfants, nouvelEnfant]);
        setNouvelEnfant({ prenom: "", nom: "", dateNaissance: "", adopte: false });
    };

    const modifierEnfant = (index: number) => {
        const enfant = enfants[index];
        setNouvelEnfant(enfant);
        setEnfants(enfants.filter((_, i) => i !== index));
    };

    const supprimerEnfant = (index: number) => {
        setEnfants(enfants.filter((_, i) => i !== index));
    };

    // ✅ Sauvegarde (persistance)
    const validerDonnees = () => {
        const data = { sexe, dateNaissance, enfants };
        localStorage.setItem("mesInfos", JSON.stringify(data));
        alert("✅ Données enregistrées avec succès !");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col items-center pt-24 p-6">
            <div className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-4xl space-y-10">

                {/* 🧭 Onglets */}
                <div className="flex justify-center space-x-4 border-b pb-4 mb-8">
                    {[
                        { id: "infos", label: "🧍 Informations personnelles" },
                        { id: "enfants", label: "👶 Enfants" },
                        { id: "carriere", label: "💼 Carrière" },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setOngletActif(tab.id as Onglet)}
                            className={`px-4 py-2 rounded-full font-medium transition ${
                                ongletActif === tab.id
                                    ? "bg-purple-600 text-white shadow-lg"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* -------------------- 🧍 Informations personnelles -------------------- */}
                {ongletActif === "infos" && (
                    <section>
                        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                            🧍 Informations personnelles
                        </h2>

                        <div className="bg-gray-50 p-6 rounded-2xl shadow-inner grid md:grid-cols-2 gap-4">
                            {/* Nom */}
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700 mb-1">Nom</label>
                                <input
                                    type="text"
                                    className="border rounded-lg p-2 text-center"
                                    placeholder="Dupont"
                                />
                            </div>

                            {/* Prénom */}
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700 mb-1">Prénom</label>
                                <input
                                    type="text"
                                    className="border rounded-lg p-2 text-center"
                                    placeholder="Jean"
                                />
                            </div>

                            {/* Sexe */}
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700 mb-1">Sexe</label>
                                <select className="border rounded-lg p-2 text-center">
                                    <option>Femme</option>
                                    <option>Homme</option>
                                    <option>Autre</option>
                                </select>
                            </div>

                            {/* Date de naissance */}
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700 mb-1">
                                    Date de naissance
                                </label>
                                <input
                                    type="date"
                                    className="border rounded-lg p-2 text-center"
                                    defaultValue="1960-08-08"
                                />
                            </div>

                            {/* Situation de handicap */}
                            <div className="flex flex-col md:col-span-2 mt-2">
                                <label className="text-sm font-medium text-gray-700 mb-2">
                                    Situation de handicap
                                </label>
                                <div className="flex items-center justify-center space-x-3">
                                    <input
                                        id="handicape"
                                        type="checkbox"
                                        className="w-5 h-5 accent-purple-600"
                                    />
                                    <label htmlFor="handicape" className="text-gray-700">
                                        Je suis reconnu(e) en situation de handicap
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Bouton valider pour persistance */}
                        <div className="flex justify-center mt-6">
                            <button
                                onClick={() => alert("Informations enregistrées ✅")}
                                className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition"
                            >
                                ✅ Valider mes informations
                            </button>
                        </div>
                    </section>
                )}

                {/* -------------------- 👶 Enfants -------------------- */}
                {ongletActif === "enfants" && (
                    <section>
                        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">👶 Enfants</h2>

                        <div className="bg-gray-50 p-6 rounded-2xl shadow-inner space-y-6">
                            {enfants.length === 0 ? (
                                <p className="text-gray-600 text-center">Aucun enfant enregistré.</p>
                            ) : (
                                <ul className="space-y-3">
                                    {enfants.map((e, i) => (
                                        <li
                                            key={i}
                                            className="bg-white p-4 rounded-xl shadow flex flex-col md:flex-row justify-between items-center"
                                        >
                                            <div className="text-center md:text-left">
                                                <p className="font-semibold text-gray-800">
                                                    {e.prenom} {e.nom}
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    <span className="font-medium">Date de naissance :</span>{" "}
                                                    {e.dateNaissance}
                                                    <br />
                                                    {e.adopte && (
                                                        <span>
                                                            <span className="font-medium">Adopté(e) à :</span>{" "}
                                                            {e.ageAdoption} ans
                                                        </span>
                                                    )}
                                                </p>
                                            </div>
                                            <div className="flex items-center space-x-3 mt-2 md:mt-0">
                                                <Pencil
                                                    className="text-purple-600 cursor-pointer"
                                                    size={20}
                                                    onClick={() => modifierEnfant(i)}
                                                />
                                                <Trash2
                                                    className="text-red-500 cursor-pointer"
                                                    size={20}
                                                    onClick={() => supprimerEnfant(i)}
                                                />
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}

                            {/* Formulaire ajout enfant */}
                            <div className="border-t pt-4 mt-4 space-y-3">
                                <h3 className="font-semibold mb-2 text-gray-700 text-center">
                                    Ajouter / Modifier un enfant
                                </h3>
                                <div className="grid md:grid-cols-4 gap-4 items-end">
                                    <div className="flex flex-col">
                                        <label className="text-sm font-medium text-gray-700 mb-1">
                                            Prénom
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Prénom"
                                            value={nouvelEnfant.prenom}
                                            onChange={(e) =>
                                                setNouvelEnfant({ ...nouvelEnfant, prenom: e.target.value })
                                            }
                                            className="p-2 border rounded-lg"
                                        />
                                    </div>

                                    <div className="flex flex-col">
                                        <label className="text-sm font-medium text-gray-700 mb-1">
                                            Nom
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Nom"
                                            value={nouvelEnfant.nom}
                                            onChange={(e) =>
                                                setNouvelEnfant({ ...nouvelEnfant, nom: e.target.value })
                                            }
                                            className="p-2 border rounded-lg"
                                        />
                                    </div>

                                    <div className="flex flex-col">
                                        <label className="text-sm font-medium text-gray-700 mb-1">
                                            Date de naissance
                                        </label>
                                        <input
                                            type="date"
                                            value={nouvelEnfant.dateNaissance}
                                            onChange={(e) =>
                                                setNouvelEnfant({
                                                    ...nouvelEnfant,
                                                    dateNaissance: e.target.value,
                                                })
                                            }
                                            className="p-2 border rounded-lg"
                                        />
                                    </div>

                                    <div className="flex flex-col justify-end">
                                        <label className="text-sm font-medium text-gray-700 mb-1">
                                            Adopté
                                        </label>
                                        <div className="flex items-center space-x-3 h-[42px]">
                                            <input
                                                type="checkbox"
                                                checked={nouvelEnfant.adopte}
                                                onChange={(e) =>
                                                    setNouvelEnfant({
                                                        ...nouvelEnfant,
                                                        adopte: e.target.checked,
                                                    })
                                                }
                                                className="w-5 h-5 accent-purple-600"
                                            />
                                            {nouvelEnfant.adopte && (
                                                <input
                                                    type="number"
                                                    placeholder="Âge adoption"
                                                    className="p-2 border rounded-lg w-28"
                                                    value={nouvelEnfant.ageAdoption || ""}
                                                    onChange={(e) =>
                                                        setNouvelEnfant({
                                                            ...nouvelEnfant,
                                                            ageAdoption:
                                                                parseInt(e.target.value) || undefined,
                                                        })
                                                    }
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={ajouterEnfant}
                                    className="mt-4 w-full flex items-center justify-center bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
                                >
                                    <Plus size={18} className="mr-2" />{" "}
                                    {nouvelEnfant.prenom ? "Enregistrer l'enfant" : "Ajouter un enfant"}
                                </button>
                            </div>
                        </div>
                    </section>
                )}

                {/* -------------------- 💼 Carrière -------------------- */}
                {ongletActif === "carriere" && (
                    <section>
                        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                            💼 Carrière
                        </h2>
                        <div className="bg-gray-50 p-6 rounded-2xl shadow-inner text-center text-gray-600">
                            Bientôt : saisissez vos années de travail, régimes, et salaires.
                        </div>
                    </section>
                )}

                {/* Bouton global de validation */}
                <div className="pt-8 text-center">
                    <button
                        onClick={validerDonnees}
                        className="flex mx-auto items-center bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition"
                    >
                        <Save size={20} className="mr-2" />
                        Valider et enregistrer mes données
                    </button>
                </div>
            </div>
        </div>
    );
}