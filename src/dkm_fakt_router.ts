import type {Float} from "@at.dkm/dkm-ts-lib-django/lib/dkm_django_m";

export const DkmFaktRouterConsts = {
    getRechFormUrl(vnr: number, uq_search_key:string): string {
        return `/rech_form/${vnr.toString()}/${uq_search_key}`
    },
    getHonFormUrl(hon_float_nr: Float, uq_search_key:string): string {
        return `/hon_form/${hon_float_nr}/${uq_search_key}`
    },
    getKuHonFormUrlTemplate(): string {
        return `/kuhon_form/:kuhon_nr`
    },
    getWorkRepUrlTemplate():string {
        return `/work_reps`
    },
    getKuHonFormUrl(kuhon_nr: Float): string {
        return `/kuhon_form/${kuhon_nr}/`
    },
    getKuHonListUrl():string {
        return `/kuhon_list`
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
