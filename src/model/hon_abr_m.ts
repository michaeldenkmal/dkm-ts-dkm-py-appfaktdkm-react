import type {Integer} from "../dkm_django/dkm_django_m.ts";
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