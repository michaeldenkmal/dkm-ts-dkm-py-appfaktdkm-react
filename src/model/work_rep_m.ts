import type {Float, MayBeDate, MayBeFloat, MayBeString} from "@at.dkm/dkm-ts-lib-django/lib/dkm_django_m";

export interface DatenabTestRow {
    NR?: MayBeFloat;
    KUNDENNAME?: MayBeString;
    KUNDE: Float;
    DATUM?: MayBeDate;
    ZEITVON?: MayBeDate;
    ZEITBIS?: MayBeDate;
    STUNDEN?: MayBeFloat;
    TAETIGKEIT?: MayBeString;
    KMGELD?: MayBeFloat;
    DIAETEN?: MayBeFloat;
    EXTRAVER?: MayBeFloat;
    HONORAR?: MayBeFloat;
    GESAMTHONORAR?: MayBeFloat;
    VERRECHNETAM?: MayBeDate;
    BEZAHLTAM?: MayBeDate;
    HONORARNR?: MayBeString;
    MITARBNR?: MayBeFloat;
    DOKUMENTPFAD?: MayBeString;
    FOERD_ID?: MayBeFloat;
    mo_honnr?: MayBeString;
    h_wart?: MayBeFloat;
}

export interface TSumNotAccountedRow {
    kunden_name: string
    sum_not_accounted: number
}

export interface TgetSumNotAccountedArbsParams {
    kdNrVon: MayBeFloat
    kdNrBis: MayBeFloat
}


export function sumUpSumNotAccountedRows(rows: TSumNotAccountedRow[]):number {
    return rows.reduce((sum,item)=>sum + (item.sum_not_accounted||0), 0);
}

