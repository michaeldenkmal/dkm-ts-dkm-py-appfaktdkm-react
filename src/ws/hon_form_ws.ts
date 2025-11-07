import {DkmUrlBuilder} from "@at.dkm/dkm-ts-lib-websrvc/lib/dkm_url_builder";
import {execDjPost} from "../dkm_django/dkm_django_ws.ts";
import type {HonListSearchData, HonListViewModel} from "../model/hon_list_m.ts";

const CONTEXT_NAME="dkmfakt/appdkmfakt";
const WS_APP_NAME="honorar";
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

export async function hon_list_search(pars:HonListSearchData): Promise<Array<HonListViewModel>> {
    const url = buildWebSrvcUrl("search")
    return execDjPost(url, pars);
}

