import {type JSX} from "react";
import {fmtGermanDate, fmtGermanShortTime} from "@at.dkm/dkm-ts-lib-gen/lib/dateUtil";
import {fmtGermanNum} from "@at.dkm/dkm-ts-lib-gen/lib/u";
import type {DatenabTestRow} from "../model/work_rep_m.ts";

interface Props{
    row:DatenabTestRow
    onEditWorkEntry:(row:DatenabTestRow) => void
}


export default function DkmWorkVwEntry(props:Props): JSX.Element {
    function buildId(prefix: string) {
        return `${prefix}_{${props.row.NR}`
    }

    function fmtTime(d: Date | undefined | null): string {
        if (d) {
            return fmtGermanShortTime(d)
        } else {
            return ""
        }
    }

    function fmtNum(n: number | undefined | null): string {
        if (n) {
            return fmtGermanNum(n)
        } else {
            return ""
        }
    }

    //<button class="btnEditArbBer" onclick="arbeitsberichte.openArbBer({%=o.NR%})">Bearbeiten</button>
    function renderBtnEdit() {
        function handleClick() {
            props.onEditWorkEntry(props.row)
        }

        return <button className="btn w-full lg:w-1/10" onClick={handleClick}>Bearbeiten</button>

    }

    return (
        /*n https://chatgpt.com/c/6915afcd-4434-8328-97cc-21afeac6aa46
         TailwindCSS funktionieren odd: und even: nur auf direkt aufeinanderfolgenden Geschwistern (siblings).
            Wenn du sie korrekt anwenden willst, müssen die Elemente gleiches Parent-Element, gleiche Tag-Struktur und keine zusätzlichen Wrapper dazwischen haben.*/
        <div className={"flex flex-row flex-wrap w-full mb-10 odd:bg-white even:bg-gray-50 hover:bg-blue-100"}>
            {renderBtnEdit()}
            <span className="dkmvalue"> {fmtGermanDate(props.row.DATUM || null)}</span>
            <span >{fmtTime(props.row.ZEITVON)}-{fmtTime(props.row.ZEITBIS)}</span>
            <span id={buildId("h")} className="dkmvalue">h:{props.row.STUNDEN ?? ""}</span>
            <span id={buildId("extraverr")} className="dkmvalue">Extraverr.:{fmtNum(props.row.EXTRAVER)}</span>
            <span id={buildId("h_wart")} className="dkmvalue">für Wartung:{fmtNum(props.row.h_wart)}</span>
            <span id={buildId("honorar")} className="dkmvalue">Honorar:{fmtNum(props.row.HONORAR)}</span>
            <span id={buildId("gesamthonorar")} className="dkmvalue">Gesamt:{fmtNum(props.row.GESAMTHONORAR)}</span>
            <span id={buildId("taetigkeit")} className="text-left text-wrap w-77 lg:w-300 mt-2">{props.row.TAETIGKEIT ?? ""}</span>
        </div>
    )
}