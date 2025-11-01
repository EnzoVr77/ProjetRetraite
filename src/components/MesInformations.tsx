import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Save } from "lucide-react";

interface Enfant {
    prenom: string;
    nom: string;
    dateNaissance: string;
    adopte: boolean;
    ageAdoption?: number;
}

interface Periode {
    id: number;
    debut: string;
    fin: string;
    trimestres: number;
    salaire: number;
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

    // 💼 Carrière
    const [firstYear, setFirstYear] = useState("");
    const [retirementAge, setRetirementAge] = useState("");
    const [retirementAgePossible, setRetirementAgePossible] = useState("");
    const [periodes, setPeriodes] = useState<Periode[]>([]);
    const [boolReprise, setBoolReprise] = useState(false);
    const [travailChezLeMemeEmployeur, setTravailChezLeMemeEmployeur] = useState(false);
    const [moisDepuisDepartMemeEmployeur, setMoisDepuisDepartMemeEmployeur] = useState(0);
    const [salaireDuCumulTravailRetraite, setSalaireDuCumulTravailRetraite] = useState(0);
    const [salaireMois1, setSalaireMois1] = useState(0);
    const [salaireMois2, setSalaireMois2] = useState(0);
    const [salaireMois3, setSalaireMois3] = useState(0);
    const [boolObtRetrObli, setBoolObtRetrObli] = useState(false);

    // 💾 Charger depuis le localStorage au démarrage
    useEffect(() => {
        const data = localStorage.getItem("mesInfos");
        if (data) {
            const parsed = JSON.parse(data);
            if (parsed.sexe) setSexe(parsed.sexe);
            if (parsed.dateNaissance) setDateNaissance(parsed.dateNaissance);
            if (parsed.enfants) setEnfants(parsed.enfants);
            if (parsed.firstYear) setFirstYear(parsed.firstYear);
            if (parsed.retirementAge) setRetirementAge(parsed.retirementAge);
            if (parsed.retirementAgePossible) setRetirementAgePossible(parsed.retirementAgePossible);
            if (parsed.periodes) setPeriodes(parsed.periodes);
            if (parsed.boolReprise) setBoolReprise(parsed.boolReprise);
            if (parsed.travailChezLeMemeEmployeur) setTravailChezLeMemeEmployeur(parsed.travailChezLeMemeEmployeur);
            if (parsed.moisDepuisDepartMemeEmployeur) setMoisDepuisDepartMemeEmployeur(parsed.moisDepuisDepartMemeEmployeur);
            if (parsed.salaireDuCumulTravailRetraite) setSalaireDuCumulTravailRetraite(parsed.salaireDuCumulTravailRetraite);
            if (parsed.salaireMois1) setSalaireMois1(parsed.salaireMois1);
            if (parsed.salaireMois2) setSalaireMois2(parsed.salaireMois2);
            if (parsed.salaireMois3) setSalaireMois3(parsed.salaireMois3);
            if (parsed.boolObtRetrObli) setBoolObtRetrObli(parsed.boolObtRetrObli);
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

    // Périodes carrière
    const ajouterPeriode = (idSuivant?: number) => {
        const newId = idSuivant ? idSuivant + 1 : periodes.length + 1;
        setPeriodes([...periodes, { id: newId, debut: "", fin: "", trimestres: 0, salaire: 0 }]);
    };

    const updatePeriode = (id: number, data: Partial<Periode>) => {
        setPeriodes(periodes.map(p => p.id === id ? { ...p, ...data } : p));
    };

    const supprimerPeriode = (id: number) => {
        setPeriodes(periodes.filter(p => p.id !== id));
    };

    // ✅ Sauvegarde globale
    const validerDonnees = () => {
        const data = {
            sexe,
            dateNaissance,
            enfants,
            firstYear,
            retirementAge,
            retirementAgePossible,
            periodes,
            boolReprise,
            travailChezLeMemeEmployeur,
            moisDepuisDepartMemeEmployeur,
            salaireDuCumulTravailRetraite,
            salaireMois1,
            salaireMois2,
            salaireMois3,
            boolObtRetrObli,
        };
        localStorage.setItem("mesInfos", JSON.stringify(data));
        alert("✅ Données enregistrées avec succès !");
    };

    const validerEtSauvegarder = () => {
        validerDonnees();
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

                        <div className="bg-gray-50 p-6 rounded-2xl shadow-inner space-y-6">
                            {/* Année de début et date de départ souhaitée */}
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-700 mb-1">Année de début d'activité</label>
                                    <input
                                        type="date"
                                        value={firstYear}
                                        onChange={(e) => setFirstYear(e.target.value)}
                                        className="border rounded-lg p-2 text-center"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-700 mb-1">Date de départ souhaitée</label>
                                    <input
                                        type="date"
                                        value={retirementAge}
                                        onChange={(e) => setRetirementAge(e.target.value)}
                                        className="border rounded-lg p-2 text-center"
                                    />
                                </div>
                            </div>

                            {/* Date de départ possible */}
                            <div className="flex flex-col md:flex-row md:items-center gap-2">
                                <label className="text-sm font-medium text-gray-700">Date de départ possible (carrière longue)</label>
                                <input
                                    type="date"
                                    value={retirementAgePossible}
                                    onChange={(e) => setRetirementAgePossible(e.target.value)}
                                    className="border rounded-lg p-2"
                                />
                            </div>

                            {/* Périodes dynamiques */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-semibold">Périodes de travail (années)</h3>
                                    <button
                                        onClick={() => ajouterPeriode()}
                                        className="inline-flex items-center gap-2 bg-purple-600 text-white px-3 py-1 rounded-md"
                                    >
                                        <Plus size={14} /> Ajouter année
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    {periodes.map((p) => (
                                        <div
                                            key={p.id}
                                            className="bg-white p-3 rounded-xl shadow flex flex-col md:flex-row md:items-center gap-3"
                                        >
                                            <div className="flex-1 grid md:grid-cols-3 gap-2">
                                                <div className="flex flex-col">
                                                    <label className="text-xs text-gray-600">Début</label>
                                                    <input
                                                        type="date"
                                                        value={p.debut}
                                                        onChange={(e) => updatePeriode(p.id, { debut: e.target.value })}
                                                        className="p-2 border rounded"
                                                    />
                                                </div>
                                                <div className="flex flex-col">
                                                    <label className="text-xs text-gray-600">Fin</label>
                                                    <input
                                                        type="date"
                                                        value={p.fin}
                                                        onChange={(e) => updatePeriode(p.id, { fin: e.target.value })}
                                                        className="p-2 border rounded"
                                                    />
                                                </div>
                                                <div className="flex flex-col">
                                                    <label className="text-xs text-gray-600">Trimestres</label>
                                                    <input
                                                        type="number"
                                                        min={0}
                                                        max={4}
                                                        value={p.trimestres}
                                                        onChange={(e) => updatePeriode(p.id, { trimestres: Number(e.target.value) || 0 })}
                                                        className="p-2 border rounded text-center"
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex md:flex-col items-center gap-2">
                                                <button
                                                    onClick={() => ajouterPeriode(p.id)}
                                                    className="px-3 py-1 bg-gray-100 rounded"
                                                >
                                                    + Ajouter Une Année
                                                </button>
                                                <button
                                                    onClick={() => supprimerPeriode(p.id)}
                                                    className="px-3 py-1 bg-red-50 text-red-600 rounded flex items-center gap-2"
                                                >
                                                    <Trash2 size={14} /> Suppr
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Reprise activité & cumul */}
                            <div className="space-y-2">
                                <div className="flex items-center gap-3">
                                    <input
                                        id="boolReprise"
                                        type="checkbox"
                                        checked={boolReprise}
                                        onChange={(e) => setBoolReprise(e.target.checked)}
                                        className="w-5 h-5 accent-purple-600"
                                    />
                                    <label htmlFor="boolReprise" className="text-gray-700">
                                        Souhaitez-vous reprendre une activité après départ ?
                                    </label>
                                </div>

                                {boolReprise && (
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="flex items-center">
                                            <input
                                                id="sameEmployer"
                                                type="checkbox"
                                                checked={travailChezLeMemeEmployeur}
                                                onChange={(e) => setTravailChezLeMemeEmployeur(e.target.checked)}
                                                className="w-5 h-5 accent-purple-600 mr-2"
                                            />
                                            <label htmlFor="sameEmployer">Chez le même employeur ?</label>
                                        </div>

                                        {travailChezLeMemeEmployeur && (
                                            <div className="flex flex-col">
                                                <label className="text-xs text-gray-600">Mois depuis départ (même employeur)</label>
                                                <input
                                                    type="number"
                                                    min={0}
                                                    value={moisDepuisDepartMemeEmployeur}
                                                    onChange={(e) => setMoisDepuisDepartMemeEmployeur(Number(e.target.value) || 0)}
                                                    className="p-2 border rounded w-40"
                                                />
                                            </div>
                                        )}

                                        <div className="flex flex-col">
                                            <label className="text-xs text-gray-600">Salaire cumul travail/retraite (estimation)</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={salaireDuCumulTravailRetraite}
                                                onChange={(e) => setSalaireDuCumulTravailRetraite(Number(e.target.value) || 0)}
                                                className="p-2 border rounded"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Obtention retraites obligatoires */}
                            <div className="flex items-center gap-3">
                                <input
                                    id="boolObtRetrObli"
                                    type="checkbox"
                                    checked={boolObtRetrObli}
                                    onChange={(e) => setBoolObtRetrObli(e.target.checked)}
                                    className="w-5 h-5 accent-purple-600"
                                />
                                <label htmlFor="boolObtRetrObli" className="text-gray-700">
                                    J'ai liquidé toutes mes retraites obligatoires
                                </label>
                            </div>

                            {/* Bouton de sauvegarde */}
                            <div className="pt-4 text-center">
                                <button
                                    onClick={validerEtSauvegarder}
                                    className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition"
                                >
                                    ✅ Valider et enregistrer (localStorage)
                                </button>
                            </div>
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