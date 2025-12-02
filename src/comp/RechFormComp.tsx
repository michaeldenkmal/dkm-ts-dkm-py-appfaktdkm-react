import {
    anyErrors,
    type RechFormRow,
    type RechFormRowErrs,
    type RechGuiData,
    type RechPosRow
} from "../model/rech_form_m.ts";
import {useEffect, useState} from "react";
import DkmRespForm from "../dkm_comps/DkmRespForm.tsx";
import DkmRespFormCell from "../dkm_comps/DkmRespFormCell.tsx";
import DkmNativeSelect, {type OptionItem} from "../dkm_comps/DkmNativeSelect.tsx";
import {fmtGermanDate} from "@at.dkm/dkm-ts-lib-gen/lib/dateUtil";
import DkmRespTableMain from "../dkm_comps/DkmRespTableMain.tsx";
import DkmRespTableHead from "../dkm_comps/DkmRespTableHead.tsx";
import DkmRespTableHeadTh from "../dkm_comps/DkmRespTableHeadTh.tsx";
import DkmRespTableRow from "../dkm_comps/DkmRespTableRow.tsx";
import {NativeNumberInput} from "../dkm_comps/NativeNumberInput.tsx";
import {NativeMemo} from "../dkm_comps/NativeMemo.tsx";
import {decimalToNumber, fmtDecimal2Digits, numberToDecimal} from "../dkm_comps/decimal_util.ts";
import DkmRespTableCell from "../dkm_comps/DkmRespTableCell.tsx";
import {TrashIcon} from "@heroicons/react/16/solid";
import NativeDialog from "../dkm_comps/NativeDialog.tsx";
import {
    createActAddPosRow,
    createActDelPos, createActionRechPos,
    createActRech,
    createActSetDataDirect,
    rechFormReducer, validateRechGuiData
} from "./rech_form_data_reducer.ts";
import {gotoDoc} from "../dkm_comps/ouh_docs.ts";
import DkmRespFormRow from "../dkm_comps/DkmRespFormRow.tsx";
import {useImmerReducer} from "use-immer";
import NativeBoolInput from "../dkm_comps/NativeBoolInput.tsx";
import type {MayBeBool} from "@at.dkm/dkm-ts-lib-django/lib/dkm_django_m";


interface Props {
    guiData: RechGuiData;
    rechFormRowErrs?: RechFormRowErrs;
    kuhonCbx: Array<OptionItem>;
    fnSaveGuiData: (guidata: RechGuiData) => void
    fnRemovePosRow: (posRowNr: number) => Promise<void>;
    fnCreateDox: (vnr: number) => Promise<number>;
}

function checkRechFormRowName(f: keyof RechFormRow): string {
    return f as any as string;
}

interface RechPossTrProps {
    row: RechPosRow
    rowIdx: number
    fnChange: (newRechPosRow: RechPosRow, rowIdx: number, recalc: boolean) => void
    fnDeleteRow: (rowIdx: number) => void
}

function RechPossTr(props: RechPossTrProps) {

    function chg(recalc: boolean, cb: (newRow: RechPosRow) => void) {
        const newRechPosRow = {
            ...props.row
        }
        cb(newRechPosRow);
        props.fnChange(newRechPosRow, props.rowIdx, recalc);
    }

    function handleRechPosChg(newv: number | null) {
        chg(true, v => {
            v.pos = newv
        });
    }


    return <DkmRespTableRow key={props.row.nr || props.rowIdx}>
        <DkmRespTableCell label={"Pos"}>
            <NativeNumberInput value={props.row.pos}
                               additionalClassName={"w-full md:w-20"}
                               onChange={handleRechPosChg}/>
            <span className={"w-6 inline-block mt-2"}><TrashIcon className={"w-6 h-6"}
                                                                 onClick={() => props.fnDeleteRow(props.rowIdx)}/>
                </span>
        </DkmRespTableCell>
        <DkmRespTableCell label={"Bezeichnung"} valueClass={"flex-3"}>
            <NativeMemo value={props.row.bezeichnung}
                        additionalClassName={"w-full md:w-100"}
                        onChange={v => {
                            chg(false, vnew => {
                                vnew.bezeichnung = v
                            })
                        }}
                        rowCount={3}
            />
        </DkmRespTableCell>
        <DkmRespTableCell label={"Menge"}>
            <NativeNumberInput value={props.row.menge}
                               additionalClassName={"w-full md:w-30"}
                               onChange={v => {
                                   chg(true, vnew => {
                                       vnew.menge = v
                                   })
                               }
                               }/>
        </DkmRespTableCell>
        <DkmRespTableCell label={"Einzelpreis"}>
            <NativeNumberInput value={decimalToNumber(props.row.einzelpreis)}
                               additionalClassName={"w-full md:w-40"}
                               onChange={v => {
                                   chg(true, vnew => {
                                       vnew.einzelpreis = numberToDecimal(v);
                                   })
                               }
                               }/>
        </DkmRespTableCell>
        <DkmRespTableCell label={"Gesamtpreis"}>
            <div className={"w-full md:w-40"}>{fmtDecimal2Digits(props.row.gesamtpreis)}</div>
        </DkmRespTableCell>
    </DkmRespTableRow>
}


function RechFormComp(props: Props) {
    //const [s_guiData, s_setGuiData] = useState<RechGuiData | null>(null);
    const [s_guiData, s_dispGuiData] = useImmerReducer(rechFormReducer, props.guiData);
    const [s_errors, s_setErrors] = useState<RechFormRowErrs>({});
    const [s_showDlgRemovePosRow, s_setShowDlgRemovePosRow] = useState<boolean>(false);
    const [s_rowPosToDelete, s_setRowPosToDelete] = useState<number>(0);

    useEffect(() => {
        //s_setGuiData(props.guiData);
        s_dispGuiData(createActSetDataDirect(props.guiData))
    }, [props.guiData])

    useEffect(() => {
        s_setErrors(validateRechGuiData(s_guiData));
    }, [s_guiData])

    function renderDlgRemovePosRow() {
        if (!s_showDlgRemovePosRow) {
            return null;
        }

        function handleClose() {
            s_setShowDlgRemovePosRow(false);
        }

        function execDeleteRowPos() {
            props.fnRemovePosRow(s_rowPosToDelete).then(() => {
                if (s_guiData) {
                    removeRowByRowPosNr(s_rowPosToDelete)
                }
                s_setShowDlgRemovePosRow(false);
                s_setRowPosToDelete(0);
            })
        }

        function renderFooter() {
            return <button type={"button"} onClick={execDeleteRowPos}>
                löschen
            </button>
        }

        return <NativeDialog isOpen={s_showDlgRemovePosRow} onClose={handleClose}
                             title={"Rechnungsposition wirklich löschen?"}
                             footer={renderFooter()}
        >
            <p>Soll die Rechnungsposition wirklich gelöscht werden?</p>
        </NativeDialog>
    }


    function chgRechVal(cb: (newValue: RechFormRow) => void) {
        // if (!s_guiData) {
        //     return;
        // }
        // const newRechRow: RechFormRow = {...s_guiData?.rech_row || {}};
        // cb(newRechRow)
        // const newGuiData: RechGuiData = {
        //     ...s_guiData
        // };
        // newGuiData.rech_row = newRechRow;
        // s_setGuiData(newGuiData);
        s_dispGuiData(createActRech(cb))
    }

    function renderFirma() {
        function handleSelected(optItem: OptionItem) {
            chgRechVal(cv => {
                cv.f_nr = parseFloat(optItem.key);
            })
        }

        return <DkmRespFormCell label={"Firma1"}
                                field={checkRechFormRowName("f_nr")} shouldRenderError={true} required={true}
                                errors={s_errors.f_nr}
                                additionalClassName={"w-full lg:w-2/8"}>
            <DkmNativeSelect selectItems={props.kuhonCbx}
                             emptyOptionItem={{
                                 key: "",
                                 value: "--- Keine Firma ausgewählt ---"
                             }}
                             name={checkRechFormRowName("f_nr")}
                             value={s_guiData?.rech_row?.f_nr?.toString() || ""}
                             onSelected={handleSelected}/>
        </DkmRespFormCell>
    }

    function renderVerrechnetAm() {
        return <DkmRespFormCell label={"Rechnungsdatum"} shouldRenderError={false}
                                field={checkRechFormRowName("verrechnet_am")}
                                additionalClassName={"w-full lg:w-1/9"}
        >
            <div>
                {fmtGermanDate(props.guiData?.rech_row?.verrechnet_am)}
            </div>
        </DkmRespFormCell>
    }

    function renderRechnungsNr() {
        return <DkmRespFormCell label={"Rechnungsnr."} field={checkRechFormRowName("rechnungsnr")}
                                shouldRenderError={false}
                                additionalClassName={"w-full lg:w-1/9"}
        >
            <div>
                {s_guiData.rech_row?.rechnungsnr}
            </div>
        </DkmRespFormCell>
    }


    function renderZwischensumme() {
        return <DkmRespFormCell label={"Zwischensumme"} shouldRenderError={false}
                                field={checkRechFormRowName("zwischensumme")}
                                additionalClassName={"w-full lg:w-1/9"}
        >
            <div>
                {fmtDecimal2Digits(s_guiData.rech_row?.zwischensumme)}
            </div>
        </DkmRespFormCell>
    }

    function renderMwst() {
        return <DkmRespFormCell label={"Mwst"} field={checkRechFormRowName("mwst")}
                                shouldRenderError={false}
                                additionalClassName={"w-full lg:w-1/9"}
        >
            <div>
                {fmtDecimal2Digits(s_guiData.rech_row?.mwst)}
            </div>
        </DkmRespFormCell>
    }

    function renderGesamtPreis() {
        return <DkmRespFormCell label={"Gesamtpreis"} field={checkRechFormRowName("gesamtpreis")}
                                shouldRenderError={false} additionalClassName={"w-full lg:w-1/9"}
        >
            <div>
                {fmtDecimal2Digits(s_guiData.rech_row?.gesamtpreis)}
            </div>
        </DkmRespFormCell>
    }


    function renderPossHead() {
        return (
            <DkmRespTableHead>
                <DkmRespTableRow>
                    <DkmRespTableHeadTh>
                        Pos
                    </DkmRespTableHeadTh>
                    <DkmRespTableHeadTh>
                        Bezeichnung
                    </DkmRespTableHeadTh>
                    <DkmRespTableHeadTh>
                        Menge
                    </DkmRespTableHeadTh>
                    <DkmRespTableHeadTh>
                        Einzelpreis
                    </DkmRespTableHeadTh>
                    <DkmRespTableHeadTh>
                        Gesamtpreis
                    </DkmRespTableHeadTh>
                </DkmRespTableRow>
            </DkmRespTableHead>
        )
    }

    function removeRowByPredicat(fnFilter: (row: RechPosRow, idx: number) => boolean) {
        s_dispGuiData(createActDelPos({
            fnPredicate: fnFilter
        }))
    }

    function removeRowByIdx(rowIdx: number) {
        removeRowByPredicat((_posnr, idx) => {
            if (idx == rowIdx) {
                return false;
            }
            return true;
        })
        // if(!s_guiData) {
        //     return;
        // }
        // const newPosRows = arrPosRows.filter((_posr,idx) => {
        //     if (idx==rowIdx) {
        //         return false;
        //     }
        //     return true;
        // });
        // const newGuiData ={
        //     ...s_guiData,
        //     pos_rows: newPosRows,
        // }
        // s_setGuiData(newGuiData);
    }

    function removeRowByRowPosNr(rowPosNr: number) {
        removeRowByPredicat((posr) => posr.nr == rowPosNr)
    }

    function renderPossBody() {

        function handleDelRow(rowIdx: number) {
            if (s_guiData && s_guiData.pos_rows) {
                const posRowToDel = s_guiData.pos_rows[rowIdx];
                if (posRowToDel.nr) {
                    s_setRowPosToDelete(posRowToDel.nr);
                    s_setShowDlgRemovePosRow(true);
                } else {
                    removeRowByIdx(rowIdx)
                }
            }
        }

        function handleChg(newv: RechPosRow, rowIdx: number, recalc: boolean) {
            s_dispGuiData(createActionRechPos({
                rowIdx,
                recalc,
                mutatePos: () => newv
            }))
        }

        if (!s_guiData) {
            return null;
        }
        return <tbody>
        {s_guiData.pos_rows.map((rpr: RechPosRow, idx: number) => {
            return <RechPossTr key={rpr.nr || idx} rowIdx={idx} row={rpr}
                               fnChange={handleChg}
                               fnDeleteRow={handleDelRow}
            />
        })}
        </tbody>
    }

    function renderIstWeggeschickt() {
        function handleChg(newv:MayBeBool) {
            chgRechVal(rechrow=> rechrow.ist_weggeschickt = newv);
        }

        return <DkmRespFormCell label={"weggeschickt?"} field={checkRechFormRowName("ist_weggeschickt")}
                                shouldRenderError={false} additionalClassName={"w-full lg:w-1/9"}
        >
            <NativeBoolInput value={s_guiData.rech_row?.ist_weggeschickt } onChange={handleChg}/>
        </DkmRespFormCell>
    }

    function renderPoss() {
        return <DkmRespTableMain>
            {/*<colgroup className="table-colgroup-responsive">*/}
            {/*    <col className="w-1/8"/> /!*pos*!/*/}
            {/*    <col className="w-4/8"/> /!*bezeichnung*!/*/}
            {/*    <col className="w-1/8"/> /!*menge*!/*/}
            {/*    <col className="w-1/8"/> /!*einzelpreis*!/*/}
            {/*    <col className="w-1/8"/> /!*gesamt*!/*/}
            {/*</colgroup>*/}
            {renderPossHead()}
            {renderPossBody()}
        </DkmRespTableMain>
    }

    function handleAddPosRow() {
        // if (!s_guiData) {
        //     return;
        // }
        // if (!s_guiData.pos_rows) {
        //     return;
        // }
        // const newPosRows = [...s_guiData.pos_rows,
        //     createNewRechPosRow(s_guiData.pos_rows.length + 1)];
        // const newGuiData = {...s_guiData, pos_rows: newPosRows};
        //s_setGuiData(newGuiData);
        s_dispGuiData(createActAddPosRow())
    }

    function calcDisabledCreateDocx(): boolean {
        return !(s_guiData?.rech_row?.verrechnet_am)
    }

    function calcDisabledOPenDocx(): boolean {
        return !(s_guiData?.rech_row?.do_id)
    }


    function calcDisabledSave(): boolean {
        const dataChanged = JSON.stringify(props.guiData) !=
            JSON.stringify(s_guiData);
        if (dataChanged) {
            return anyErrors(s_errors);
        }
        return true;
    }

    function handleOpenDocx() {
        if (!s_guiData.rech_row?.do_id) {
            return;
        }
        gotoDoc(s_guiData.rech_row?.do_id)
    }

    function handleCreateDocx() {
        const vnr = s_guiData.rech_row?.vnr;
        if (!vnr) {
            return;
        }
        props.fnCreateDox(vnr)
            .then(do_id => {
                chgRechVal(
                    oldv => oldv.do_id = do_id
                )
            });
    }


    if (!props.guiData) {
        return null;
    }


    return (
        <DkmRespForm addtionalClasses={"w-full dkm-form"}>
            {renderDlgRemovePosRow()}
            <DkmRespFormRow>
                {renderFirma()}
                {renderVerrechnetAm()}
                {renderRechnungsNr()}
                {renderZwischensumme()}
                {renderMwst()}
                {renderGesamtPreis()}
                {renderIstWeggeschickt()}
            </DkmRespFormRow>
            <DkmRespFormRow>
                {renderPoss()}
            </DkmRespFormRow>
            <DkmRespFormRow>
                < button type={"button"}
                         disabled={calcDisabledSave()}
                         className={"dkm-default-button"}
                         onClick={() => props.fnSaveGuiData(s_guiData || {
                             pos_rows: [], rech_row: {}
                         })}>
                    speichern
                </button>
                < button type={"button"} onClick={handleAddPosRow}
                >
                    Neue Zeile
                </button>
                < button type={"button"} disabled={calcDisabledCreateDocx()}
                         onClick={handleCreateDocx}>
                    Word erstellen
                </button>
                < button type={"button"} disabled={calcDisabledOPenDocx()}
                         onClick={handleOpenDocx}>
                    Word öffnen
                </button>
            </DkmRespFormRow>
        </DkmRespForm>
    )
}

export default RechFormComp;