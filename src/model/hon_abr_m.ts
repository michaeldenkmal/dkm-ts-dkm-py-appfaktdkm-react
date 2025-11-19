import type {Integer} from "@at.dkm/dkm-ts-lib-django/lib/dkm_django_m";
import Decimal from "decimal.js";

export interface ArbRechTemp {
    nr: Integer
    firma1: string
    gesamt_sum: Decimal
    abrechnen:boolean
}


export interface CalcHonToSettleRes {
    sum_gesamt: Decimal
    rows_to_choose: Array<ArbRechTemp>
}