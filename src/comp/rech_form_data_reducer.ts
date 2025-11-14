import {
    createNewRechPosRow,
    type RechFormRow,
    type RechFormRowErrs,
    type RechGuiData,
    type RechPosRow
} from "../model/rech_form_m.ts";
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
export function _handleActRech(guiData: RechGuiData, act: ActRech): void {
    if (!guiData.rech_row) {
        return ;
    }
    act.mutateRech(guiData.rech_row);
}

export function _handleActDelPos(guiData: RechGuiData, act: ActDelPos):void {
    if (!guiData.pos_rows) {
        return
    }
    const newPosRows = guiData.pos_rows.filter(act.fnPredicate);
    guiData.pos_rows = newPosRows;
}

export function validateRechGuiData(guidata: RechGuiData):RechFormRowErrs {
    if (guidata.rech_row ) {
        if (guidata.rech_row.f_nr) {
            return {}
        } else {
            return {
                f_nr:"Firma muss ausgewählt werden"
            }
        }
    } else {
        throw new Error("guidata.rech_row is null")
    }
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
    if (!guiData.pos_rows) {
        throw Error("dürfte nicht vorkommen");
    }
    const newrow =act.mutatePos(guiData.pos_rows[act.rowIdx]);

    const proxyrow=guiData.pos_rows[act.rowIdx];
    // Properties müssen einzeln kopieren werden
    // weil sonst eine Readonly referenz eingebaut wird,
    // an der dann reacalcGUiuData scheitert
    Object.keys(newrow).forEach(prop=> {
        proxyrow[prop]=newrow[prop];
    })
    if (act.recalc) {
        recalcGuiData(guiData);
    }
    return guiData;
}

export function _handleActSetDataDirect(act: ActSetDataDirect): RechGuiData {
    return act.guiData;
}

export function _handleActAddPosRow(guiData: RechGuiData) {
    if (!guiData.pos_rows) {
        guiData.pos_rows=[];
    }
    guiData.pos_rows.push(createNewRechPosRow(guiData.pos_rows.length + 1));
}

export function rechFormReducer(guidata: RechGuiData, action: Action): RechGuiData|void {
    console.log(`guiData:${JSON.stringify(guidata)}, action=${JSON.stringify(action)}`);
    switch (action.actions) {
        case "set_data_direct":
            return _handleActSetDataDirect(action as ActSetDataDirect);
        case "change_rech":
            _handleActRech(guidata, action as ActRech);
            return;
        case "change_rech_pos":
            return _handlActPos(guidata, action as ActPos);
        case "del_pos_row":
            _handleActDelPos(guidata, action as ActDelPos);
            return;
        case "add_pos_row":
            _handleActAddPosRow(guidata);
            return;
    }
    throw new Error("Invalid action " + action.actions);
}