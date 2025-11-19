import type {Float, MayBeBool, MayBeFloat, MayBeInteger, MayBeString} from "@at.dkm/dkm-ts-lib-django/lib/dkm_django_m";

export interface KundenhonorarRow {
    nr: Float;
    firma1?: MayBeString;
    stundenhon?: MayBeFloat;
    logo?: MayBeString;
    anrede?: MayBeString;
    kilometer?: MayBeFloat;
    kmgeld?: MayBeFloat;
    spesen?: MayBeFloat;
    zahlungsbeding?: MayBeString;
    zustellart?: MayBeString;
    inaktiv?: MayBeBool;
    mailadresse?: MayBeString;
    bmd_nr?: MayBeInteger;
    gp_id?: MayBeFloat;
}

export function getKundenhonorarRowByNr (kohorows:Array<KundenhonorarRow>,kuhoNr: number): KundenhonorarRow|undefined {
    return kohorows.find(r=>r.nr == kuhoNr)

}

