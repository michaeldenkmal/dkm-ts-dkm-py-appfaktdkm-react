import type {CaseMap} from "../dkm_comps/case_map.ts";
import type {KundenhonorarRow} from "../model/kuhon_form_m.ts";
import type {MayBeString} from "@at.dkm/dkm-ts-lib-django/lib/dkm_django_m";
import equal from "fast-deep-equal/es6";

type Action =
    | { type: "set_data_direct", newData:KundenhonorarRow }
    | { type: "change"; fnMutate:(row:KundenhonorarRow)=>void };




const handlers: CaseMap<KundenhonorarRow, Action> = {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    set_data_direct:(_data,act)=> {
        return act.newData;
    },
    change:(data,act )=> {
        act.fnMutate(data);
    }
}

export function creActChange(fnMutate:(r:KundenhonorarRow)=>void):Action {
    return {
        type:"change",
        fnMutate
    }
}

export function kunHonReducer(guidata: KundenhonorarRow, action: Action): KundenhonorarRow|void {
    const fn = handlers[action.type];
    return fn(guidata,action as any)
}




export interface KuHonValidatonErrs {
    nr?:MayBeString
    firma1?:MayBeString
    stundenhon?:MayBeString
    logo?:MayBeString
    anrede?:MayBeString
}

export interface KuHonGuiFlags {
    isSaveValid:boolean
    isDirty:boolean
    isEmailDisabled:boolean
}

export function calcKuHonGuiFlags(propsData:KundenhonorarRow, stateData:KundenhonorarRow,valerrs:KuHonValidatonErrs):KuHonGuiFlags {
    const isDirty = !equal(propsData, stateData);
    const isSaveValid = (Object.keys(valerrs).length==0) &&(isDirty)
    const isEmailDisabled = stateData.zustellart!="Email";
    return {
        isDirty,isSaveValid, isEmailDisabled
    }
}

export function validateKuHonRow(row: KundenhonorarRow): KuHonValidatonErrs {

    const REQUIRED_FIELDS: Array<keyof KundenhonorarRow> = [
        "nr", "firma1", "stundenhon", "logo", "anrede"
    ]
    const ret:Partial<Record<keyof KuHonValidatonErrs, MayBeString>> ={};
    const values: Record<string, any> = row as unknown as Record<string, any>;
    REQUIRED_FIELDS.forEach(field => {
        if (!values[field]) {
            ret[field] = "muss ausgefüllt werden"
        }
    })
    return ret;
}

