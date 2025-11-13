import {fmtNum} from "@at.dkm/dkm-ts-lib-gen/lib/numUtil";
import {sumUpSumNotAccountedRows, type TSumNotAccountedRow} from "../model/work_rep_m.ts";

interface Props{
    rows:TSumNotAccountedRow[]
}

export default function DkmSumNotAccountedComp (props: Props) {

    function renderTr(row:TSumNotAccountedRow){
        return <tr key={row.kunden_name} className={"text-left even:bg-amber-50 odd:bg-amber-400 hover:bg-blue-100"}>
            <td>{row.kunden_name}</td>
            <td className={"text-right"}> { fmtNum(row.sum_not_accounted ,2)}</td>
        </tr>
    }

    function renderSumTr() {
        return <tr className={"text-right"}>
            <th>Summe</th>
            <th className={"text-right"}> { fmtNum(sumUpSumNotAccountedRows(props.rows),2,",","")}</th>
        </tr>
    }

    function renderBody() {
        return <tbody className={""}>
        {props.rows.map(row=> renderTr(row))}
        {renderSumTr()}
        </tbody>
    }

    return <div><table className={"lg:max-w-4xl bg-white-900"} >
        <thead >
            <tr>
            <th className={"w-100 text-left"}>Kunde</th>
            <th className={"text-right"}>Summe</th>
            </tr>
        </thead>
        {renderBody()}
    </table>
    </div>
}