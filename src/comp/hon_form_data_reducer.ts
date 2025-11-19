import type {HonGuiData, WorkRepRow} from "../model/hon_form_m.ts";
import type {Float, Integer, MayBeBool,  MayBeString} from "@at.dkm/dkm-ts-lib-django/lib/dkm_django_m";
import type {CaseMap} from "../dkm_comps/case_map.ts";
import {addToArrPropIfNotExists} from "../dkm_comps/arr_util.ts";
import type {FormReduceState} from "./HonFormComp.tsx";

type Action =
    | { type: "set_data_direct", newData:HonGuiData }
    | { type: "set_weggeschickt"; istWeggeschickt: MayBeBool }
    | { type: "chg_work_rep_honararnr";
        honorarnr: MayBeString;
        rowIdx: Integer }
    |{ type:"set_do_id";
        do_id:Float
    };


const handlers: CaseMap<HonGuiData, Action> = {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    set_data_direct:(_data,act)=> {
        return act.newData;
    },
    set_weggeschickt:(data,act )=> {
        data.hon_row.weggeschickt = act.istWeggeschickt
        data.hon_row_changed = true
    },
    chg_work_rep_honararnr:(data, act)=> {
        const workrow = data.work_rep_rows[act.rowIdx];
        workrow.honorarnr = act.honorarnr
        addToArrPropIfNotExists<HonGuiData,Float>( {
            elem: workrow.work_rep_float_nr,
            arr_prop:"work_rep_rows_changed",
            container_object:data
        })
    },
    set_do_id:(data, act)=> {
        data.hon_row.do_id = act.do_id
        data.hon_row_changed = true
    }
}

export function honFormReducer(guidata: HonGuiData, action: Action): HonGuiData|void {
    const fn = handlers[action.type];
    return fn(guidata,action as any)
}

// // Hilfstyp: mappt jeden Action-Typ auf die passende Handler-Signatur
// // set_data_direct
// interface ActSetDataDirect extends Action {
//     guiData: HonGuiData
// }
//
// export function createActSetDataDirect(guiData: HonGuiData): ActSetDataDirect {
//     return {
//         actions: "set_data_direct", guiData: guiData,
//     }
// }
//
//
//
// // Action  set_weggeschickt
// interface ActSetWeggeschickt extends Action {
//     istWeggeschickt: MayBeBool
// }
//
// export function creActSetWeggeschickt(weggeschickt: MayBeBool): ActSetWeggeschickt {
//     return {
//         actions: "set_weggeschickt",
//         istWeggeschickt: weggeschickt
//     }
// }
//
// export function _handleActSetWeggeschickt(guiData: HonGuiData, act: ActSetWeggeschickt) {
//     guiData.hon_row.weggeschickt = act.istWeggeschickt;
// }
//
// // Action chg_work_rep_honararnr
//
// interface ActChgWorkRepHonorarProps {
//     honorarnr: MayBeString
//     rowIdx: Integer
//
// }
//
// interface ActChgWorkRepHonorar extends Action, ActChgWorkRepHonorarProps {
// }
//
// export function creActChgWorkRepHonorar(props: ActChgWorkRepHonorarProps): ActChgWorkRepHonorar {
//     return {
//         ...props,
//         actions: "chg_work_rep_honararnr"
//     }
// }
//
// export function _handleActChgWorkRepHonorar(guiData: HonGuiData, act: ActChgWorkRepHonorar) {
//     const workRepRow = guiData.work_rep_rows[act.rowIdx];
//     if (workRepRow) {
//         workRepRow.honorarnr = act.honorarnr;
//     }
// }
//
//
// // set_do_id
// interface ActSetDoId extends Action {
//     do_id: MayBeFloat
// }
//
// export function creActSetDoId(do_id: MayBeFloat): ActSetDoId {
//     return {
//         actions: "set_do_id", do_id: do_id
//     }
// }
//
// export function _handleActActSetDoId(guiData: HonGuiData, act: ActSetDoId){
//     guiData.hon_row.do_id = act.do_id;
// }
//
//
// export function honFormReducer(guidata: HonGuiData, action: Action): HonGuiData|void {
//     console.log(`guiData:${JSON.stringify(guidata)}, action=${JSON.stringify(action)}`);
//     switch (action.actions) {
//         case "set_data_direct":
//             return (action as ActSetDataDirect).guiData;
//         case "set_weggeschickt":
//             _handleActSetWeggeschickt(guidata, action as ActSetWeggeschickt);
//             break;
//         case "chg_work_rep_honararnr":
//             _handleActChgWorkRepHonorar(guidata, action as ActChgWorkRepHonorar);
//             break;
//         case "set_do_id":
//             _handleActActSetDoId(guidata, action as ActSetDoId);
//     }
//     throw new Error("Invalid action " + action.actions);
// }

export function getLastResettleDate(guiData:HonGuiData, honorarnr:string):Date|null {
    if (!guiData.work_rep_rows) {
        return null
    }
    return guiData.work_rep_rows
        .filter(wrr=>wrr.honorarnr ==honorarnr)
        .reduce((prevDate:Date,wrr:WorkRepRow)=>
            (prevDate||new Date(0)) < wrr.work_date?
                wrr.work_date : prevDate,new Date(0))
}

export function calcGuiFlags(formGuiData:HonGuiData):FormReduceState {
    // btnSaveDisabled
    const ret:FormReduceState={};
    ret.btnSaveDisabled = true;
    if ( (formGuiData.hon_row_changed) || (formGuiData.hon_row_changed && formGuiData.work_rep_rows_changed?.length)) {
        ret.btnSaveDisabled = false;
    }
    // btnCreateDocxDisabled
    ret.btnCreateDocxDisabled = !formGuiData.hon_row.honorarnr;
    // btnOpenDocxDisabled
    ret.btnOpenDocxDisabled = !formGuiData.hon_row.do_id;
    // btnResettleDisabled
    ret.btnResettleDisabled = true;
    if (ret.btnSaveDisabled && formGuiData.hon_row?.honorarnr) {
        ret.btnResettleDisabled = false;
    }
    return ret;
}
