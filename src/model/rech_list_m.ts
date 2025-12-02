import type {MayBeBool} from "@at.dkm/dkm-ts-lib-django/lib/dkm_django_m";

export interface RechListViewModel {
    rech_num: string;
    verrechnet_am: string; // ISO datetime string
    firma1: string;
    gesamt_betrag: number; // Decimal -> number
    rech_pk: number;
    ist_weggeschickt:MayBeBool;
}

export interface RechListSearchData {
    search_expr_rechnum: string
    search_expr_firma: string
}

export function createEmptyRechListSearchData(): RechListSearchData{
    return {
        search_expr_rechnum: "", search_expr_firma: ""
    }
}
