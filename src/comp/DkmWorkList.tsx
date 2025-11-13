import {type JSX} from "react";
import DkmWorkVwEntry from "./DkmWorkVwEntry.tsx";
import DkmWorkEditEntry from "./DkmWorkEditEntry.tsx";
import type {DatenabTestRow} from "../model/work_rep_m.ts";

interface Props {
    rows:Array<DatenabTestRow>
    onEditWorkEntry:(row:DatenabTestRow) => void
    onCancelEdit:()=>void
    onSaveWorkEntry:(row:DatenabTestRow) => void
    curWorkEntryNr:number
}
export default function DkmWorkList (props: Props): JSX.Element {



    function renderRow(row:DatenabTestRow) {
        if (row.NR ==props.curWorkEntryNr) {
            return <DkmWorkEditEntry row={row} onCancel={props.onCancelEdit} onSave={props.onSaveWorkEntry}/>
        }
        return <DkmWorkVwEntry key={row.NR} row={row} onEditWorkEntry={props.onEditWorkEntry}/>
    }

    function render() {
        return (<div >
            {props.rows.map(row=>renderRow(row))}
        </div>)
    }

    return render();
}