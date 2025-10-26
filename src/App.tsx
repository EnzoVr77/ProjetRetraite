import FormulaireRetraite from "./components/FormulaireRetraites.tsx";
import ResultatRetraite from "./components/ResultatRetraite";
import DetailsCalcul from "./components/DetailsCalcul";
import { calculerRetraite } from "./utils/calculRetraite";
import {useState} from "react";

export default function App() {
    const [valeurs, setValeurs] = useState({
        anneeNaissance: 1964,
        ageDepart: 64,
        sam: 26000,
        trimestresAcquis: 169,
    });

    const [afficherDetails, setAfficherDetails] = useState(false);

    const resultat = calculerRetraite(valeurs);

    function handleChange(nom: string, valeur: any) {
        setValeurs({ ...valeurs, [nom]: valeur });
    }

    return (
        <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-blue-50 to-blue-100 p-8">
            <h1 className="text-3xl font-bold mb-6 text-blue-900">
                🧮 Simulateur de Retraite (Base Sécu)
            </h1>

            <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-2xl space-y-5">
                <FormulaireRetraite valeurs={valeurs} onChange={handleChange} />
                <ResultatRetraite resultat={resultat} />
                <DetailsCalcul
                    resultat={resultat}
                    visible={afficherDetails}
                    onToggle={() => setAfficherDetails(!afficherDetails)}
                />
            </div>
        </div>
    );
}