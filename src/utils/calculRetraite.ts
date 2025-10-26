// ----------------------------------------------------
// utilitaire : calcul de la pension de retraite (base régime général)
// - SAM plafonné au PASS
// - Cap à 50 % du PASS, puis ajout éventuel de la surcote
// - Trimestres requis automatiques (non éditables dans l'UI)
// - Surcote calculée automatiquement (âge légal + trimestres en plus)
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

export interface DonneesRetraite {
    anneeNaissance: number;
    ageDepart: number;          // en années (ex: 64)
    sam: number;                // Salaire Annuel Moyen "brut" saisi (on le plafonne ensuite)
    trimestresAcquis: number;   // total (cotisés + assimilés + rachetés durées si vous les intégrez en amont)
}

export interface ResultatRetraite {
    ageLegal: number;
    trimestresRequis: number;
    ecartTrimestres: number;          // acquis - requis
    surcoteTrimestres: number;        // calcul auto
    tauxEffectif: number;             // en décimal (ex: 0.515)
    ratio: number;                    // min(acquis/requis, 1)
    samPlafonne: number;              // SAM plafonné PASS
    pensionAnnuelleBrute: number;
    pensionMensuelleBrute: number;
    pensionMensuelleNette: number;
}

// helper
const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

export function calculerRetraite(d: DonneesRetraite): ResultatRetraite {
    const trimestresRequis = TRIMESTRES_REQUIS_PAR_NAISSANCE[d.anneeNaissance] ?? 172;
    const ageLegal = AGE_LEGAL_PAR_NAISSANCE[d.anneeNaissance] ?? 64;

    // SAM plafonné PASS (NB : dans la vraie vie, c'est un plafonnement année par année avant moyenne)
    const samPlafonne = Math.min(d.sam, PASS_ANNUEL);

    // Ecart de durée
    const ecartTrimestres = d.trimestresAcquis - trimestresRequis;

    // Calcul automatique des trimestres de surcote
    // - condition 1 : être au moins à l'âge légal
    // - condition 2 : avoir plus de trimestres que requis
    // - on borne par le nombre de trimestres effectivement travaillés après l'âge légal
    const trimestresApresAgeLegal = d.ageDepart > ageLegal ? Math.floor((d.ageDepart - ageLegal) * 4) : 0;
    const trimestresSupp = Math.max(0, ecartTrimestres);
    const surcoteTrimestres = Math.min(trimestresSupp, trimestresApresAgeLegal);

    // Taux effectif (décote si manquants, + surcote si conditions OK)
    let tauxDecoteSurcote = TAUX_PLEIN;
    if (ecartTrimestres < 0) {
        tauxDecoteSurcote -= Math.abs(ecartTrimestres) * DECOTE_PAR_TRIMESTRE;
        tauxDecoteSurcote = Math.max(0, tauxDecoteSurcote);
    }
    // Surcote s'applique seulement si âge légal atteint ET trimestresSupp > 0
    if (surcoteTrimestres > 0) {
        tauxDecoteSurcote += surcoteTrimestres * SURCOTE_PAR_TRIMESTRE;
    }

    const ratio = clamp(d.trimestresAcquis / trimestresRequis, 0, 1);

    // Application du CAP 50% PASS sur la partie "hors surcote" :
    const partTauxSansSurcote = Math.min(tauxDecoteSurcote, TAUX_PLEIN);      // max 50%
    const pensionBaseSansSurcote = samPlafonne * partTauxSansSurcote * ratio; // base
    const capBase = PASS_ANNUEL * TAUX_PLEIN;                                  // 50% PASS
    const pensionBaseCapped = Math.min(pensionBaseSansSurcote, capBase);

    // Ajout de la SURCOTE au-delà du cap (comme autorisé par la règle)
    const pctSurcote = Math.max(0, tauxDecoteSurcote - TAUX_PLEIN);            // ex: +0.025 si 2 trimestres
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
    };
}