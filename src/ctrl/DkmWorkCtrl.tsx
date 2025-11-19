import {type DatenabTestRow, type TSumNotAccountedRow} from "../model/work_rep_m.ts";
import {useEffect, useState} from "react";
import DkmWorkHead from "../comp/DkmWorkHead.tsx";
import DkmWorkList from "../comp/DkmWorkList.tsx";
import * as work_rep_ws from "../ws/work_rep_ws.ts";
import * as kuhon_api_ws from "../ws/kunhon_api_ws.ts";
import {arrFindFirstUpdateOrAppend} from "@at.dkm/dkm-ts-lib-gen/lib/u";
import {dateWithoutTime} from "@at.dkm/dkm-ts-lib-gen/lib/dateUtil";
import DkmSumNotAccountedComp from "../comp/DkmSumNotAccountedComp.tsx";
import ErrhandlerComp from "../comp/ErrhandlerComp.tsx";
import {getKundenhonorarRowByNr, type KundenhonorarRow} from "../model/kuhon_form_m.ts";
import BaseLayout from "../dkm_comps/BaseLayout.tsx";
import BaseMenuBar from "../dkm_comps/BaseMenuBar.tsx";

export default function DkmWorkCtrl() {
    const [s_workRows,s_setWorkRows] = useState<Array<DatenabTestRow>>();
    const [s_curKuHonNr, s_setCurKuHonNr] = useState(0);
    const [s_kuhonRows, s_setKuhonRows] = useState<KundenhonorarRow[]>([]);
    const [s_err,s_setErr] = useState<string>("");
    const [s_curWorkEntryNr, s_setCurWorkEntryNr] = useState(0);
    const [s_showSumNotAccounted, s_setShowSumNotAccounted] = useState(false);
    const [s_sumNotAccountedRows,s_setSumNotAccountedRows] = useState<TSumNotAccountedRow[]>([]);

    async function loadData() {
        let action:string = "kuhon_list_ws.get_all";
        try {
            const kuhonList= await kuhon_api_ws.get_all_kuhon_rows(true);
            s_setKuhonRows(kuhonList);
            action = "loadKuhonNr"
            const storedKuHoNr = loadStoredKuhonnr();
            if (storedKuHoNr) {
                action = "loadKuHonNr"
                const dbWorkRows = await work_rep_ws.getArbeitsberichtsRowsByKdNr({kdnr: storedKuHoNr.toString()});
                s_setWorkRows(dbWorkRows);
                s_setCurKuHonNr(storedKuHoNr);
            }
        }
        catch (e) {
            const err = new Error(`${action}: ${e}`);
            handleError(err);
        }
    }

    useEffect(() => {
        loadData();
    }, []);

    function handleOnEditWorkEntry(row:DatenabTestRow) {
        s_setCurWorkEntryNr(row.NR||0)
    }
    const STORE_PATH = "dkm-ts-dkm-fakt_kuhonnr"
    function loadStoredKuhonnr():number {
        const szval =localStorage.getItem(STORE_PATH)
        return parseInt(szval||"");
    }

    function saveStoredKuhonnr(kuhonNr:number|null|undefined):void {
        if (kuhonNr ) {
            localStorage.setItem(STORE_PATH,kuhonNr.toString());
        }
    }

    function handleOnCancelEdit() {
        if (!s_workRows) {
            return
        }
        // wenn es einen neu angelegten Datensatz gibt, diesen löschen
        const newWorkRows  = s_workRows.filter(wr=> (wr.NR||0)>0)
        s_setWorkRows(newWorkRows);
        s_setCurWorkEntryNr(0)
    }

    function handleOnSaveEntry(row:DatenabTestRow) {
        if (!s_workRows) {
            return;
        }
        const rowToBeSavedNr = !row.NR ?  -1: row.NR;
        work_rep_ws.saveArbeitsberichtsRow(row)
            .then(savedRow=> {
                // Jetzt die Zeile ersetzen mit dem neuen Wert
                // vorallem wichtig, wenn es ein neuer Datensatz war
                const curArbRows = [...s_workRows];
                arrFindFirstUpdateOrAppend(curArbRows,savedRow,r=>r.NR== rowToBeSavedNr)
                s_setWorkRows(curArbRows);
                s_setCurWorkEntryNr(0);
            })
            .catch(err=> handleError(err));
    }

    function renderWorkList() {
        if ( (s_workRows && s_workRows.length > 0) &&(!s_showSumNotAccounted) ) {
            return <DkmWorkList rows={s_workRows} curWorkEntryNr={s_curWorkEntryNr}
                                onEditWorkEntry={handleOnEditWorkEntry}
                                onCancelEdit={handleOnCancelEdit}
                                onSaveWorkEntry={handleOnSaveEntry}
            />
        }
        return null;
    }

    function handleError(err:Error) {
        console.log(err);
        s_setErr(err.message|| err.toString());
    }

    function handleSetCurKoHoNr(kunhonNr:number) {
        work_rep_ws.getArbeitsberichtsRowsByKdNr({kdnr:kunhonNr.toString()})
            .then(rows=>  {
                s_setCurKuHonNr(kunhonNr);
                s_setWorkRows(rows);
                saveStoredKuhonnr(kunhonNr);
            })
            .catch(err => handleError(err))
    }

    function renderError() {
        if (s_err) {
            return <ErrhandlerComp err={s_err}/>
        }
        return null
    }

    function handleOnNewWorkRep() {

        if (s_curWorkEntryNr) {
            return
        }


        if (!s_curKuHonNr) {
            const err = new Error("kann keinen neuen Arbeitsbericht erstellen , wenn kein Kunde ausgewähl ist")
            handleError(err);
            return;
        }

        const kuhoRow = getKundenhonorarRowByNr(s_kuhonRows,s_curKuHonNr);
        if (!kuhoRow) {
            const err = new Error(`keine Zeile zu nr ${s_curKuHonNr} gefunden`)
            handleError(err);
            return;
        }
        const newRow:DatenabTestRow = {
            NR:-1,
            DATUM:dateWithoutTime(new Date()),
            KUNDE: s_curKuHonNr,
            KUNDENNAME: kuhoRow.firma1,
            HONORAR : kuhoRow.stundenhon
        }
        if (!s_workRows) {
            throw new Error("s_workRows is null")
        }
        s_setWorkRows([newRow, ...s_workRows]);
        s_setCurWorkEntryNr(-1);
    }

    function calcDisableNewButton() {
        if (s_curWorkEntryNr) {
            return true;
        }
        return false;
    }

    function handleToogleShowSumNotAccounted() {
        const showIt = !s_showSumNotAccounted;
        s_setShowSumNotAccounted(showIt)
        if (showIt) {
            work_rep_ws.getSumNotAccountedArbs()
                .then(rows=> {
                    s_setSumNotAccountedRows(rows);
                })
                .catch(err=> handleError(err));
        }
    }

    function renderSumNotAccounted() {
        if (s_showSumNotAccounted && (s_sumNotAccountedRows && s_sumNotAccountedRows.length > 0)) {
            return <DkmSumNotAccountedComp rows={s_sumNotAccountedRows}></DkmSumNotAccountedComp>
        }
    }

    function renderMenuBar() {
        return <BaseMenuBar items={[]}  currentCapt={"Arbeitsberichtseingabe"}/>
    }
    return <BaseLayout menu={renderMenuBar()}>
        <DkmWorkHead curKuHonNr={s_curKuHonNr} setCurKuHonNr={handleSetCurKoHoNr} kuhonrows={s_kuhonRows}
                     onNewWorkRep={handleOnNewWorkRep}
                     onToogleShowSumNotAccounted={handleToogleShowSumNotAccounted}
                     disableButtonNew={calcDisableNewButton()}
        />
        {renderError()}
        {renderSumNotAccounted()}
        {renderWorkList()}
    </BaseLayout>


}