import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
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
}

type Onglet = "infos" | "enfants" | "carriere";

export default function MesInformations() {
    const navigate = useNavigate();
    const [ongletActif, setOngletActif] = useState<Onglet>("infos");

    // 🧍 Infos perso
    const [nom, setNom] = useState("");
    const [prenom, setPrenom] = useState("");
    const [sexe, setSexe] = useState("Femme");
    const [dateNaissance, setDateNaissance] = useState("1960-08-08");
    const [handicape, setHandicape] = useState(false);

    // 👶 Enfants
    const [enfants, setEnfants] = useState<Enfant[]>([]);
    const [nouvelEnfant, setNouvelEnfant] = useState<Enfant>({
        prenom: "",
        nom: "",
        dateNaissance: "",
        adopte: false,
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

    // 💾 Chargement au démarrage
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

    // ✅ Sauvegarde globale
    const validerDonnees = () => {
        const data = {
            nom,
            prenom,
            sexe,
            dateNaissance,
            handicape,
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
    };

    // ✅ Validation + redirection
    const validerEtAllerProfil = () => {
        validerDonnees();
        alert("✅ Informations enregistrées avec succès !");
        navigate("/profil");
    };

    // 👶 Gestion des enfants
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

    // 💼 Gestion carrière
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

                {/* -------------------- 🧍 Infos personnelles -------------------- */}
                {ongletActif === "infos" && (
                    <section>
                        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                            🧍 Informations personnelles
                        </h2>
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

                                    {/* Texte "Adopté" au-dessus de la checkbox */}
                                    <div className="flex flex-col">
                                        <p className="text-sm text-gray-600 mb-1">Adopté</p>
                                        <div className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                checked={nouvelEnfant.adopte}
                                                onChange={e=>setNouvelEnfant({...nouvelEnfant, adopte:e.target.checked})}
                                                className="w-5 h-5 accent-purple-600"
                                            />
                                            {nouvelEnfant.adopte && (
                                                <input
                                                    type="number"
                                                    placeholder="Âge adoption"
                                                    value={nouvelEnfant.ageAdoption || ""}
                                                    onChange={e=>setNouvelEnfant({...nouvelEnfant, ageAdoption:parseInt(e.target.value)||undefined})}
                                                    className="p-2 border rounded-lg w-28"
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* --- Boutons --- */}
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
                        <div className="bg-gray-50 p-6 rounded-2xl shadow-inner space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <input type="date" value={firstYear} onChange={e=>setFirstYear(e.target.value)} className="p-2 border rounded-lg text-center"/>
                                <input type="date" value={retirementAge} onChange={e=>setRetirementAge(e.target.value)} className="p-2 border rounded-lg text-center"/>
                            </div>
                            <input type="date" value={retirementAgePossible} onChange={e=>setRetirementAgePossible(e.target.value)} className="p-2 border rounded-lg w-full"/>

                            <div className="space-y-3">
                                {periodes.map(p=>(
                                    <div key={p.id} className="bg-white p-3 rounded-xl shadow flex flex-col md:flex-row gap-2 md:items-center">
                                        <input type="date" value={p.debut} onChange={e=>updatePeriode(p.id,{debut:e.target.value})} className="p-2 border rounded-lg"/>
                                        <input type="date" value={p.fin} onChange={e=>updatePeriode(p.id,{fin:e.target.value})} className="p-2 border rounded-lg"/>
                                        <input type="number" value={p.trimestres} onChange={e=>updatePeriode(p.id,{trimestres:parseInt(e.target.value)||0})} className="p-2 border rounded-lg w-24 text-center"/>
                                        <div className="flex space-x-2">
                                            <button onClick={()=>ajouterPeriode(p.id)} className="px-2 py-1 bg-gray-100 rounded">+ Année</button>
                                            <button onClick={()=>supprimerPeriode(p.id)} className="px-2 py-1 bg-red-50 text-red-600 rounded flex items-center gap-1"><Trash2 size={14}/> Suppr</button>
                                        </div>
                                    </div>
                                ))}
                                <button onClick={()=>ajouterPeriode()} className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 flex items-center gap-2"><Plus size={14}/> Ajouter période</button>
                            </div>

                            <div className="flex items-center gap-2">
                                <input type="checkbox" checked={boolReprise} onChange={e=>setBoolReprise(e.target.checked)} className="w-5 h-5 accent-purple-600"/>
                                <span>Reprendre activité après départ ?</span>
                            </div>

                            {boolReprise && (
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="flex items-center gap-2">
                                        <input type="checkbox" checked={travailChezLeMemeEmployeur} onChange={e=>setTravailChezLeMemeEmployeur(e.target.checked)} className="w-5 h-5 accent-purple-600"/>
                                        <span>Même employeur ?</span>
                                    </div>
                                    {travailChezLeMemeEmployeur && (
                                        <input type="number" value={moisDepuisDepartMemeEmployeur} onChange={e=>setMoisDepuisDepartMemeEmployeur(parseInt(e.target.value)||0)} className="p-2 border rounded-lg w-40"/>
                                    )}
                                    <input type="number" value={salaireDuCumulTravailRetraite} onChange={e=>setSalaireDuCumulTravailRetraite(parseFloat(e.target.value)||0)} className="p-2 border rounded-lg"/>
                                </div>
                            )}

                            <div className="flex items-center gap-2">
                                <input type="checkbox" checked={boolObtRetrObli} onChange={e=>setBoolObtRetrObli(e.target.checked)} className="w-5 h-5 accent-purple-600"/>
                                <span>J'ai liquidé toutes mes retraites obligatoires</span>
                            </div>

                            <div className="pt-4 text-center">
                                <button onClick={validerEtAllerProfil} className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition">✅ Sauvegarder</button>
                            </div>
                        </div>
                    </section>
                )}

            </div>
        </div>
    );
}