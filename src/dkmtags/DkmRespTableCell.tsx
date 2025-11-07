interface Props {
    children?: any
    label:string
    tdClass?:string
    valueClass?:string
}

function DkmRespTableCell(props: Props) {
    let myTdClass ="table-cell-responsive";
    if (props.tdClass) {
        myTdClass += " " + props.tdClass;
    }
    let myValueClass="table-cell-value";
    if (props.valueClass) {
        myValueClass += " " + props.valueClass;
    }
    return (
        <td className={myTdClass}>
            <div className="table-cell-inner">
                <span className="table-cell-label">{props.label}</span>
                <span className={myValueClass}>{props.children}</span>
            </div>
        </td>)
}

export default DkmRespTableCell;