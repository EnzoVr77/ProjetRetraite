interface Props {
    valeurs: any;
    onChange: (nom: string, valeur: any) => void;
}

export default function FormulaireRetraite({ valeurs, onChange }: Props) {
    return (
        <div className="grid grid-cols-2 gap-4">
            <label className="flex flex-col text-sm">
                Année de naissance
                <input
                    type="number"
                    value={valeurs.anneeNaissance}
                    onChange={(e) => onChange("anneeNaissance", parseInt(e.target.value))}
                    className="border rounded p-2"
                />
            </label>

            <label className="flex flex-col text-sm">
                Âge de départ (ans)
                <input
                    type="number"
                    value={valeurs.ageDepart}
                    onChange={(e) => onChange("ageDepart", parseInt(e.target.value))}
                    className="border rounded p-2"
                />
            </label>

            <label className="flex flex-col text-sm">
                Salaire annuel moyen (SAM)
                <input
                    type="number"
                    value={valeurs.sam}
                    onChange={(e) => onChange("sam", parseFloat(e.target.value))}
                    className="border rounded p-2"
                    placeholder="ex. 26000"
                />
            </label>

            <label className="flex flex-col text-sm">
                Trimestres validés (cotisés + assimilés)
                <input
                    type="number"
                    value={valeurs.trimestresAcquis}
                    onChange={(e) => onChange("trimestresAcquis", parseInt(e.target.value))}
                    className="border rounded p-2"
                    placeholder="ex. 169"
                />
            </label>
        </div>
    );
}