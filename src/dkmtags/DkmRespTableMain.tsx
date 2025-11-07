
interface Props {
    children?:any
}

function DkmRespTableMain(props:Props) {
    return (<table className="table-main">
        {props.children}
        </table>)
}

export default DkmRespTableMain;