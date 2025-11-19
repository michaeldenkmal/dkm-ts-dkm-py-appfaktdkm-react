import type {Integer, MayBeBool} from "@at.dkm/dkm-ts-lib-django/lib/dkm_django_m.ts";
import type {CaseMap} from "../dkm_comps/case_map.ts";
import type {CalcHonToSettleRes} from "../model/hon_abr_m.ts";

type Action =
    | { type: "set_data_direct", newData:CalcHonToSettleRes }
    | { type: "set_abrechnen"; abrechnen: MayBeBool, rowIdx:Integer };


interface CreSetAbrechnenActionProps{
    abrechnen:MayBeBool
    rowIdx:Integer
}
export function creActSetAbrechnen(props:CreSetAbrechnenActionProps):Action {
    return { type:"set_abrechnen", abrechnen:props.abrechnen, rowIdx:props.rowIdx}
}


const handlers: CaseMap<CalcHonToSettleRes, Action> = {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    set_data_direct:(_data,act)=> {
        return act.newData;
    },
    set_abrechnen:(data,act )=> {
        data.rows_to_choose[act.rowIdx].abrechnen = act.abrechnen || false
    }
}

export function honAbrReducer(guidata: CalcHonToSettleRes, action: Action): CalcHonToSettleRes|void {
    const fn = handlers[action.type];
    return fn(guidata,action as any)
}


export interface HonAbrGuiFlags {
    btnExecAbrechdisabled : boolean;
}

export function calcHonAbrGuiFlags(guiData: CalcHonToSettleRes):HonAbrGuiFlags {
    const ret:HonAbrGuiFlags = {
        btnExecAbrechdisabled:true
    };

    if (guiData.rows_to_choose && guiData.rows_to_choose.length) {
        if (guiData.rows_to_choose.find(r=>r.abrechnen===true)) {
            ret.btnExecAbrechdisabled = false;
        }
    }
    return ret;

}