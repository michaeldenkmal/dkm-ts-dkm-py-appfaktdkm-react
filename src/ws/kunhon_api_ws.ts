import {DkmUrlBuilder} from "@at.dkm/dkm-ts-lib-websrvc/lib/dkm_url_builder";
import {execDjGet} from "../dkm_django/dkm_django_ws.ts";
import type {OptionItem} from "../dkm_comps/DkmNativeSelect.tsx";

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



