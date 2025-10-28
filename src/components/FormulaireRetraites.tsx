interface Props {
    valeurs: any;
    onChange: (nom: string, valeur: any) => void;
}

export default function FormulaireRetraite({ valeurs, onChange }: Props) {
    return (
        <div className="bg-gray-50 p-6 rounded-lg shadow-sm max-w-2xl mx-auto">
            <h1 className="text-4xl font-extrabold mb-10 text-gray-700 text-center">
                Simulateur De Retraite
            </h1>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Informations retraite</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex flex-col text-sm text-gray-700">
                    Année de naissance
                    <input
                        type="number"
                        value={valeurs.anneeNaissance}
                        onChange={(e) => onChange("anneeNaissance", parseInt(e.target.value))}
                        className="mt-1 border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                        placeholder="ex. 1980"
                    />
                </label>

                <label className="flex flex-col text-sm text-gray-700">
                    Âge de départ (ans)
                    <input
                        type="number"
                        value={valeurs.ageDepart}
                        onChange={(e) => onChange("ageDepart", parseInt(e.target.value))}
                        className="mt-1 border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                        placeholder="ex. 62"
                    />
                </label>

                <label className="flex flex-col text-sm text-gray-700">
                    Salaire annuel moyen (SAM)
                    <input
                        type="number"
                        value={valeurs.sam}
                        onChange={(e) => onChange("sam", parseFloat(e.target.value))}
                        className="mt-1 border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                        placeholder="ex. 26000"
                    />
                </label>

                <label className="flex flex-col text-sm text-gray-700">
                    Trimestres validés (cotisés + assimilés)
                    <input
                        type="number"
                        value={valeurs.trimestresAcquis}
                        onChange={(e) => onChange("trimestresAcquis", parseInt(e.target.value))}
                        className="mt-1 border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                        placeholder="ex. 169"
                    />
                </label>
            </div>
        </div>
    );
}