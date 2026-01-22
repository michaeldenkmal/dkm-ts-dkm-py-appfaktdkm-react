import {DkmUrlBuilder} from "@at.dkm/dkm-ts-lib-websrvc/lib/dkm_url_builder";
import {execDjGet, execDjPost} from "@at.dkm/dkm-ts-lib-django/lib/dkm_django_ws";
import type {WorkRepRow} from "../model/hon_form_m.ts";
import type {Float} from "@at.dkm/dkm-ts-lib-django/lib/dkm_django_m";
import type {CalcHonToSettleRes} from "../model/hon_abr_m.ts";

const CONTEXT_NAME="dkmfakt/appdkmfakt";

const WS_APP_NAME="root"
const RES_NAME="info"

export interface VersionInfo {
    db_server:string
    db_name:string
    version:string
}
//path("honorar/abrech/list_kuhon_work",vwhon.handle_honorar_abr_list_kuhon_work,name="hon_abrech_list_kuhon_work"),
function buildWebSrvcUrl(funcName: string,pathParams?:string[]) {
    return DkmUrlBuilder.buildFullWebSrvcUrl({
        pathParams: pathParams ||[],
        funcName,
        WS_APP_NAME,
        RES_NAME,
        CONTEXT_NAME
    });
}


export async function get_version():Promise<VersionInfo> {
    const url = buildWebSrvcUrl("version");
    return execDjGet(url);
}

