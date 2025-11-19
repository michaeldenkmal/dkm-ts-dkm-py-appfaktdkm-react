import type {KundenhonorarRow} from "../model/kuhon_form_m.ts";
import type {MayBeBool, MayBeFloat, MayBeInteger, MayBeString} from "@at.dkm/dkm-ts-lib-django/lib/dkm_django_m";
import {
    calcKuHonGuiFlags, creActChange,
    type KuHonGuiFlags,
    type KuHonValidatonErrs,
    kunHonReducer,
    validateKuHonRow
} from "./kuhon_data_reducer.ts";
import {useEffect, useState} from "react";
import DkmRespForm from "../dkm_comps/DkmRespForm.tsx";
import {useImmerReducer} from "use-immer";
import DkmFieldRow from "../dkm_comps/DkmFieldRow.tsx";
import DkmNativeSelect, {type OptionItem} from "../dkm_comps/DkmNativeSelect.tsx";
import {NativeTextInput} from "../dkm_comps/NativeTextInput.tsx";
import {NativeNumberInput} from "../dkm_comps/NativeNumberInput.tsx";
import {NativeMemo} from "../dkm_comps/NativeMemo.tsx";
import {strToKuHoZustellArtType} from "./kuhon_zustell_art_m.ts";
import KuHoZustellArtCbx from "./KuHoZustellArtCbx.tsx";
import NativeBoolInput from "../dkm_comps/NativeBoolInput.tsx";



interface RenderFieldOpts {
    label: string
    field: keyof KundenhonorarRow
    required: boolean
    shouldRenderError?: MayBeBool
    error?: MayBeString
    colDivClass: string
    children: any
    //tw_width_class?: string
}


interface FormRowProps {
    children: any
}

function FormRow(props: FormRowProps) {
    return <div className={"flex flex-row flex-wrap w-full"}>
        {props.children}
    </div>
}

function RenderField(opts: RenderFieldOpts) {
    const {label, field, required, shouldRenderError, error, colDivClass} = opts;

    return (
            <DkmFieldRow field={field} label={label}
                         shouldRenderError={shouldRenderError || false}
                         required={required}
                         errors={error}
                         additionalClassName={colDivClass}>
                {opts.children}
            </DkmFieldRow>
    )
}


interface Props {
    row: KundenhonorarRow,
    onSaveRow: (row: KundenhonorarRow) => void,
    getGpOptionItems: Array<OptionItem>
}


export default function KuHonFormComp(props: Props) {

    const [s_validateErrs, s_setValidateErrs] = useState<KuHonValidatonErrs>({});
    const [s_guiFlag, s_setGuiFlags] = useState<KuHonGuiFlags>({isSaveValid: false, isDirty: false, isEmailDisabled:false});
    const [s_row, s_dispatchRow] = useImmerReducer(kunHonReducer, props.row)

    // Daten setzen, wenn sie sich außerhalb geändert haben
    useEffect(() => {
        s_dispatchRow({
            type: "set_data_direct", newData: props.row
        })
    }, [props.row, s_dispatchRow])

    // Gui Flogs and validation Errs neu berechnen
    useEffect(() => {
        if (s_row) {
            const valErrs = validateKuHonRow(s_row);
            const guiFlags = calcKuHonGuiFlags(props.row, s_row, valErrs);
            s_setValidateErrs(valErrs);
            s_setGuiFlags(guiFlags);
        }
    }, [s_row, props.row])


    function renderNr() {
        return <RenderField label={"nr"} field={"nr"} required={false} colDivClass={"w-full lg:w-1/4"}>
            <div className={"w-full  text-left"}>{s_row.nr}</div>
        </RenderField>
    }

    function handleFirmaChg(v: MayBeString) {
        s_dispatchRow(creActChange(r => {
            r.firma1 = v
        }))
    }

    const renderFIRMA1 = () =>
        <RenderField label={"Firma - Suchbegriff"} field={"firma1"} required={true}
                     error={s_validateErrs.firma1} shouldRenderError={true}
                     colDivClass={"w-full"}
        >
            <NativeTextInput value={s_row.firma1 ?? ""}
                             onChange={handleFirmaChg}
                             required
                             additionalClassName={"w-full"}
            />
        </RenderField>

    function handleOfficeHelpCbxChange(cbxItem: OptionItem | null) {
        s_dispatchRow(creActChange(r => {
            if (cbxItem?.key) {
                r.gp_id = parseFloat(cbxItem.key)
            } else {
                r.gp_id = null
            }
        }))
    }

    const renderGpCbx = () =>
        <RenderField label={"Office Help Firma"} field={"gp_id"} required={false}
        colDivClass={"w-full"}>
            <DkmNativeSelect onSelected={handleOfficeHelpCbxChange}
                             selectItems={props.getGpOptionItems}
                             emptyOptionItem={{
                                 key: "", value: "-- Keine Adresse ausgewählt"
                             }}
                             value={s_row.gp_id ? s_row.gp_id.toString() : ""}
            />
        </RenderField>


    function handleStundenhonChg(v: MayBeFloat) {
        s_dispatchRow(creActChange(r => {
            r.stundenhon = v
        }))
    }


    const renderSTUNDENHON = () =>
        <RenderField label={"hon./h"} field={"stundenhon"} required={true}
                     error={s_validateErrs.stundenhon}
                     colDivClass={"w-full lg:w-1/4"}
        >

            <NativeNumberInput value={s_row.stundenhon ?? 0}
                               onChange={handleStundenhonChg}
                               required/>
        </RenderField>

    function handleLogoChg(v: MayBeString) {
        s_dispatchRow(creActChange(r => {
            r.logo = v
        }))
    }

    const renderLOGO = () =>
        <RenderField label={"Logo"} field={"logo"} required={true} colDivClass={"w-full"} >
            <NativeMemo value={s_row.logo ?? ""}
                        onChange={handleLogoChg}
                        required
                        rowCount={4}
            />
        </RenderField>

    const handleAnredeChg = (v: MayBeString) => {
        s_dispatchRow(creActChange(r => {
            r.anrede = v
        }))
    }
    const renderANREDE = () =>
        <RenderField label={"Anrede"} field={"anrede"} required={true} colDivClass={"w-full"} >
            <NativeTextInput value={s_row.anrede ?? ""}
                             onChange={handleAnredeChg}
                             required
            />
        </RenderField>

    function handleZahlungsbedingChg(v: MayBeString): void {
        s_dispatchRow(creActChange(r => {
            r.zahlungsbeding = v
        }))
    }

    const renderZahlungsbeding = () =>
        <RenderField label={"Zahlungsbedingungen"} field={"zahlungsbeding"} required={false} colDivClass={"w-full"}>
            <NativeTextInput value={s_row.zahlungsbeding ?? ""}
                             onChange={handleZahlungsbedingChg}/>
        </RenderField>

    function handleZustellArtChg(v: MayBeString): void {
        s_dispatchRow(creActChange(r => {
            r.zustellart = v
        }))
    }

    const renderZustellArt = () =>
        <RenderField label={"Zustellart"} field={"zustellart"} required={false} colDivClass={"w-full lg:w-1/5"} >
            <KuHoZustellArtCbx value={strToKuHoZustellArtType(s_row.zustellart)}
                               onChange={handleZustellArtChg}/>
        </RenderField>


    function handleInaktiv(v: MayBeBool) {
        s_dispatchRow(creActChange(r => {
            r.inaktiv = v
        }))
    }

    const renderInaktiv = () => {
        //     renderField("inaktiv", "inaktiv", <NativeBoolInput value={s_row.inaktiv ?? false} onChange={(val) => chgProp("inaktiv", val)} />,
        //          false,{
        //             ctrlAdditionalClassName:"inline"
        //         });
        return <RenderField label={"Inaktiv"} field={"inaktiv"} required={false} colDivClass={"w-full lg:w-1/4"}>
                <NativeBoolInput value={s_row.inaktiv ?? false}
                                 onChange={handleInaktiv} />

        </RenderField>
    }

    function handleEmail(v: MayBeString) {
        s_dispatchRow(creActChange(r => {
            r.mailadresse = v
        }))
    }

    const renderMailAdresse = () =>
        <RenderField label={"Mail-Adresse"} field={"mailadresse"} required={false} colDivClass={"w-full lg:w-4/5"}>
            <NativeTextInput value={s_row.mailadresse ?? ""}
                             onChange={handleEmail}
                             disabled={s_guiFlag.isEmailDisabled}
            />
        </RenderField>

    function handleBmdNr(v: MayBeInteger) {
        s_dispatchRow(creActChange(r => {
            r.bmd_nr = v
        }))
    }

    const renderBMD_NR = () =>
        <RenderField label={"BMD-NR"} field={"bmd_nr"} required={false} colDivClass={"w-full lg:w-1/4"}>
            <NativeNumberInput value={s_row.bmd_nr}
                               onChange={handleBmdNr}
            />
        </RenderField>


    function handleResetClick(e: any) {
        e.preventDefault();
        s_dispatchRow({
            type: "set_data_direct", newData: props.row
        })
    }

    function handleGoBack(e: any) {
        e.preventDefault();
        window.history.back();
    }

    function handleBtnSaveClick() {
        if (Object.keys(s_validateErrs).length==0) {
            props.onSaveRow(s_row);
        }
    }

    return (
        <>
            <h1 className={"dkm-h1 text-left"}>Kundenhonorar bearbeiten</h1>
            <DkmRespForm addtionalClasses={"w-full lg:w-5/6 dkm-form"}>
                <FormRow>
                    {renderFIRMA1()}
                </FormRow>
                <FormRow>
                    {renderGpCbx()}
                </FormRow>
                <FormRow>
                    {renderNr()}
                    {renderSTUNDENHON()}
                    {renderInaktiv()}
                    {renderBMD_NR()}

                </FormRow>
                <FormRow>
                    {renderLOGO()}
                </FormRow>
                <FormRow>
                    {renderANREDE()}
                </FormRow>
                <FormRow>
                    {renderZahlungsbeding()}
                </FormRow>
                <FormRow>
                    {renderZustellArt()}
                    {renderMailAdresse()}
                </FormRow>
                <FormRow>
                <div className="pt-2">
                    <button disabled={!s_guiFlag.isSaveValid}
                            className="btn"
                            onClick={handleBtnSaveClick}
                    >
                        Speichern
                    </button>
                    <button disabled={!s_guiFlag.isDirty}
                            className="btn"
                            onClick={handleResetClick}
                    >
                        Abrechen
                    </button>
                    <button disabled={s_guiFlag.isDirty}
                            className="btn"
                            onClick={handleGoBack}
                    >
                        zurück
                    </button>
                </div>
                </FormRow>
            </DkmRespForm>
        </>
    )
}
