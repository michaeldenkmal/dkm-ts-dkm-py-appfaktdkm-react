import {useEffect, useState} from "react";
import DkmRespForm from "../dkmtags/DkmRespForm.tsx";
import DkmRespFormCell from "../dkmtags/DkmRespFormCell.tsx";
import {fmtGermanDate, fmtTimeOnlyHourMin} from "@at.dkm/dkm-ts-lib-gen/lib/dateUtil";
import DkmRespTableMain from "../dkmtags/DkmRespTableMain.tsx";
import DkmRespTableHead from "../dkmtags/DkmRespTableHead.tsx";
import DkmRespTableHeadTh from "../dkmtags/DkmRespTableHeadTh.tsx";
import DkmRespTableRow from "../dkmtags/DkmRespTableRow.tsx";
import DkmRespTableCell from "../dkmtags/DkmRespTableCell.tsx";
import type {WorkRepRow} from "../model/hon_form_m.ts";
import {fmtGermanCurrency} from "@at.dkm/dkm-ts-lib-gen/lib/u";
import NativeBoolInput from "../dkm_comps/NativeBoolInput.tsx";
import type {Float, MayBeBool} from "../dkm_django/dkm_django_m.ts";
import {useImmerReducer} from "use-immer";
import type {ArbRechTemp, CalcHonToSettleRes} from "../model/hon_abr_m.ts";
import {fmtDecimal2Digits} from "../dkm_comps/decimal_util.ts";
import {
    calcHonAbrGuiFlags,
    creActSetAbrechnen,
    type HonAbrGuiFlags,
    honAbrReducer
} from "./hon_abr_data_reducer.ts";
import React from "react";


interface Props {
    guiData: CalcHonToSettleRes;
    execAbrech: (guidata: CalcHonToSettleRes) => void
    loadWorkRepRows: (kuhon_nr: Float) => Promise<Array<WorkRepRow>>
}

export interface FormReduceState {
    btnStartAbrech?: boolean
}


interface WorkRepRowsTableProps {
    rows: Array<WorkRepRow>
}

function WorkRepRowsTable(props: WorkRepRowsTableProps) {
    function renderTr(r: WorkRepRow) {
        {/*// Datum	von	bis	Tätigkeit	Gesamhonor*/
        }

        return <>
            <DkmRespTableRow key={r.work_rep_float_nr}>
                <DkmRespTableCell label={"Datum"}>
                    {fmtGermanDate(r.work_date)}
                </DkmRespTableCell>
                <DkmRespTableCell label={"von"}>
                    {fmtTimeOnlyHourMin(r.von)}
                </DkmRespTableCell>
                <DkmRespTableCell label={"bis"}>
                    {fmtTimeOnlyHourMin(r.bis)}
                </DkmRespTableCell>
                <DkmRespTableCell label={"Tätigkeit"}>
                    {r.taetigkeit}
                </DkmRespTableCell>
                <DkmRespTableCell label={"Gesamthonorar"}>
                    {fmtGermanCurrency(r.gesamthonorar)}
                </DkmRespTableCell>
            </DkmRespTableRow>
            <DkmRespTableRow>

            </DkmRespTableRow>
        </>
    }

    function renderBody() {
        return <tbody>
        {props.rows.map(r => renderTr(r))}
        </tbody>
    }

    return <DkmRespTableMain>
        <DkmRespTableHead>
            {/*// Datum	von	bis	Tätigkeit	Gesamhonor*/}
            <DkmRespTableRow>
                <DkmRespTableHeadTh>Datum</DkmRespTableHeadTh>
                <DkmRespTableHeadTh>von</DkmRespTableHeadTh>
                <DkmRespTableHeadTh>bis</DkmRespTableHeadTh>
                <DkmRespTableHeadTh>Tätigkeit</DkmRespTableHeadTh>
                <DkmRespTableHeadTh>Gesamthonorar</DkmRespTableHeadTh>
            </DkmRespTableRow>
        </DkmRespTableHead>
        {renderBody()}
    </DkmRespTableMain>
}

interface AbrTrProps {
    row: ArbRechTemp;
    loadWorkRepRows: (kuhon_nr: Float) => Promise<Array<WorkRepRow>>
    onChangeAbrechnen: (abrechnen: MayBeBool) => void
}

const SHOW_WORK_REPS = "Arbeitsberichte anzeigen";
const HIDE_WORK_REPS = "Arbeitsberichte verstecken";


function AbrTr(props: AbrTrProps) {

    const [s_workRepRows, s_setWorkRepRows] = useState<Array<WorkRepRow> | undefined>();
    const [s_showWorkRepCapt, s_setShowWorkRepCapt] = useState(SHOW_WORK_REPS);

    function renderWorkRepTable() {
        if (!s_setWorkRepRows) {
            return;
        }
        if (!s_setWorkRepRows.length) {
            return;
        }
        if (s_showWorkRepCapt == SHOW_WORK_REPS) {
            return;
        }
        return <DkmRespTableRow>
            <DkmRespTableCell label={"Arbeitsberichte"} colSpan={4}>
                <WorkRepRowsTable rows={s_workRepRows || []}></WorkRepRowsTable>
            </DkmRespTableCell>
        </DkmRespTableRow>
    }

    function handleShowWorkRepsClick() {
        if (!s_workRepRows) {
            props.loadWorkRepRows(props.row.nr)
                .then(workRepRows => {
                    s_setWorkRepRows(workRepRows);
                    s_setShowWorkRepCapt(HIDE_WORK_REPS);
                });
        }

        if (s_showWorkRepCapt === SHOW_WORK_REPS) {
            s_setShowWorkRepCapt(HIDE_WORK_REPS);
        } else {
            s_setShowWorkRepCapt(SHOW_WORK_REPS);
        }
    }

    // button col für anzeige der Arbeitsberichte
    // Firma1
    //Honorarsumme
    // abrechnen?
    return <React.Fragment key={props.row.nr}>
        <DkmRespTableRow >
            <DkmRespTableCell label={"action"}>
                <button onClick={handleShowWorkRepsClick}>{s_showWorkRepCapt}</button>
            </DkmRespTableCell>
            <DkmRespTableCell label={"Firma"}>
                {props.row.firma1}
            </DkmRespTableCell>
            <DkmRespTableCell label={"Honorarsumme"}>
                {fmtDecimal2Digits(props.row.gesamt_sum)}
            </DkmRespTableCell>
            <DkmRespTableCell label={"abrechnen"}>
                <NativeBoolInput value={props.row.abrechnen} onChange={props.onChangeAbrechnen}/>
            </DkmRespTableCell>
        </DkmRespTableRow>
        {renderWorkRepTable()}
    </React.Fragment>
}


function HonAbrComp(props: Props) {
    //const [s_guiData, s_setGuiData] = useState<RechGuiData | null>(null);
    const [s_guiData, s_dispGuiData] = useImmerReducer(honAbrReducer, props.guiData);
    const [s_guiFlags, s_setGuiFlags] = useState<HonAbrGuiFlags>();
    //const toastCenter = useToastCenter();

    useEffect(() => {
        //s_setGuiData(props.guiData);
        s_dispGuiData({type: "set_data_direct", newData: props.guiData});
    }, [props.guiData, s_dispGuiData])

    useEffect(() => {
        s_setGuiFlags(calcHonAbrGuiFlags(s_guiData));
    }, [s_guiData]);

    // Kundennr	Firma1	Honorar-Summe	abrechnen


    function renderTableHead() {
        return (
            <DkmRespTableHead>
                <DkmRespTableRow>
                    <DkmRespTableHeadTh>
                        action
                    </DkmRespTableHeadTh>
                    <DkmRespTableHeadTh>
                        Firma1
                    </DkmRespTableHeadTh>
                    <DkmRespTableHeadTh>
                        Gesamthonorar
                    </DkmRespTableHeadTh>
                    <DkmRespTableHeadTh>
                        abrechnen
                    </DkmRespTableHeadTh>
                </DkmRespTableRow>
            </DkmRespTableHead>
        )
    }

    function renderTableBody() {

        if (!s_guiData) {
            return null;
        }
        return <tbody>
        {s_guiData.rows_to_choose.map((rpt: ArbRechTemp, rowIdx: number) => {
            return <AbrTr key={rpt.nr} row={rpt}
                          loadWorkRepRows={props.loadWorkRepRows}
                          onChangeAbrechnen={abrechnen => s_dispGuiData(creActSetAbrechnen({
                              abrechnen, rowIdx
                          }))}
            />
        })}
        </tbody>
    }

    function renderTable() {
        return <DkmRespTableMain>
            {renderTableHead()}
            {renderTableBody()}
        </DkmRespTableMain>
    }

    if ((!s_guiData) || (!s_guiFlags)) {
        return null;
    }
    return (
        <DkmRespForm>
            {renderTable()}
            <hr/>
            <DkmRespFormCell>
                < button type={"button"}
                         disabled={s_guiFlags?.btnExecAbrechdisabled}
                         className={"dkm-default-button"}
                         onClick={() => {
                             props.execAbrech(s_guiData);
                         }}>
                    Abrechnen starten
                </button>
            </DkmRespFormCell>
        </DkmRespForm>
    )
}

export default HonAbrComp;