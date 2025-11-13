import { PASS_MENSUEL } from "../utils/calculRetraite";
import FormulaireRetraite from "./FormulaireRetraites.tsx";
import { useState } from "react";

export default function MaRetraite() {
    // 🔹 Valeurs du formulaire
    const [valeurs, setValeurs] = useState({
        retirementAge: "",
        // Tu peux ajouter d'autres champs si besoin
    });

    function handleChange(nom: string, valeur: any) {
        setValeurs({ ...valeurs, [nom]: valeur });
    }

    // 🔹 Valeurs fictives pour test du résultat de retraite
    const resultatMock = {
        pensionMensuelleNette: 1250.75,
        pensionMensuelleBrute: 1500.50,
        ecartTrimestres: -3,
        ageLegal: 64,
        trimestresRequis: 172,
        surcoteTrimestres: 2,
        handicape: true,
    };

    const {
        pensionMensuelleNette,
        pensionMensuelleBrute,
        ecartTrimestres,
        ageLegal,
        trimestresRequis,
        surcoteTrimestres,
        handicape,
    } = resultatMock;

    let message = "";
    let messageColor = "text-gray-800";

    if (ecartTrimestres < 0) {
        message = `⚠️ Il manque ${Math.abs(ecartTrimestres)} trimestre(s) pour le taux plein.`;
        messageColor = "text-orange-600";
    } else if (ecartTrimestres === 0) {
        message = "✅ Taux plein atteint.";
        messageColor = "text-green-600";
    } else {
        message = `💪 ${ecartTrimestres} trimestre(s) supplémentaires (+${surcoteTrimestres} pris en compte pour surcote).`;
        messageColor = "text-blue-600";
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col items-center pt-10 p-6">

            <h1 className="text-4xl font-extrabold mb-10 text-gray-700 text-center">
                Simulateur De Retraite
            </h1>

            {/* Container flex pour aligner Résultat à gauche et Formulaire à droite */}
            <div className="flex flex-col md:flex-row w-full max-w-6xl gap-8">

                {/* Résultat retraite */}
                <div className="flex-1 p-6 bg-gray-50 border border-gray-200 rounded-lg shadow-sm">
                    <p className={`text-lg font-semibold mb-4 ${messageColor}`}>{message}</p>

                    <div className="mb-3">
                        <span className="text-gray-700">Pension nette estimée :</span>{" "}
                        <span className="font-bold text-gray-900">{pensionMensuelleNette.toFixed(2)} € / mois</span>
                    </div>

                    <div className="text-sm text-gray-600 mb-2">
                        (Brut : {pensionMensuelleBrute.toFixed(2)} € / mois — Âge légal : {ageLegal} ans —{" "}
                        Trimestres requis : {trimestresRequis}
                        {handicape ? " — Travailleur handicapé" : ""})
                    </div>

                    <div className="text-xs text-gray-500">
                        ⚖️ Pension plafonnée à 50 % du PASS ({PASS_MENSUEL.toLocaleString()} €/mois) + surcote éventuelle.
                    </div>
                </div>

                {/* Formulaire retraite */}
                <div className="flex-1">
                    <FormulaireRetraite valeurs={valeurs} onChange={handleChange} />
                </div>
            </div>
        </div>
    );
}