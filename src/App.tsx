import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import FormulaireRetraite from "./components/FormulaireRetraites.tsx";
import ResultatRetraite from "./components/ResultatRetraite";
import DetailsCalcul from "./components/DetailsCalcul";
import MesInformations from "./components/MesInformations";
import Profil from "./components/Profil";
import { calculerRetraite } from "./utils/calculRetraite";
import { useState } from "react";

function Simulateur() {
    const [valeurs, setValeurs] = useState({
        anneeNaissance: 1964,
        ageDepart: 64,
        sam: 26000,
        trimestresAcquis: 169,
        handicape: true
    });

    const [afficherDetails, setAfficherDetails] = useState(false);
    const resultat = calculerRetraite(valeurs);

    function handleChange(nom: string, valeur: unknown) {
        setValeurs({ ...valeurs, [nom]: valeur });
    }

    return (
        <div className="pt-8 min-h-screen flex flex-col items-center bg-gradient-to-br from-blue-50 to-blue-100">
            <div className="bg-white shadow-2xl rounded-[2rem] p-10 w-full max-w-6xl space-y-8">
                {/* Titres principaux centrés */}
                <div className="flex justify-between mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 text-center w-1/2 border-b-4 border-blue-600 pb-2">
                        🧾 Formulaire
                    </h2>
                    <h2 className="text-2xl font-bold text-gray-800 text-center w-1/2 border-b-4 border-purple-600 pb-2">
                        📊 Résultats & Calculs
                    </h2>
                </div>

                {/* Deux colonnes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    {/* Colonne gauche : formulaire */}
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 shadow-inner">
                        <FormulaireRetraite valeurs={valeurs} onChange={handleChange} />
                    </div>

                    {/* Colonne droite : résultats + détails */}
                    <div className="flex flex-col items-center space-y-6">
                        <div className="bg-white rounded-xl p-6 shadow-md w-full text-center">
                            <ResultatRetraite resultat={resultat} />
                        </div>

                        <div className="bg-gray-50 rounded-xl p-6 shadow-inner w-full text-center">
                            <DetailsCalcul
                                resultat={resultat}
                                visible={afficherDetails}
                                onToggle={() => setAfficherDetails(!afficherDetails)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function App() {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<Simulateur />} />
                <Route path="/profil" element={<Profil />} />
                <Route path="/mes-informations" element={<MesInformations />} />
            </Routes>
        </Router>
    );
}