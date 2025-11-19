import type {RechListSearchData, RechListViewModel} from "../model/rech_list_m.ts";
import {DkmUrlBuilder} from "@at.dkm/dkm-ts-lib-websrvc/lib/dkm_url_builder";
import {execDjPost} from "@at.dkm/dkm-ts-lib-django/lib/dkm_django_ws";

const CONTEXT_NAME="dkmfakt/appdkmfakt";
const WS_APP_NAME="rechnung";
const RES_NAME="list";


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

export async function rech_list_search(pars:RechListSearchData): Promise<Array<RechListViewModel>> {
    const url = buildWebSrvcUrl("search")
    return execDjPost(url, pars);
}


