import {useEffect, useReducer} from "react";
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
    creActChgWorkRepHonorar,
    creActSetDoId,
    creActSetWeggeschickt,
    createActSetDataDirect,
    honFormReducer
} from "./hon_form_data_reducer.ts";
import NativeBoolInput from "../dkm_comps/NativeBoolInput.tsx";
import type {MayBeString} from "../dkm_django/dkm_django_m.ts";


interface Props {
    guiData: HonGuiData;
    fnSaveGuiData: (guidata: HonGuiData) => void
    fnCreateDocx: (honorar: number) => Promise<number>;
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


function HonFormComp(props: Props) {
    //const [s_guiData, s_setGuiData] = useState<RechGuiData | null>(null);
    const [s_guiData, s_dispGuiData] = useReducer(honFormReducer, props.guiData);

    useEffect(() => {
        //s_setGuiData(props.guiData);
        s_dispGuiData(createActSetDataDirect(props.guiData))
    }, [props.guiData])

    // anwen
    function renderFirma() {
        return <DkmRespFormCell label={"Firma1"}>
            {props.guiData.hon_row.anwen ||""}
        </DkmRespFormCell>
    }
    // hononrarnr
    function renderHonorarnr() {
        return <DkmRespFormCell label={"Honorarnr."}>
            {props.guiData.hon_row.honorarnr ||""}
        </DkmRespFormCell>
    }
    // Gesamtpreis
    function renderGesamtpreis() {
        return <DkmRespFormCell label={"Gesamtbetrag"}>
            { fmtGermanNum(props.guiData.hon_row.gesamtpreis)}
        </DkmRespFormCell>
    }
    // weggeschickt
    function renderWeggeschickt() {
        function handleChg(newValue:boolean|null|undefined) {
            s_dispGuiData(creActSetWeggeschickt(newValue))
        }
        return <DkmRespFormCell label={"weggeschickt?"}>
            <NativeBoolInput value={props.guiData.hon_row.weggeschickt}
                             onChange={handleChg}/>
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
                                  creActChgWorkRepHonorar({honorarnr:newHonorarnr, rowIdx:idx}))}
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

    function calcDisabledCreateDocx(): boolean {
        return false;
    }

    function calcDisabledOPenDocx(): boolean {
        return !(s_guiData?.hon_row?.do_id)
    }

    function calcDisabledSave(): boolean {
        const dataChanged = JSON.stringify(props.guiData) !=
            JSON.stringify(s_guiData);
        if (dataChanged) {
            return false;
        }
        return true;
    }

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
                s_dispGuiData(creActSetDoId(do_id))
            });
    }


    if (!props.guiData) {
        return null;
    }
    return (
        <DkmRespForm>
            {renderFirma()}
            {/*//hononrarnr*/}
            {renderHonorarnr()}
            {/*//Gesamtpreis*/}
            {renderGesamtpreis()}
            {/*//weggeschickt*/}
            {renderWeggeschickt()}
            {renderPoss()}
            <DkmRespFormCell>
                < button type={"button"}
                         disabled={calcDisabledSave()}
                         className={"dkm-default-button"}
                         onClick={() => props.fnSaveGuiData(s_guiData || {
                             pos_rows: [], rech_row: {}
                         })}>
                    speichern
                </button>
                < button type={"button"} disabled={calcDisabledCreateDocx()}
                         onClick={handleCreateDocx}>
                    Word erstellen
                </button>
                < button type={"button"} disabled={calcDisabledOPenDocx()}
                         onClick={handleOpenDocx}>
                    Word öffnen
                </button>
            </DkmRespFormCell>
        </DkmRespForm>
    )
}

export default HonFormComp;