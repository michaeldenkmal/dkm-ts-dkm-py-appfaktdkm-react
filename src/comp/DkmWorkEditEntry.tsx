import {type DatenabTestRow} from "../model/work_rep_m.ts";
import {useEffect, useState} from "react";
import * as util from "./DkmWorkEditEntry_util.ts";
import "./DkmWorkEditEntry.css"
import NativeDateInput from "../dkm_comps/NativeDateInput.tsx";
import {NativeTimeInput} from "../dkm_comps/NativeTimeInput.tsx";
import {useImmerReducer} from "use-immer";
import {creActWorkRepChange, workRepReducer} from "./work_edit_data_reducer.ts";
import type {MayBeDate} from "@at.dkm/dkm-ts-lib-django/lib/dkm_django_m";
import {NativeNumberInput} from "../dkm_comps/NativeNumberInput.tsx";
import {NativeMemo} from "../dkm_comps/NativeMemo.tsx";
import DkmRespFormCell from "../dkm_comps/DkmRespFormCell.tsx";
import DkmRepFormRow from "../dkm_comps/DkmRespFormRow.tsx";

interface Props {
    row: DatenabTestRow
    onSave: (row: DatenabTestRow) => void
    onCancel: () => void
}


export default function DkmWorkEditEntry(props: Props) {

    //const [s_row, s_setRow]= React.useState<DatenabTestRow>();
    const [s_row, dispatchRow] = useImmerReducer(workRepReducer, props.row);
    const [s_bisTouched, s_setBisTouched] = useState(false);

    function mutateRow(workRow: DatenabTestRow) {
        const recalced_row = util.reCalc({
            workRow,
            bIgnoreExtraVerr: false,
            bisTouched: s_bisTouched
        })
        Object.keys(recalced_row).forEach(prop => {
            workRow[prop] = recalced_row[prop];
        })
    }

    function chgRow<T>(prop: keyof DatenabTestRow, value: T) {
        // TODO reaclc here
        dispatchRow(creActWorkRepChange(r => {
            (r as any) [prop] = value;
            mutateRow(r);
        }));
    }

    useEffect(() => {
        //s_setRow(props.row)
        dispatchRow({
            type: "set_data_direct",
            newData: props.row
        })
    }, [props.row]);

    function renderDatum() {
        function handleChange(newDat: MayBeDate) {
            chgRow("DATUM", newDat)
        }

        //             lblDatum = new TDkmUILabel(getJelemid("lblDatum"), "Datum", getJelemid("edtDatum"));
        return <DkmRespFormCell label={"Datum"} field={"DATUM"} shouldRenderError={false}>
            <NativeDateInput additionalClassName={"datum"} value={s_row?.DATUM} onChange={handleChange}/>
        </DkmRespFormCell>
    }

    // von
    function renderVon() {
        function handleChange(newv: MayBeDate) {
            chgRow("ZEITVON", newv)
        }

        function calcDisabled() {
            if (!s_row.DATUM) {
                return true;
            }
            return false;
        }

        return <DkmRespFormCell label={"von"} field={"ZEITVON"} shouldRenderError={false}>
            <NativeTimeInput additionalClassName={"zeit "} value={s_row.ZEITVON} hourDivisor={4}
                             onChange={handleChange}
                             disabled={calcDisabled()}
                             dateOfDay={s_row.DATUM}
                             onBlur={() => s_setBisTouched(true)}
            />
        </DkmRespFormCell>
    }

    // bis
    function renderBis() {
        function handleChange(newv: MayBeDate) {
            chgRow("ZEITBIS", newv)
        }

        function calcDisabled() {
            if (!s_row.DATUM) {
                return true;
            }
            if (!s_row.ZEITVON) {
                return true;
            }
            return false;
        }

        return <DkmRespFormCell label={"bis"} shouldRenderError={false} field={"ZEITBIS"}>
            <NativeTimeInput additionalClassName={"zeit"} value={s_row.ZEITBIS} hourDivisor={4}
                             onChange={handleChange}
                             disabled={calcDisabled()}
                             dateOfDay={s_row.DATUM}
            />
        </DkmRespFormCell>
    }

    // Stunden
    function renderStunden() {

        return <DkmRespFormCell label={"Stunden"} field={"STUNDEN"} shouldRenderError={false}>
            <NativeNumberInput additionalClassName={"anzahl stunden"} value={s_row.STUNDEN} readonly={true}/>
        </DkmRespFormCell>
    }

    // // Taetigkeit
    function renderTaetigkeit() {
        function handleChange(newv: string | null) {
            chgRow("TAETIGKEIT", newv)
        }

        return <div className={"ownRow taetigkeit"}>
            <NativeMemo
                className={"w-full h-32 border border-gray-300 rounded-md p-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"}
                value={s_row.TAETIGKEIT} onChange={handleChange} maxlen={255} rowCount={4}/>
        </div>
    }

    // // h_Wart Wartungsstd
    function renderWartungsstd() {
        return <DkmRespFormCell label={"h für Wartung"} shouldRenderError={false} field={"h_wart"}>
            <NativeNumberInput name={"h_wart"} additionalClassName={"anzahl"} value={s_row.h_wart} onChange={v => chgRow("h_wart", v)}/>
        </DkmRespFormCell>
    }

    // Extraverrechnung
    function renderExtraVerr() {
        return <DkmRespFormCell label={"extra verr."} shouldRenderError={false} field={"EXTRAVER"}>
            <NativeNumberInput name={"EXTRAVER"} additionalClassName={"anzahl"} value={s_row.EXTRAVER}
                               onChange={v => chgRow("EXTRAVER", v)}/>
        </DkmRespFormCell>
    }

    // Honorar
    function renderHonorar() {
        return <DkmRespFormCell label={"hon / h"} field={"HONORAR"} shouldRenderError={false}>
            <NativeNumberInput name="HONORAR" additionalClassName={"waehrung"} value={s_row.HONORAR}
                               onChange={v => chgRow("HONORAR", v)}/>
        </DkmRespFormCell>
    }

    //Gesamt
    function renderGesamt() {
        return <DkmRespFormCell label="Gesamt" field="GESAMTHONORAR" shouldRenderError={false}>
            <NativeNumberInput name="GESAMTHONORAR" additionalClassName={"waehrung"} value={s_row.GESAMTHONORAR}
                               onChange={v => chgRow("GESAMTHONORAR", v)}/>
        </DkmRespFormCell>
    }


    // ok ->Speichern
    function renderBtnOk() {

        function calcDisabled(): boolean {
            if (!util.isSaveValid(s_row)) {
                return true;
            }
            if (!isRowDirty()) {
                return true;
            }
            return false;
        }

        return <button className={"btn"} disabled={calcDisabled()}
                       onClick={() => props.onSave(s_row)}>Speichern</button>

    }

    function isRowDirty(): boolean {
        return JSON.stringify(props.row) !== JSON.stringify(s_row)
    }

    // abbrechen
    function renderBtnCancel() {
        const dirty = !isRowDirty()
        const caption: string = !dirty ? "Abbrechen" : "Zurück";

        return <button className={"btn"} onClick={() => props.onCancel()}>{caption}</button>
    }


    //var fset = new TDkmUIFieldSet(getJelemid("fieldset"), "Arbeitsbericht bearbeiten");
    if ((!props.row) || (!s_row)) {
        return null;
    }

    return <fieldset className={"bg-white-500 w-full"} title={"Arbeitsbericht bearbeiten"}>
        <div className={"bg-blue-50 mb-20 ring-gray-300 px-2 py-2 "}>
            <DkmRepFormRow>
                {renderDatum()}
                {renderVon()}
                {renderBis()}
                {renderStunden()}
            </DkmRepFormRow>
            <DkmRepFormRow>
                {renderTaetigkeit()}
            </DkmRepFormRow>
            <DkmRepFormRow>
                {renderWartungsstd()}
                {renderExtraVerr()}
                {renderHonorar()}
                {renderGesamt()}
            </DkmRepFormRow>
            <div className={"ownRow"}>
                {renderBtnOk()}
                {renderBtnCancel()}
            </div>
        </div>
    </fieldset>
}
