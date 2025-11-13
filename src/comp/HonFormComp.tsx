import {useEffect, useRef, useState} from "react";
import DkmRespForm from "../dkmtags/DkmRespForm.tsx";
import DkmRespFormCell from "../dkmtags/DkmRespFormCell.tsx";
import {fmtGermanDate, fmtTimeOnlyHourMin} from "@at.dkm/dkm-ts-lib-gen/lib/dateUtil";
import DkmRespTableMain from "../dkmtags/DkmRespTableMain.tsx";
import DkmRespTableHead from "../dkmtags/DkmRespTableHead.tsx";
import DkmRespTableHeadTh from "../dkmtags/DkmRespTableHeadTh.tsx";
import DkmRespTableRow from "../dkmtags/DkmRespTableRow.tsx";
import DkmRespTableCell from "../dkmtags/DkmRespTableCell.tsx";
import {gotoDoc} from "../oh_url_hander/ouh_docs.ts";
import type {HonGuiData, WorkRepRow} from "../model/hon_form_m.ts";
import {fmtGermanNum} from "@at.dkm/dkm-ts-lib-gen/lib/u";
import {NativeTextInput} from "../dkm_comps/NativeTextInput.tsx";
import {
    calcGuiFlags,
    getLastResettleDate,
    honFormReducer
} from "./hon_form_data_reducer.ts";
import NativeBoolInput from "../dkm_comps/NativeBoolInput.tsx";
import type {Float, MayBeDate, MayBeString} from "../dkm_django/dkm_django_m.ts";
import {useToastCenter} from "../dkm_comps/ToastCenterContext.tsx";
import {useImmerReducer} from "use-immer";
import NativeDateInput from "../dkm_comps/NativeDateInput.tsx";
import NativeDialog from "../dkm_comps/NativeDialog.tsx";
import {showMayBeHtmlError} from "../dkm_comps/err_handling.tsx";
import DkmRespFormRow from "../dkmtags/DkmRespFormRow.tsx";


interface Props {
    guiData: HonGuiData;
    fnSaveGuiData: (guidata: HonGuiData) => void
    fnCreateDocx: (honorar: number) => Promise<number>;
    fnResettleHonorar: (lastSettleDate:Date, nr:Float) =>void;
}

export interface FormReduceState {
    btnSaveDisabled?:boolean
    btnCreateDocxDisabled?:boolean
    btnOpenDocxDisabled?:boolean
    btnResettleDisabled?:boolean
}

interface WorkRepTrProps {
    row: WorkRepRow
    rowIdx: number
    chgHonorarNr:(newHonorarnr:MayBeString)=>void;
}

function WorkRepTr(props: WorkRepTrProps) {

    return <DkmRespTableRow key={props.row.work_rep_float_nr}>
        <DkmRespTableCell label={"Datum"}>
            {fmtGermanDate(props.row.work_date)}
        </DkmRespTableCell>
        <DkmRespTableCell label={"von"}>
            {fmtTimeOnlyHourMin(props.row.von)}
        </DkmRespTableCell>
        <DkmRespTableCell label={"bis"}>
            {fmtTimeOnlyHourMin(props.row.bis)}
        </DkmRespTableCell>
        <DkmRespTableCell label={"Tätigkeit"} valueClass={"flex-3"}>
            {props.row.taetigkeit||""}
        </DkmRespTableCell>
        <DkmRespTableCell label={"Gesamhonorar"} >
            {fmtGermanNum(props.row.gesamthonorar)}
        </DkmRespTableCell>

        <DkmRespTableCell label={"Honorarnr"}>
            <NativeTextInput value={props.row.honorarnr || ""}
                               additionalClassName={"w-full md:w-40"}
                               onChange={v=>props.chgHonorarNr(v) }/>
        </DkmRespTableCell>
    </DkmRespTableRow>
}

interface TrViewOnlyProps {
    children: React.ReactNode;
}

function TrViewOnlyValue(props:TrViewOnlyProps) {
    return <div>{props.children}</div>
}


interface AksDateForResettleProps{
    curLastDate: MayBeDate;
    onOk:(newDate:Date) => void;
}
function AskDateForResettle (props:AksDateForResettleProps) {

    const [s_lastSettleDate, s_setLastSettleDate] = useState<MayBeDate>();
    useEffect(()=> {
        s_setLastSettleDate(props.curLastDate);
    }, [props.curLastDate])

    function handleChange(newDv:MayBeDate) {
        s_setLastSettleDate(newDv);
    }

    function handleOkCLick():void {
        if (s_lastSettleDate) {
            props.onOk(s_lastSettleDate);
        }
    }

    function calcDisableOKBtn():boolean {
        return !s_lastSettleDate;
    }



    return <div>
        <label>Letztes Datum für Abrechnung</label>
        <NativeDateInput value={s_lastSettleDate} onChange={handleChange}/>
        <button disabled={calcDisableOKBtn()}  onClick={handleOkCLick}></button>
    </div>
}

function HonFormComp(props: Props) {
    //const [s_guiData, s_setGuiData] = useState<RechGuiData | null>(null);
    const [s_guiData, s_dispGuiData] = useImmerReducer(honFormReducer, props.guiData);
    const [s_showResettleDlg, s_setShowRessettleDlg] = useState<boolean>(false);
    const [s_formGuiState, s_setFormGuiState] = useState<FormReduceState>({});
    const ref_resettle_date = useRef<Date>(null)

    const toastCenter = useToastCenter();
    // Setzen nach Laden, oder wenn sich props.
    useEffect(() => {
        //s_setGuiData(props.guiData);
        s_dispGuiData({type:"set_data_direct",newData:props.guiData});
    }, [props.guiData, s_dispGuiData])

    useEffect(()=> {
        s_setFormGuiState(calcGuiFlags(s_guiData));
    },[s_guiData]);

    useEffect(()=> {
        if (!s_guiData) {
            ref_resettle_date.current = null;
            return;
        }
        ref_resettle_date.current = getLastResettleDate(s_guiData, s_guiData.hon_row.honorarnr)
    },[s_guiData])

    // anwen
    function renderFirma() {
        return <DkmRespFormCell label={"Firma1"} shouldRenderError={true} required field={"anwen"} >
            <TrViewOnlyValue>
                {s_guiData.hon_row.anwen ||""}
            </TrViewOnlyValue>
        </DkmRespFormCell>
    }
    // hononrarnr
    function renderHonorarnr() {
        return <DkmRespFormCell label={"Honorarnr."} shouldRenderError={false} field={"honorarnr"}>
            <TrViewOnlyValue>
                {s_guiData.hon_row.honorarnr ||""}
            </TrViewOnlyValue>
        </DkmRespFormCell>
    }
    // Gesamtpreis
    function renderGesamtpreis() {
        return <DkmRespFormCell label={"Gesamtbetrag"} shouldRenderError={false} field={"gesamtpreis"}>
            <TrViewOnlyValue>
                { fmtGermanNum(s_guiData.hon_row.gesamtpreis)}
            </TrViewOnlyValue>
        </DkmRespFormCell>
    }
    // weggeschickt
    function renderWeggeschickt() {
        function handleChg(newValue:boolean|null|undefined) {
            s_dispGuiData({type:"set_weggeschickt",istWeggeschickt:newValue});
        }
        return <DkmRespFormCell label={"weggeschickt?"} shouldRenderError={false} field={"weggeschickt"}>
            <TrViewOnlyValue>
                <NativeBoolInput value={s_guiData.hon_row.weggeschickt}
                                 onChange={handleChg}/>
            </TrViewOnlyValue>
        </DkmRespFormCell>
    }







    function renderPossHead() {
        // Datum	von	bis	Tätigkeit	Gesamhonor	Honorarnr
        return (
            <DkmRespTableHead>
                <DkmRespTableRow>
                    <DkmRespTableHeadTh>
                        Datum
                    </DkmRespTableHeadTh>
                    <DkmRespTableHeadTh>
                        von
                    </DkmRespTableHeadTh>
                    <DkmRespTableHeadTh>
                        bis
                    </DkmRespTableHeadTh>
                    <DkmRespTableHeadTh>
                        Tätigkeit
                    </DkmRespTableHeadTh>
                    <DkmRespTableHeadTh>
                        Gesamthonorar
                    </DkmRespTableHeadTh>
                    <DkmRespTableHeadTh>
                        Honorarnr
                    </DkmRespTableHeadTh>
                </DkmRespTableRow>
            </DkmRespTableHead>
        )
    }

    function renderPossBody() {

        if (!s_guiData) {
            return null;
        }
        return <tbody>
        {s_guiData.work_rep_rows.map((rpr: WorkRepRow, idx: number) => {
            return <WorkRepTr key={rpr.work_rep_float_nr || idx} rowIdx={idx} row={rpr}
                              chgHonorarNr={newHonorarnr => s_dispGuiData(
                                  {type:"chg_work_rep_honararnr",
                                        honorarnr:newHonorarnr, rowIdx:idx
                                  })}
            />
        })}
        </tbody>
    }

    function renderPoss() {
        return <DkmRespTableMain>
            {renderPossHead()}
            {renderPossBody()}
        </DkmRespTableMain>
    }

    // function calcDisabledCreateDocx(): boolean {
    //     return false;
    // }
    //
    // function calcDisabledOPenDocx(): boolean {
    //     return !(s_guiData?.hon_row?.do_id)
    // }
    //
    // function calcDisabledSave(): boolean {
    //     const js1=JSON.stringify(props.guiData);
    //     const js2=JSON.stringify(s_guiData);
    //     const dataChanged = js1!=js2;
    //     if (dataChanged) {
    //         return false;
    //     }
    //     return true;
    // }
    //
    function handleOpenDocx() {
        if (!s_guiData.hon_row?.do_id) {
            return;
        }
        gotoDoc(s_guiData.hon_row.do_id)
    }

    function handleCreateDocx() {
        const nr = s_guiData.hon_row?.nr;
        if (!nr) {
            return;
        }
        props.fnCreateDocx(nr)
            .then(do_id => {
                s_dispGuiData({type:"set_do_id",do_id:do_id})
            })
            .catch(e => {
                const errmsg=`create_docx: ${nr}:${e}`
                showMayBeHtmlError(toastCenter,{e,errprefix:errmsg});
            })
    }

    function renderResettleDlg() {
        function handleOk(lastSettleDate:Date) {
            ref_resettle_date.current = lastSettleDate;
            props.fnResettleHonorar(lastSettleDate,s_guiData.hon_row.nr);
            s_setShowRessettleDlg(false);
        }

        if (s_showResettleDlg) {
            return <NativeDialog isOpen={s_showResettleDlg} onClose={()=> s_setShowRessettleDlg(false)}>
                <AskDateForResettle onOk={handleOk} curLastDate={ref_resettle_date.current}/>
            </NativeDialog>
        }
    }

    if (!s_guiData) {
        return null;
    }
    return (
        <DkmRespForm>
            {renderResettleDlg()}
            {renderFirma()}
            {/*//hononrarnr*/}
            {renderHonorarnr()}
            {/*//Gesamtpreis*/}
            {renderGesamtpreis()}
            {/*//weggeschickt*/}
            {renderWeggeschickt()}
            {renderPoss()}
            <DkmRespFormRow>
                < button type={"button"}
                         disabled={s_formGuiState.btnSaveDisabled}
                         className={"dkm-default-button"}
                         onClick={() =>  {
                             console.log(`save: ${JSON.stringify(s_guiData,null,4)}`)
                             props.fnSaveGuiData(s_guiData)
                         }}>
                    speichern
                </button>
                < button type={"button"} disabled={s_formGuiState.btnCreateDocxDisabled}
                         onClick={handleCreateDocx}>
                    Word erstellen
                </button>
                < button type={"button"} disabled={s_formGuiState.btnOpenDocxDisabled}
                         onClick={handleOpenDocx}>
                    Word öffnen
                </button>
                < button type={"button"}
                         disabled={s_formGuiState.btnResettleDisabled}
                         onClick={()=> s_setShowRessettleDlg(true)}>
                    Neu berechnen
                </button>
            </DkmRespFormRow>
        </DkmRespForm>
    )
}

export default HonFormComp;