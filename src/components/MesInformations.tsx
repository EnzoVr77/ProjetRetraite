import { useState, useEffect } from "react";
import {Plus, Pencil, Trash2, Check} from "lucide-react";
import { useNavigate } from "react-router-dom";

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
    devise?: "EUR" | "FRF";
    valide?: boolean;
}

type Onglet = "infos" | "enfants" | "carriere";

export default function MesInformations() {
    const navigate = useNavigate();
    const [ongletActif, setOngletActif] = useState<Onglet>("infos");

    // Infos perso
    const [nom, setNom] = useState("");
    const [prenom, setPrenom] = useState("");
    const [sexe, setSexe] = useState("Femme");
    const [dateNaissance, setDateNaissance] = useState("1960-08-08");
    const [handicape, setHandicape] = useState(false);
    const [erreursPeriodes, setErreursPeriodes] = useState<{[key:number]: string}>({});


    // Enfants
    const [enfants, setEnfants] = useState<Enfant[]>([]);
    const [nouvelEnfant, setNouvelEnfant] = useState<Enfant>({
        prenom: "",
        nom: "",
        dateNaissance: "",
        adopte: false,
    });

    // Carrière
    const [periodes, setPeriodes] = useState<Periode[]>([]);

    // Chargement initial
    useEffect(() => {
        const data = localStorage.getItem("mesInfos");
        if (data) {
            const parsed = JSON.parse(data);
            if (parsed.nom) setNom(parsed.nom);
            if (parsed.prenom) setPrenom(parsed.prenom);
            if (parsed.sexe) setSexe(parsed.sexe);
            if (parsed.dateNaissance) setDateNaissance(parsed.dateNaissance);
            if (parsed.handicape !== undefined) setHandicape(parsed.handicape);
            if (parsed.enfants) setEnfants(parsed.enfants);
        }

        const storedPeriodes = localStorage.getItem("periodesStockees");
        if (storedPeriodes) {
            try {
                const parsed: Periode[] = JSON.parse(storedPeriodes);
                setPeriodes(parsed);
            } catch {}
        }
    }, []);

    // Sauvegarde globale
    const validerDonnees = () => {
        const data = {
            nom,
            prenom,
            sexe,
            dateNaissance,
            handicape,
            enfants
        };
        localStorage.setItem("mesInfos", JSON.stringify(data));
    };

    // Périodes
    const sauvegarderPeriodes = (updatedPeriodes: Periode[]) => {
        localStorage.setItem("periodesStockees", JSON.stringify(updatedPeriodes));
        setPeriodes(updatedPeriodes);
    };

    const ajouterPeriode = () => {
        const newId = periodes.length === 0 ? 1 : Math.max(...periodes.map(p => p.id)) + 1;
        setPeriodes([...periodes, { id: newId, debut: "", fin: "", trimestres: 0, salaire: 0 }]);
    };

    const updatePeriode = (id: number, data: Partial<Periode>) => {
        const updated = periodes.map(p => p.id === id ? { ...p, ...data } : p);
        setPeriodes(updated);
    };

    const validerPeriode = (id: number) => {
        const periode = periodes.find(p => p.id === id);
        if (!periode) return;

        // 🔄 Conversion FRANC → EURO si nécessaire
        let salaireEuro = periode.salaire;
        if (periode.devise === "FRF") {
            salaireEuro = +(periode.salaire / 6.55957).toFixed(2);
        }

        // On prépare la période avec conversion + validation
        const updatedPeriodes = periodes.map(p =>
            p.id === id
                ? { ...p, salaire: salaireEuro, devise: "EUR", valide: true }
                : p
        );

        // Vérifier chevauchement
        const start = new Date(periode.debut).getTime();
        const end = new Date(periode.fin).getTime();
        const chevauche = updatedPeriodes.some(p => {
            if (p.id === id || !p.debut || !p.fin) return false;
            const pStart = new Date(p.debut).getTime();
            const pEnd = new Date(p.fin).getTime();
            return start <= pEnd && end >= pStart;
        });

        if (chevauche) {
            setErreursPeriodes(prev => ({ ...prev, [id]: "❌ Cette période chevauche une autre période." }));
            return;
        }

        // Vérification trimestres et salaire
        let maxTrimestres = 0;
        if (periode.debut && periode.fin) {
            const months = (new Date(periode.fin).getFullYear() - new Date(periode.debut).getFullYear()) * 12
                + (new Date(periode.fin).getMonth() - new Date(periode.debut).getMonth()) + 1;
            maxTrimestres = Math.floor(months / 3);
        }

        if (periode.trimestres <= 0 || periode.trimestres > maxTrimestres || salaireEuro <= 0) {
            setErreursPeriodes(prev => ({ ...prev, [id]: "❌ Trimestres ou salaire incorrect" }));
            return;
        }

        // Tout ok → sauvegarde
        setErreursPeriodes(prev => ({ ...prev, [id]: "" }));
        sauvegarderPeriodes(updatedPeriodes);
    };

    const supprimerPeriode = (id: number) => {
        const updated = periodes.filter(p => p.id !== id);
        sauvegarderPeriodes(updated);
    };

    // Enfants
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

    const validerEtAllerProfil = () => {
        validerDonnees();
        alert("✅ Informations enregistrées avec succès !");
        navigate("/profil");
    };

    const salairesValides = periodes
        .filter(p => p.valide)
        .map(p => p.salaire);

    salairesValides.sort((a, b) => b - a);

    const top25 = salairesValides.slice(0, 25);

    const samMoyen = top25.length > 0
        ? (top25.reduce((a, b) => a + b, 0) / top25.length).toFixed(2)
        : 0;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col items-center pt-24 p-6">
            <div className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-4xl space-y-10">

                {/* 🧭 Onglets */}
                <div className="flex justify-center space-x-4 border-b pb-4 mb-8">
                    {["infos", "enfants", "carriere"].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setOngletActif(tab as Onglet)}
                            className={`px-4 py-2 rounded-full font-medium transition ${
                                ongletActif === tab
                                    ? "bg-purple-600 text-white shadow-lg"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                        >
                            {tab === "infos" ? "🧍 Infos perso" : tab === "enfants" ? "👶 Enfants" : "💼 Carrière"}
                        </button>
                    ))}
                </div>

                {/* -------------------- 🧍 Infos personnelles -------------------- */}
                {ongletActif === "infos" && (
                    <section>
                        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">🧍 Informations personnelles</h2>
                        <div className="bg-gray-50 p-6 rounded-2xl shadow-inner grid md:grid-cols-2 gap-4">
                            <input type="text" placeholder="Nom" value={nom} onChange={e => setNom(e.target.value)} className="p-2 border rounded-lg text-center"/>
                            <input type="text" placeholder="Prénom" value={prenom} onChange={e => setPrenom(e.target.value)} className="p-2 border rounded-lg text-center"/>
                            <select value={sexe} onChange={e => setSexe(e.target.value)} className="p-2 border rounded-lg text-center">
                                <option>Femme</option>
                                <option>Homme</option>
                                <option>Autre</option>
                            </select>
                            <input type="date" value={dateNaissance} onChange={e => setDateNaissance(e.target.value)} className="p-2 border rounded-lg text-center"/>
                            <div className="md:col-span-2 flex items-center space-x-3">
                                <input id="handicape" type="checkbox" checked={handicape} onChange={e => setHandicape(e.target.checked)} className="w-5 h-5 accent-purple-600"/>
                                <label htmlFor="handicape">Je suis reconnu(e) en situation de handicap</label>
                            </div>
                        </div>
                        <div className="flex justify-center mt-6">
                            <button onClick={validerEtAllerProfil} className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition">
                                ✅ Valider mes informations
                            </button>
                        </div>
                    </section>
                )}

                {/* -------------------- 👶 Enfants -------------------- */}
                {ongletActif === "enfants" && (
                    <section>
                        <h2 className="text-2xl font-bold text-center mb-6">👶 Enfants</h2>
                        <div className="bg-gray-50 p-6 rounded-2xl shadow-inner space-y-6">
                            {enfants.length === 0 ? <p className="text-center text-gray-600">Aucun enfant enregistré.</p> : (
                                <ul className="space-y-3">
                                    {enfants.map((e,i)=>(
                                        <li key={i} className="bg-white p-4 rounded-xl shadow flex justify-between items-center">
                                            <div>{e.prenom} {e.nom} <br/> {e.dateNaissance} {e.adopte && `(Adopté à ${e.ageAdoption} ans)`}</div>
                                            <div className="flex space-x-2">
                                                <Pencil size={20} className="cursor-pointer text-purple-600" onClick={()=>modifierEnfant(i)}/>
                                                <Trash2 size={20} className="cursor-pointer text-red-500" onClick={()=>supprimerEnfant(i)}/>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}

                            <div className="border-t pt-4 mt-4 space-y-3">
                                <div className="grid md:grid-cols-4 gap-4 items-end">
                                    <input type="text" placeholder="Prénom" value={nouvelEnfant.prenom} onChange={e => setNouvelEnfant({...nouvelEnfant, prenom:e.target.value})} className="p-2 border rounded-lg"/>
                                    <input type="text" placeholder="Nom" value={nouvelEnfant.nom} onChange={e => setNouvelEnfant({...nouvelEnfant, nom:e.target.value})} className="p-2 border rounded-lg"/>
                                    <input type="date" value={nouvelEnfant.dateNaissance} onChange={e => setNouvelEnfant({...nouvelEnfant, dateNaissance:e.target.value})} className="p-2 border rounded-lg"/>
                                    <div className="flex flex-col">
                                        <p className="text-sm text-gray-600 mb-1">Adopté</p>
                                        <div className="flex items-center space-x-2">
                                            <input type="checkbox" checked={nouvelEnfant.adopte} onChange={e => setNouvelEnfant({...nouvelEnfant, adopte:e.target.checked})} className="w-5 h-5 accent-purple-600"/>
                                            {nouvelEnfant.adopte && (
                                                <input type="number" placeholder="Âge adoption" value={nouvelEnfant.ageAdoption || ""} onChange={e=>setNouvelEnfant({...nouvelEnfant, ageAdoption:parseInt(e.target.value)||undefined})} className="p-2 border rounded-lg w-28"/>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-3 mt-3">
                                    <button onClick={ajouterEnfant} className="w-full flex items-center justify-center bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition">
                                        <Plus size={18} className="mr-2"/> Ajouter / Enregistrer
                                    </button>
                                    <button onClick={validerEtAllerProfil} className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
                                        ✅ Sauvegarder les enfants
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* -------------------- 💼 Carrière -------------------- */}
                {ongletActif === "carriere" && (
                    <section>
                        <h2 className="text-2xl font-bold text-center mb-6">💼 Carrière</h2>

                        <div className="bg-gray-50 p-6 rounded-2xl shadow-inner space-y-6">

                            {/* -------------------- PÉRIODES -------------------- */}
                            <div className="space-y-4">
                                {periodes.map(p => {
                                    let maxTrimestres = 0;
                                    if (p.debut && p.fin) {
                                        const debut = new Date(p.debut);
                                        const fin = new Date(p.fin);
                                        if (fin >= debut) {
                                            const months = (fin.getFullYear() - debut.getFullYear()) * 12 + (fin.getMonth() - debut.getMonth()) + 1;
                                            maxTrimestres = Math.floor(months / 3);
                                        }
                                    }

                                    const isDisabled = p.valide;

                                    return (
                                        <div key={p.id} className={`bg-white p-4 rounded-xl shadow space-y-3 ${isDisabled ? "bg-gray-100 opacity-70" : ""}`}>
                                            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">

                                                {/* Date début */}
                                                <label className="flex flex-col text-sm">
                                                    <span className="text-xs text-gray-500">Date de début</span>
                                                    <input
                                                        type="date"
                                                        value={p.debut}
                                                        onChange={e => updatePeriode(p.id, { debut: e.target.value })}
                                                        className="p-2 border rounded-lg"
                                                        disabled={isDisabled}
                                                    />
                                                </label>

                                                {/* Date fin */}
                                                <label className="flex flex-col text-sm">
                                                    <span className="text-xs text-gray-500">Date de fin</span>
                                                    <input
                                                        type="date"
                                                        value={p.fin}
                                                        onChange={e => updatePeriode(p.id, { fin: e.target.value })}
                                                        className="p-2 border rounded-lg"
                                                        disabled={isDisabled}
                                                    />
                                                </label>

                                                {/* Trimestres */}
                                                <label className={`flex flex-col text-sm ${isDisabled ? "text-gray-400" : ""}`}>
                                                    <span className="text-xs text-gray-500">Trimestres (0 - {maxTrimestres})</span>
                                                    <input
                                                        type="number"
                                                        min={0}
                                                        max={maxTrimestres}
                                                        value={p.trimestres}
                                                        onChange={e => updatePeriode(p.id, { trimestres: parseInt(e.target.value) || 0 })}
                                                        className={`p-2 border rounded-lg text-center ${p.trimestres <= 0 || p.trimestres > maxTrimestres ? "border-red-500" : ""}`}
                                                        disabled={isDisabled}
                                                    />
                                                </label>

                                                {/* Salaire */}
                                                <label className={`flex flex-col text-sm ${isDisabled ? "text-gray-400" : ""}`}>
                                                    <span className="text-xs text-gray-500">SAM de la période</span>
                                                    <input
                                                        type="number"
                                                        min={0}
                                                        value={p.salaire || ""}
                                                        onChange={e => updatePeriode(p.id, { salaire: parseFloat(e.target.value) || 0 })}
                                                        className={`p-2 border rounded-lg text-center ${p.salaire <= 0 ? "border-red-500" : ""}`}
                                                        disabled={isDisabled}
                                                    />
                                                </label>
                                                {/* Devise */}
                                                <label className="flex flex-col text-sm">
                                                    <span className="text-xs text-gray-500">Devise</span>
                                                    <select
                                                        value={p.devise || "EUR"}
                                                        onChange={e => updatePeriode(p.id, { devise: e.target.value as "EUR" | "FRF" })}
                                                        disabled={isDisabled}
                                                        className="p-2 border rounded-lg"
                                                    >
                                                        <option value="EUR">Euro (€)</option>
                                                        <option value="FRF">Franc (₣)</option>
                                                    </select>
                                                </label>

                                                {/* Actions */}
                                                <div className="flex justify-end gap-2">

                                                    {/* Modifier */}
                                                    <button
                                                        type="button"
                                                        onClick={() => updatePeriode(p.id, { valide: false })}
                                                        className="p-2 rounded-lg hover:bg-gray-100"
                                                        title="Modifier"
                                                    >
                                                        <Pencil size={18} className="text-purple-600" />
                                                    </button>

                                                    {/* Valider */}
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            const erreurs: string[] = [];

                                                            // Conversion FRANC → EURO si nécessaire
                                                            let salaireEuro = p.salaire;
                                                            if (p.devise === "FRF") {
                                                                salaireEuro = +(p.salaire / 6.55957).toFixed(2);
                                                            }

                                                            // Vérifier chevauchement
                                                            const chevauche = periodes.some(other =>
                                                                other.id !== p.id &&
                                                                p.debut && p.fin && other.debut && other.fin &&
                                                                !(new Date(p.fin) < new Date(other.debut) || new Date(p.debut) > new Date(other.fin))
                                                            );
                                                            if (chevauche) erreurs.push("Période chevauche une autre période");

                                                            if (p.trimestres <= 0 || p.trimestres > maxTrimestres)
                                                                erreurs.push("Trimestres incorrects");

                                                            if (!salaireEuro || salaireEuro <= 0)
                                                                erreurs.push("Salaire incorrect");

                                                            if (erreurs.length === 0) {
                                                                const periodeFinale = {
                                                                    ...p,
                                                                    salaire: salaireEuro,
                                                                    devise: "EUR",
                                                                    valide: true
                                                                };

                                                                updatePeriode(p.id, periodeFinale);
                                                                sauvegarderPeriodeLocalStorage(periodeFinale);

                                                                setErreursPeriodes(prev => ({ ...prev, [p.id]: "" }));
                                                            } else {
                                                                setErreursPeriodes(prev => ({ ...prev, [p.id]: erreurs.join(", ") }));
                                                            }
                                                        }}
                                                        className="p-2 rounded-lg hover:bg-green-100"
                                                    >
                                                        <Check size={18} className="text-green-600" />
                                                    </button>

                                                    {/* Supprimer */}
                                                    <button
                                                        type="button"
                                                        onClick={() => supprimerPeriode(p.id)}
                                                        className="p-2 rounded-lg hover:bg-red-100"
                                                        title="Supprimer"
                                                    >
                                                        <Trash2 size={18} className="text-red-600" />
                                                    </button>

                                                </div>
                                            </div>

                                            {/* Erreurs éventuelles */}
                                            {erreursPeriodes[p.id] && (
                                                <p className="text-red-600 text-sm">{erreursPeriodes[p.id]}</p>
                                            )}
                                        </div>
                                    );
                                })}

                                <button
                                    onClick={() => ajouterPeriode()}
                                    className="px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 flex items-center gap-2"
                                >
                                    <Plus size={16} /> Ajouter une période
                                </button>
                            </div>
                            <div className="bg-white p-4 rounded-xl shadow text-center">
                                <h3 className="text-lg font-bold">📊 Salaire annuel moyen (25 meilleures années)</h3>
                                <p className="text-xl text-purple-600 font-semibold mt-2">
                                    {samMoyen} € / an
                                </p>
                            </div>

                        </div>
                    </section>
                )}

            </div>
        </div>
    );
}