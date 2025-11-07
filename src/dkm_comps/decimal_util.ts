import type {MayBeDecimal} from "../dkm_django/dkm_django_m.ts";
import Decimal from "decimal.js";

export function fmtDecimal2Digits(dec:MayBeDecimal):string {
    if (!dec) {
        return "";
    }
    return dec.toFixed(2);
}

export function decimalToNumber(dec:MayBeDecimal):number|null {
    if (!dec) {
        return null;
    }
    return dec.toNumber()
}

export function numberToDecimal(num:number|null|undefined):Decimal|null{
    if (!num) {
        return null;
    }
    return Decimal(num);
}