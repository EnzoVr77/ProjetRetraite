import {type ResultatRetraite, PASS_MENSUEL } from "../utils/calculRetraite";

interface Props {
    resultat: ResultatRetraite;
}

export default function ResultatRetraite({ resultat }: Props) {
    const {
        pensionMensuelleNette,
        pensionMensuelleBrute,
        ecartTrimestres,
        ageLegal,
        trimestresRequis,
        surcoteTrimestres,
    } = resultat;

    let message = "";
    if (ecartTrimestres < 0) message = `⚠️ Il manque ${Math.abs(ecartTrimestres)} trimestre(s) pour le taux plein.`;
    else if (ecartTrimestres === 0) message = "✅ Taux plein atteint.";
    else message = `💪 ${ecartTrimestres} trimestre(s) supplémentaires (+${surcoteTrimestres} pris en compte pour surcote).`;

    return (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg text-center">
            <p className="text-lg font-semibold text-blue-900 mb-2">{message}</p>
            <p className="text-gray-700">
                Pension nette estimée :{" "}
                <span className="font-bold text-blue-800">
          {pensionMensuelleNette.toFixed(2)} € / mois
        </span>
            </p>
            <p className="text-sm text-gray-500 mt-2">
                (Brut : {pensionMensuelleBrute.toFixed(2)} € / mois — Âge légal : {ageLegal} ans —{" "}
                Trimestres requis : {trimestresRequis})
            </p>
            <p className="text-xs text-gray-400 mt-1">
                ⚖️ Pension plafonnée à 50 % du PASS ({PASS_MENSUEL.toLocaleString()} €/mois) + surcote éventuelle.
            </p>
        </div>
    );
}