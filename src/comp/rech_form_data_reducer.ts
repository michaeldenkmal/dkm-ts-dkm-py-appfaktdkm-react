import {createNewRechPosRow, type RechFormRow, type RechGuiData, type RechPosRow} from "../model/rech_form_m.ts";
import Decimal from "decimal.js";

export type EnActions = "set_data_direct" | "change_rech" | "recalc" | "change_rech_pos"
    | "del_pos_row" | "add_pos_row";

interface Action {
    actions: EnActions
}

interface ActSetDataDirect extends Action {
    guiData: RechGuiData
}

export function createActSetDataDirect(guiData: RechGuiData): ActSetDataDirect {
    return {
        actions: "set_data_direct", guiData: guiData,
    }
}

interface ActRech extends Action {
    mutateRech: (rechRow: RechFormRow) => void
}

export function createActRech(mutateFuncRech: (rechRow: RechFormRow) => void): ActRech {
    return {
        actions: "change_rech",
        mutateRech: mutateFuncRech,
    }
}

interface ActPosProps {
    mutatePos: (rechPosrow: RechPosRow) => RechPosRow
    rowIdx: number
    recalc?: boolean
}

interface ActPos extends Action, ActPosProps {
}

export function createActionRechPos(pars: ActPosProps): ActPos {
    return {
        ...pars,
        actions: "change_rech_pos",
    }
}

interface ActDelPosProps {
    fnPredicate: (row: RechPosRow, idx: number) => boolean
}

interface ActDelPos extends Action, ActDelPosProps {
}

export function createActDelPos(props: ActDelPosProps): ActDelPos {
    return {
        ...props,
        actions: "del_pos_row"
    }
}

export function createActAddPosRow():Action {
    return {
        actions: "add_pos_row",
    }
}
// action handler
export function _handleActRech(guiData: RechGuiData, act: ActRech): RechGuiData {
    const newGuiData = {...guiData};
    if (!newGuiData.rech_row) {
        return newGuiData;
    }
    const rechRow = newGuiData.rech_row;
    act.mutateRech(rechRow);
    newGuiData.rech_row = rechRow;
    return newGuiData;
}

export function _handleActDelPos(guiData: RechGuiData, act: ActDelPos): RechGuiData {
    const newGuiData = {...guiData};
    if (!newGuiData.pos_rows) {
        return newGuiData;
    }
    const newPosRows = guiData.pos_rows.filter(act.fnPredicate);
    newGuiData.pos_rows = newPosRows;
    return newGuiData;
}

export function recalcGuiData(guidata: RechGuiData) {
    let zwischensumme: Decimal = Decimal(0);
    if (guidata.pos_rows && guidata.pos_rows.length > 0) {
        guidata.pos_rows.forEach(pos_row => {
            const menge: number = pos_row.menge || 0;
            const einzelpreis: Decimal = pos_row.einzelpreis || Decimal(0);
            const gesamt: Decimal = Decimal(menge).mul(einzelpreis);
            pos_row.gesamtpreis = gesamt;
            zwischensumme = zwischensumme.add(gesamt);
        })
    }
    if (guidata.rech_row) {
        guidata.rech_row.zwischensumme = zwischensumme;
        guidata.rech_row.mwst = zwischensumme.mul(0.2)
        guidata.rech_row.gesamtpreis = guidata.rech_row.zwischensumme.add(guidata.rech_row.mwst);
    }
    return guidata;
}

export function _handlActPos(guiData: RechGuiData, act: ActPos): RechGuiData {
    const newGuiData = {...guiData};
    if (!newGuiData.pos_rows) {
        return newGuiData;
    }
    let posRow = newGuiData.pos_rows[act.rowIdx];
    posRow=act.mutatePos(posRow);
    newGuiData.pos_rows[act.rowIdx] = posRow;
    if (act.recalc) {
        return recalcGuiData(newGuiData);
    }
    return newGuiData;
}

export function _handleActSetDataDirect(act: ActSetDataDirect): RechGuiData {
    return act.guiData;
}

export function _handleActAddPosRow(guiData: RechGuiData): RechGuiData {
    const newGuiData = {...guiData};
    if (!newGuiData.pos_rows) {
        return newGuiData;
    }
    const newPosRows = [...newGuiData.pos_rows,
        createNewRechPosRow(newGuiData.pos_rows.length + 1)];
    newGuiData.pos_rows = newPosRows;
    return newGuiData;
}

export function rechFormReducer(guidata: RechGuiData, action: Action): RechGuiData {
    console.log(`guiData:${JSON.stringify(guidata)}, action=${JSON.stringify(action)}`);
    switch (action.actions) {
        case "set_data_direct":
            return _handleActSetDataDirect(action as ActSetDataDirect);
        case "change_rech":
            return _handleActRech(guidata, action as ActRech);
        case "change_rech_pos":
            return _handlActPos(guidata, action as ActPos);
        case "del_pos_row":
            return _handleActDelPos(guidata, action as ActDelPos);
        case "add_pos_row":
            return _handleActAddPosRow(guidata);
    }
    throw new Error("Invalid action " + action.actions);
}