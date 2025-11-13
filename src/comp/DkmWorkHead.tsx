import {useState} from "react";
import type {KundenhonorarRow} from "../model/kuhon_form_m.ts";

interface Props {
    kuhonrows:Array<KundenhonorarRow>
    curKuHonNr:number
    setCurKuHonNr:(value:number) => void
    onNewWorkRep:()=>void
    disableButtonNew:boolean
    onToogleShowSumNotAccounted:()=>void
}

export default function DkmWorkHead (props:Props) {

    const [s_showWorkList, s_setShowWorkList] = useState<boolean>(true);

    function renderKdWaCbx() {

        function makeItem(row:KundenhonorarRow) {
            return <option key={row.nr} value={row.nr||undefined}> {row.firma1}</option>
        }

        function handleSelect(event: React.ChangeEvent<HTMLSelectElement>) {
            const selectedNr = event.target.value;
            props.setCurKuHonNr( parseFloat(selectedNr));
        }

        return <select className={"border border-gray-300 rounded-md p- focus:outline-none focus:ring-2 focus:ring-blue-500"}
                       onChange={handleSelect} value={props.curKuHonNr}>
            {props.kuhonrows.map(row=>makeItem(row))}
        </select>
    }

    function renderKundenauswahl() {
        return <>
            <label>Kundenauswahl:</label>
            <span>{renderKdWaCbx()}</span>
        </>
    }

    function renderBtnNew() {
        function handleClick() {
            props.onNewWorkRep();
        }

        return <button className={"btn"} onClick={handleClick} disabled={props.disableButtonNew}>Neuer Arbeitsbericht</button>
    }



    function renderBtnShowSumNotAccounted() {
        function handleCLick() {
            props.onToogleShowSumNotAccounted();
            s_setShowWorkList(!s_showWorkList);
        }
        const caption :string = s_showWorkList ? "Offenen Summen anzeigen": "Arbeitsberichte anzeigen";
        return <button className={"btn"} onClick={handleCLick}> {caption}</button>
    }

    function render() {
        return <div className={"flex flex-row flex-wrap gap-2 items-center"}>
            {renderKundenauswahl()}
            {renderBtnNew()}
            {renderBtnShowSumNotAccounted()}
        </div>
    }

    return render();
}