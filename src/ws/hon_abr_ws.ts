import {DkmUrlBuilder} from "@at.dkm/dkm-ts-lib-websrvc/lib/dkm_url_builder";
import {execDjGet, execDjPost} from "@at.dkm/dkm-ts-lib-django/lib/dkm_django_ws";
import type {WorkRepRow} from "../model/hon_form_m.ts";
import type {Float} from "@at.dkm/dkm-ts-lib-django/lib/dkm_django_m";
import type {CalcHonToSettleRes} from "../model/hon_abr_m.ts";

const CONTEXT_NAME="dkmfakt/appdkmfakt";
const WS_APP_NAME="honorar";
const RES_NAME="abrech";

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


export async function list_kuhon_work():Promise<CalcHonToSettleRes> {
    const url = buildWebSrvcUrl("list_kuhon_work");
    return execDjGet(url);
}

export async function exec_abrech(data:CalcHonToSettleRes):Promise<CalcHonToSettleRes> {
    const url = buildWebSrvcUrl("exec_abrech")
    return execDjPost(url, data)
}

export async function load_open_work_reps_by_kuhon_nr(kuhon_nr:Float):Promise<Array<WorkRepRow>> {
    const url = buildWebSrvcUrl("load_open_work_reps_by_kuhon_nr",[kuhon_nr.toString()])
    return execDjGet(url);
}