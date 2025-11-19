import {DkmUrlBuilder} from "@at.dkm/dkm-ts-lib-websrvc/lib/dkm_url_builder";
import {execDjGet, execDjPost} from "@at.dkm/dkm-ts-lib-django/lib/dkm_django_ws.ts";
import type {OptionItem} from "../dkm_comps/DkmNativeSelect.tsx";
import type {KundenhonorarRow} from "../model/kuhon_form_m.ts";
import type {Float, MayBeBool} from "@at.dkm/dkm-ts-lib-django/lib/dkm_django_m";

// rech_form_ws.ts kundenhonorar/api/cbx_items
const CONTEXT_NAME="dkmfakt/appdkmfakt";
const WS_APP_NAME="kundenhonorar";
const RES_NAME="api";


function buildWebSrvcUrl(funcName: string,pathParams?:string[]) {
    return DkmUrlBuilder.buildFullWebSrvcUrl({
        pathParams: pathParams ||[],
        funcName,
        WS_APP_NAME,
        RES_NAME,
        CONTEXT_NAME
    });
}

//rechnung/list/search


export async function cbxItems() :Promise<Array<OptionItem>>{
    const url = buildWebSrvcUrl("cbx_items")
    return execDjGet(url);
}

//get_gp_cbx
export async function get_gp_cbx():Promise<Array<OptionItem>> {
    const url=buildWebSrvcUrl("get_gp_cbx")
    return execDjGet(url)
}

//kundenhonorar/api/get_kuhon_row/<str:nr>
export async function get_kuhon_row(kuhon_nr:Float):Promise<KundenhonorarRow> {
    const url=buildWebSrvcUrl("get_kuhon_row",[kuhon_nr.toString()])
    return execDjGet(url);
}

export async function get_all_kuhon_rows(active:MayBeBool):Promise<Array<KundenhonorarRow>> {
    const par_active = active==true ? "y":(active==false?"n":"-")
    const url=buildWebSrvcUrl("get_all_kuhon_rows",[par_active])
    return execDjGet(url);
}
export async function save(row:KundenhonorarRow):Promise<KundenhonorarRow> {
    const url=buildWebSrvcUrl("save")
    return execDjPost(url, row)
}

