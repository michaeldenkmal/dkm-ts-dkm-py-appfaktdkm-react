// <th class="table-head-th">
interface Props {
    children?:any
    additionalClasses?:string
}

function DkmRespTableHeadTh(props:Props) {
    let myClass = "table-head-th";
    if (props.additionalClasses) {
        myClass = myClass + " " + props.additionalClasses;
    }
    return (
        <th className={myClass}>
        {props.children}
        </th>
    )
}

export default DkmRespTableHeadTh;