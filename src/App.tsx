import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import FormulaireRetraite from "./components/FormulaireRetraites.tsx";
import ResultatRetraite from "./components/ResultatRetraite";
import DetailsCalcul from "./components/DetailsCalcul";
import Profil from "./components/Profil";
import { calculerRetraite } from "./utils/calculRetraite";
import { useState } from "react";

function Simulateur() {
    const [valeurs, setValeurs] = useState({
        anneeNaissance: 1964,
        ageDepart: 64,
        sam: 26000,
        trimestresAcquis: 169,
    });

    const [afficherDetails, setAfficherDetails] = useState(false);

    const resultat = calculerRetraite(valeurs);

    function handleChange(nom: string, valeur: unknown) {
        setValeurs({ ...valeurs, [nom]: valeur });
    }

    return (
        <div className="pt-28 min-h-screen flex flex-col items-center bg-gradient-to-br from-blue-50 to-blue-100">
            <div className="bg-white shadow-2xl rounded-[2rem] p-10 w-full max-w-4xl space-y-8">
                {/* Formulaire */}
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 shadow-inner">
                    <FormulaireRetraite valeurs={valeurs} onChange={handleChange} />
                </div>

                {/* Résultat */}
                <div className="bg-white rounded-xl p-6 shadow-md">
                    <ResultatRetraite resultat={resultat} />
                </div>

                {/* Détails */}
                <div className="bg-gray-50 rounded-xl p-6 shadow-inner">
                    <DetailsCalcul
                        resultat={resultat}
                        visible={afficherDetails}
                        onToggle={() => setAfficherDetails(!afficherDetails)}
                    />
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
            </Routes>
        </Router>
    );
}