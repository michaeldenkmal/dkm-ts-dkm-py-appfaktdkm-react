// file: /work_rep_ws.ts
import {DkmUrlBuilder} from "@at.dkm/dkm-ts-lib-websrvc/lib/dkm_url_builder";
import {execDjPost} from "../dkm_django/dkm_django_ws.ts";
import type {DatenabTestRow, TgetSumNotAccountedArbsParams, TSumNotAccountedRow} from "../model/work_rep_m.ts";

const CONTEXT_NAME="dkmfakt/appdkmfakt";
const WS_APP_NAME="work_rep";
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


interface TgetArbeitsberichtsRowsByKdNrParam {
    kdnr: string
}

export function getArbeitsberichtsRowsByKdNr(data:TgetArbeitsberichtsRowsByKdNrParam):Promise<DatenabTestRow[]> {
    const url = buildWebSrvcUrl("get_arbeitsberichts_rows_by_kd_nr",[]);
    return execDjPost(url, data);
}


export function saveArbeitsberichtsRow(data:DatenabTestRow):Promise<DatenabTestRow> {
    const url = buildWebSrvcUrl("save_arbeitsberichts_row",[]);
    return execDjPost(url, data);
}


export function getSumNotAccountedArbs():Promise<TSumNotAccountedRow[]> {
    const url = buildWebSrvcUrl("get_sum_not_accounted_arbs")
    const pars:TgetSumNotAccountedArbsParams = {
        kdNrBis:null,
        kdNrVon:null
    }
    return execDjPost(url,pars);
}

