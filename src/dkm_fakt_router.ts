import type {Float} from "./dkm_django/dkm_django_m.ts";

export const DkmFaktRouterConsts = {
    getRechFormUrl(vnr: number, uq_search_key:string): string {
        return `/rech_form/${vnr.toString()}/${uq_search_key}`
    },
    getHonFormUrl(hon_float_nr: Float, uq_search_key:string): string {
        return `/rech_form/${hon_float_nr}/${uq_search_key}`
    },
    getNewRechUrl():string {
        return `/rech_form/0/new`
    },
    getRechListSearchUrl(uq_key: string): string {
        return `/rech_list/${uq_key}`
    },
    getHonListSearchUrl(uq_key: string): string {
        return `/hon_list/${uq_key}`
    }
}
