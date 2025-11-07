import type {HonGuiData} from "../model/hon_form_m.ts";
import type {Integer, MayBeBool, MayBeFloat, MayBeString} from "../dkm_django/dkm_django_m.ts";


export type EnActions = "set_data_direct" | "set_weggeschickt" | "chg_work_rep_honararnr" | "set_do_id"

interface Action {
    actions: EnActions
}

// set_data_direct
interface ActSetDataDirect extends Action {
    guiData: HonGuiData
}

export function createActSetDataDirect(guiData: HonGuiData): ActSetDataDirect {
    return {
        actions: "set_data_direct", guiData: guiData,
    }
}

export function _handleActSetDataDirect(act: ActSetDataDirect): HonGuiData {
    return act.guiData;
}


// Action  set_weggeschickt
interface ActSetWeggeschickt extends Action {
    istWeggeschickt: MayBeBool
}

export function creActSetWeggeschickt(weggeschickt: MayBeBool): ActSetWeggeschickt {
    return {
        actions: "set_weggeschickt",
        istWeggeschickt: weggeschickt
    }
}

export function _handleActSetWeggeschickt(guiData: HonGuiData, act: ActSetWeggeschickt): HonGuiData {
    const newGuiData = {...guiData};
    newGuiData.hon_row.weggeschickt = act.istWeggeschickt;
    return newGuiData;
}

// Action chg_work_rep_honararnr

interface ActChgWorkRepHonorarProps {
    honorarnr: MayBeString
    rowIdx: Integer

}

interface ActChgWorkRepHonorar extends Action, ActChgWorkRepHonorarProps {
}

export function creActChgWorkRepHonorar(props: ActChgWorkRepHonorarProps): ActChgWorkRepHonorar {
    return {
        ...props,
        actions: "chg_work_rep_honararnr"
    }
}

export function _handleActChgWorkRepHonorar(guiData: HonGuiData, act: ActChgWorkRepHonorar): HonGuiData {
    const newGuiData = {...guiData};
    const workRepRow = newGuiData.work_rep_rows[act.rowIdx];
    if (workRepRow) {
        workRepRow.honorarnr = act.honorarnr;
    }
    return newGuiData;
}


// set_do_id
interface ActSetDoId extends Action {
    do_id: MayBeFloat
}

export function creActSetDoId(do_id: MayBeFloat): ActSetDoId {
    return {
        actions: "set_do_id", do_id: do_id
    }
}

export function _handleActActSetDoId(guiData: HonGuiData, act: ActSetDoId): HonGuiData {
    const newGuiData = {...guiData};
    newGuiData.hon_row.do_id = act.do_id;
    return newGuiData;
}


export function honFormReducer(guidata: HonGuiData, action: Action): HonGuiData {
    console.log(`guiData:${JSON.stringify(guidata)}, action=${JSON.stringify(action)}`);
    switch (action.actions) {
        case "set_data_direct":
            return _handleActSetDataDirect(action as ActSetDataDirect);
        case "set_weggeschickt":
            return _handleActSetWeggeschickt(guidata, action as ActSetWeggeschickt);
        case "chg_work_rep_honararnr":
            return _handleActChgWorkRepHonorar(guidata, action as ActChgWorkRepHonorar);
        case "set_do_id":
            return _handleActActSetDoId(guidata, action as ActSetDoId);
    }
    throw new Error("Invalid action " + action.actions);
}