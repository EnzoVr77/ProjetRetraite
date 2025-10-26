import {type ResultatRetraite, PASS_ANNUEL } from "../utils/calculRetraite";

interface Props {
    resultat: ResultatRetraite;
    visible: boolean;
    onToggle: () => void;
}

export default function DetailsCalcul({ resultat, visible, onToggle }: Props) {
    return (
        <div className="mt-4">
            <button
                onClick={onToggle}
                className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-black transition"
            >
                {visible ? "Masquer le calcul" : "Afficher le calcul détaillé"}
            </button>

            {visible && (
                <div className="mt-3 bg-gray-50 p-4 rounded-xl text-sm text-gray-700 space-y-2 text-left">
                    <p><strong>Âge légal :</strong> {resultat.ageLegal} ans</p>
                    <p><strong>Trimestres requis :</strong> {resultat.trimestresRequis}</p>
                    <p><strong>Trimestres acquis :</strong> {resultat.trimestresRequis + resultat.ecartTrimestres}</p>
                    <p><strong>Surcote prise en compte :</strong> {resultat.surcoteTrimestres}</p>
                    <hr />
                    <p><strong>SAM plafonné :</strong> {resultat.samPlafonne.toLocaleString()} €</p>
                    <p><strong>Taux effectif :</strong> {(resultat.tauxEffectif * 100).toFixed(2)} %</p>
                    <p><strong>Ratio trimestres :</strong> {(resultat.ratio * 100).toFixed(2)} %</p>
                    <p><strong>Plafond 50 % PASS annuel :</strong> {(PASS_ANNUEL * 0.5).toLocaleString()} €</p>
                    <hr />
                    <p><strong>Pension annuelle brute :</strong> {resultat.pensionAnnuelleBrute.toLocaleString()} €</p>
                    <p><strong>Pension mensuelle brute :</strong> {resultat.pensionMensuelleBrute.toFixed(2)} €</p>
                    <p><strong>Pension mensuelle nette :</strong> {resultat.pensionMensuelleNette.toFixed(2)} €</p>
                </div>
            )}
        </div>
    );
}