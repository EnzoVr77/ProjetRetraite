import { type ResultatRetraite, PASS_MENSUEL } from "../utils/calculRetraite";

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
        handicape,
    } = resultat;

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
        <div className="mt-6 p-6 bg-gray-50 border border-gray-200 rounded-lg shadow-sm max-w-lg mx-auto">
            <p className={`text-lg font-semibold mb-4 ${messageColor}`}>{message}</p>

            <div className="mb-3">
                <span className="text-gray-700">Pension nette estimée :</span>{" "}
                <span className="font-bold text-gray-900">{pensionMensuelleNette.toFixed(2)} € / mois</span>
            </div>

            <div className="text-sm text-gray-600 mb-2">
                (Brut : {pensionMensuelleBrute.toFixed(2)} € / mois — Âge légal : {ageLegal} ans —{" "}
                Trimestres requis : {trimestresRequis}
                {handicape != null && handicape
                    ? " — Travailleur handicapé"
                    : ""})
            </div>

            <div className="text-xs text-gray-500">
                ⚖️ Pension plafonnée à 50 % du PASS ({PASS_MENSUEL.toLocaleString()} €/mois) + surcote éventuelle.
            </div>
        </div>
    );
}