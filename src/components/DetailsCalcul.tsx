import { type ResultatRetraite, PASS_ANNUEL } from "../utils/calculRetraite";

interface Props {
    resultat: ResultatRetraite;
    visible: boolean;
    onToggle: () => void;
}

export default function DetailsCalcul({ resultat, visible, onToggle }: Props) {
    return (
        <div className="mt-4 max-w-2xl mx-auto">
            <button
                onClick={onToggle}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-200"
            >
                {visible ? "Masquer le calcul" : "Afficher le calcul détaillé"}
            </button>

            {visible && (
                <div className="mt-3 bg-gray-50 border border-gray-200 p-4 rounded-xl text-sm text-gray-700 space-y-3">
                    <h3 className="font-semibold text-gray-800 mb-2">Informations générales</h3>
                    <p><strong>Âge légal :</strong> {resultat.ageLegal} ans</p>
                    <p><strong>Trimestres requis :</strong> {resultat.trimestresRequis}</p>
                    <p><strong>Trimestres acquis :</strong> {resultat.trimestresRequis + resultat.ecartTrimestres}</p>
                    <p><strong>Surcote prise en compte :</strong> {resultat.surcoteTrimestres}</p>

                    <hr className="border-gray-300" />

                    <h3 className="font-semibold text-gray-800">Détails du calcul</h3>
                    <p><strong>SAM plafonné :</strong> {resultat.samPlafonne.toLocaleString()} €</p>
                    <p><strong>Taux effectif :</strong> {(resultat.tauxEffectif * 100).toFixed(2)} %</p>
                    <p><strong>Ratio trimestres :</strong> {(resultat.ratio * 100).toFixed(2)} %</p>
                    <p><strong>Plafond 50 % PASS annuel :</strong> {(PASS_ANNUEL * 0.5).toLocaleString()} €</p>

                    <hr className="border-gray-300" />

                    <h3 className="font-semibold text-gray-800">Pensions</h3>
                    <p><strong>Pension annuelle brute :</strong> {resultat.pensionAnnuelleBrute.toLocaleString()} €</p>
                    <p><strong>Pension mensuelle brute :</strong> {resultat.pensionMensuelleBrute.toFixed(2)} €</p>
                    <p><strong>Pension mensuelle nette :</strong> {resultat.pensionMensuelleNette.toFixed(2)} €</p>
                </div>
            )}
        </div>
    );
}