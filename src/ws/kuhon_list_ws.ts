import {DkmUrlBuilder} from "@at.dkm/dkm-ts-lib-websrvc/lib/dkm_url_builder";
import {execDjPost} from "@at.dkm/dkm-ts-lib-django/lib/dkm_django_ws.ts";
import type {KuHonViewRow} from "../model/kuhon_list_m.ts";
import type {MayBeBool} from "@at.dkm/dkm-ts-lib-django/lib/dkm_django_m.ts";

const CONTEXT_NAME="dkmfakt/appdkmfakt";
const WS_APP_NAME="kundenhonorar";
const RES_NAME="list";

//kundenhonorar/list/get_all

function buildWebSrvcUrl(funcName: string,pathParams?:string[]) {
    return DkmUrlBuilder.buildFullWebSrvcUrl({
        pathParams: pathParams ||[],
        funcName,
        WS_APP_NAME,
        RES_NAME,
        CONTEXT_NAME
    });
}

interface GetAllPars{
    inactive:MayBeBool
}



export async function get_all(pars:GetAllPars):Promise<Array<KuHonViewRow>> {
    const url = buildWebSrvcUrl("get_all");
    return execDjPost(url,pars);
}


