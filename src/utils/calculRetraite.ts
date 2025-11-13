// ----------------------------------------------------
// utilitaire : calcul de la pension de retraite (base régime général)
// - SAM plafonné au PASS
// - Cap à 50 % du PASS, puis ajout éventuel de la surcote
// - Trimestres requis automatiques (non éditables dans l'UI)
// - Surcote calculée automatiquement (âge légal + trimestres en plus)
// - Intégration départ anticipé pour travailleurs handicapés
// ----------------------------------------------------

export const TAUX_PLEIN = 0.5;               // 50 %
export const DECOTE_PAR_TRIMESTRE = 0.00625;  // 0,625 % par trimestre manquant
export const SURCOTE_PAR_TRIMESTRE = 0.0125;  // +1,25 % par trimestre supplémentaire
export const RETENUES_SOCIALES = 0.092;       // CSG/CRDS/CASA simplifié (~9,2 %)

// PASS 2025 (si besoin, rends ces valeurs éditables dans une page "Paramètres")
export const PASS_ANNUEL = 47100;   // €
export const PASS_MENSUEL = 3925;   // €

// Trimestres requis (réforme Touraine simplifiée)
export const TRIMESTRES_REQUIS_PAR_NAISSANCE: Record<number, number> = {
    1960: 167, 1961: 168, 1962: 169, 1963: 170, 1964: 171,
    1965: 172, 1966: 172, 1967: 172, 1968: 172, 1969: 172, 1970: 172,
};

// Âge légal indicatif (simplifié à fins pédagogiques)
export const AGE_LEGAL_PAR_NAISSANCE: Record<number, number> = {
    1960: 62, 1961: 62, 1962: 62.25, 1963: 62.5, 1964: 62.75,
    1965: 63, 1966: 63.25, 1967: 63.5, 1968: 63.75, 1969: 64, 1970: 64,
};

// 🔹 Départs anticipés travailleurs handicapés
export const AGE_DEP_TRIM_HANDI: Record<string | number, any> = {
    "avant-1961-09-01": { annee: 59, mois: 0, trimestres: 68 },
    "1961-09-01_to_1962-12-31": { annee: 59, mois: 0, trimestres: 68 },
    1963: {
        58: { trimestres: 79, mois: 0, annee: 58 },
        59: { trimestres: 68, mois: 0, annee: 59 }
    },
    1964: {
        58: { trimestres: 79, mois: 0, annee: 58 },
        59: { trimestres: 69, mois: 0, annee: 59 }
    },
    1965: {
        57: { trimestres: 89, mois: 0, annee: 57 },
        58: { trimestres: 79, mois: 0, annee: 58 },
        59: { trimestres: 69, mois: 0, annee: 59 }
    },
    1966: {
        56: { trimestres: 99, mois: 0, annee: 56 },
        57: { trimestres: 89, mois: 0, annee: 57 },
        58: { trimestres: 79, mois: 0, annee: 58 },
        59: { trimestres: 69, mois: 0, annee: 59 }
    },
    1967: {
        55: { trimestres: 110, mois: 0, annee: 55 },
        56: { trimestres: 100, mois: 0, annee: 56 },
        57: { trimestres: 90, mois: 0, annee: 57 },
        58: { trimestres: 80, mois: 0, annee: 58 },
        59: { trimestres: 70, mois: 0, annee: 59 }
    },
    1968: {
        55: { trimestres: 110, mois: 0, annee: 55 },
        56: { trimestres: 100, mois: 0, annee: 56 },
        57: { trimestres: 90, mois: 0, annee: 57 },
        58: { trimestres: 80, mois: 0, annee: 58 },
        59: { trimestres: 70, mois: 0, annee: 59 }
    },
    1969: {
        55: { trimestres: 110, mois: 0, annee: 55 },
        56: { trimestres: 100, mois: 0, annee: 56 },
        57: { trimestres: 90, mois: 0, annee: 57 },
        58: { trimestres: 80, mois: 0, annee: 58 },
        59: { trimestres: 70, mois: 0, annee: 59 }
    },
    1970: {
        55: { trimestres: 111, mois: 0, annee: 55 },
        56: { trimestres: 101, mois: 0, annee: 56 },
        57: { trimestres: 91, mois: 0, annee: 57 },
        58: { trimestres: 81, mois: 0, annee: 58 },
        59: { trimestres: 71, mois: 0, annee: 59 }
    },
    1971: {
        55: { trimestres: 111, mois: 0, annee: 55 },
        56: { trimestres: 101, mois: 0, annee: 56 },
        57: { trimestres: 91, mois: 0, annee: 57 },
        58: { trimestres: 81, mois: 0, annee: 58 },
        59: { trimestres: 71, mois: 0, annee: 59 }
    },
    1972: {
        55: { trimestres: 111, mois: 0, annee: 55 },
        56: { trimestres: 101, mois: 0, annee: 56 },
        57: { trimestres: 91, mois: 0, annee: 57 },
        58: { trimestres: 81, mois: 0, annee: 58 },
        59: { trimestres: 71, mois: 0, annee: 59 }
    },
    1973: {
        55: { trimestres: 112, mois: 0, annee: 55 },
        56: { trimestres: 102, mois: 0, annee: 56 },
        57: { trimestres: 92, mois: 0, annee: 57 },
        58: { trimestres: 82, mois: 0, annee: 58 },
        59: { trimestres: 72, mois: 0, annee: 59 }
    }
};

// ----------------------------------------------------
// Interfaces
// ----------------------------------------------------
export interface DonneesRetraite {
    anneeNaissance: number;
    ageDepart: number;          // en années (ex: 64)
    sam: number;                // Salaire Annuel Moyen "brut"
    trimestresAcquis: number;
    handicape?: boolean;        // 🔹 Nouveau : statut travailleur handicapé
}

export interface ResultatRetraite {
    ageLegal: number;
    trimestresRequis: number;
    ecartTrimestres: number;
    surcoteTrimestres: number;
    tauxEffectif: number;
    ratio: number;
    samPlafonne: number;
    pensionAnnuelleBrute: number;
    pensionMensuelleBrute: number;
    pensionMensuelleNette: number;
    handicape: boolean;
}

// helper
const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

// ----------------------------------------------------
// Fonction principale
// ----------------------------------------------------
export function calculerRetraite(d: DonneesRetraite): ResultatRetraite {
    let trimestresRequis = TRIMESTRES_REQUIS_PAR_NAISSANCE[d.anneeNaissance] ?? 172;
    let ageLegal = AGE_LEGAL_PAR_NAISSANCE[d.anneeNaissance] ?? 64;

    // 🔹 Si handicapé, on cherche une entrée spécifique dans AGE_DEP_TRIM_HANDI
    if (d.handicape) {
        const donneesHandi = AGE_DEP_TRIM_HANDI[d.anneeNaissance];
        if (donneesHandi) {
            // On prend le plus bas âge possible (le départ le plus précoce)
            const agesPossibles = Object.keys(donneesHandi).map(a => Number(a));
            const ageMin = Math.min(...agesPossibles);
            ageLegal = ageMin;
            trimestresRequis = donneesHandi[ageMin].trimestres;
        }
    }

    // SAM plafonné PASS
    const samPlafonne = Math.min(d.sam, PASS_ANNUEL);

    // Ecart de durée
    const ecartTrimestres = d.trimestresAcquis - trimestresRequis;

    // Calcul automatique des trimestres de surcote
    const trimestresApresAgeLegal = d.ageDepart > ageLegal ? Math.floor((d.ageDepart - ageLegal) * 4) : 0;
    const trimestresSupp = Math.max(0, ecartTrimestres);
    const surcoteTrimestres = Math.min(trimestresSupp, trimestresApresAgeLegal);

    // Taux effectif
    let tauxDecoteSurcote = TAUX_PLEIN;
    if (ecartTrimestres < 0) {
        tauxDecoteSurcote -= Math.abs(ecartTrimestres) * DECOTE_PAR_TRIMESTRE;
        tauxDecoteSurcote = Math.max(0, tauxDecoteSurcote);
    }
    if (surcoteTrimestres > 0) {
        tauxDecoteSurcote += surcoteTrimestres * SURCOTE_PAR_TRIMESTRE;
    }

    const ratio = clamp(d.trimestresAcquis / trimestresRequis, 0, 1);

    // Calcul pension
    const partTauxSansSurcote = Math.min(tauxDecoteSurcote, TAUX_PLEIN);
    const pensionBaseSansSurcote = samPlafonne * partTauxSansSurcote * ratio;
    const capBase = PASS_ANNUEL * TAUX_PLEIN;
    const pensionBaseCapped = Math.min(pensionBaseSansSurcote, capBase);
    const pctSurcote = Math.max(0, tauxDecoteSurcote - TAUX_PLEIN);
    const pensionSurcote = samPlafonne * pctSurcote * ratio;

    const pensionAnnuelleBrute = pensionBaseCapped + pensionSurcote;
    const pensionMensuelleBrute = pensionAnnuelleBrute / 12;
    const pensionMensuelleNette = pensionMensuelleBrute * (1 - RETENUES_SOCIALES);

    return {
        ageLegal,
        trimestresRequis,
        ecartTrimestres,
        surcoteTrimestres,
        tauxEffectif: tauxDecoteSurcote,
        ratio,
        samPlafonne,
        pensionAnnuelleBrute,
        pensionMensuelleBrute,
        pensionMensuelleNette,
        handicape: true
    };
}