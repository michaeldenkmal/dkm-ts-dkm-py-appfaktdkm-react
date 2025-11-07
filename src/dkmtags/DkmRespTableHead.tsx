//  <thead class="table-head">

interface Props {
    children?:any
}

function DkmRespTableHead(props:Props) {
    return (
        <thead className="table-head">
        {props.children}
        </thead>
    )
}

export default DkmRespTableHead;