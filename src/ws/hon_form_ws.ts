import {DkmUrlBuilder} from "@at.dkm/dkm-ts-lib-websrvc/lib/dkm_url_builder";
import type {HonGuiData} from "../model/hon_form_m.ts";
import {execDjGet, execDjPost} from "@at.dkm/dkm-ts-lib-django/lib/dkm_django_ws";
import type {Float} from "@at.dkm/dkm-ts-lib-django/lib/dkm_django_m";

const CONTEXT_NAME="dkmfakt/appdkmfakt";
const WS_APP_NAME="honorar";
const RES_NAME="form";


function buildWebSrvcUrl(funcName: string,pathParams?:string[]) {
    return DkmUrlBuilder.buildFullWebSrvcUrl({
        pathParams: pathParams ||[],
        funcName,
        WS_APP_NAME,
        RES_NAME,
        CONTEXT_NAME
    });
}

// get Honorar by nr
export async function get_honorar_by_nr(hon_float_nr:Float):Promise<HonGuiData> {
    const url=buildWebSrvcUrl("get_honorar_by_nr",[hon_float_nr.toString()])
    return execDjGet(url);
}

export async function update(guiData:HonGuiData) :Promise<HonGuiData> {
    const url = buildWebSrvcUrl("update");
    return execDjPost(url, guiData);
}

export async function cre_docx(hon_float_nr:Float):Promise<Float> {
    const url = buildWebSrvcUrl("cre_docx",[hon_float_nr.toString()]);
    return execDjGet(url);
}


interface ResettlePars {
    last_settle_date: Date
    nr: Float
}
//honorar/form/resettle
// params:last_settle_date:Date
// nr: Honorarnr:float
export async function resettle_json(pars:ResettlePars):Promise<HonGuiData> {
    const url = buildWebSrvcUrl("resettle_json");
    return execDjPost(url, pars);
}


