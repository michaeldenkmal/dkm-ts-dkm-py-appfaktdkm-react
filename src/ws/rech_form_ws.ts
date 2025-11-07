import {DkmUrlBuilder} from "@at.dkm/dkm-ts-lib-websrvc/lib/dkm_url_builder";
import type {Integer} from "../dkm_django/dkm_django_m.ts";
import type { RechGuiData, SaveRechDataRes} from "../model/rech_form_m.ts";
import {execDjGet, execDjPost} from "../dkm_django/dkm_django_ws.ts";

const CONTEXT_NAME="dkmfakt/appdkmfakt";
const WS_APP_NAME="rechnung";
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

//rechnung/list/search


export async function rech_form_get_by_vnr(vnr:Integer) :Promise<RechGuiData>{
    const url = buildWebSrvcUrl("get_by_vnr",[vnr.toString()])
    return execDjGet(url);
}


export async function rech_form_save(data:RechGuiData):Promise<SaveRechDataRes>{
    const url = buildWebSrvcUrl("save");
    return execDjPost(url, data)
}

export async function remove_pos_row(pos_row_nr:number):Promise<void>{
    const url = buildWebSrvcUrl("remove_pos_row",[pos_row_nr.toString()]);
    return execDjGet(url);
}


export async function createDocx(vnr: number): Promise<number> {
    const url = buildWebSrvcUrl("cre_docx",[vnr.toString()]);
    return execDjGet(url);
}

