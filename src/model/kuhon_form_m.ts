import type {Float, MayBeBool, MayBeFloat, MayBeInteger, MayBeString} from "../dkm_django/dkm_django_m.ts";

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
